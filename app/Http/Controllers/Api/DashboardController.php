<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

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

        // Pendaftar per bulan (12 bulan terakhir)
        $perBulan = Pendaftaran::selectRaw('MONTH(created_at) as bulan, YEAR(created_at) as tahun, COUNT(*) as total')
            ->whereRaw('created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)')
            ->groupByRaw('YEAR(created_at), MONTH(created_at)')
            ->orderByRaw('YEAR(created_at) ASC, MONTH(created_at) ASC')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'total' => $total,
                'per_lembaga' => $perLembaga,
                'per_status' => $perStatus,
                'per_mukim' => $perMukim,
                'per_jenis_kelamin' => $perJK,
                'per_bulan' => $perBulan,
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

class ActivityLogController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = ActivityLog::with('user:id,nama')->orderByDesc('created_at');

        if ($request->action) {
            $query->where('action', $request->action);
        }

        $data = $query->paginate(50);

        return response()->json([
            'success' => true,
            'data' => $data->items(),
            'meta' => [
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'total' => $data->total(),
            ],
        ]);
    }
}
