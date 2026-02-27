<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Kontak;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class KontakController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['success' => true, 'data' => Kontak::all()]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'lembaga'     => 'required|string|max:50',
            'nama'        => 'required|string|max:100',
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
