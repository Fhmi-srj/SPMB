<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Beasiswa;
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
            'jenis'    => 'required|string|max:100',
            'kategori' => 'required|string|max:100',
            'syarat'   => 'required|string|max:200',
            'benefit'  => 'required|string|max:100',
        ]);

        $beasiswa = Beasiswa::create([
            ...$request->only(['jenis', 'kategori', 'syarat', 'benefit']),
            'urutan' => Beasiswa::max('urutan') + 1,
        ]);

        ActivityLog::create([
            'admin_id'    => auth()->id(),
            'action'     => 'ADD',
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
