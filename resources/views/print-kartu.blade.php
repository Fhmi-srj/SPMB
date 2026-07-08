<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=device-width, initial-scale=1.0">
    <title>Cetak Kartu Calon Siswa - PPDB {{ $tahun_ajaran }}</title>
    <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        :root {
            --text-dark: #0F172A;
            --text-medium: #334155;
            --text-muted: #64748B;
            --border-color: #E2E8F0;
            --bg-light: #F8FAFC;
        }

        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Outfit', sans-serif;
            background: #F1F5F9;
            color: var(--text-dark);
            padding-top: 80px;
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

        /* Cards Container */
        .cards-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 30px;
            padding: 20px;
            width: 100%;
            max-width: 1200px;
        }

        /* Card Outlines & Cutting Guide */
        .card-outline {
            position: relative;
            padding: 12px;
            background: #ffffff;
            border-radius: 20px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .cut-guide {
            position: absolute;
            top: -15px;
            left: 12px;
            font-size: 11px;
            color: var(--text-muted);
            font-style: italic;
            display: flex;
            align-items: center;
            gap: 4px;
        }

        /* Card Sizing */
        .card {
            width: 100mm;
            height: 148mm;
            border: 2px dashed #CBD5E1;
            border-radius: 16px;
            position: relative;
            display: flex;
            flex-direction: column;
            background: #ffffff;
            overflow: hidden;
        }

        /* Color-Coded Themes based on Institution */
        .theme-smp {
            --theme-gradient: linear-gradient(135deg, #064E3B 0%, #059669 100%);
            --theme-accent: #059669;
            --theme-accent-light: #ECFDF5;
            --theme-accent-border: #A7F3D0;
            --theme-accent-text: #047857;
        }

        .theme-ma {
            --theme-gradient: linear-gradient(135deg, #1E1B4B 0%, #4338CA 100%);
            --theme-accent: #4F46E5;
            --theme-accent-light: #EEF2FF;
            --theme-accent-border: #C7D2FE;
            --theme-accent-text: #4338CA;
        }

        .theme-default {
            --theme-gradient: linear-gradient(135deg, #0F172A 0%, #334155 100%);
            --theme-accent: #64748B;
            --theme-accent-light: #F8FAFC;
            --theme-accent-border: #E2E8F0;
            --theme-accent-text: #475569;
        }

        /* Card Header / Kop Banner */
        .card-header {
            background: var(--theme-gradient);
            color: #ffffff;
            padding: 16px 14px;
            text-align: center;
            position: relative;
        }

        /* Abstract Pattern on Header Background */
        .card-header::after {
            content: "";
            position: absolute;
            top: 0; left: 0; right: 0; bottom: 0;
            background: linear-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
            background-size: 8px 8px;
            opacity: 0.6;
            pointer-events: none;
        }

        .header-subtitle {
            font-size: 8px;
            font-weight: 500;
            letter-spacing: 1.8px;
            opacity: 0.9;
            text-transform: uppercase;
        }

        .header-title {
            font-size: 19px;
            font-weight: 800;
            letter-spacing: 0.5px;
            margin: 4px 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
            text-transform: uppercase;
        }

        .header-school {
            font-size: 9px;
            font-weight: 600;
            letter-spacing: 1px;
            opacity: 0.85;
            text-transform: uppercase;
        }

        /* Registration Bar */
        .reg-bar {
            background: var(--theme-accent-light);
            border-bottom: 1px solid var(--theme-accent-border);
            padding: 8px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            z-index: 1;
        }

        .reg-label {
            font-size: 8px;
            font-weight: 800;
            color: var(--theme-accent-text);
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .reg-value {
            font-family: monospace;
            font-size: 14px;
            font-weight: 800;
            color: var(--theme-accent-text);
            letter-spacing: 0.5px;
        }

        /* Card Main Content */
        .card-body {
            padding: 16px;
            display: flex;
            flex: 1;
            gap: 12px;
            background: #ffffff;
        }

        /* Left Column: Student Details */
        .info-column {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }

        .info-item {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .info-label {
            font-size: 7.5px;
            font-weight: 700;
            color: var(--text-muted);
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }

        .info-val {
            font-size: 10px;
            font-weight: 600;
            color: var(--text-medium);
            line-height: 1.3;
        }

        .info-val.name-highlight {
            font-size: 11px;
            font-weight: 800;
            color: var(--text-dark);
        }

        .info-val.address-val {
            font-size: 9px;
            color: #475569;
            height: 24px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }

        /* Right Column: Visual Frames */
        .visual-column {
            width: 30mm;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
        }

        .photo-frame {
            width: 25mm;
            height: 33mm;
            border: 1px dashed var(--theme-accent-border);
            border-radius: 8px;
            background: #FAFAFA;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: var(--text-muted);
            position: relative;
            box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.01);
        }

        .photo-frame i {
            font-size: 18px;
            margin-bottom: 4px;
            color: #CBD5E1;
        }

        .photo-frame span {
            font-size: 7px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .qr-frame {
            width: 20mm;
            height: 20mm;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 2px;
            background: #ffffff;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .qr-image {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        /* Card Footer & Signatures */
        .card-footer {
            padding: 12px 16px 16px 16px;
            background: #F8FAFC;
            border-top: 1px solid #F1F5F9;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .signatures {
            display: flex;
            justify-content: space-between;
        }

        .sig-col {
            width: 45%;
            text-align: center;
        }

        .sig-title {
            font-size: 8px;
            color: var(--text-muted);
            line-height: 1.3;
        }

        .sig-space {
            height: 10mm;
        }

        .sig-name {
            font-size: 8.5px;
            font-weight: 700;
            color: var(--text-medium);
            border-top: 1px solid #CBD5E1;
            display: inline-block;
            padding-top: 2px;
            width: 80%;
            text-transform: uppercase;
        }

        .sig-dots {
            font-size: 8.5px;
            color: #CBD5E1;
        }

        .instruction-box {
            font-size: 6.5px;
            color: var(--text-medium);
            background: #ffffff;
            padding: 8px;
            border-radius: 6px;
            border: 1px solid var(--border-color);
            line-height: 1.4;
            text-align: center;
        }

        * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
        }

        /* Print Media Styles */
        @media print {
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

            .no-print {
                display: none !important;
            }

            body {
                background: #ffffff;
                padding-top: 0;
                margin: 0;
            }

            .cards-container {
                padding: 0;
                gap: 0;
                max-width: none;
            }

            .card-outline {
                box-shadow: none;
                padding: 0;
                margin: 5mm;
                page-break-inside: avoid;
            }

            .cut-guide {
                display: none;
            }

            .card {
                border: 1px dashed #64748B;
            }

            .card-outline:nth-child(2n) {
                page-break-after: always;
            }
        }
    </style>
</head>
<body>

    <!-- Floating Top Toolbar -->
    <div class="print-toolbar no-print">
        <div class="toolbar-title">
            <i class="fas fa-id-card text-orange-500 mr-2"></i>
            Kartu Calon Siswa ({{ $students->count() }} Pendaftar)
        </div>
        <div class="toolbar-actions">
            <button onclick="window.close()" class="btn btn-secondary">
                <i class="fas fa-times"></i> Tutup
            </button>
            <button onclick="window.print()" class="btn btn-primary">
                <i class="fas fa-print"></i> Cetak Sekarang
            </button>
        </div>
    </div>

    <!-- Cards Wrapper -->
    <div class="cards-container">
        @foreach ($students as $student)
            @php
                // Resolve Class Theme based on chosen Lembaga
                $themeClass = 'theme-default';
                if (str_contains(strtoupper($student->lembaga), 'SMP')) {
                    $themeClass = 'theme-smp';
                } elseif (str_contains(strtoupper($student->lembaga), 'MA')) {
                    $themeClass = 'theme-ma';
                }
            @endphp
            
            <div class="card-outline">
                <div class="cut-guide"><i class="fas fa-scissors"></i> Potong sepanjang garis putus-putus</div>
                <div class="card {{ $themeClass }}">
                    <!-- Header Banner (Kop) -->
                    <div class="card-header">
                        <div class="header-subtitle">Kartu Tanda Peserta PPDB - {{ $tahun_ajaran }}</div>
                        <div class="header-title">{{ $student->lembaga }}</div>
                        <div class="header-school">PP Mamba'ul Huda Pajomblangan</div>
                    </div>

                    <!-- Registration Bar -->
                    <div class="reg-bar">
                        <span class="reg-label">No. Registrasi</span>
                        <span class="reg-value">{{ $student->no_registrasi }}</span>
                    </div>

                    <!-- Body -->
                    <div class="card-body">
                        <!-- Left: Student Info -->
                        <div class="info-column">
                            <div class="info-item">
                                <span class="info-label">Nama Lengkap</span>
                                <span class="info-val name-highlight">{{ $student->nama }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">NISN</span>
                                <span class="info-val">{{ $student->nisn ?? '-' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Asal Sekolah</span>
                                <span class="info-val">{{ $student->asal_sekolah ?? '-' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">Alamat Lengkap</span>
                                <span class="info-val address-val" title="{{ $student->alamat }}">{{ $student->alamat ?? '-' }}</span>
                            </div>
                            <div class="info-item">
                                <span class="info-label">No. HP Wali</span>
                                <span class="info-val">{{ $student->no_hp_wali ?? '-' }}</span>
                            </div>
                        </div>
                        
                        <!-- Right: Visual Slots (Photo & QR Code) -->
                        <div class="visual-column">
                            <!-- Pasfoto 3x4 Slot -->
                            <div class="photo-frame">
                                <i class="fas fa-user-tie"></i>
                                <span>Pasfoto 3x4</span>
                            </div>
                            <!-- QR Code for Quick Check-In -->
                            <div class="qr-frame">
                                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data={{ urlencode(url('/cek-status?q=' . $student->no_registrasi)) }}" 
                                     alt="QR Code" 
                                     class="qr-image">
                            </div>
                        </div>
                    </div>

                    <!-- Footer & Signatures -->
                    <div class="card-footer">
                        <div class="signatures">
                            <div class="sig-col">
                                <div class="sig-title">Calon Siswa,</div>
                                <div class="sig-space"></div>
                                <div class="sig-name">{{ \Illuminate\Support\Str::limit($student->nama, 20) }}</div>
                            </div>
                            <div class="sig-col">
                                <div class="sig-title">Pekalongan, {{ date('d-m-Y') }}<br>Panitia PPDB,</div>
                                <div class="sig-space"></div>
                                <div class="sig-dots">____________________</div>
                            </div>
                        </div>
                        <div class="instruction-box">
                            <strong>PENTING:</strong> Tempelkan pasfoto 3x4 background merah pada kotak di atas. Kartu ini wajib dibawa saat melakukan verifikasi fisik berkas di sekretariat PPDB.
                        </div>
                    </div>
                </div>
            </div>
        @endforeach
    </div>

    <script>
        // Auto-trigger browser print dialog on load
        window.addEventListener('load', function() {
            setTimeout(function() {
                window.print();
            }, 1000);
        });
    </script>
</body>
</html>
