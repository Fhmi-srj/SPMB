<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Pengaturan;
use App\Models\Beasiswa;
use App\Models\Biaya;
use App\Models\Kontak;
use App\Models\PerlengkapanItem;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Admin User ────────────────────────────────────────────────────
        User::firstOrCreate(
            ['username' => 'admin_spmb'],
            [
                'nama'     => 'Admin SPMB',
                'username' => 'admin_spmb',
                'role'     => 'super_admin',
                'password' => Hash::make('admin123'),
            ]
        );

        // ─── Pengaturan Default ──────────────────────────────────────────
        $defaults = [
            'status_pendaftaran' => '1',
            'tahun_ajaran'       => '2025/2026',
            'gelombang_1_start'  => '2025-01-01',
            'gelombang_1_end'    => '2025-03-31',
            'gelombang_2_start'  => '2025-04-01',
            'gelombang_2_end'    => '2025-06-30',
            'link_grup_wa'       => '',
            'link_pdf_brosur'    => '',
            'link_pdf_biaya'     => '',
            'link_pdf_syarat'    => '',
        ];

        foreach ($defaults as $kunci => $nilai) {
            Pengaturan::firstOrCreate(['kunci' => $kunci], ['nilai' => $nilai]);
        }

        // ─── Beasiswa ──────────────────────────────────────────────────────
        $beasiswaData = [
            ['jenis' => 'Beasiswa Yatim/Piatu', 'kategori' => 'Sosial', 'syarat' => 'Memiliki surat kematian orang tua yang dilegalisir', 'benefit' => 'Bebas SPP 100%', 'urutan' => 1],
            ['jenis' => 'Beasiswa Hafidz', 'kategori' => 'Tahfidz', 'syarat' => 'Hafal minimal 5 Juz Al-Qur\'an yang dibuktikan dengan ujian', 'benefit' => 'Bebas SPP + Bebas Uang Gedung', 'urutan' => 2],
            ['jenis' => 'Beasiswa Prestasi Akademik', 'kategori' => 'Akademik', 'syarat' => 'Nilai rata-rata rapor ≥ 85 dan peringkat 3 besar di sekolah asal', 'benefit' => 'Diskon SPP 50%', 'urutan' => 3],
            ['jenis' => 'Beasiswa Dhuafa', 'kategori' => 'Sosial', 'syarat' => 'Memiliki KIP/PKH dan surat keterangan tidak mampu dari desa/kelurahan', 'benefit' => 'Keringanan biaya 30-70%', 'urutan' => 4],
        ];

        foreach ($beasiswaData as $b) {
            Beasiswa::firstOrCreate(['jenis' => $b['jenis']], $b);
        }

        // ─── Biaya Pendaftaran ─────────────────────────────────────────────
        $biayaPendaftaran = [
            ['kategori' => 'PENDAFTARAN', 'nama_item' => 'Uang Pendaftaran', 'biaya_pondok' => 0, 'biaya_smp' => 150000, 'biaya_ma' => 150000, 'urutan' => 1],
            ['kategori' => 'PENDAFTARAN', 'nama_item' => 'Formulir Pendaftaran', 'biaya_pondok' => 0, 'biaya_smp' => 50000, 'biaya_ma' => 50000, 'urutan' => 2],
        ];

        // ─── Biaya Daftar Ulang ────────────────────────────────────────────
        $biayaDaftarUlang = [
            ['kategori' => 'DAFTAR_ULANG', 'nama_item' => 'SPP Bulan Pertama', 'biaya_pondok' => 300000, 'biaya_smp' => 250000, 'biaya_ma' => 300000, 'urutan' => 1],
            ['kategori' => 'DAFTAR_ULANG', 'nama_item' => 'Uang Gedung', 'biaya_pondok' => 1500000, 'biaya_smp' => 1000000, 'biaya_ma' => 1500000, 'urutan' => 2],
            ['kategori' => 'DAFTAR_ULANG', 'nama_item' => 'Seragam', 'biaya_pondok' => 500000, 'biaya_smp' => 400000, 'biaya_ma' => 450000, 'urutan' => 3],
            ['kategori' => 'DAFTAR_ULANG', 'nama_item' => 'Infaq Bulan Pertama', 'biaya_pondok' => 750000, 'biaya_smp' => 0, 'biaya_ma' => 0, 'urutan' => 4],
            ['kategori' => 'DAFTAR_ULANG', 'nama_item' => 'Registrasi', 'biaya_pondok' => 0, 'biaya_smp' => 200000, 'biaya_ma' => 250000, 'urutan' => 5],
        ];

        foreach ([...$biayaPendaftaran, ...$biayaDaftarUlang] as $b) {
            Biaya::firstOrCreate(
                ['kategori' => $b['kategori'], 'nama_item' => $b['nama_item']],
                $b
            );
        }

        // ─── Kontak ──────────────────────────────────────────────────────
        $kontakData = [
            ['lembaga' => 'SMP NU BP', 'nama' => 'Panitia SPMB SMP NU BP', 'no_whatsapp' => '6285999000001', 'link_wa' => 'https://wa.me/6285999000001'],
            ['lembaga' => 'MA ALHIKAM', 'nama' => 'Panitia SPMB MA ALHIKAM', 'no_whatsapp' => '6285999000002', 'link_wa' => 'https://wa.me/6285999000002'],
            ['lembaga' => 'UMUM', 'nama' => 'Sekretariat PP Mambaul Huda', 'no_whatsapp' => '6285999000003', 'link_wa' => 'https://wa.me/6285999000003'],
        ];

        foreach ($kontakData as $k) {
            Kontak::firstOrCreate(['no_whatsapp' => $k['no_whatsapp']], $k);
        }

        // ─── Perlengkapan Items ──────────────────────────────────────────
        $perlengkapanData = [
            ['nama_item' => 'Kasur', 'nominal' => 500000, 'urutan' => 1],
            ['nama_item' => 'Almari', 'nominal' => 750000, 'urutan' => 2],
            ['nama_item' => 'Bantal', 'nominal' => 100000, 'urutan' => 3],
            ['nama_item' => 'Guling', 'nominal' => 75000, 'urutan' => 4],
            ['nama_item' => 'Selimut', 'nominal' => 150000, 'urutan' => 5],
        ];

        foreach ($perlengkapanData as $p) {
            PerlengkapanItem::firstOrCreate(['nama_item' => $p['nama_item']], $p);
        }

        $this->command->info('✅ Seeder selesai. Admin: username=admin_spmb, password=admin123');
    }
}
