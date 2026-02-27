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
        // Get biaya items for column headers
        $biayaItems = Biaya::where('kategori', 'DAFTAR_ULANG')
            ->where('biaya_pondok', '>', 0)
            ->whereNotIn('nama_item', ['Infaq Bulan Pertama', 'Registrasi'])
            ->orderBy('urutan')
            ->pluck('nama_item')
            ->toArray();

        // Registrasi fee
        $registrasiFee = Biaya::where('nama_item', 'Registrasi')
            ->where('kategori', 'DAFTAR_ULANG')
            ->first();

        // Get all registrants
        $registrants = Pendaftaran::select('id', 'nama', 'lembaga', 'status_mukim', 'created_at')->orderByDesc('created_at')->get();

        $result = [];

        foreach ($registrants as $reg) {
            // Total pembayaran approved
            $totalPembayaran = TransaksiPemasukan::where('pendaftaran_id', $reg->id)
                ->where('status', 'approved')
                ->sum('nominal');

            // Biaya sekolah
            $lembagaCol = ($reg->lembaga === 'SMP NU BP') ? 'biaya_smp' : 'biaya_ma';
            $totalBiayaSekolah = Biaya::sum($lembagaCol);

            // Biaya pondok
            $isPondok = $reg->status_mukim === 'PONDOK PP MAMBAUL HUDA';
            $totalBiayaPondok = $isPondok ? Biaya::sum('biaya_pondok') : 0;

            // Perlengkapan
            $totalPerlengkapan = DB::table('perlengkapan_pesanan')
                ->join('perlengkapan_items', 'perlengkapan_pesanan.perlengkapan_item_id', '=', 'perlengkapan_items.id')
                ->where('perlengkapan_pesanan.pendaftaran_id', $reg->id)
                ->where('perlengkapan_pesanan.status', 1)
                ->sum('perlengkapan_items.nominal');

            // Distribusi pos
            $sisa = $totalPembayaran;
            $pos = [
                'pos_ma'           => 0,
                'pos_smp'          => 0,
                'pos_pondok'       => 0,
                'pos_perlengkapan' => 0,
                'pos_sisa'         => 0,
            ];

            if (in_array($reg->lembaga, ['MA', 'MA ALHIKAM'])) {
                $biayaMA = $totalBiayaSekolah;
                if ($registrasiFee) $biayaMA += $registrasiFee->biaya_ma;
                $pos['pos_ma'] = min($sisa, $biayaMA);
                $sisa -= $pos['pos_ma'];
            } elseif (in_array($reg->lembaga, ['SMP', 'SMP NU BP'])) {
                $biayaSMP = $totalBiayaSekolah;
                if ($registrasiFee) $biayaSMP += $registrasiFee->biaya_smp;
                $pos['pos_smp'] = min($sisa, $biayaSMP);
                $sisa -= $pos['pos_smp'];
            }

            if ($sisa > 0 && $isPondok) {
                $pos['pos_pondok'] = min($sisa, $totalBiayaPondok);
                $sisa -= $pos['pos_pondok'];
            }

            if ($sisa > 0 && $totalPerlengkapan > 0) {
                $pos['pos_perlengkapan'] = min($sisa, $totalPerlengkapan);
                $sisa -= $pos['pos_perlengkapan'];
            }

            $pos['pos_sisa'] = $sisa;

            $result[] = array_merge([
                'id'               => $reg->id,
                'nama'             => $reg->nama,
                'lembaga'          => $reg->lembaga,
                'status_mukim'     => $reg->status_mukim,
                'total_pembayaran' => $totalPembayaran,
                'total_tagihan'    => $totalBiayaSekolah + $totalBiayaPondok + $totalPerlengkapan,
            ], $pos);
        }

        // Summary totals
        $totalMA           = array_sum(array_column($result, 'pos_ma'));
        $totalSMP          = array_sum(array_column($result, 'pos_smp'));
        $totalPondok       = array_sum(array_column($result, 'pos_pondok'));
        $totalPerlengkapan = array_sum(array_column($result, 'pos_perlengkapan'));

        return response()->json([
            'data'    => $result,
            'summary' => [
                'total_ma'           => $totalMA,
                'total_smp'          => $totalSMP,
                'total_pondok'       => $totalPondok,
                'total_perlengkapan' => $totalPerlengkapan,
            ],
        ]);
    }
}
