<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #333;
            line-height: 1.4;
            margin: 0;
            padding: 0;
        }
        .header {
            margin-bottom: 20px;
            border-bottom: 2px solid #E67E22;
            padding-bottom: 10px;
        }
        .header h2 {
            margin: 0;
            color: #E67E22;
            font-size: 18px;
        }
        .header p {
            margin: 4px 0 0 0;
            color: #666;
            font-size: 11px;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .badge {
            display: inline-block;
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 9px;
            font-weight: bold;
        }
        .badge-success {
            background-color: #d4edda;
            color: #155724;
        }
        .badge-warning {
            background-color: #fff3cd;
            color: #856404;
        }
        .badge-danger {
            background-color: #f8d7da;
            color: #721c24;
        }
        .stats-table {
            width: 100%;
            margin-bottom: 20px;
            border-spacing: 8px;
            border-collapse: separate;
        }
        .stats-card {
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 8px;
            text-align: center;
        }
        .stats-label {
            font-size: 8px;
            color: #718096;
            text-transform: uppercase;
            font-weight: bold;
            margin-bottom: 2px;
        }
        .stats-value {
            font-size: 12px;
            font-weight: bold;
            color: #2d3748;
        }
        .section-title {
            font-size: 13px;
            font-weight: bold;
            color: #2c3e50;
            margin-top: 15px;
            margin-bottom: 8px;
            border-left: 3px solid #E67E22;
            padding-left: 6px;
        }
        .content-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .content-table th {
            background-color: #f8f9fa;
            color: #495057;
            font-weight: bold;
            text-align: left;
            padding: 6px 8px;
            border: 1px solid #dee2e6;
            font-size: 10px;
        }
        .content-table td {
            padding: 6px 8px;
            border: 1px solid #dee2e6;
            vertical-align: middle;
            font-size: 10px;
        }
        .content-table tr:nth-child(even) td {
            background-color: #f8f9fa;
        }
        .footer {
            position: fixed;
            bottom: 0;
            width: 100%;
            text-align: center;
            font-size: 9px;
            color: #777;
            border-top: 1px solid #dee2e6;
            padding-top: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <table style="width: 100%;">
            <tr>
                <td>
                    <h2>{{ $title }}</h2>
                    <p>Pondok Pesantren Mambaul Huda - Penerimaan Siswa Baru (SPMB)</p>
                </td>
                <td style="text-align: right; vertical-align: bottom;">
                    <p style="font-size: 10px; margin-bottom: 2px;"><strong>Periode:</strong> {{ ucfirst(str_replace('_', ' ', $periode)) }}</p>
                    <p style="font-size: 9px; color: #888;">Tanggal Cetak: {{ $date }}</p>
                </td>
            </tr>
        </table>
    </div>

    <!-- Detail Box / Summary Cards -->
    <table class="stats-table" style="margin-left: -8px; margin-right: -8px;">
        <tr>
            <td width="20%">
                <div class="stats-card" style="border-left: 3px solid #2ecc71;">
                    <div class="stats-label">Total Pemasukan</div>
                    <div class="stats-value" style="color: #27ae60;">Rp {{ number_format($summary['total_masuk'], 0, ',', '.') }}</div>
                </div>
            </td>
            <td width="20%">
                <div class="stats-card" style="border-left: 3px solid #3498db;">
                    <div class="stats-label">Total Uang Cash</div>
                    <div class="stats-value" style="color: #2980b9;">Rp {{ number_format($summary['total_cash'], 0, ',', '.') }}</div>
                </div>
            </td>
            <td width="20%">
                <div class="stats-card" style="border-left: 3px solid #9b59b6;">
                    <div class="stats-label">Total Uang TF</div>
                    <div class="stats-value" style="color: #8e44ad;">Rp {{ number_format($summary['total_transfer'], 0, ',', '.') }}</div>
                </div>
            </td>
            <td width="20%">
                <div class="stats-card" style="border-left: 3px solid #e74c3c;">
                    <div class="stats-label">Total Pengeluaran</div>
                    <div class="stats-value" style="color: #c0392b;">Rp {{ number_format($summary['total_keluar'], 0, ',', '.') }}</div>
                </div>
            </td>
            <td width="20%">
                <div class="stats-card" style="border-left: 3px solid #f1c40f;">
                    <div class="stats-label">Saldo</div>
                    <div class="stats-value" style="color: #d35400;">Rp {{ number_format($summary['saldo'], 0, ',', '.') }}</div>
                    <div style="font-size: 7px; color: #718096; font-weight: bold; text-transform: uppercase; margin-top: 3px; border-top: 1px dashed #e2e8f0; padding-top: 2px;">
                        Cash: Rp {{ number_format($summary['saldo'] - ($summary['total_transfer'] ?? 0), 0, ',', '.') }}
                    </div>
                </div>
            </td>
        </tr>
    </table>

    <!-- Pemasukan Section -->
    <div class="section-title">Rincian Uang Masuk (Pemasukan)</div>
    <table class="content-table">
        <thead>
            <tr>
                <th width="4%" class="text-center">No</th>
                <th width="15%">Invoice</th>
                <th width="12%">Tanggal</th>
                <th width="20%">Nama Peserta</th>
                <th width="12%">Lembaga</th>
                <th width="10%">Jenis</th>
                <th width="12%" class="text-center">Status</th>
                <th width="15%" class="text-right">Nominal</th>
            </tr>
        </thead>
        <tbody>
            @forelse($pemasukan as $index => $row)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td><strong>{{ $row->invoice }}</strong></td>
                    <td>{{ $row->tanggal ? \Carbon\Carbon::parse($row->tanggal)->format('d/m/Y') : '-' }}</td>
                    <td>{{ $row->nama }}</td>
                    <td>{{ $row->lembaga }}</td>
                    <td>{{ $row->jenis_pembayaran }}</td>
                    <td class="text-center">
                        @if($row->status === 'approved')
                            <span class="badge badge-success">ACC</span>
                        @elseif($row->status === 'pending')
                            <span class="badge badge-warning">Pending</span>
                        @else
                            <span class="badge badge-danger">Ditolak</span>
                        @endif
                    </td>
                    <td class="text-right" style="color: #27ae60; font-weight: bold;">Rp {{ number_format($row->nominal, 0, ',', '.') }}</td>
                </tr>
            @empty
                <tr>
                    <td colSpan="8" class="text-center" style="color: #888; padding: 15px;">Tidak ada data pemasukan</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Pengeluaran Section -->
    <div class="section-title">Rincian Uang Keluar (Pengeluaran)</div>
    <table class="content-table">
        <thead>
            <tr>
                <th width="4%" class="text-center">No</th>
                <th width="15%">Invoice</th>
                <th width="12%">Tanggal</th>
                <th width="20%">Kategori</th>
                <th width="27%">Keterangan</th>
                <th width="10%" class="text-center">Status</th>
                <th width="12%" class="text-right">Nominal</th>
            </tr>
        </thead>
        <tbody>
            @forelse($pengeluaran as $index => $row)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td><strong>{{ $row->invoice }}</strong></td>
                    <td>{{ $row->tanggal ? \Carbon\Carbon::parse($row->tanggal)->format('d/m/Y') : '-' }}</td>
                    <td>{{ $row->kategori }}</td>
                    <td>{{ $row->keterangan ?? '-' }}</td>
                    <td class="text-center">
                        @if($row->status === 'approved')
                            <span class="badge badge-success">ACC</span>
                        @elseif($row->status === 'pending')
                            <span class="badge badge-warning">Pending</span>
                        @else
                            <span class="badge badge-danger">Ditolak</span>
                        @endif
                    </td>
                    <td class="text-right" style="color: #c0392b; font-weight: bold;">Rp {{ number_format($row->nominal, 0, ',', '.') }}</td>
                </tr>
            @empty
                <tr>
                    <td colSpan="7" class="text-center" style="color: #888; padding: 15px;">Tidak ada data pengeluaran</td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        Laporan Transaksi Keuangan SPMB - Pondok Pesantren Mambaul Huda
    </div>
</body>
</html>
