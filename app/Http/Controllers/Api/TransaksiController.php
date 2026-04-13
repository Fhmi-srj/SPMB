<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TransaksiPemasukan;
use App\Models\TransaksiPengeluaran;
use App\Models\ActivityLog;
use App\Models\Pendaftaran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TransaksiController extends Controller
{
    // ─── Helper: Log Aktivitas Transaksi ─────────────────────────
    private function logTransaksi($aksi, $modul, $detail)
    {
        ActivityLog::create([
            'admin_id'    => auth()->id(),
            'action'      => $aksi,
            'description' => "[$modul] $detail",
            'ip_address'  => request()->ip(),
        ]);
    }

    // ─── PEMASUKAN ──────────────────────────────────────────────

    public function indexPemasukan(Request $request)
    {
        $query = TransaksiPemasukan::query()
            ->join('pendaftaran', 'transaksi_pemasukan.pendaftaran_id', '=', 'pendaftaran.id')
            ->leftJoin('users as u_input', 'transaksi_pemasukan.input_by', '=', 'u_input.id')
            ->select('transaksi_pemasukan.*', 'pendaftaran.nama', 'pendaftaran.lembaga', 'pendaftaran.no_registrasi', 'u_input.nama as input_nama');

        // Filter periode
        if ($request->periode && $request->periode !== 'semua') {
            switch ($request->periode) {
                case 'hari_ini':
                    $query->whereDate('transaksi_pemasukan.tanggal', today());
                    break;
                case 'minggu_ini':
                    $query->whereBetween('transaksi_pemasukan.tanggal', [now()->startOfWeek(), now()->endOfWeek()]);
                    break;
                case 'bulan_ini':
                    $query->whereMonth('transaksi_pemasukan.tanggal', now()->month)
                          ->whereYear('transaksi_pemasukan.tanggal', now()->year);
                    break;
            }
        }

        // Filter nama
        if ($request->nama) {
            $query->where('pendaftaran.nama', 'like', '%' . $request->nama . '%');
        }

        // Filter jenis
        if ($request->jenis) {
            $query->where('transaksi_pemasukan.jenis_pembayaran', $request->jenis);
        }

        $data = $query->orderByDesc('transaksi_pemasukan.tanggal')
                      ->orderByDesc('transaksi_pemasukan.created_at')
                      ->get();

        // Summary (Fix #19: both totals use filtered query)
        $totalApproved = (clone $query)->where('transaksi_pemasukan.status', 'approved')->sum('transaksi_pemasukan.nominal');
        $totalPending  = (clone $query)->where('transaksi_pemasukan.status', 'pending')->sum('transaksi_pemasukan.nominal');

        return response()->json([
            'data'    => $data,
            'summary' => [
                'total_approved' => $totalApproved,
                'total_pending'  => $totalPending,
            ],
        ]);
    }

    public function storePemasukan(Request $request)
    {
        $request->validate([
            'pendaftaran_id'  => 'required|exists:pendaftaran,id',
            'tanggal'         => 'required|date',
            'nominal'         => 'required|integer|min:1',
            'jenis_pembayaran'=> 'required|string',
            'keterangan'      => 'nullable|string',
        ]);

        $user = auth()->user();
        $isAdmin = in_array($user->role, ['super_admin', 'admin']);

        // Auto-generate invoice with DB lock to prevent race condition (Fix #21)
        $data = \DB::transaction(function () use ($request, $user, $isAdmin) {
            $today = now()->format('Ymd');
            $count = TransaksiPemasukan::whereDate('created_at', today())->lockForUpdate()->count() + 1;
            $invoice = 'INV-' . $today . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);

            $pendaftar = Pendaftaran::find($request->pendaftaran_id);

            $txn = TransaksiPemasukan::create([
                'invoice'           => $invoice,
                'pendaftaran_id'    => $request->pendaftaran_id,
                'tanggal'           => $request->tanggal,
                'nominal'           => $request->nominal,
                'jenis_pembayaran'  => $request->jenis_pembayaran,
                'keterangan'        => $request->keterangan,
                'status'            => $isAdmin ? 'approved' : 'pending',
                'input_by'          => $user->id,
                'input_at'          => now(),
                'approved_by'       => $isAdmin ? $user->id : null,
                'approved_at'       => $isAdmin ? now() : null,
            ]);

            $statusLabel = $isAdmin ? '' : ' (Menunggu ACC)';
            $this->logTransaksi('CREATE', 'PEMASUKAN', "Tambah pemasukan {$pendaftar->nama} - Rp" . number_format($request->nominal, 0, ',', '.') . $statusLabel);

            return ['data' => $txn, 'statusLabel' => $statusLabel];
        });

        return response()->json(['message' => 'Pemasukan berhasil ditambahkan!' . $data['statusLabel'], 'data' => $data['data']], 201);
    }

    public function updatePemasukan(Request $request, $id)
    {
        $request->validate([
            'pendaftaran_id'  => 'required|exists:pendaftaran,id',
            'tanggal'         => 'required|date',
            'nominal'         => 'required|integer|min:1',
            'jenis_pembayaran'=> 'required|string',
            'keterangan'      => 'nullable|string',
        ]);

        $data = TransaksiPemasukan::findOrFail($id);
        $pendaftar = Pendaftaran::find($request->pendaftaran_id);

        $data->update($request->only(['pendaftaran_id', 'tanggal', 'nominal', 'jenis_pembayaran', 'keterangan']));

        $this->logTransaksi('UPDATE', 'PEMASUKAN', "Edit pemasukan {$pendaftar->nama} - Rp" . number_format($request->nominal, 0, ',', '.'));

        return response()->json(['message' => 'Pemasukan berhasil diupdate', 'data' => $data]);
    }

    public function destroyPemasukan($id)
    {
        $data = TransaksiPemasukan::findOrFail($id);
        $pendaftar = Pendaftaran::find($data->pendaftaran_id);

        $this->logTransaksi('DELETE', 'PEMASUKAN', "Hapus pemasukan {$pendaftar->nama} - Rp" . number_format($data->nominal, 0, ',', '.'));

        $data->delete();

        return response()->json(['message' => 'Pemasukan berhasil dihapus']);
    }

    public function approvePemasukan(Request $request, $id)
    {
        $data = TransaksiPemasukan::findOrFail($id);
        $user = auth()->user();
        $data->update([
            'status'      => 'approved',
            'approved_by' => $user->id,
            'approved_at' => now(),
        ]);
        $this->logTransaksi('APPROVE', 'PEMASUKAN', "Approve pemasukan {$data->invoice}");
        return response()->json(['message' => 'Pemasukan disetujui']);
    }

    public function rejectPemasukan(Request $request, $id)
    {
        $data = TransaksiPemasukan::findOrFail($id);
        $user = auth()->user();
        $data->update([
            'status'            => 'rejected',
            'approved_by'       => $user->id,
            'approved_at'       => now(),
            'catatan_approval'  => $request->catatan ?? '',
        ]);
        $this->logTransaksi('REJECT', 'PEMASUKAN', "Tolak pemasukan {$data->invoice}" . ($request->catatan ? ": {$request->catatan}" : ''));
        return response()->json(['message' => 'Pemasukan ditolak']);
    }

    // ─── PENGELUARAN ─────────────────────────────────────────────

    public function indexPengeluaran(Request $request)
    {
        $query = TransaksiPengeluaran::query()
            ->leftJoin('users as u_input', 'transaksi_pengeluaran.input_by', '=', 'u_input.id')
            ->select('transaksi_pengeluaran.*', 'u_input.nama as input_nama');

        if ($request->periode && $request->periode !== 'semua') {
            switch ($request->periode) {
                case 'hari_ini':
                    $query->whereDate('transaksi_pengeluaran.tanggal', today());
                    break;
                case 'minggu_ini':
                    $query->whereBetween('transaksi_pengeluaran.tanggal', [now()->startOfWeek(), now()->endOfWeek()]);
                    break;
                case 'bulan_ini':
                    $query->whereMonth('transaksi_pengeluaran.tanggal', now()->month)->whereYear('transaksi_pengeluaran.tanggal', now()->year);
                    break;
            }
        }

        if ($request->kategori) {
            $query->where('transaksi_pengeluaran.kategori', $request->kategori);
        }

        $data = $query->orderByDesc('transaksi_pengeluaran.tanggal')->orderByDesc('transaksi_pengeluaran.created_at')->get();

        $totalApproved = (clone $query)->where('transaksi_pengeluaran.status', 'approved')->sum('transaksi_pengeluaran.nominal');
        $totalPending  = (clone $query)->where('transaksi_pengeluaran.status', 'pending')->sum('transaksi_pengeluaran.nominal');

        return response()->json([
            'data'    => $data,
            'summary' => [
                'total_approved' => $totalApproved,
                'total_pending'  => $totalPending,
            ],
        ]);
    }

    public function storePengeluaran(Request $request)
    {
        $request->validate([
            'tanggal'    => 'required|date',
            'nominal'    => 'required|integer|min:1',
            'kategori'   => 'required|string',
            'keterangan' => 'nullable|string',
        ]);

        $user = auth()->user();
        $isAdmin = in_array($user->role, ['super_admin', 'admin']);

        // Auto-generate invoice with DB lock to prevent race condition (Fix #21)
        $data = \DB::transaction(function () use ($request, $user, $isAdmin) {
            $today = now()->format('Ymd');
            $count = TransaksiPengeluaran::whereDate('created_at', today())->lockForUpdate()->count() + 1;
            $invoice = 'OUT-' . $today . '-' . str_pad($count, 4, '0', STR_PAD_LEFT);

            $txn = TransaksiPengeluaran::create([
                'invoice'    => $invoice,
                'tanggal'    => $request->tanggal,
                'nominal'    => $request->nominal,
                'kategori'   => $request->kategori,
                'keterangan' => $request->keterangan,
                'status'     => $isAdmin ? 'approved' : 'pending',
                'input_by'   => $user->id,
                'input_at'   => now(),
                'approved_by'=> $isAdmin ? $user->id : null,
                'approved_at'=> $isAdmin ? now() : null,
            ]);

            $statusLabel = $isAdmin ? '' : ' (Menunggu ACC)';
            $this->logTransaksi('CREATE', 'PENGELUARAN', "Tambah pengeluaran {$invoice} - Rp" . number_format($request->nominal, 0, ',', '.') . " ({$request->kategori})" . $statusLabel);

            return ['data' => $txn, 'statusLabel' => $statusLabel];
        });

        return response()->json(['message' => 'Pengeluaran berhasil ditambahkan!' . $data['statusLabel'], 'data' => $data['data']], 201);
    }

    public function updatePengeluaran(Request $request, $id)
    {
        $request->validate([
            'tanggal'    => 'required|date',
            'nominal'    => 'required|integer|min:1',
            'kategori'   => 'required|string',
            'keterangan' => 'nullable|string',
        ]);

        $data = TransaksiPengeluaran::findOrFail($id);
        $data->update($request->only(['tanggal', 'nominal', 'kategori', 'keterangan']));

        $this->logTransaksi('UPDATE', 'PENGELUARAN', "Edit pengeluaran {$data->invoice} - Rp" . number_format($request->nominal, 0, ',', '.') . " ({$request->kategori})");

        return response()->json(['message' => 'Pengeluaran berhasil diupdate', 'data' => $data]);
    }

    public function destroyPengeluaran($id)
    {
        $data = TransaksiPengeluaran::findOrFail($id);
        $this->logTransaksi('DELETE', 'PENGELUARAN', "Hapus pengeluaran {$data->invoice} - Rp" . number_format($data->nominal, 0, ',', '.') . " ({$data->kategori})");
        $data->delete();
        return response()->json(['message' => 'Pengeluaran berhasil dihapus']);
    }

    public function approvePengeluaran(Request $request, $id)
    {
        $data = TransaksiPengeluaran::findOrFail($id);
        $user = auth()->user();
        $data->update([
            'status'      => 'approved',
            'approved_by' => $user->id,
            'approved_at' => now(),
        ]);
        $this->logTransaksi('APPROVE', 'PENGELUARAN', "Approve pengeluaran {$data->invoice}");
        return response()->json(['message' => 'Pengeluaran disetujui']);
    }

    public function rejectPengeluaran(Request $request, $id)
    {
        $data = TransaksiPengeluaran::findOrFail($id);
        $user = auth()->user();
        $data->update([
            'status'            => 'rejected',
            'approved_by'       => $user->id,
            'approved_at'       => now(),
            'catatan_approval'  => $request->catatan ?? '',
        ]);
        $this->logTransaksi('REJECT', 'PENGELUARAN', "Tolak pengeluaran {$data->invoice}" . ($request->catatan ? ": {$request->catatan}" : ''));
        return response()->json(['message' => 'Pengeluaran ditolak']);
    }

    // ─── SEARCH PESERTA (for pemasukan form) ─────────────────────
    public function searchPeserta(Request $request)
    {
        $q = $request->q;
        if (!$q || strlen($q) < 1) return response()->json(['success' => true, 'data' => []]);

        $data = Pendaftaran::where('nama', 'like', "%{$q}%")
            ->orWhere('no_registrasi', 'like', "%{$q}%")
            ->select('id', 'no_registrasi', 'nama', 'lembaga')
            ->orderBy('nama')
            ->limit(10)
            ->get()
            ->map(fn($r) => [
                'id'            => $r->id,
                'no_registrasi' => $r->no_registrasi,
                'nama'          => $r->nama,
                'lembaga'       => $r->lembaga,
                'label'         => ($r->no_registrasi ?? '-') . ' - ' . $r->nama . ' (' . $r->lembaga . ')',
            ]);

        return response()->json(['success' => true, 'data' => $data]);
    }

    // ─── INFO TAGIHAN PESERTA (For Admin Transaksi) ──────────────
    public function getTagihanPeserta($id)
    {
        $peserta = Pendaftaran::findOrFail($id);
        
        $lembagaCol = ($peserta->lembaga === 'SMP NU BP') ? 'biaya_smp' : 'biaya_ma';
        $isPondok = $peserta->status_mukim === 'PONDOK PP MAMBAUL HUDA';

        $biayaSekolah = \App\Models\Biaya::sum($lembagaCol);
        $biayaPondok = $isPondok ? \App\Models\Biaya::sum('biaya_pondok') : 0;

        $perlengkapanTotal = \DB::table('perlengkapan_pesanan')
            ->join('perlengkapan_items', 'perlengkapan_pesanan.perlengkapan_item_id', '=', 'perlengkapan_items.id')
            ->where('perlengkapan_pesanan.pendaftaran_id', $id)
            ->where('perlengkapan_pesanan.status', 1)
            ->sum('perlengkapan_items.nominal');

        $totalPaid = \App\Models\TransaksiPemasukan::where('pendaftaran_id', $id)
            ->where('status', 'approved')
            ->sum('nominal');

        $totalTagihan = $biayaSekolah + $biayaPondok + $perlengkapanTotal;

        return response()->json([
            'success'            => true,
            'total_tagihan'      => $totalTagihan,
            'total_dibayar'      => $totalPaid,
            'sisa_kekurangan'    => $totalTagihan - $totalPaid,
            'biaya_pondok'       => $biayaPondok,
            'biaya_sekolah'      => $biayaSekolah,
            'biaya_perlengkapan' => $perlengkapanTotal,
            'lembaga'            => $peserta->lembaga,
            'status_mukim'       => $peserta->status_mukim,
            'is_pondok'          => $isPondok,
        ]);
    }

    // ─── LOG AKTIVITAS (Deprecated) ──────────────────────────────
    // Previously used LogAktivitas, now using standard ActivityLog unified table
    // Endpoint kept for backward compatibility if needed, but safe to remove
    public function logAktivitas(Request $request)
    {
        return response()->json(['data' => []]);
    }
}
