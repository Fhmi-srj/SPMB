<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>{{ $title }}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            font-size: 8px;
            color: #333;
            line-height: 1.3;
            margin: 0;
            padding: 0;
        }
        .header {
            margin-bottom: 15px;
            border-bottom: 2px solid #E67E22;
            padding-bottom: 8px;
        }
        .header h2 {
            margin: 0;
            color: #E67E22;
            font-size: 14px;
            text-transform: uppercase;
        }
        .header p {
            margin: 2px 0 0 0;
            color: #666;
            font-size: 8px;
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
            text-align: center;
            padding: 4px 2px;
            border: 1px solid #d35400;
            font-size: 8px;
            text-transform: uppercase;
        }
        .content-table td {
            padding: 4px 2px;
            border: 1px solid #e0e0e0;
            vertical-align: middle;
            font-size: 8px;
        }
        .content-table tr:nth-child(even) td {
            background-color: #f9f9f9;
        }
        .text-center {
            text-align: center;
        }
        .text-left {
            text-align: left;
        }
        .badge-ordered {
            font-family: "DejaVu Sans", sans-serif;
            color: #27ae60;
            font-weight: bold;
            font-size: 10px;
        }
        .badge-not-ordered {
            font-family: "DejaVu Sans", sans-serif;
            color: #c0392b;
            font-weight: bold;
            font-size: 9px;
        }
        .signature-dots {
            color: #999;
            font-size: 7px;
        }
        .footer {
            margin-top: 20px;
            text-align: right;
            font-size: 7px;
            color: #777;
            position: absolute;
            bottom: 0;
            width: 100%;
        }
        .signatures-table {
            width: 100%;
            margin-top: 25px;
            border-collapse: collapse;
        }
        .signatures-table td {
            border: none;
            text-align: center;
            vertical-align: top;
            width: 50%;
            font-size: 9px;
        }
    </style>
</head>
<body>
    @php
        $totals = [];
        foreach ($items as $item) {
            $totals[$item->id] = 0;
        }
        foreach ($data as $student) {
            foreach ($items as $item) {
                if (isset($student['perlengkapan'][$item->id]) && $student['perlengkapan'][$item->id]) {
                    $totals[$item->id]++;
                }
            }
        }
    @endphp
    <div class="header">
        <table style="width: 100%; border: none;">
            <tr style="border: none;">
                <td style="border: none; width: 60%;">
                    <h2>{{ $title }}</h2>
                    <p>Pondok Pesantren Mambaul Huda - Penerimaan Siswa Baru</p>
                </td>
                <td style="text-align: right; vertical-align: bottom; border: none; width: 40%;">
                    <p style="font-size: 8px; color: #666;">Lembaga: <strong>{{ $lembaga }}</strong></p>
                    <p style="font-size: 8px; color: #666;">Tanggal Cetak: {{ $date }}</p>
                </td>
            </tr>
        </table>
    </div>

    <table class="content-table">
        <thead>
            <tr>
                <th rowspan="2" width="3%">No</th>
                <th rowspan="2" width="10%">No. Reg</th>
                <th rowspan="2" width="15%" class="text-left" style="padding-left: 5px;">Nama Santri</th>
                <th rowspan="2" width="8%">Lembaga</th>
                @foreach($items as $item)
                    <th colspan="3" width="{{ 55 / count($items) }}%">{{ $item->nama_item }}</th>
                @endforeach
                <th rowspan="2" width="9%">Keterangan</th>
            </tr>
            <tr>
                @foreach($items as $item)
                    <th style="font-size: 7px; padding: 2px 1px;" width="3%">Pesan</th>
                    <th style="font-size: 7px; padding: 2px 1px;" width="11%">Tgl Ambil</th>
                    <th style="font-size: 7px; padding: 2px 1px;" width="8%">Ttd</th>
                @endforeach
            </tr>
        </thead>
        <tbody>
            @foreach($data as $index => $student)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td class="text-center"><strong>{{ $student['no_registrasi'] ?: '-' }}</strong></td>
                    <td class="text-left" style="padding-left: 5px; font-weight: bold;">{{ $student['nama'] }}</td>
                    <td class="text-center">{{ $student['lembaga'] }}</td>
                    
                    @foreach($items as $item)
                        @php
                            $isOrdered = isset($student['perlengkapan'][$item->id]) && $student['perlengkapan'][$item->id];
                            
                            $tanggalTampil = '';
                            if ($isOrdered && $mode === 'filled' && !empty($student['tanggal'])) {
                                try {
                                    $tanggalTampil = \Carbon\Carbon::parse($student['tanggal'])->format('d/m/Y');
                                } catch (\Exception $e) {
                                    $tanggalTampil = $student['tanggal'];
                                }
                            }
                        @endphp
                        
                        <!-- Pesan -->
                        <td class="text-center">
                            @if($isOrdered)
                                <span class="badge-ordered">&#10004;</span>
                            @else
                                <span class="badge-not-ordered">&#10008;</span>
                            @endif
                        </td>
                        
                        <!-- Tgl Ambil -->
                        <td class="text-center">
                            @if($isOrdered)
                                @if(!empty($tanggalTampil))
                                    {{ $tanggalTampil }}
                                @else
                                    <span class="signature-dots">...........</span>
                                @endif
                            @else
                                <span style="color: #bbb;">-</span>
                            @endif
                        </td>
                        
                        <!-- Ttd -->
                        <td class="text-center" style="height: 20px;">
                            @if($isOrdered)
                                <span class="signature-dots">.......</span>
                            @else
                                <span style="color: #bbb;">-</span>
                            @endif
                        </td>
                    @endforeach
                    
                    <td>
                        @if($mode === 'filled')
                            {{ $student['keterangan'] ?: '-' }}
                        @else
                            <span class="signature-dots">....................</span>
                        @endif
                    </td>
                </tr>
            @endforeach
        </tbody>
        <tfoot>
            <tr style="background-color: #f9f9f9; font-weight: bold;">
                <td colspan="4" style="text-align: right; padding-right: 10px; font-weight: bold; font-size: 8px; border: 1px solid #e0e0e0;">TOTAL PESANAN</td>
                @foreach($items as $item)
                    <td colspan="3" class="text-center" style="border: 1px solid #d35400; background-color: #ffe6d5; color: #d35400; font-weight: bold; font-size: 8px;">
                        {{ $totals[$item->id] }} Pcs
                    </td>
                @endforeach
                <td style="border: 1px solid #e0e0e0;"></td>
            </tr>
        </tfoot>
    </table>

    <table class="signatures-table">
        <tr>
            <td>
                <p>Mengetahui,</p>
                <p style="font-weight: bold; margin-top: 3px;">Kepala Pondok Pesantren</p>
                <br><br><br>
                <p style="font-weight: bold;">( ......................................... )</p>
            </td>
            <td>
                <p>Jombang, {{ $formattedDate }}</p>
                <p style="font-weight: bold; margin-top: 3px;">Petugas Perlengkapan</p>
                <br><br><br>
                <p style="font-weight: bold;">( ......................................... )</p>
            </td>
        </tr>
    </table>

    <div class="footer">
        <p>Bukti Pengambilan Perlengkapan SPMB Mambaul Huda - Dicetak otomatis oleh Sistem</p>
    </div>
</body>
</html>
