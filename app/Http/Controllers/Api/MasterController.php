<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Beasiswa;
use App\Models\Biaya;
use App\Models\Kontak;
use App\Models\Pengaturan;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BeasiswaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => Beasiswa::orderBy('urutan')->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'jenis' => 'required|string|max:100',
            'kategori' => 'required|string|max:100',
            'syarat' => 'required|string|max:200',
            'benefit' => 'required|string|max:100',
        ]);

        $beasiswa = Beasiswa::create([
            ...$request->only(['jenis', 'kategori', 'syarat', 'benefit']),
            'urutan' => Beasiswa::max('urutan') + 1,
        ]);

        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => 'ADD',
            'description' => 'Tambah beasiswa: ' . $beasiswa->jenis,
            'ip_address' => request()->ip(),
        ]);

        return response()->json(['success' => true, 'data' => $beasiswa], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $beasiswa = Beasiswa::findOrFail($id);
        $beasiswa->update($request->only(['jenis', 'kategori', 'syarat', 'benefit', 'urutan']));
        return response()->json(['success' => true, 'data' => $beasiswa]);
    }

    public function destroy($id): JsonResponse
    {
        Beasiswa::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Beasiswa dihapus.']);
    }
}

class BiayaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'pendaftaran' => Biaya::where('kategori', 'PENDAFTARAN')->orderBy('urutan')->get(),
                'daftar_ulang' => Biaya::where('kategori', 'DAFTAR_ULANG')->orderBy('urutan')->get(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'kategori' => 'required|in:PENDAFTARAN,DAFTAR_ULANG',
            'nama_item' => 'required|string|max:100',
        ]);

        $biaya = Biaya::create([
            ...$request->only(['kategori', 'nama_item', 'biaya_pondok', 'biaya_smp', 'biaya_ma']),
            'urutan' => Biaya::where('kategori', $request->kategori)->max('urutan') + 1,
        ]);

        return response()->json(['success' => true, 'data' => $biaya], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $biaya = Biaya::findOrFail($id);
        $biaya->update($request->only(['nama_item', 'biaya_pondok', 'biaya_smp', 'biaya_ma', 'urutan']));
        return response()->json(['success' => true, 'data' => $biaya]);
    }

    public function destroy($id): JsonResponse
    {
        Biaya::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Biaya dihapus.']);
    }
}

class KontakController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => Kontak::all()]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'lembaga' => 'required|string|max:50',
            'nama' => 'required|string|max:100',
            'no_whatsapp' => 'required|string|max:20',
        ]);

        $kontak = Kontak::create($request->only(['lembaga', 'nama', 'no_whatsapp', 'link_wa']));
        return response()->json(['success' => true, 'data' => $kontak], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $kontak = Kontak::findOrFail($id);
        $kontak->update($request->only(['lembaga', 'nama', 'no_whatsapp', 'link_wa']));
        return response()->json(['success' => true, 'data' => $kontak]);
    }

    public function destroy($id): JsonResponse
    {
        Kontak::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Kontak dihapus.']);
    }
}

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
            'user_id' => auth()->id(),
            'action' => 'UPDATE',
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
            'user_id' => auth()->id(),
            'action' => 'UPDATE',
            'description' => 'Update pengaturan bulk',
            'ip_address' => $request->ip(),
        ]);

        return response()->json(['success' => true, 'message' => 'Pengaturan berhasil disimpan.']);
    }
}
