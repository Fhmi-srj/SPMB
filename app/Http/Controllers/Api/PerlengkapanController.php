<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PerlengkapanItem;
use App\Models\PerlengkapanPesanan;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;

class PerlengkapanController extends Controller
{
    // ─── ITEMS CRUD ──────────────────────────────────────────────

    public function indexItems()
    {
        return response()->json(PerlengkapanItem::orderBy('urutan')->get());
    }

    public function storeItem(Request $request)
    {
        $request->validate([
            'nama_item' => 'required|string|max:100',
            'nominal'   => 'nullable|integer|min:0',
            'urutan'    => 'nullable|integer',
        ]);

        $item = PerlengkapanItem::create([
            'nama_item' => $request->nama_item,
            'nominal'   => $request->nominal ?? 0,
            'urutan'    => $request->urutan,
        ]);
        return response()->json(['message' => 'Item berhasil ditambahkan', 'data' => $item], 201);
    }

    public function updateItem(Request $request, $id)
    {
        $request->validate([
            'nama_item' => 'required|string|max:100',
            'nominal'   => 'nullable|integer|min:0',
            'urutan'    => 'nullable|integer',
            'aktif'     => 'nullable|boolean',
        ]);

        $item = PerlengkapanItem::findOrFail($id);
        $item->update([
            'nama_item' => $request->nama_item,
            'nominal'   => $request->nominal ?? 0,
            'urutan'    => $request->urutan,
            'aktif'     => $request->aktif,
        ]);
        return response()->json(['message' => 'Item berhasil diupdate', 'data' => $item]);
    }

    public function destroyItem($id)
    {
        PerlengkapanItem::findOrFail($id)->delete();
        return response()->json(['message' => 'Item berhasil dihapus']);
    }

    // ─── PESANAN PER PENDAFTAR ───────────────────────────────────

    public function indexPesanan(Request $request)
    {
        $query = Pendaftaran::query()
            ->select('id', 'nama', 'lembaga', 'no_registrasi');

        if ($request->search) {
            $query->where('nama', 'like', '%' . $request->search . '%');
        }
        if ($request->lembaga) {
            $query->where('lembaga', $request->lembaga);
        }

        $pendaftaranList = $query->orderByDesc('created_at')->get();

        $items = PerlengkapanItem::where('aktif', true)->orderBy('urutan')->get();
        $pesananAll = PerlengkapanPesanan::all()->groupBy('pendaftaran_id');

        $result = $pendaftaranList->map(function ($p) use ($items, $pesananAll) {
            $pesanan = $pesananAll->get($p->id, collect());
            $perlengkapan = [];
            foreach ($items as $item) {
                $rec = $pesanan->firstWhere('perlengkapan_item_id', $item->id);
                $perlengkapan[$item->id] = $rec ? (bool)$rec->status : false;
            }

            return [
                'id'            => $p->id,
                'nama'          => $p->nama,
                'lembaga'       => $p->lembaga,
                'no_registrasi' => $p->no_registrasi,
                'perlengkapan'  => $perlengkapan,
            ];
        });

        return response()->json([
            'items'      => $items,
            'pendaftar'  => $result,
        ]);
    }

    public function togglePesanan(Request $request)
    {
        $request->validate([
            'pendaftaran_id'      => 'required|exists:pendaftaran,id',
            'perlengkapan_item_id'=> 'required|exists:perlengkapan_items,id',
            'status'              => 'required|boolean',
        ]);

        PerlengkapanPesanan::updateOrCreate(
            [
                'pendaftaran_id'       => $request->pendaftaran_id,
                'perlengkapan_item_id' => $request->perlengkapan_item_id,
            ],
            ['status' => $request->status]
        );

        return response()->json(['success' => true]);
    }
}
