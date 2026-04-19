<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Biaya;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class BiayaController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'pendaftaran'  => Biaya::where('kategori', 'PENDAFTARAN')->orderBy('urutan')->get(),
                'daftar_ulang' => Biaya::where('kategori', 'DAFTAR_ULANG')->orderBy('urutan')->get(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'kategori'  => 'required|in:PENDAFTARAN,DAFTAR_ULANG',
            'nama_item' => 'required|string|max:100',
            'biaya'     => 'nullable|numeric',
        ]);

        $biaya = Biaya::create([
            'kategori'  => $request->kategori,
            'nama_item' => $request->nama_item,
            'biaya'     => $request->biaya ?? 0,
            'urutan'    => Biaya::where('kategori', $request->kategori)->max('urutan') + 1,
        ]);

        return response()->json(['success' => true, 'data' => $biaya], 201);
    }

    public function update(Request $request, $id): JsonResponse
    {
        $biaya = Biaya::findOrFail($id);
        $biaya->update([
            'kategori'  => $request->kategori,
            'nama_item' => $request->nama_item,
            'biaya'     => $request->biaya ?? 0,
            'urutan'    => $request->urutan,
        ]);
        return response()->json(['success' => true, 'data' => $biaya]);
    }

    public function destroy($id): JsonResponse
    {
        Biaya::findOrFail($id)->delete();
        return response()->json(['success' => true, 'message' => 'Biaya dihapus.']);
    }
}
