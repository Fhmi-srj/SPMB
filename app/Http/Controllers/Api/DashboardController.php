<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\ActivityLog;
use App\Models\TransaksiPemasukan;
use App\Models\TransaksiPengeluaran;
use App\Models\Biaya;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function statistics(): JsonResponse
    {
        $total = Pendaftaran::count();
        $perLembaga = Pendaftaran::selectRaw('lembaga, COUNT(*) as total')
            ->groupBy('lembaga')->pluck('total', 'lembaga');
        $perStatus = Pendaftaran::selectRaw('status, COUNT(*) as total')
            ->groupBy('status')->pluck('total', 'status');
        $perMukim = Pendaftaran::selectRaw('status_mukim, COUNT(*) as total')
            ->groupBy('status_mukim')->pluck('total', 'status_mukim');
        $perJK = Pendaftaran::selectRaw('jenis_kelamin, COUNT(*) as total')
            ->groupBy('jenis_kelamin')->pluck('total', 'jenis_kelamin');

        // Monthly data (6 bulan terakhir) — format labels & data for Chart.js
        $months = collect();
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $months->push([
                'month' => $date->month,
                'year'  => $date->year,
                'label' => $date->translatedFormat('M Y'),
            ]);
        }
        $monthlyCounts = Pendaftaran::selectRaw('MONTH(created_at) as bulan, YEAR(created_at) as tahun, COUNT(*) as total')
            ->whereRaw('created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)')
            ->groupByRaw('YEAR(created_at), MONTH(created_at)')
            ->get()
            ->keyBy(fn($r) => $r->tahun . '-' . $r->bulan);

        $monthlyLabels = [];
        $monthlyData = [];
        foreach ($months as $m) {
            $monthlyLabels[] = $m['label'];
            $key = $m['year'] . '-' . $m['month'];
            $monthlyData[] = $monthlyCounts->has($key) ? $monthlyCounts[$key]->total : 0;
        }

        // Latest registrations
        $latest = Pendaftaran::orderByDesc('created_at')
            ->limit(10)
            ->get(['nama', 'lembaga', 'jenis_kelamin', 'status', 'created_at']);

        // Recent activity log
        $activityLog = ActivityLog::with('user:id,nama')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        // Document completion stats
        $docFields = ['file_kk', 'file_ktp_ortu', 'file_akta', 'file_ijazah', 'file_sertifikat'];
        $docStats = [];
        foreach ($docFields as $field) {
            $docStats[$field] = Pendaftaran::whereNotNull($field)->where($field, '!=', '')->count();
        }

        // Sumber info stats
        $sumberInfo = Pendaftaran::selectRaw('sumber_info, COUNT(*) as total')
            ->whereNotNull('sumber_info')
            ->where('sumber_info', '!=', '')
            ->groupBy('sumber_info')
            ->pluck('total', 'sumber_info');

        // Pos Keuangan summary
        $posKeuangan = [];
        try {
            $biayaRegistrasiRow = Biaya::where('nama_item', 'Registrasi')->first();
            $biayaMATotal = Biaya::sum('biaya_ma');
            $biayaSMPTotal = Biaya::sum('biaya_smp');
            $biayaPondokExclReg = Biaya::where('nama_item', '!=', 'Registrasi')->sum('biaya_pondok');
            $biayaRegistrasiPondok = $biayaRegistrasiRow ? $biayaRegistrasiRow->biaya_pondok : 50000;

            $registrants = Pendaftaran::select('id', 'nama', 'lembaga', 'status_mukim')->get();

            $totalRegistrasiPemasukan = 0;
            $totalMAPemasukan = 0;
            $totalSMPPemasukan = 0;
            $totalPondokPemasukan = 0;
            $totalPerlengkapanPemasukan = 0;
            $totalSisaPemasukan = 0;

            $payments = TransaksiPemasukan::where('status', 'approved')
                ->selectRaw('pendaftaran_id, SUM(nominal) as total')
                ->groupBy('pendaftaran_id')
                ->pluck('total', 'pendaftaran_id');

            $perlengkapanTotals = DB::table('perlengkapan_pesanan')
                ->join('perlengkapan_items', 'perlengkapan_pesanan.perlengkapan_item_id', '=', 'perlengkapan_items.id')
                ->where('perlengkapan_pesanan.status', 1)
                ->groupBy('perlengkapan_pesanan.pendaftaran_id')
                ->selectRaw('perlengkapan_pesanan.pendaftaran_id, SUM(perlengkapan_items.nominal) as total')
                ->pluck('total', 'pendaftaran_id');

            foreach ($registrants as $reg) {
                $totalPembayaran = $payments[$reg->id] ?? 0;
                if ($totalPembayaran <= 0) {
                    continue;
                }

                $isPondok = $reg->status_mukim === 'PONDOK PP MAMBAUL HUDA';
                $totalPerlengkapan = $perlengkapanTotals[$reg->id] ?? 0;

                $sisa = $totalPembayaran;

                // 1. Allocate to Registrasi
                $allocatedRegistrasi = 0;
                if ($isPondok && $biayaRegistrasiPondok > 0) {
                    $allocatedRegistrasi = min($sisa, $biayaRegistrasiPondok);
                    $sisa -= $allocatedRegistrasi;
                }
                $totalRegistrasiPemasukan += $allocatedRegistrasi;

                // 2. Allocate to School (MA / SMP)
                $allocatedSchool = 0;
                $lembaga = strtoupper($reg->lembaga);
                if (in_array($lembaga, ['MA', 'MA ALHIKAM'])) {
                    $allocatedSchool = min($sisa, $biayaMATotal);
                    $sisa -= $allocatedSchool;
                    $totalMAPemasukan += $allocatedSchool;
                } elseif (in_array($lembaga, ['SMP', 'SMP NU BP'])) {
                    $allocatedSchool = min($sisa, $biayaSMPTotal);
                    $sisa -= $allocatedSchool;
                    $totalSMPPemasukan += $allocatedSchool;
                }

                // 3. Allocate to Pondok
                $allocatedPondok = 0;
                if ($sisa > 0 && $isPondok) {
                    $allocatedPondok = min($sisa, $biayaPondokExclReg);
                    $sisa -= $allocatedPondok;
                }
                $totalPondokPemasukan += $allocatedPondok;

                // 4. Allocate to Perlengkapan
                $allocatedPerlengkapan = 0;
                if ($sisa > 0 && $totalPerlengkapan > 0) {
                    $allocatedPerlengkapan = min($sisa, $totalPerlengkapan);
                    $sisa -= $allocatedPerlengkapan;
                }
                $totalPerlengkapanPemasukan += $allocatedPerlengkapan;

                // 5. Sisa
                $totalSisaPemasukan += $sisa;
            }

            $pengeluaran = TransaksiPengeluaran::where('status', 'approved')
                ->selectRaw('kategori, SUM(nominal) as total')
                ->groupBy('kategori')
                ->pluck('total', 'kategori');

            $categoriesMapping = [
                'Registrasi'   => $totalRegistrasiPemasukan,
                'MA'           => $totalMAPemasukan,
                'SMP'          => $totalSMPPemasukan,
                'Pondok'       => $totalPondokPemasukan,
                'Perlengkapan' => $totalPerlengkapanPemasukan,
                'Sisa'         => $totalSisaPemasukan,
            ];

            foreach ($categoriesMapping as $name => $pemasukanTotal) {
                $pengeluaranTotal = (float)($pengeluaran[$name] ?? 0);
                if ($pemasukanTotal > 0 || $pengeluaranTotal > 0 || in_array($name, ['MA', 'SMP', 'Pondok', 'Perlengkapan'])) {
                    $posKeuangan[$name] = [
                        'pemasukan'   => (float)$pemasukanTotal,
                        'pengeluaran' => $pengeluaranTotal,
                    ];
                }
            }
        } catch (\Exception $e) {
            // Tables might not exist yet
        }

        return response()->json([
            'success' => true,
            'data' => [
                'total'        => $total,
                'per_lembaga'  => $perLembaga,
                'per_status'   => $perStatus,
                'per_mukim'    => $perMukim,
                'per_gender'   => $perJK,
                'monthly'      => [
                    'labels' => $monthlyLabels,
                    'data'   => $monthlyData,
                ],
                'latest'       => $latest,
                'activity_log' => $activityLog,
                'doc_stats'    => $docStats,
                'sumber_info'  => $sumberInfo,
                'pos_keuangan' => $posKeuangan,
            ],
        ]);
    }

    public function recentActivity(): JsonResponse
    {
        $logs = ActivityLog::with('user:id,nama')
            ->orderByDesc('created_at')
            ->limit(20)
            ->get();

        return response()->json(['success' => true, 'data' => $logs]);
    }
}
