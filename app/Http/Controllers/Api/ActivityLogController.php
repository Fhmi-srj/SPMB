<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;

class ActivityLogController extends Controller
{
    public function index(): JsonResponse
    {
        $data = ActivityLog::with('user')->latest()->paginate(25);

        return response()->json([
            'success' => true,
            'data' => $data->items(),
            'meta' => [
                'total' => $data->total(),
                'current_page' => $data->currentPage(),
                'last_page' => $data->lastPage(),
                'per_page' => $data->perPage(),
            ],
        ]);
    }
}
