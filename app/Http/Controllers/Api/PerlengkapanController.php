<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PerlengkapanItem;
use App\Models\PerlengkapanPesanan;
use App\Models\Pendaftaran;
use App\Models\ActivityLog;
use Illuminate\Http\Request;

class PerlengkapanController extends Controller
{
    // ─── ITEMS CRUD ──────────────────────────────────────────────

    public function indexItems()
    {
        return response()->json([
            'success' => true,
            'data' => PerlengkapanItem::orderBy('urutan')->get()
        ]);
    }

    public function storeItem(Request $request)
    {
        $request->validate([
            'nama_item' => 'required|string|max:100',
            'nominal'   => 'required|integer|min:0',
            'urutan'    => 'nullable|integer',
        ]);

        $item = PerlengkapanItem::create($request->only(['nama_item', 'nominal', 'urutan']));
        return response()->json([
            'success' => true,
            'message' => 'Item berhasil ditambahkan',
            'data' => $item
        ], 201);
    }

    public function updateItem(Request $request, $id)
    {
        $request->validate([
            'nama_item' => 'required|string|max:100',
            'nominal'   => 'required|integer|min:0',
            'urutan'    => 'nullable|integer',
            'aktif'     => 'nullable|boolean',
        ]);

        $item = PerlengkapanItem::findOrFail($id);
        $item->update($request->only(['nama_item', 'nominal', 'urutan', 'aktif']));
        return response()->json([
            'success' => true,
            'message' => 'Item berhasil diupdate',
            'data' => $item
        ]);
    }

    public function destroyItem($id)
    {
        PerlengkapanItem::findOrFail($id)->delete();
        return response()->json([
            'success' => true,
            'message' => 'Item berhasil dihapus'
        ]);
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

    public function exportPdf(Request $request)
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
        $pesananAll = PerlengkapanPesanan::where('status', 1)->get()->groupBy('pendaftaran_id');

        $customData = json_decode($request->input('custom_data', '{}'), true);
        $mode = $request->input('mode', 'blank'); // blank or filled
        $defaultTanggal = $request->input('tanggal_pengambilan', '');
        $defaultKeterangan = $request->input('keterangan', '');

        $result = [];
        foreach ($pendaftaranList as $p) {
            $pesanan = $pesananAll->get($p->id, collect());
            if ($pesanan->isEmpty()) {
                continue; // Skip if they didn't order any item
            }

            $perlengkapan = [];
            $hasAnyActiveOrder = false;
            foreach ($items as $item) {
                $rec = $pesanan->firstWhere('perlengkapan_item_id', $item->id);
                $isOrdered = $rec && $rec->status;
                $perlengkapan[$item->id] = $isOrdered;
                if ($isOrdered) {
                    $hasAnyActiveOrder = true;
                }
            }

            if (!$hasAnyActiveOrder) {
                continue; // Skip if they don't have any active order
            }

            $studentId = $p->id;
            $tanggal = '';
            $keterangan = '';

            if ($mode === 'filled') {
                $tanggal = $customData[$studentId]['tanggal_pengambilan'] ?? $defaultTanggal;
                $keterangan = $customData[$studentId]['keterangan'] ?? $defaultKeterangan;
            }

            $result[] = [
                'id'            => $p->id,
                'nama'          => $p->nama,
                'lembaga'       => $p->lembaga,
                'no_registrasi' => $p->no_registrasi,
                'perlengkapan'  => $perlengkapan,
                'tanggal'       => $tanggal,
                'keterangan'    => $keterangan,
            ];
        }

        $indonesianMonths = [
            1 => 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
            'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
        ];
        $formattedDate = date('d') . ' ' . $indonesianMonths[(int)date('m')] . ' ' . date('Y');

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.perlengkapan_penerimaan', [
            'data' => $result,
            'items' => $items,
            'title' => 'Bukti Pengambilan Perlengkapan Santri',
            'date' => date('d/m/Y H:i'),
            'formattedDate' => $formattedDate,
            'mode' => $mode,
            'lembaga' => $request->lembaga ?: 'Semua Lembaga',
        ]);

        $pdf->setPaper('a4', 'landscape');

        if (auth()->check()) {
            ActivityLog::create([
                'admin_id' => auth()->id(),
                'action' => 'EXPORT',
                'description' => 'Export bukti pengambilan perlengkapan ke PDF (' . count($result) . ' records)',
                'ip_address' => request()->ip(),
            ]);
        }

        return $pdf->download('bukti-pengambilan-perlengkapan-' . date('Ymd-His') . '.pdf');
    }
}
