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
    /**
     * Helper: Normalize phone number to 0xxx format
     */
    private function normalizePhone(string $phone): string
    {
        $phone = preg_replace('/[^0-9]/', '', $phone);
        if (str_starts_with($phone, '62')) {
            $phone = '0' . substr($phone, 2);
        } elseif (!str_starts_with($phone, '0')) {
            $phone = '0' . $phone;
        }
        return $phone;
    }

    // ─── LOGIN PENDAFTAR ─────────────────────────────────────────
    public function login(Request $request)
    {
        $request->validate([
            'phone'    => 'required|string',
            'password' => 'required|string',
        ]);

        $phone = preg_replace('/[^0-9]/', '', $request->phone);

        // Try multiple phone formats (Fix #16: also try normalized format)
        $phoneFormats = [];
        $normalized = $this->normalizePhone($phone);
        if (str_starts_with($phone, '62')) {
            $phoneFormats = [$phone, '+' . $phone, '0' . substr($phone, 2), substr($phone, 2), $normalized];
        } elseif (str_starts_with($phone, '0')) {
            $phoneFormats = [$phone, '62' . substr($phone, 1), '+62' . substr($phone, 1), substr($phone, 1), $normalized];
        } else {
            $phoneFormats = [$phone, '0' . $phone, '62' . $phone, '+62' . $phone, $normalized];
        }
        $phoneFormats = array_unique($phoneFormats);

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

        // Create token and SAVE it (Fix #2: token was never stored/validated)
        $token = bin2hex(random_bytes(32));
        $user->update(['reset_token' => hash('sha256', $token)]);

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
                'token'   => $token,
                'user_id' => $user->id,
            ],
        ]);
    }

    // ─── VALIDATE TOKEN (reusable helper) ────────────────────────
    private function validateToken(Request $request): ?Pendaftaran
    {
        $token = $request->header('X-User-Token') ?? $request->input('token');
        $userId = $request->header('X-User-Id') ?? $request->input('user_id');

        if (!$token || !$userId) return null;

        $user = Pendaftaran::find($userId);
        if (!$user || !$user->reset_token) return null;

        if (!hash_equals($user->reset_token, hash('sha256', $token))) {
            return null;
        }

        return $user;
    }

    // ─── GET DASHBOARD DATA ──────────────────────────────────────
    public function dashboard(Request $request)
    {
        $user = $this->validateToken($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $data = $user;

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
        $user = $this->validateToken($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'field'   => 'required|string',
            'value'   => 'nullable|string',
        ]);

        $allowedFields = [
            'nama', 'nik', 'nisn', 'no_kk', 'tempat_lahir', 'tanggal_lahir',
            'jenis_kelamin', 'provinsi', 'kota_kab', 'kecamatan', 'kelurahan_desa',
            'alamat', 'asal_sekolah', 'pip_pkh',
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

        if (!in_array($user->status, ['pending', 'rejected'])) {
            return response()->json(['success' => false, 'message' => 'Data tidak dapat diedit'], 422);
        }

        $user->update([$request->field => $request->value]);
        return response()->json(['success' => true]);
    }

    // ─── UPLOAD FILE ─────────────────────────────────────────────
    public function uploadFile(Request $request)
    {
        $user = $this->validateToken($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'field'   => 'required|in:file_kk,file_ktp_ortu,file_akta,file_ijazah,file_sertifikat',
            'file'    => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        if (!in_array($user->status, ['pending', 'rejected'])) {
            return response()->json(['success' => false, 'message' => 'Data tidak dapat diedit'], 422);
        }

        $field = $request->field;
        $subDir = $field === 'file_sertifikat' ? 'sertifikat' : 'dokumen';

        // Delete old file
        if ($user->$field) {
            Storage::disk('public')->delete("uploads/{$subDir}/{$user->$field}");
        }

        $ext = $request->file('file')->getClientOriginalExtension();
        $filename = $user->id . '_' . $field . '_' . time() . '.' . $ext;
        $request->file('file')->storeAs("uploads/{$subDir}", $filename, 'public');

        $user->update([$field => $filename]);

        return response()->json([
            'success'  => true,
            'filename' => $filename,
            'url'      => "/storage/uploads/{$subDir}/{$filename}",
        ]);
    }

    // ─── CHANGE PASSWORD ─────────────────────────────────────────
    public function changePassword(Request $request)
    {
        $user = $this->validateToken($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $request->validate([
            'old_password'     => 'required|string',
            'new_password'     => 'required|string|min:6|confirmed',
        ]);

        if (!Hash::check($request->old_password, $user->password)) {
            return response()->json(['success' => false, 'message' => 'Password lama salah'], 422);
        }

        $user->update(['password' => Hash::make($request->new_password)]);
        return response()->json(['success' => true, 'message' => 'Password berhasil diubah']);
    }

    // ─── GET TAGIHAN ─────────────────────────────────────────────
    public function getTagihan(Request $request)
    {
        $user = $this->validateToken($request);
        if (!$user) {
            return response()->json(['success' => false, 'message' => 'Unauthorized'], 401);
        }

        $peserta = $user;
        $id = $peserta->id;

        $totalBiaya = Biaya::sum('biaya');

        $perlengkapanTotal = \DB::table('perlengkapan_pesanan')
            ->join('perlengkapan_items', 'perlengkapan_pesanan.perlengkapan_item_id', '=', 'perlengkapan_items.id')
            ->where('perlengkapan_pesanan.pendaftaran_id', $id)
            ->where('perlengkapan_pesanan.status', 1)
            ->sum('perlengkapan_items.nominal');

        $totalPaid = TransaksiPemasukan::where('pendaftaran_id', $id)
            ->where('status', 'approved')
            ->sum('nominal');

        $totalTagihan = $totalBiaya + $perlengkapanTotal;

        return response()->json([
            'success'            => true,
            'total_tagihan'      => $totalTagihan,
            'total_dibayar'      => $totalPaid,
            'sisa_kekurangan'    => $totalTagihan - $totalPaid,
            'biaya_pendaftaran'  => $totalBiaya,
            'biaya_perlengkapan' => $perlengkapanTotal,
        ]);
    }
}
