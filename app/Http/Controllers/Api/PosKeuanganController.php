<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pendaftaran;
use App\Models\Biaya;
use App\Models\TransaksiPemasukan;
use App\Models\PerlengkapanPesanan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PosKeuanganController extends Controller
{
    public function index()
    {
        // Get all registrants
        $registrants = Pendaftaran::select('id', 'nama', 'created_at')->orderByDesc('created_at')->get();

        // Total biaya (single column now)
        $totalBiaya = Biaya::sum('biaya');

        $result = [];

        foreach ($registrants as $reg) {
            // Total pembayaran approved
            $totalPembayaran = TransaksiPemasukan::where('pendaftaran_id', $reg->id)
                ->where('status', 'approved')
                ->sum('nominal');

            // Perlengkapan
            $totalPerlengkapan = DB::table('perlengkapan_pesanan')
                ->join('perlengkapan_items', 'perlengkapan_pesanan.perlengkapan_item_id', '=', 'perlengkapan_items.id')
                ->where('perlengkapan_pesanan.pendaftaran_id', $reg->id)
                ->where('perlengkapan_pesanan.status', 1)
                ->sum('perlengkapan_items.nominal');

            // Distribusi pos
            $sisa = $totalPembayaran;
            $pos = [
                'pos_pondok'       => 0,
                'pos_perlengkapan' => 0,
                'pos_sisa'         => 0,
            ];

            // Pondok biaya
            $pos['pos_pondok'] = min($sisa, $totalBiaya);
            $sisa -= $pos['pos_pondok'];

            if ($sisa > 0 && $totalPerlengkapan > 0) {
                $pos['pos_perlengkapan'] = min($sisa, $totalPerlengkapan);
                $sisa -= $pos['pos_perlengkapan'];
            }

            $pos['pos_sisa'] = $sisa;

            $result[] = array_merge([
                'id'               => $reg->id,
                'nama'             => $reg->nama,
                'total_pembayaran' => $totalPembayaran,
                'total_tagihan'    => $totalBiaya + $totalPerlengkapan,
            ], $pos);
        }

        // Summary totals
        $totalPondok       = array_sum(array_column($result, 'pos_pondok'));
        $totalPerlengkapan = array_sum(array_column($result, 'pos_perlengkapan'));

        return response()->json([
            'data'    => $result,
            'summary' => [
                'total_pondok'       => $totalPondok,
                'total_perlengkapan' => $totalPerlengkapan,
            ],
        ]);
    }
}
