<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\ActivityLog;
use App\Models\TransaksiPemasukan;
use App\Models\TransaksiPengeluaran;
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
            $pemasukan = TransaksiPemasukan::where('status', 'approved')
                ->selectRaw('jenis_pembayaran as kategori, SUM(nominal) as total')
                ->groupBy('jenis_pembayaran')
                ->pluck('total', 'kategori');

            $pengeluaran = TransaksiPengeluaran::where('status', 'approved')
                ->selectRaw('kategori, SUM(nominal) as total')
                ->groupBy('kategori')
                ->pluck('total', 'kategori');

            $allKategori = $pemasukan->keys()->merge($pengeluaran->keys())->unique();
            foreach ($allKategori as $kat) {
                $posKeuangan[$kat] = [
                    'pemasukan'   => $pemasukan[$kat] ?? 0,
                    'pengeluaran' => $pengeluaran[$kat] ?? 0,
                ];
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
