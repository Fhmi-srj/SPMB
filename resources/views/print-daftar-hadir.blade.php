<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cetak Daftar Hadir - PPDB {{ $tahun_ajaran }}</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @page {
            size: A4 landscape;
            margin: 10mm;
        }

        :root {
            --text-dark: #0F172A;
            --text-medium: #334155;
            --border-color: #94A3B8;
            --bg-light: #F8FAFC;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: #F1F5F9;
            color: var(--text-dark);
            padding-top: 80px;
            padding-bottom: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        /* Non-printable Toolbar */
        .print-toolbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 64px;
            background: #ffffff;
            border-bottom: 1px solid #E2E8F0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            z-index: 1000;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }

        .toolbar-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--text-dark);
        }

        .toolbar-actions {
            display: flex;
            gap: 12px;
        }

        .btn {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            text-decoration: none;
            transition: all 0.2s ease;
            border: none;
            outline: none;
        }

        .btn-secondary {
            background: #F1F5F9;
            color: #334155;
        }

        .btn-secondary:hover {
            background: #E2E8F0;
        }

        .btn-primary {
            background: #E67E22;
            color: #ffffff;
        }

        .btn-primary:hover {
            background: #D35400;
        }

        /* Paper Layout for Printing */
        .paper {
            background: #ffffff;
            width: 297mm; /* A4 landscape width */
            min-height: 210mm; /* A4 landscape height */
            padding: 15mm;
            margin-bottom: 20px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
            position: relative;
            box-sizing: border-box;
        }

        /* Kop Surat (Header) */
        .kop-surat {
            display: flex;
            align-items: center;
            border-bottom: 3px double #000000;
            padding-bottom: 10px;
            margin-bottom: 20px;
            text-align: center;
            width: 100%;
        }

        .kop-logo {
            width: 70px;
            height: 70px;
            object-fit: contain;
            margin-right: 15px;
        }

        .kop-text {
            flex: 1;
        }

        .kop-text h2 {
            font-size: 18px;
            font-weight: 700;
            text-transform: uppercase;
            line-height: 1.2;
            margin-bottom: 2px;
        }

        .kop-text h3 {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            line-height: 1.2;
            margin-bottom: 4px;
        }

        .kop-text p {
            font-size: 11px;
            color: var(--text-medium);
            line-height: 1.3;
        }

        /* Document Title */
        .doc-title {
            text-align: center;
            margin-bottom: 20px;
        }

        .doc-title h4 {
            font-size: 16px;
            font-weight: 700;
            text-transform: uppercase;
            text-decoration: underline;
            margin-bottom: 4px;
        }

        .doc-title p {
            font-size: 13px;
            font-weight: 500;
        }

        /* Info Section */
        .info-details {
            margin-bottom: 15px;
            font-size: 13px;
            display: flex;
            justify-content: space-between;
        }

        .info-left {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .info-row {
            display: flex;
        }

        .info-label {
            width: 100px;
            font-weight: 600;
        }

        .info-val {
            position: relative;
        }

        .info-val::before {
            content: ": ";
            font-weight: normal;
        }

        /* Attendance Table */
        .attendance-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 12px;
            margin-bottom: 30px;
        }

        .attendance-table th,
        .attendance-table td {
            border: 1px solid #000000;
            padding: 6px 6px;
            vertical-align: middle;
        }

        .attendance-table th {
            font-weight: 700;
            text-transform: uppercase;
            background-color: #F1F5F9;
            text-align: center;
        }

        .text-center {
            text-align: center;
        }

        .td-no {
            width: 30px;
        }

        .td-noreg {
            width: 100px;
            font-weight: 600;
            white-space: nowrap;
        }

        .td-nama {
            font-weight: 500;
            white-space: nowrap;
        }

        .td-alamat {
            font-size: 11px;
            max-width: 230px;
            word-wrap: break-word;
            line-height: 1.3;
        }

        .td-sekolah {
            font-size: 11px;
            max-width: 170px;
            word-wrap: break-word;
            line-height: 1.3;
        }

        .td-wa {
            font-size: 11.5px;
            width: 110px;
            white-space: nowrap;
        }

        .td-ttd {
            width: 85px;
            font-size: 11px;
            padding: 10px 4px !important;
        }

        .ttd-odd {
            text-align: left;
        }

        .ttd-even {
            text-align: right;
            padding-right: 15px !important;
        }

        /* Document Footer Signatures */
        .doc-footer {
            display: flex;
            justify-content: flex-end;
            margin-top: 30px;
            font-size: 13px;
        }

        .footer-sig {
            text-align: center;
            width: 200px;
        }

        .sig-space {
            height: 70px;
        }

        .sig-name {
            font-weight: 600;
            text-decoration: underline;
        }

        /* Printing Specific Styles */
        @media print {
            body {
                background: #ffffff;
                padding-top: 0;
                padding-bottom: 0;
            }

            .print-toolbar {
                display: none !important;
            }

            .paper {
                margin: 0;
                box-shadow: none;
                width: 100%;
                min-height: auto;
                padding: 0;
                page-break-after: always;
            }

            .paper:last-child {
                page-break-after: avoid;
            }

            .attendance-table th {
                background-color: #E2E8F0 !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    @php
        $bulanIndo = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April', 5 => 'Mei', 6 => 'Juni',
            7 => 'Juli', 8 => 'Agustus', 9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];
        $tanggalIndo = date('d') . ' ' . $bulanIndo[(int)date('m')] . ' ' . date('Y');
    @endphp

    <!-- Floating Top Toolbar -->
    <div class="print-toolbar">
        <div class="toolbar-title">
            <i class="fas fa-file-signature text-orange-500 mr-2"></i>
            Daftar Hadir Calon Siswa Baru ({{ $grouped->flatten()->count() }} Total)
        </div>
        <div class="toolbar-actions">
            <button onclick="window.close()" class="btn btn-secondary">
                <i class="fas fa-times"></i> Tutup
            </button>
            <button onclick="window.print()" class="btn btn-primary">
                <i class="fas fa-print"></i> Cetak Daftar Hadir
            </button>
        </div>
    </div>

    @if($grouped->isEmpty())
        <div class="paper">
            <div class="doc-title" style="margin-top: 50px;">
                <h4>DAFTAR HADIR CALON SISWA BARU</h4>
                <p>Tidak ada data pendaftar yang terpilih.</p>
            </div>
        </div>
    @else
        @foreach ($grouped as $lembaga => $students)
            <div class="paper">
                <!-- Kop Surat -->
                <div class="kop-surat" style="justify-content: center; border-bottom: 2px solid #000000; padding-bottom: 8px; margin-bottom: 20px;">
                    <div class="kop-text" style="text-align: center;">
                        <h2 style="font-size: 16px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px;">SISTEM PENERIMAAN MURID BARU (SPMB)</h2>
                        <h3 style="font-size: 20px; font-weight: 800; text-transform: uppercase; margin-top: 5px;">{{ $lembaga }}</h3>
                    </div>
                </div>

                <!-- Judul Dokumen -->
                <div class="doc-title">
                    <h4>Daftar Hadir Calon Siswa Baru</h4>
                    <p>Tahun Pelajaran {{ $tahun_ajaran }}</p>
                </div>

                <!-- Info detail -->
                <div class="info-details">
                    <div class="info-left">
                        <div class="info-row">
                            <span class="info-label">Lembaga</span>
                            <span class="info-val"><strong>{{ $lembaga }}</strong></span>
                        </div>
                        <div class="info-row">
                            <span class="info-label">Acara</span>
                            <span class="info-val">Registrasi / Verifikasi Berkas Fisik</span>
                        </div>
                    </div>
                    <div class="info-left" style="text-align: right; align-items: flex-end;">
                        <div>Hari / Tanggal : ...................................</div>
                        <div>Waktu : ...................................</div>
                    </div>
                </div>

                <!-- Tabel Daftar Hadir -->
                <table class="attendance-table">
                    <thead>
                        <tr>
                            <th class="text-center">No</th>
                            <th>No. Reg</th>
                            <th>Nama Calon Siswa</th>
                            <th>Alamat</th>
                            <th>Asal Sekolah</th>
                            <th>No. WA / HP</th>
                            <th colspan="2">Tanda Tangan</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach ($students as $student)
                            <tr>
                                <td class="text-center td-no">{{ $loop->iteration }}</td>
                                <td class="td-noreg">{{ $student->no_registrasi }}</td>
                                <td class="td-nama">{{ $student->nama }}</td>
                                <td class="td-alamat">{{ $student->alamat }}</td>
                                <td class="td-sekolah">{{ $student->asal_sekolah ?? '-' }}</td>
                                <td class="td-wa">{{ $student->no_hp_wali ?? '-' }}</td>
                                
                                @if ($loop->iteration % 2 != 0)
                                    <td class="td-ttd ttd-odd">{{ $loop->iteration }}. ............</td>
                                    <td class="td-ttd" style="border-left: none;"></td>
                                @else
                                    <td class="td-ttd" style="border-right: none;"></td>
                                    <td class="td-ttd ttd-even">{{ $loop->iteration }}. ............</td>
                                @endif
                            </tr>
                        @endforeach
                    </tbody>
                </table>

                <!-- Tanda Tangan Panitia -->
                <div class="doc-footer">
                    <div class="footer-sig">
                        <div>Pekalongan, {{ $tanggalIndo }}</div>
                        <div>Panitia PPDB,</div>
                        <div class="sig-space"></div>
                        <div class="sig-name">................................................</div>
                    </div>
                </div>
            </div>
        @endforeach
    @endif

    <script>
        // Auto-trigger browser print dialog on load
        window.addEventListener('load', function() {
            setTimeout(function() {
                window.print();
            }, 800);
        });
    </script>
</body>
</html>
