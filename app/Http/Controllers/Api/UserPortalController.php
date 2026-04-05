<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\TransaksiPemasukan;
use App\Models\PerlengkapanPesanan;
use App\Models\Biaya;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserPortalController extends Controller
{
    // ─── LOGIN PENDAFTAR ─────────────────────────────────────────
    public function login(Request $request)
    {
        $request->validate([
            'phone'    => 'required|string',
            'password' => 'required|string',
        ]);

        $phone = preg_replace('/[^0-9]/', '', $request->phone);

        // Try multiple phone formats
        $phoneFormats = [];
        if (str_starts_with($phone, '62')) {
            $phoneFormats = [$phone, '+' . $phone, '0' . substr($phone, 2), substr($phone, 2)];
        } elseif (str_starts_with($phone, '0')) {
            $phoneFormats = [$phone, '62' . substr($phone, 1), '+62' . substr($phone, 1), substr($phone, 1)];
        } else {
            $phoneFormats = [$phone, '0' . $phone, '62' . $phone, '+62' . $phone];
        }

        $user = null;
        foreach ($phoneFormats as $tryPhone) {
            $found = Pendaftaran::where('no_hp_wali', $tryPhone)->first();
            if ($found) { $user = $found; break; }
        }

        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Nomor WA tidak terdaftar!'], 401);
        }

        if (!$user->password || !Hash::check($request->password, $user->password)) {
            return response()->json(['success' => false, 'message' => 'Password salah!'], 401);
        }

        // Create a simple token (store in pendaftaran, or just use a signed value)
        $token = bin2hex(random_bytes(32));

        return response()->json([
            'success' => true,
            'message' => 'Login berhasil',
            'data' => [
                'user' => [
                    'id'            => $user->id,
                    'nama'          => $user->nama,
                    'no_hp_wali'    => $user->no_hp_wali,
                    'no_registrasi' => $user->no_registrasi,
                    'status'        => $user->status,
                ],
                'token' => $token,
                'user_id' => $user->id,
            ],
        ]);
    }

    // ─── GET DASHBOARD DATA ──────────────────────────────────────
    public function dashboard(Request $request)
    {
        $userId = $request->user_id;
        $data = Pendaftaran::find($userId);

        if (!$data) {
            return response()->json(['success' => false, 'message' => 'Data tidak ditemukan'], 404);
        }

        // Document completion
        $documents = [
            'file_kk'        => ['label' => 'Kartu Keluarga', 'required' => true],
            'file_ktp_ortu'  => ['label' => 'KTP Orang Tua', 'required' => true],
            'file_akta'      => ['label' => 'Akta Kelahiran', 'required' => true],
            'file_ijazah'    => ['label' => 'Ijazah', 'required' => false],
            'file_sertifikat'=> ['label' => 'Sertifikat', 'required' => false],
        ];

        $docStatus = [];
        foreach ($documents as $field => $info) {
            $docStatus[$field] = [
                'label'    => $info['label'],
                'required' => $info['required'],
                'uploaded' => !empty($data->$field),
                'filename' => $data->$field,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $data,
            'documents' => $docStatus,
            'can_edit' => in_array($data->status, ['pending', 'rejected']),
        ]);
    }

    // ─── UPDATE FIELD ────────────────────────────────────────────
    public function updateField(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:pendaftaran,id',
            'field'   => 'required|string',
            'value'   => 'nullable|string',
        ]);

        $allowedFields = [
            'nama', 'nik', 'nisn', 'no_kk', 'tempat_lahir', 'tanggal_lahir',
            'jenis_kelamin', 'provinsi', 'kota_kab', 'kecamatan', 'kelurahan_desa',
            'alamat', 'lembaga', 'status_mukim', 'asal_sekolah', 'pip_pkh',
            'sumber_info', 'jumlah_saudara',
            'nama_ayah', 'nik_ayah', 'tempat_lahir_ayah', 'tanggal_lahir_ayah',
            'pekerjaan_ayah', 'penghasilan_ayah',
            'nama_ibu', 'nik_ibu', 'tempat_lahir_ibu', 'tanggal_lahir_ibu',
            'pekerjaan_ibu', 'penghasilan_ibu',
            'prestasi', 'tingkat_prestasi', 'juara',
        ];

        if (!in_array($request->field, $allowedFields)) {
            return response()->json(['success' => false, 'message' => 'Field tidak valid'], 422);
        }

        $data = Pendaftaran::find($request->user_id);
        if (!in_array($data->status, ['pending', 'rejected'])) {
            return response()->json(['success' => false, 'message' => 'Data tidak dapat diedit'], 422);
        }

        $data->update([$request->field => $request->value]);
        return response()->json(['success' => true]);
    }

    // ─── UPLOAD FILE ─────────────────────────────────────────────
    public function uploadFile(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:pendaftaran,id',
            'field'   => 'required|in:file_kk,file_ktp_ortu,file_akta,file_ijazah,file_sertifikat',
            'file'    => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $data = Pendaftaran::find($request->user_id);
        if (!in_array($data->status, ['pending', 'rejected'])) {
            return response()->json(['success' => false, 'message' => 'Data tidak dapat diedit'], 422);
        }

        $field = $request->field;
        $subDir = $field === 'file_sertifikat' ? 'sertifikat' : 'dokumen';

        // Delete old file
        if ($data->$field) {
            Storage::disk('public')->delete("uploads/{$subDir}/{$data->$field}");
        }

        $ext = $request->file('file')->getClientOriginalExtension();
        $filename = $data->id . '_' . $field . '_' . time() . '.' . $ext;
        $request->file('file')->storeAs("uploads/{$subDir}", $filename, 'public');

        $data->update([$field => $filename]);

        return response()->json([
            'success'  => true,
            'filename' => $filename,
            'url'      => "/storage/uploads/{$subDir}/{$filename}",
        ]);
    }

    // ─── CHANGE PASSWORD ─────────────────────────────────────────
    public function changePassword(Request $request)
    {
        $request->validate([
            'user_id'          => 'required|exists:pendaftaran,id',
            'old_password'     => 'required|string',
            'new_password'     => 'required|string|min:6|confirmed',
        ]);

        $data = Pendaftaran::find($request->user_id);

        if (!Hash::check($request->old_password, $data->password)) {
            return response()->json(['success' => false, 'message' => 'Password lama salah'], 422);
        }

        $data->update(['password' => Hash::make($request->new_password)]);
        return response()->json(['success' => true, 'message' => 'Password berhasil diubah']);
    }

    // ─── GET TAGIHAN ─────────────────────────────────────────────
    public function getTagihan(Request $request)
    {
        $id = $request->id;
        $peserta = Pendaftaran::find($id);
        if (!$peserta) return response()->json(['error' => 'Peserta not found'], 404);

        $lembagaCol = ($peserta->lembaga === 'SMP NU BP') ? 'biaya_smp' : 'biaya_ma';
        $isPondok = $peserta->status_mukim === 'PONDOK PP MAMBAUL HUDA';

        $biayaSekolah = Biaya::sum($lembagaCol);
        $biayaPondok = $isPondok ? Biaya::sum('biaya_pondok') : 0;

        $perlengkapanTotal = \DB::table('perlengkapan_pesanan')
            ->join('perlengkapan_items', 'perlengkapan_pesanan.perlengkapan_item_id', '=', 'perlengkapan_items.id')
            ->where('perlengkapan_pesanan.pendaftaran_id', $id)
            ->where('perlengkapan_pesanan.status', 1)
            ->sum('perlengkapan_items.nominal');

        $totalPaid = TransaksiPemasukan::where('pendaftaran_id', $id)
            ->where('status', 'approved')
            ->sum('nominal');

        $totalTagihan = $biayaSekolah + $biayaPondok + $perlengkapanTotal;

        return response()->json([
            'success'            => true,
            'total_tagihan'      => $totalTagihan,
            'total_dibayar'      => $totalPaid,
            'sisa_kekurangan'    => $totalTagihan - $totalPaid,
            'biaya_pondok'       => $biayaPondok,
            'biaya_sekolah'      => $biayaSekolah,
            'biaya_perlengkapan' => $perlengkapanTotal,
            'lembaga'            => $peserta->lembaga,
            'status_mukim'       => $peserta->status_mukim,
            'is_pondok'          => $isPondok,
        ]);
    }
}
