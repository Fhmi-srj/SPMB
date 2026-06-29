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
        .meta-table {
            width: 100%;
            margin-bottom: 10px;
        }
        .meta-table td {
            padding: 2px 0;
        }
        .content-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .content-table th {
            background-color: #E67E22;
            color: #ffffff;
            font-weight: bold;
            text-align: left;
            padding: 8px 6px;
            border: 1px solid #d35400;
        }
        .content-table td {
            padding: 6px;
            border: 1px solid #e0e0e0;
            vertical-align: top;
        }
        .content-table tr:nth-child(even) td {
            background-color: #f9f9f9;
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
        .footer {
            margin-top: 30px;
            text-align: right;
            font-size: 10px;
            color: #777;
        }
        .stats-table {
            width: 100%;
            margin-bottom: 15px;
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
    </style>
</head>
<body>
    <div class="header">
        <table style="width: 100%;">
            <tr>
                <td>
                    <h2>{{ $title }}</h2>
                    <p>Pondok Pesantren Mambaul Huda - Penerimaan Siswa Baru</p>
                </td>
                <td style="text-align: right; vertical-align: bottom;">
                    <p style="font-size: 10px;">Tanggal Cetak: {{ $date }}</p>
                </td>
            </tr>
        </table>
    </div>

    @if(isset($summary))
    <table class="stats-table" style="margin-left: -8px; margin-right: -8px;">
        <tr>
            <td width="16.6%">
                <div class="stats-card" style="border-left: 3px solid #E67E22;">
                    <div class="stats-label">Total Pendaftar</div>
                    <div class="stats-value">{{ $summary['total_pendaftar'] }}</div>
                </div>
            </td>
            <td width="16.6%">
                <div class="stats-card" style="border-left: 3px solid #2ecc71;">
                    <div class="stats-label">Berkas Lengkap</div>
                    <div class="stats-value">{{ $summary['total_lengkap_berkas'] }}</div>
                </div>
            </td>
            <td width="16.6%">
                <div class="stats-card" style="border-left: 3px solid #3498db;">
                    <div class="stats-label">Total Tagihan</div>
                    <div class="stats-value">Rp {{ number_format($summary['total_tagihan'], 0, ',', '.') }}</div>
                </div>
            </td>
            <td width="16.6%">
                <div class="stats-card" style="border-left: 3px solid #27ae60;">
                    <div class="stats-label">Uang Masuk</div>
                    <div class="stats-value">Rp {{ number_format($summary['total_pemasukan'], 0, ',', '.') }}</div>
                </div>
            </td>
            <td width="16.6%">
                <div class="stats-card" style="border-left: 3px solid #e74c3c;">
                    <div class="stats-label">Uang Keluar</div>
                    <div class="stats-value">Rp {{ number_format($summary['total_pengeluaran'], 0, ',', '.') }}</div>
                </div>
            </td>
            <td width="16.6%">
                <div class="stats-card" style="border-left: 3px solid #f39c12;">
                    <div class="stats-label">Kekurangan</div>
                    <div class="stats-value" style="color: #e74c3c;">Rp {{ number_format($summary['total_kekurangan'], 0, ',', '.') }}</div>
                </div>
            </td>
        </tr>
    </table>
    @endif

    <table class="content-table">
        <thead>
            <tr>
                <th width="3%" class="text-center">No</th>
                <th width="9%">No. Reg</th>
                <th width="18%">Nama Calon</th>
                <th width="10%">Lembaga</th>
                <th width="18%">Alamat</th>
                <th width="12%">Pemberkasan</th>
                <th class="text-right" width="10%">Tagihan</th>
                <th class="text-right" width="10%">Pemesanan</th>
                <th class="text-right" width="10%">Total Tagihan</th>
                <th class="text-right" width="10%">Kekurangan</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td><strong>{{ $item['no_registrasi'] ?? '-' }}</strong></td>
                    <td>{{ $item['nama'] }}</td>
                    <td>{{ $item['lembaga'] }}</td>
                    <td>{{ $item['alamat'] ?? '-' }}</td>
                    <td class="text-center">
                        @if($item['status_berkas'] === 'Lengkap')
                            <span class="badge badge-success">Lengkap</span>
                        @else
                            <span class="badge badge-warning">Belum Lengkap</span>
                        @endif
                    </td>
                    <td class="text-right">Rp {{ number_format($item['tagihan'], 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($item['pemesanan'], 0, ',', '.') }}</td>
                    <td class="text-right"><strong>Rp {{ number_format($item['total_tagihan'], 0, ',', '.') }}</strong></td>
                    <td class="text-right" style="color: {{ $item['kekurangan'] > 0 ? '#e74c3c' : '#27ae60' }}; font-weight: bold;">
                        Rp {{ number_format($item['kekurangan'], 0, ',', '.') }}
                    </td>
                </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        <p>Laporan Rekapitulasi Pendaftaran SPMB - Halaman 1 dari 1</p>
    </div>
</body>
</html>
