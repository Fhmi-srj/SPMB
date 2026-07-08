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
                    ->orWhere('no_hp_wali', 'like', "%{$search}%")
                    ->orWhere('alamat', 'like', "%{$search}%")
                    ->orWhere('provinsi', 'like', "%{$search}%")
                    ->orWhere('kota_kab', 'like', "%{$search}%")
                    ->orWhere('kecamatan', 'like', "%{$search}%")
                    ->orWhere('kelurahan_desa', 'like', "%{$search}%")
                    ->orWhere('nama_ayah', 'like', "%{$search}%")
                    ->orWhere('nama_ibu', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%");
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

        $sortBy = $request->query('sort_by', 'no_registrasi');
        $sortDir = $request->query('sort_dir', 'asc');
        $allowedSort = ['no_registrasi', 'nama', 'alamat', 'lembaga', 'no_hp_wali', 'status', 'created_at'];
        if (!in_array($sortBy, $allowedSort)) {
            $sortBy = 'no_registrasi';
        }
        if (!in_array($sortDir, ['asc', 'desc'])) {
            $sortDir = 'asc';
        }
        $query->orderBy($sortBy, $sortDir);

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
            ->orWhere('no_registrasi', 'like', "%{$q}%")
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get(['id', 'nama', 'lembaga', 'no_registrasi', 'status', 'alamat', 'asal_sekolah', 'status_mukim', 'created_at']);

        $ids = $results->pluck('id')->toArray();

        $biayaSMPTotal = \App\Models\Biaya::sum('biaya_smp');
        $biayaMATotal = \App\Models\Biaya::sum('biaya_ma');
        $biayaPondokTotal = \App\Models\Biaya::sum('biaya_pondok');

        $perlengkapanDetails = [];
        $perlengkapanTotals = [];
        if (!empty($ids)) {
            $pesanans = \DB::table('perlengkapan_pesanan')
                ->join('perlengkapan_items', 'perlengkapan_pesanan.perlengkapan_item_id', '=', 'perlengkapan_items.id')
                ->whereIn('perlengkapan_pesanan.pendaftaran_id', $ids)
                ->where('perlengkapan_pesanan.status', 1)
                ->select('perlengkapan_pesanan.pendaftaran_id', 'perlengkapan_items.nama_item', 'perlengkapan_items.nominal')
                ->get();
            
            foreach ($pesanans as $p) {
                $perlengkapanDetails[$p->pendaftaran_id][] = [
                    'nama_item' => $p->nama_item,
                    'nominal' => (int)$p->nominal
                ];
                if (!isset($perlengkapanTotals[$p->pendaftaran_id])) {
                    $perlengkapanTotals[$p->pendaftaran_id] = 0;
                }
                $perlengkapanTotals[$p->pendaftaran_id] += (int)$p->nominal;
            }
        }

        $paidTotals = [];
        if (!empty($ids)) {
            $paidTotals = \DB::table('transaksi_pemasukan')
                ->whereIn('pendaftaran_id', $ids)
                ->where('status', '!=', 'rejected')
                ->groupBy('pendaftaran_id')
                ->select('pendaftaran_id', \DB::raw('SUM(nominal) as total'))
                ->pluck('total', 'pendaftaran_id')
                ->toArray();
        }

        $formattedResults = $results->map(function ($r) use ($biayaSMPTotal, $biayaMATotal, $biayaPondokTotal, $perlengkapanTotals, $perlengkapanDetails, $paidTotals) {
            $biayaSekolah = ($r->lembaga === 'SMP NU BP') ? (int)$biayaSMPTotal : (int)$biayaMATotal;
            $biayaPondok = ($r->status_mukim === 'PONDOK PP MAMBAUL HUDA') ? (int)$biayaPondokTotal : 0;
            $biayaPerlengkapan = (int)($perlengkapanTotals[$r->id] ?? 0);
            $totalTagihan = $biayaSekolah + $biayaPondok + $biayaPerlengkapan;
            $totalPaid = (int)($paidTotals[$r->id] ?? 0);
            $sisaKekurangan = $totalTagihan - $totalPaid;

            return [
                'id' => $r->id,
                'nama' => $r->nama,
                'lembaga' => $r->lembaga,
                'no_registrasi' => $r->no_registrasi,
                'status' => $r->status,
                'alamat' => $r->alamat,
                'asal_sekolah' => $r->asal_sekolah,
                'status_mukim' => $r->status_mukim,
                'created_at' => $r->created_at,
                'biaya_sekolah' => $biayaSekolah,
                'biaya_pondok' => $biayaPondok,
                'biaya_perlengkapan' => $biayaPerlengkapan,
                'perlengkapan_details' => $perlengkapanDetails[$r->id] ?? [],
                'total_tagihan' => $totalTagihan,
                'total_dibayar' => $totalPaid,
                'sisa_kekurangan' => $sisaKekurangan,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $formattedResults,
        ]);
    }

    /** Buat pendaftaran baru (publik) */
    public function store(Request $request): JsonResponse
    {
        // Normalize no_hp_wali before validation (Fix #16)
        if ($request->filled('no_hp_wali')) {
            $phone = preg_replace('/[^0-9]/', '', $request->no_hp_wali);
            if (!empty($phone)) {
                if (str_starts_with($phone, '62')) {
                    $phone = '0' . substr($phone, 2);
                } elseif (!str_starts_with($phone, '0')) {
                    $phone = '0' . $phone;
                }
                $request->merge(['no_hp_wali' => $phone]);
            } else {
                $request->merge(['no_hp_wali' => null]);
            }
        } else {
            $request->merge(['no_hp_wali' => null]);
        }

        $request->validate([
            'nama' => 'required|string|max:100',
            'lembaga' => 'required|in:SMP NU BP,MA ALHIKAM',
            'jenis_kelamin' => 'required|in:L,P',
            'status_mukim' => 'required|in:PONDOK PP MAMBAUL HUDA,PONDOK SELAIN PP MAMBAUL HUDA,TIDAK PONDOK',
            'no_hp_wali' => 'nullable|required_with:password|string|max:20',
            'password' => 'nullable|string|min:6',
        ], [
            'nama.required' => 'Nama lengkap wajib diisi.',
            'lembaga.required' => 'Lembaga wajib dipilih.',
            'jenis_kelamin.required' => 'Jenis kelamin wajib dipilih.',
            'status_mukim.required' => 'Status mukim wajib dipilih.',
            'no_hp_wali.required_with' => 'Nomor HP Wali wajib diisi jika Anda membuat akun.',
            'password.min' => 'Password minimal terdiri dari 6 karakter.',
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
            
            // Generate registration number based on current month/year suffix to avoid DB lock and timezone issues
            $latest = Pendaftaran::where('no_registrasi', 'like', "%." . $bulan . $tahun)
                ->orderByDesc('id')
                ->first();
            if ($latest) {
                $parts = explode('.', $latest->no_registrasi);
                $lastCount = (int) $parts[0];
                $count = $lastCount + 1;
            } else {
                $count = 1;
            }
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
            $data['password'] = $request->password ? Hash::make($request->password) : null;
            $data['no_registrasi'] = $noReg;
            $data['status'] = 'pending';

            return Pendaftaran::create($data);
        });

        // Proses upload dokumen jika ada (Fix file upload ignore during registration)
        $fileFields = ['file_kk', 'file_ktp_ortu', 'file_akta', 'file_ijazah', 'file_sertifikat'];
        $hasUpload = false;
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                $file = $request->file($field);
                $folder = $field === 'file_sertifikat' ? 'sertifikat' : 'dokumen';
                $filename = $pendaftaran->id . '_' . $field . '_' . time() . '.' . $file->getClientOriginalExtension();
                $file->storeAs("uploads/{$folder}", $filename, 'public');
                $pendaftaran->$field = $filename;
                $hasUpload = true;
            }
        }
        if ($hasUpload) {
            $pendaftaran->save();
        }

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

        if ($request->has('no_hp_wali')) {
            if ($request->filled('no_hp_wali')) {
                $phone = preg_replace('/[^0-9]/', '', $request->no_hp_wali);
                if (!empty($phone)) {
                    if (str_starts_with($phone, '62')) {
                        $phone = '0' . substr($phone, 2);
                    } elseif (!str_starts_with($phone, '0')) {
                        $phone = '0' . $phone;
                    }
                    $request->merge(['no_hp_wali' => $phone]);
                } else {
                    $request->merge(['no_hp_wali' => null]);
                }
            } else {
                $request->merge(['no_hp_wali' => null]);
            }
        }

        $request->validate([
            'nama' => 'sometimes|required|string|max:100',
            'no_hp_wali' => 'sometimes|nullable|string|max:20',
        ]);

        $allowedFields = [
            'nama', 'lembaga', 'nisn', 'nik', 'jenis_kelamin', 'tempat_lahir', 'tanggal_lahir',
            'jumlah_saudara', 'no_kk', 'alamat', 'provinsi', 'kota_kab', 'kecamatan', 'kelurahan_desa',
            'asal_sekolah', 'status_mukim', 'nama_ayah', 'pekerjaan_ayah', 'penghasilan_ayah',
            'nama_ibu', 'pekerjaan_ibu', 'penghasilan_ibu', 'no_hp_wali', 'status', 'catatan_admin'
        ];
        $data = $request->only($allowedFields);

        if ($request->has('catatan_admin')) {
            $data['catatan_updated_at'] = now();
        }

        $pendaftaran->update($data);

        ActivityLog::create([
            'admin_id' => auth()->id(),
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
                Storage::disk('public')->delete('uploads/dokumen/' . $pendaftaran->$field);
            }
        }
        if ($pendaftaran->file_sertifikat) {
            Storage::disk('public')->delete('uploads/sertifikat/' . $pendaftaran->file_sertifikat);
        }

        $pendaftaran->delete();

        ActivityLog::create([
            'admin_id' => auth()->id(),
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
                $file->storeAs("uploads/{$folder}", $filename, 'public');

                // Hapus file lama
                if ($pendaftaran->$field) {
                    Storage::disk('public')->delete("uploads/{$folder}/" . $pendaftaran->$field);
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
            'data' => $pendaftaran,
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
            'admin_id' => auth()->id(),
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
            'admin_id' => auth()->id(),
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
            'admin_id' => auth()->id(),
            'action' => 'WA_WELCOME',
            'description' => 'Kirim ucapan selamat ke: ' . $pendaftaran->nama,
            'ip_address' => $request->ip(),
        ]);

        return response()->json(['success' => true, 'message' => 'WA ucapan selamat berhasil dikirim.']);
    }

    /** Verifikasi masal (bulk verify) */
    public function verifyBulk(Request $request): JsonResponse
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:pendaftaran,id',
        ], [
            'ids.required' => 'Pilih setidaknya satu pendaftar.',
            'ids.array' => 'Data pendaftar tidak valid.',
            'ids.*.exists' => 'Pendaftar tidak ditemukan.',
        ]);

        $ids = $request->ids;

        Pendaftaran::whereIn('id', $ids)->update(['status' => 'verified']);

        ActivityLog::create([
            'admin_id' => auth()->id(),
            'action' => 'UPDATE',
            'description' => 'Melakukan verifikasi masal untuk ' . count($ids) . ' pendaftar.',
            'ip_address' => $request->ip(),
        ]);

        return response()->json([
            'success' => true,
            'message' => count($ids) . ' pendaftar berhasil diverifikasi.',
        ]);
    }

    /** Helper: kirim WhatsApp */
    private function sendWhatsApp(?string $phone, string $message): void
    {
        if (empty($phone)) return;

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

    public function rekap(Request $request): JsonResponse
    {
        $query = Pendaftaran::query();

        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('nisn', 'like', "%{$search}%")
                    ->orWhere('no_registrasi', 'like', "%{$search}%")
                    ->orWhere('asal_sekolah', 'like', "%{$search}%")
                    ->orWhere('no_hp_wali', 'like', "%{$search}%")
                    ->orWhere('alamat', 'like', "%{$search}%")
                    ->orWhere('provinsi', 'like', "%{$search}%")
                    ->orWhere('kota_kab', 'like', "%{$search}%")
                    ->orWhere('kecamatan', 'like', "%{$search}%")
                    ->orWhere('kelurahan_desa', 'like', "%{$search}%")
                    ->orWhere('nama_ayah', 'like', "%{$search}%")
                    ->orWhere('nama_ibu', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%");
            });
        }

        if ($request->lembaga) {
            $query->where('lembaga', $request->lembaga);
        }

        if ($request->status_mukim) {
            $query->where('status_mukim', $request->status_mukim);
        }

        // Calculate summary statistics for ALL filtered records
        $allFiltered = (clone $query)->get(['id', 'lembaga', 'status_mukim', 'file_kk', 'file_ktp_ortu', 'file_akta', 'file_ijazah']);
        
        $biayaSMPTotal = \App\Models\Biaya::sum('biaya_smp');
        $biayaMATotal = \App\Models\Biaya::sum('biaya_ma');
        $biayaPondokTotal = \App\Models\Biaya::sum('biaya_pondok');

        $filteredIds = $allFiltered->pluck('id')->toArray();

        // Get perlengkapan orders sum for filtered in bulk
        $perlengkapanTotals = [];
        if (!empty($filteredIds)) {
            $perlengkapanTotals = \DB::table('perlengkapan_pesanan')
                ->join('perlengkapan_items', 'perlengkapan_pesanan.perlengkapan_item_id', '=', 'perlengkapan_items.id')
                ->whereIn('perlengkapan_pesanan.pendaftaran_id', $filteredIds)
                ->where('perlengkapan_pesanan.status', 1)
                ->groupBy('perlengkapan_pesanan.pendaftaran_id')
                ->select('perlengkapan_pesanan.pendaftaran_id', \DB::raw('SUM(perlengkapan_items.nominal) as total'))
                ->pluck('total', 'pendaftaran_id')
                ->toArray();
        }

        // Get total paid for filtered in bulk
        $paidTotals = [];
        if (!empty($filteredIds)) {
            $paidTotals = \DB::table('transaksi_pemasukan')
                ->whereIn('pendaftaran_id', $filteredIds)
                ->where('status', 'approved')
                ->groupBy('pendaftaran_id')
                ->select('pendaftaran_id', \DB::raw('SUM(nominal) as total'))
                ->pluck('total', 'pendaftaran_id')
                ->toArray();
        }

        $sumTotalTagihan = 0;
        $sumTotalKekurangan = 0;
        $sumTotalPaid = 0;
        $countLengkap = 0;

        foreach ($allFiltered as $p) {
            $tagihanSekolah = ($p->lembaga === 'SMP NU BP') ? $biayaSMPTotal : $biayaMATotal;
            $tagihanPondok = ($p->status_mukim === 'PONDOK PP MAMBAUL HUDA') ? $biayaPondokTotal : 0;
            $tagihanFees = $tagihanSekolah + $tagihanPondok;
            $pemesananPerlengkapan = $perlengkapanTotals[$p->id] ?? 0;
            $totalTagihan = $tagihanFees + $pemesananPerlengkapan;
            $totalPaid = $paidTotals[$p->id] ?? 0;
            $kekurangan = $totalTagihan - $totalPaid;

            $isLengkap = !empty($p->file_kk) && !empty($p->file_ktp_ortu) && !empty($p->file_akta) && !empty($p->file_ijazah);

            $sumTotalTagihan += $totalTagihan;
            $sumTotalKekurangan += $kekurangan;
            $sumTotalPaid += $totalPaid;
            if ($isLengkap) {
                $countLengkap++;
            }
        }

        $totalPengeluaran = \App\Models\TransaksiPengeluaran::where('status', 'approved')->sum('nominal');

        $perPage = (int)($request->per_page ?? 20);
        $paginator = $query->orderBy('no_registrasi')->paginate($perPage);

        $items = [];
        foreach ($paginator->items() as $p) {
            $tagihanSekolah = ($p->lembaga === 'SMP NU BP') ? $biayaSMPTotal : $biayaMATotal;
            $tagihanPondok = ($p->status_mukim === 'PONDOK PP MAMBAUL HUDA') ? $biayaPondokTotal : 0;
            $tagihanFees = $tagihanSekolah + $tagihanPondok;
            $pemesananPerlengkapan = $perlengkapanTotals[$p->id] ?? 0;
            $totalTagihan = $tagihanFees + $pemesananPerlengkapan;
            $totalPaid = $paidTotals[$p->id] ?? 0;
            $kekurangan = $totalTagihan - $totalPaid;

            $isLengkap = !empty($p->file_kk) && !empty($p->file_ktp_ortu) && !empty($p->file_akta) && !empty($p->file_ijazah);
            $missing = [];
            if (empty($p->file_kk)) $missing[] = 'KK';
            if (empty($p->file_ktp_ortu)) $missing[] = 'KTP';
            if (empty($p->file_akta)) $missing[] = 'Akta';
            if (empty($p->file_ijazah)) $missing[] = 'Ijazah';
            $statusBerkasLabel = $isLengkap ? 'Lengkap' : 'Belum Lengkap (' . implode(', ', $missing) . ')';

            $items[] = [
                'id' => $p->id,
                'no_registrasi' => $p->no_registrasi,
                'nama' => $p->nama,
                'lembaga' => $p->lembaga,
                'alamat' => $p->alamat,
                'status_berkas' => $isLengkap ? 'Lengkap' : 'Belum Lengkap',
                'status_berkas_detail' => $statusBerkasLabel,
                'missing_berkas' => $missing,
                'tagihan' => $tagihanFees,
                'pemesanan' => $pemesananPerlengkapan,
                'total_tagihan' => $totalTagihan,
                'total_dibayar' => $totalPaid,
                'kekurangan' => $kekurangan,
                'status_mukim' => $p->status_mukim,
                'asal_sekolah' => $p->asal_sekolah,
            ];
        }

        return response()->json([
            'success' => true,
            'data' => $items,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
            'summary' => [
                'total_pendaftar' => $allFiltered->count(),
                'total_lengkap_berkas' => $countLengkap,
                'total_tagihan' => $sumTotalTagihan,
                'total_kekurangan' => $sumTotalKekurangan,
                'total_pemasukan' => $sumTotalPaid,
                'total_pengeluaran' => $totalPengeluaran,
                'saldo_tersedia' => $sumTotalPaid - $totalPengeluaran,
            ]
        ]);
    }

    public function exportRekapExcel(Request $request)
    {
        $query = Pendaftaran::query();
        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('nisn', 'like', "%{$search}%")
                    ->orWhere('no_registrasi', 'like', "%{$search}%")
                    ->orWhere('asal_sekolah', 'like', "%{$search}%")
                    ->orWhere('no_hp_wali', 'like', "%{$search}%")
                    ->orWhere('alamat', 'like', "%{$search}%")
                    ->orWhere('provinsi', 'like', "%{$search}%")
                    ->orWhere('kota_kab', 'like', "%{$search}%")
                    ->orWhere('kecamatan', 'like', "%{$search}%")
                    ->orWhere('kelurahan_desa', 'like', "%{$search}%")
                    ->orWhere('nama_ayah', 'like', "%{$search}%")
                    ->orWhere('nama_ibu', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%");
            });
        }
        if ($request->lembaga) $query->where('lembaga', $request->lembaga);
        if ($request->status_mukim) $query->where('status_mukim', $request->status_mukim);

        $data = $query->orderBy('no_registrasi')->get();

        $biayaSMPTotal = \App\Models\Biaya::sum('biaya_smp');
        $biayaMATotal = \App\Models\Biaya::sum('biaya_ma');
        $biayaPondokTotal = \App\Models\Biaya::sum('biaya_pondok');

        $studentIds = $data->pluck('id')->toArray();

        $perlengkapanTotals = [];
        if (!empty($studentIds)) {
            $perlengkapanTotals = \DB::table('perlengkapan_pesanan')
                ->join('perlengkapan_items', 'perlengkapan_pesanan.perlengkapan_item_id', '=', 'perlengkapan_items.id')
                ->whereIn('perlengkapan_pesanan.pendaftaran_id', $studentIds)
                ->where('perlengkapan_pesanan.status', 1)
                ->groupBy('perlengkapan_pesanan.pendaftaran_id')
                ->select('perlengkapan_pesanan.pendaftaran_id', \DB::raw('SUM(perlengkapan_items.nominal) as total'))
                ->pluck('total', 'pendaftaran_id')
                ->toArray();
        }

        $paidTotals = [];
        if (!empty($studentIds)) {
            $paidTotals = \DB::table('transaksi_pemasukan')
                ->whereIn('pendaftaran_id', $studentIds)
                ->where('status', 'approved')
                ->groupBy('pendaftaran_id')
                ->select('pendaftaran_id', \DB::raw('SUM(nominal) as total'))
                ->pluck('total', 'pendaftaran_id')
                ->toArray();
        }

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Rekap Pendaftaran');

        $headers = [
            'No', 'No. Reg', 'Nama Calon', 'Lembaga', 'Alamat', 
            'Status Pemberkasan', 'Tagihan (Sekolah & Pondok)', 
            'Pemesanan (Perlengkapan)', 'Total Tagihan', 'Total Pembayaran', 'Kekurangan Pembayaran'
        ];

        $col = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($col . '1', $header);
            $sheet->getStyle($col . '1')->getFont()->setBold(true);
            $col++;
        }

        $row = 2;
        foreach ($data as $i => $p) {
            $tagihanSekolah = ($p->lembaga === 'SMP NU BP') ? $biayaSMPTotal : $biayaMATotal;
            $tagihanPondok = ($p->status_mukim === 'PONDOK PP MAMBAUL HUDA') ? $biayaPondokTotal : 0;
            $tagihanFees = $tagihanSekolah + $tagihanPondok;
            $pemesananPerlengkapan = $perlengkapanTotals[$p->id] ?? 0;
            $totalTagihan = $tagihanFees + $pemesananPerlengkapan;
            $totalPaid = $paidTotals[$p->id] ?? 0;
            $kekurangan = $totalTagihan - $totalPaid;

            $isLengkap = !empty($p->file_kk) && !empty($p->file_ktp_ortu) && !empty($p->file_akta) && !empty($p->file_ijazah);
            $missing = [];
            if (empty($p->file_kk)) $missing[] = 'KK';
            if (empty($p->file_ktp_ortu)) $missing[] = 'KTP';
            if (empty($p->file_akta)) $missing[] = 'Akta';
            if (empty($p->file_ijazah)) $missing[] = 'Ijazah';
            $statusBerkasLabel = $isLengkap ? 'Lengkap' : 'Belum Lengkap (' . implode(', ', $missing) . ')';

            $sheet->setCellValue('A' . $row, $i + 1);
            $sheet->setCellValue('B' . $row, $p->no_registrasi);
            $sheet->setCellValue('C' . $row, $p->nama);
            $sheet->setCellValue('D' . $row, $p->lembaga);
            $sheet->setCellValue('E' . $row, $p->alamat);
            $sheet->setCellValue('F' . $row, $statusBerkasLabel);
            $sheet->setCellValue('G' . $row, $tagihanFees);
            $sheet->setCellValue('H' . $row, $pemesananPerlengkapan);
            $sheet->setCellValue('I' . $row, $totalTagihan);
            $sheet->setCellValue('J' . $row, $totalPaid);
            $sheet->setCellValue('K' . $row, $kekurangan);
            $row++;
        }

        foreach (range('A', 'K') as $col) {
            $sheet->getColumnDimension($col)->setAutoSize(true);
        }

        $writer = new Xlsx($spreadsheet);
        $filename = 'rekap-pendaftaran-' . date('Ymd-His') . '.xlsx';
        $tempPath = sys_get_temp_dir() . '/' . $filename;
        $writer->save($tempPath);

        ActivityLog::create([
            'admin_id' => auth()->id(),
            'action' => 'EXPORT',
            'description' => 'Export rekap pendaftaran ke Excel (' . $data->count() . ' records)',
            'ip_address' => request()->ip(),
        ]);

        return response()->download($tempPath, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ])->deleteFileAfterSend(true);
    }

    public function exportRekapPdf(Request $request)
    {
        $query = Pendaftaran::query();
        if ($request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('nisn', 'like', "%{$search}%")
                    ->orWhere('no_registrasi', 'like', "%{$search}%")
                    ->orWhere('asal_sekolah', 'like', "%{$search}%")
                    ->orWhere('no_hp_wali', 'like', "%{$search}%")
                    ->orWhere('alamat', 'like', "%{$search}%")
                    ->orWhere('provinsi', 'like', "%{$search}%")
                    ->orWhere('kota_kab', 'like', "%{$search}%")
                    ->orWhere('kecamatan', 'like', "%{$search}%")
                    ->orWhere('kelurahan_desa', 'like', "%{$search}%")
                    ->orWhere('nama_ayah', 'like', "%{$search}%")
                    ->orWhere('nama_ibu', 'like', "%{$search}%")
                    ->orWhere('nik', 'like', "%{$search}%");
            });
        }
        if ($request->lembaga) $query->where('lembaga', $request->lembaga);
        if ($request->status_mukim) $query->where('status_mukim', $request->status_mukim);

        $data = $query->orderBy('no_registrasi')->get();

        $biayaSMPTotal = \App\Models\Biaya::sum('biaya_smp');
        $biayaMATotal = \App\Models\Biaya::sum('biaya_ma');
        $biayaPondokTotal = \App\Models\Biaya::sum('biaya_pondok');

        $studentIds = $data->pluck('id')->toArray();

        $perlengkapanTotals = [];
        if (!empty($studentIds)) {
            $perlengkapanTotals = \DB::table('perlengkapan_pesanan')
                ->join('perlengkapan_items', 'perlengkapan_pesanan.perlengkapan_item_id', '=', 'perlengkapan_items.id')
                ->whereIn('perlengkapan_pesanan.pendaftaran_id', $studentIds)
                ->where('perlengkapan_pesanan.status', 1)
                ->groupBy('perlengkapan_pesanan.pendaftaran_id')
                ->select('perlengkapan_pesanan.pendaftaran_id', \DB::raw('SUM(perlengkapan_items.nominal) as total'))
                ->pluck('total', 'pendaftaran_id')
                ->toArray();
        }

        $paidTotals = [];
        if (!empty($studentIds)) {
            $paidTotals = \DB::table('transaksi_pemasukan')
                ->whereIn('pendaftaran_id', $studentIds)
                ->where('status', 'approved')
                ->groupBy('pendaftaran_id')
                ->select('pendaftaran_id', \DB::raw('SUM(nominal) as total'))
                ->pluck('total', 'pendaftaran_id')
                ->toArray();
        }

        $sumTotalTagihan = 0;
        $sumTotalKekurangan = 0;
        $sumTotalPaid = 0;
        $countLengkap = 0;

        $items = [];
        foreach ($data as $p) {
            $tagihanSekolah = ($p->lembaga === 'SMP NU BP') ? $biayaSMPTotal : $biayaMATotal;
            $tagihanPondok = ($p->status_mukim === 'PONDOK PP MAMBAUL HUDA') ? $biayaPondokTotal : 0;
            $tagihanFees = $tagihanSekolah + $tagihanPondok;
            $pemesananPerlengkapan = $perlengkapanTotals[$p->id] ?? 0;
            $totalTagihan = $tagihanFees + $pemesananPerlengkapan;
            $totalPaid = $paidTotals[$p->id] ?? 0;
            $kekurangan = $totalTagihan - $totalPaid;

            $isLengkap = !empty($p->file_kk) && !empty($p->file_ktp_ortu) && !empty($p->file_akta) && !empty($p->file_ijazah);
            $missing = [];
            if (empty($p->file_kk)) $missing[] = 'KK';
            if (empty($p->file_ktp_ortu)) $missing[] = 'KTP';
            if (empty($p->file_akta)) $missing[] = 'Akta';
            if (empty($p->file_ijazah)) $missing[] = 'Ijazah';
            $statusBerkasLabel = $isLengkap ? 'Lengkap' : 'Belum Lengkap (' . implode(', ', $missing) . ')';

            $sumTotalTagihan += $totalTagihan;
            $sumTotalKekurangan += $kekurangan;
            $sumTotalPaid += $totalPaid;
            if ($isLengkap) {
                $countLengkap++;
            }

            $items[] = [
                'no_registrasi' => $p->no_registrasi,
                'nama' => $p->nama,
                'lembaga' => $p->lembaga,
                'alamat' => $p->alamat,
                'status_berkas' => $isLengkap ? 'Lengkap' : 'Belum Lengkap',
                'status_berkas_detail' => $statusBerkasLabel,
                'tagihan' => $tagihanFees,
                'pemesanan' => $pemesananPerlengkapan,
                'total_tagihan' => $totalTagihan,
                'total_dibayar' => $totalPaid,
                'kekurangan' => $kekurangan,
            ];
        }

        $totalPengeluaran = \App\Models\TransaksiPengeluaran::where('status', 'approved')->sum('nominal');

        $summary = [
            'total_pendaftar' => $data->count(),
            'total_lengkap_berkas' => $countLengkap,
            'total_tagihan' => $sumTotalTagihan,
            'total_kekurangan' => $sumTotalKekurangan,
            'total_pemasukan' => $sumTotalPaid,
            'total_pengeluaran' => $totalPengeluaran,
            'saldo_tersedia' => $sumTotalPaid - $totalPengeluaran,
        ];

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.rekap_pendaftaran', [
            'data' => $items,
            'title' => 'Rekap Pendaftaran Calon Siswa Baru',
            'date' => date('d/m/Y H:i'),
            'summary' => $summary,
        ]);

        $pdf->setPaper('a4', 'landscape');

        ActivityLog::create([
            'admin_id' => auth()->id(),
            'action' => 'EXPORT',
            'description' => 'Export rekap pendaftaran ke PDF (' . $data->count() . ' records)',
            'ip_address' => request()->ip(),
        ]);

        return $pdf->download('rekap-pendaftaran-' . date('Ymd-His') . '.pdf');
    }

    /** Print kartu pendaftaran (massal / individual) */
    public function printKartu(Request $request)
    {
        $token = $request->query('token');
        $noReg = $request->query('no_reg');
        $isAdmin = false;
        $admin = null;

        if ($token) {
            // Cari token secara manual dari personal_access_tokens
            if (str_contains($token, '|')) {
                [$id, $plain] = explode('|', $token, 2);
                $pat = \Laravel\Sanctum\PersonalAccessToken::find($id);
                if ($pat && hash_equals($pat->token, hash('sha256', $plain))) {
                    if (!$pat->expires_at || !$pat->expires_at->isPast()) {
                        $admin = $pat->tokenable;
                        if ($admin) {
                            $isAdmin = true;
                        }
                    }
                }
            } else {
                $pat = \Laravel\Sanctum\PersonalAccessToken::where('token', hash('sha256', $token))->first();
                if ($pat && (!$pat->expires_at || !$pat->expires_at->isPast())) {
                    $admin = $pat->tokenable;
                    if ($admin) {
                        $isAdmin = true;
                    }
                }
            }
        }

        $idsString = $request->query('ids', '');
        if (empty($idsString)) {
            return response('Bad Request: ID pendaftar tidak disertakan', 400);
        }

        $ids = array_filter(explode(',', $idsString));
        if (empty($ids)) {
            return response('Bad Request: ID pendaftar tidak valid', 400);
        }

        // Jika bukan admin, pastikan ada verifikasi no_reg pendaftar tunggal
        if (!$isAdmin) {
            if (!$noReg) {
                return response('Unauthorized: Token tidak valid atau verifikasi tidak ditemukan', 401);
            }
            if (count($ids) > 1) {
                return response('Unauthorized: Cetak massal hanya diperbolehkan untuk administrator', 403);
            }
            $students = Pendaftaran::where('id', $ids[0])->where('no_registrasi', $noReg)->get();
        } else {
            $students = Pendaftaran::whereIn('id', $ids)->get();
        }

        if ($students->isEmpty()) {
            return response('Not Found: Data pendaftar tidak ditemukan', 404);
        }

        // Ambil tahun ajaran aktif dari pengaturan
        $settings = Pengaturan::all()->keyBy('kunci')->map(fn($s) => $s->nilai);
        $tahun_ajaran = $settings->get('tahun_ajaran', '2026/2027');

        if ($isAdmin && $admin) {
            // Catat aktivitas print
            ActivityLog::create([
                'admin_id'    => $admin->id,
                'action'      => 'EXPORT',
                'description' => 'Mencetak kartu tanda peserta untuk ' . $students->count() . ' pendaftar',
                'ip_address'  => $request->ip(),
            ]);
        }

        return view('print-kartu', compact('students', 'tahun_ajaran'));
    }
}
