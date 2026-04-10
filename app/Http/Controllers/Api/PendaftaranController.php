<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\ActivityLog;
use App\Models\Pengaturan;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

class PendaftaranController extends Controller
{
    /** List pendaftaran (admin: full data, public: cek by no_hp) */
    public function index(Request $request): JsonResponse
    {
        $query = Pendaftaran::query();

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('nisn', 'like', "%{$search}%")
                    ->orWhere('no_registrasi', 'like', "%{$search}%")
                    ->orWhere('asal_sekolah', 'like', "%{$search}%")
                    ->orWhere('no_hp_wali', 'like', "%{$search}%");
            });
        }

        if ($request->lembaga) {
            $query->where('lembaga', $request->lembaga);
        }

        if ($request->status) {
            $query->where('status', $request->status);
        }

        if ($request->jenis_kelamin) {
            $query->where('jenis_kelamin', $request->jenis_kelamin);
        }

        $query->orderBy('no_registrasi', 'asc');

        $perPage = (int)($request->per_page ?? 20);
        $data = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $data->items(),
            'meta' => [
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'per_page' => $data->perPage(),
                'total' => $data->total(),
            ],
        ]);
    }

    /** Detail satu pendaftaran */
    public function show($id): JsonResponse
    {
        $pendaftaran = Pendaftaran::findOrFail($id);
        return response()->json(['success' => true, 'data' => $pendaftaran]);
    }

    /** Cek status publik via no_hp */
    public function cekStatus(Request $request): JsonResponse
    {
        $request->validate(['no_hp' => 'required|string']);

        $pendaftaran = Pendaftaran::where('no_hp_wali', $request->no_hp)->first();

        if (!$pendaftaran) {
            return response()->json([
                'success' => false,
                'message' => 'Nomor HP tidak ditemukan dalam sistem.',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => [
                'nama' => $pendaftaran->nama,
                'no_registrasi' => $pendaftaran->no_registrasi,
                'lembaga' => $pendaftaran->lembaga,
                'status' => $pendaftaran->status,
                'catatan_admin' => $pendaftaran->catatan_admin,
                'catatan_updated_at' => $pendaftaran->catatan_updated_at,
                'created_at' => $pendaftaran->created_at,
            ],
        ]);
    }

    /** Cari pendaftar publik berdasarkan nama (untuk halaman Cek Status) */
    public function searchPublic(Request $request): JsonResponse
    {
        $q = $request->query('q', '');

        if (strlen($q) < 2) {
            return response()->json(['success' => true, 'data' => []]);
        }

        $results = Pendaftaran::where('nama', 'like', "%{$q}%")
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get(['nama', 'lembaga', 'status', 'created_at']);

        return response()->json([
            'success' => true,
            'data' => $results,
        ]);
    }

    /** Buat pendaftaran baru (publik) */
    public function store(Request $request): JsonResponse
    {
        // Normalize no_hp_wali before validation (Fix #16)
        if ($request->has('no_hp_wali')) {
            $phone = preg_replace('/[^0-9]/', '', $request->no_hp_wali);
            if (str_starts_with($phone, '62')) {
                $phone = '0' . substr($phone, 2);
            } elseif (!str_starts_with($phone, '0')) {
                $phone = '0' . $phone;
            }
            $request->merge(['no_hp_wali' => $phone]);
        }

        $request->validate([
            'nama' => 'required|string|max:100',
            'lembaga' => 'required|in:SMP NU BP,MA ALHIKAM',
            'jenis_kelamin' => 'required|in:L,P',
            'status_mukim' => 'required|in:PONDOK PP MAMBAUL HUDA,PONDOK SELAIN PP MAMBAUL HUDA,TIDAK PONDOK',
            'no_hp_wali' => 'required|string|max:20|unique:pendaftaran,no_hp_wali',
            'password' => 'required|string|min:6',
        ]);

        // Cek apakah pendaftaran terbuka
        $statusPendaftaran = Pengaturan::where('kunci', 'status_pendaftaran')->value('nilai');
        if ($statusPendaftaran !== '1') {
            return response()->json([
                'success' => false,
                'message' => 'Pendaftaran sedang ditutup.',
            ], 403);
        }

        // Generate no_registrasi with DB lock to prevent race condition (Fix #5)
        $pendaftaran = \DB::transaction(function () use ($request) {
            $tahunAjaran = Pengaturan::where('kunci', 'tahun_ajaran')->value('nilai');
            $tahun = substr(($tahunAjaran ?? date('Y')), 0, 4);
            $bulan = date('m');
            $count = Pendaftaran::whereMonth('created_at', date('m'))->lockForUpdate()->count() + 1;
            $noReg = str_pad($count, 3, '0', STR_PAD_LEFT) . '.' . $bulan . $tahun;

            // Use whitelist instead of $request->except() to prevent mass assignment (Fix #6, #14)
            $allowedFields = [
                'nama', 'lembaga', 'nisn', 'tempat_lahir', 'tanggal_lahir',
                'jenis_kelamin', 'jumlah_saudara', 'no_kk', 'nik', 'alamat',
                'provinsi', 'kota_kab', 'kecamatan', 'kelurahan_desa',
                'asal_sekolah', 'prestasi', 'tingkat_prestasi', 'juara',
                'pip_pkh', 'status_mukim', 'sumber_info',
                'nama_ayah', 'tempat_lahir_ayah', 'tanggal_lahir_ayah', 'nik_ayah',
                'pekerjaan_ayah', 'penghasilan_ayah',
                'nama_ibu', 'tempat_lahir_ibu', 'tanggal_lahir_ibu', 'nik_ibu',
                'pekerjaan_ibu', 'penghasilan_ibu',
                'no_hp_wali',
            ];

            $data = $request->only($allowedFields);
            $data['password'] = Hash::make($request->password);
            $data['no_registrasi'] = $noReg;
            $data['status'] = 'pending';

            return Pendaftaran::create($data);
        });

        return response()->json([
            'success' => true,
            'message' => 'Pendaftaran berhasil! Nomor registrasi Anda: ' . $pendaftaran->no_registrasi,
            'data' => [
                'id' => $pendaftaran->id,
                'no_registrasi' => $pendaftaran->no_registrasi,
            ],
        ], 201);
    }

    /** Update data pendaftaran (admin) */
    public function update(Request $request, $id): JsonResponse
    {
        $pendaftaran = Pendaftaran::findOrFail($id);

        // Whitelist only allowed fields for admin update (Fix #15)
        $allowedFields = ['status', 'catatan_admin'];
        $data = $request->only($allowedFields);

        if ($request->filled('catatan_admin')) {
            $data['catatan_updated_at'] = now();
        }

        $pendaftaran->update($data);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'UPDATE',
            'description' => 'Mengupdate data pendaftaran: ' . $pendaftaran->nama,
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Data berhasil diupdate.',
            'data' => $pendaftaran->fresh(),
        ]);
    }

    /** Hapus pendaftaran */
    public function destroy(Request $request, $id): JsonResponse
    {
        $pendaftaran = Pendaftaran::findOrFail($id);
        $nama = $pendaftaran->nama;

        // Hapus file terkait
        $fileFields = ['file_kk', 'file_ktp_ortu', 'file_akta', 'file_ijazah'];
        foreach ($fileFields as $field) {
            if ($pendaftaran->$field) {
                Storage::delete('public/uploads/dokumen/' . $pendaftaran->$field);
            }
        }
        if ($pendaftaran->file_sertifikat) {
            Storage::delete('public/uploads/sertifikat/' . $pendaftaran->file_sertifikat);
        }

        $pendaftaran->delete();

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'DELETE',
            'description' => 'Menghapus pendaftaran: ' . $nama,
            'ip_address' => $request->ip(),
        ]);

        return response()->json(['success' => true, 'message' => 'Data berhasil dihapus.']);
    }

    /** Upload dokumen */
    public function uploadDokumen(Request $request, $id): JsonResponse
    {
        $pendaftaran = Pendaftaran::findOrFail($id);
        $allowedFields = ['file_kk', 'file_ktp_ortu', 'file_akta', 'file_ijazah', 'file_sertifikat'];
        $updated = [];

        foreach ($allowedFields as $field) {
            if ($request->hasFile($field)) {
                $file = $request->file($field);
                $folder = $field === 'file_sertifikat' ? 'sertifikat' : 'dokumen';
                $filename = $id . '_' . $field . '_' . time() . '.' . $file->getClientOriginalExtension();
                $file->storeAs("public/uploads/{$folder}", $filename);

                // Hapus file lama
                if ($pendaftaran->$field) {
                    Storage::delete("public/uploads/{$folder}/" . $pendaftaran->$field);
                }

                $pendaftaran->$field = $filename;
                $updated[] = $field;
            }
        }

        $pendaftaran->save();

        return response()->json([
            'success' => true,
            'message' => 'File berhasil diupload.',
            'updated' => $updated,
        ]);
    }

    /** Export Excel */
    public function exportExcel(Request $request)
    {
        $query = Pendaftaran::query();
        if ($request->lembaga) $query->where('lembaga', $request->lembaga);
        if ($request->status) $query->where('status', $request->status);
        $data = $query->orderBy('no_registrasi')->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Data Pendaftar');

        $headers = [
            'No', 'No. Reg', 'Nama', 'Lembaga', 'NISN', 'NIK', 'JK',
            'TTL', 'Provinsi', 'Kota/Kab', 'Kecamatan', 'Kelurahan',
            'Asal Sekolah', 'Status Mukim', 'PIP/PKH',
            'Nama Ayah', 'Pekerjaan Ayah',
            'Nama Ibu', 'Pekerjaan Ibu',
            'No HP Wali', 'Status', 'Tanggal Daftar',
        ];

        $col = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($col . '1', $header);
            $sheet->getStyle($col . '1')->getFont()->setBold(true);
            $col++;
        }

        $row = 2;
        foreach ($data as $i => $p) {
            $sheet->setCellValue('A' . $row, $i + 1);
            $sheet->setCellValue('B' . $row, $p->no_registrasi);
            $sheet->setCellValue('C' . $row, $p->nama);
            $sheet->setCellValue('D' . $row, $p->lembaga);
            $sheet->setCellValue('E' . $row, $p->nisn);
            $sheet->setCellValue('F' . $row, $p->nik);
            $sheet->setCellValue('G' . $row, $p->jenis_kelamin);
            $sheet->setCellValue('H' . $row, ($p->tempat_lahir ?? '') . ', ' . ($p->tanggal_lahir ? $p->tanggal_lahir->format('d/m/Y') : ''));
            $sheet->setCellValue('I' . $row, $p->provinsi);
            $sheet->setCellValue('J' . $row, $p->kota_kab);
            $sheet->setCellValue('K' . $row, $p->kecamatan);
            $sheet->setCellValue('L' . $row, $p->kelurahan_desa);
            $sheet->setCellValue('M' . $row, $p->asal_sekolah);
            $sheet->setCellValue('N' . $row, $p->status_mukim);
            $sheet->setCellValue('O' . $row, $p->pip_pkh);
            $sheet->setCellValue('P' . $row, $p->nama_ayah);
            $sheet->setCellValue('Q' . $row, $p->pekerjaan_ayah);
            $sheet->setCellValue('R' . $row, $p->nama_ibu);
            $sheet->setCellValue('S' . $row, $p->pekerjaan_ibu);
            $sheet->setCellValue('T' . $row, $p->no_hp_wali);
            $sheet->setCellValue('U' . $row, $p->status);
            $sheet->setCellValue('V' . $row, $p->created_at ? $p->created_at->format('d/m/Y') : '');
            $row++;
        }

        foreach (range('A', 'V') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);
        $filename = 'data-pendaftar-' . date('Ymd-His') . '.xlsx';
        $tempPath = sys_get_temp_dir() . '/' . $filename;
        $writer->save($tempPath);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'EXPORT',
            'description' => 'Export data pendaftaran ke Excel (' . $data->count() . ' records)',
            'ip_address' => request()->ip(),
        ]);

        return response()->download($tempPath, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }

    /** Kirim WhatsApp notifikasi kekurangan berkas */
    public function notifyBerkas(Request $request, $id): JsonResponse
    {
        $pendaftaran = Pendaftaran::findOrFail($id);

        $berkasKurang = [];
        if (empty($pendaftaran->file_kk)) $berkasKurang[] = 'Kartu Keluarga (KK)';
        if (empty($pendaftaran->file_ktp_ortu)) $berkasKurang[] = 'KTP Orang Tua';
        if (empty($pendaftaran->file_akta)) $berkasKurang[] = 'Akta Kelahiran';
        if (empty($pendaftaran->file_ijazah)) $berkasKurang[] = 'Ijazah/SKL';

        if (empty($berkasKurang)) {
            return response()->json([
                'success' => false,
                'message' => 'Semua berkas sudah lengkap!',
            ]);
        }

        $berkasText = implode(', ', $berkasKurang);
        $message = "Assalamualaikum, Yth. Wali Murid *{$pendaftaran->nama}*\n\n";
        $message .= "Nomor Registrasi: *{$pendaftaran->no_registrasi}*\n\n";
        $message .= "Kami informasikan bahwa berkas pendaftaran Anda *BELUM LENGKAP*.\n\n";
        $message .= "Berkas yang belum diunggah:\n";
        foreach ($berkasKurang as $b) {
            $message .= "• {$b}\n";
        }
        $message .= "\nMohon segera melengkapi berkas melalui website pendaftaran.\n\nTerima kasih.";

        $this->sendWhatsApp($pendaftaran->no_hp_wali, $message);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'WA_BERKAS',
            'description' => 'Kirim notifikasi kekurangan berkas ke: ' . $pendaftaran->nama,
            'ip_address' => $request->ip(),
        ]);

        return response()->json(['success' => true, 'message' => 'Notifikasi WA berhasil dikirim.']);
    }

    /** Kirim WhatsApp ucapan selamat  */
    public function notifyWelcome(Request $request, $id): JsonResponse
    {
        $pendaftaran = Pendaftaran::findOrFail($id);
        $gruaLink = Pengaturan::where('kunci', 'link_grup_wa')->value('nilai') ?? 'https://wa.me';

        $message = "Assalamualaikum, Yth. Wali Murid *{$pendaftaran->nama}*\n\n";
        $message .= "Selamat! Pendaftaran putra/putri Anda di *{$pendaftaran->lembaga}* telah *DITERIMA*.\n\n";
        $message .= "Nomor Registrasi: *{$pendaftaran->no_registrasi}*\n\n";
        $message .= "Silakan bergabung dengan grup WhatsApp kami:\n{$gruaLink}\n\nTerima kasih.";

        $this->sendWhatsApp($pendaftaran->no_hp_wali, $message);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'WA_WELCOME',
            'description' => 'Kirim ucapan selamat ke: ' . $pendaftaran->nama,
            'ip_address' => $request->ip(),
        ]);

        return response()->json(['success' => true, 'message' => 'WA ucapan selamat berhasil dikirim.']);
    }

    /** Helper: kirim WhatsApp */
    private function sendWhatsApp(string $phone, string $message): void
    {
        $url = config('services.mpwa.url');
        $apiKey = config('services.mpwa.api_key');
        $sender = config('services.mpwa.sender');

        if (!$url) return;

        // Normalize phone number
        $phone = preg_replace('/^0/', '62', preg_replace('/\D/', '', $phone));

        try {
            $ch = curl_init($url);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
                'api_key' => $apiKey,
                'sender' => $sender,
                'number' => $phone,
                'message' => $message,
            ]));
            curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
            curl_setopt($ch, CURLOPT_TIMEOUT, 10);
            curl_exec($ch);
            curl_close($ch);
        } catch (\Exception $e) {
            // Silently fail
        }
    }
}
