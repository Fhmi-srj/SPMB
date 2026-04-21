<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pengaturan;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class PengaturanController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = Pengaturan::all()->keyBy('kunci')->map(fn($s) => $s->nilai);
        return response()->json(['success' => true, 'data' => $settings]);
    }

    public function publicSettings(): JsonResponse
    {
        $publicKeys = [
            'status_pendaftaran', 'tahun_ajaran', 'link_pdf_biaya',
            'link_pdf_brosur', 'link_pdf_syarat', 'link_beasiswa',
            'gelombang_1_start', 'gelombang_1_end',
            'gelombang_2_start', 'gelombang_2_end', 'link_grup_wa',
            'link_facebook', 'link_instagram', 'link_tiktok', 'link_youtube',
        ];

        $settings = Pengaturan::whereIn('kunci', $publicKeys)
            ->get()->keyBy('kunci')->map(fn($s) => $s->nilai);

        return response()->json(['success' => true, 'data' => $settings]);
    }

    public function update(Request $request, $key): JsonResponse
    {
        $setting = Pengaturan::firstOrNew(['kunci' => $key]);
        $setting->nilai = $request->nilai;
        $setting->save();

        ActivityLog::create([
            'admin_id'    => auth()->id(),
            'action'     => 'UPDATE',
            'description' => "Update pengaturan: {$key}",
            'ip_address' => $request->ip(),
        ]);

        return response()->json(['success' => true, 'data' => $setting]);
    }

    public function updateBulk(Request $request): JsonResponse
    {
        $settings = $request->settings; // array ['kunci' => 'nilai']
        foreach ($settings as $key => $value) {
            Pengaturan::updateOrCreate(
                ['kunci' => $key],
                ['nilai' => $value]
            );
        }

        ActivityLog::create([
            'admin_id'    => auth()->id(),
            'action'     => 'UPDATE',
            'description' => 'Update pengaturan bulk',
            'ip_address' => $request->ip(),
        ]);

        return response()->json(['success' => true, 'message' => 'Pengaturan berhasil disimpan.']);
    }
}
