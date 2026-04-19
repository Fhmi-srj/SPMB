<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Pengaturan;
use App\Models\Biaya;
use App\Models\Kontak;
use App\Models\PerlengkapanItem;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Admin User ────────────────────────────────────────────────────
        User::firstOrCreate(
            ['username' => 'admin_psb'],
            [
                'nama'     => 'Admin PSB',
                'username' => 'admin_psb',
                'role'     => 'super_admin',
                'password' => Hash::make('admin123'),
            ]
        );

        // ─── Pengaturan Default ──────────────────────────────────────────
        $defaults = [
            'status_pendaftaran' => '1',
            'tahun_ajaran'       => '2026/2027',
            'gelombang_1_start'  => '2026-01-01',
            'gelombang_1_end'    => '2026-03-31',
            'gelombang_2_start'  => '2026-04-01',
            'gelombang_2_end'    => '2026-06-30',
            'link_grup_wa'       => '',
            'link_pdf_brosur'    => 'https://drive.google.com/file/d/19oTO4BfuGDAKNmn6WCGFAZn96-daCdjM/view?usp=sharing',
            'link_pdf_biaya'     => 'https://drive.google.com/file/d/1ZfzjkZdVG0jyV1woj0zgahKJX-o8-pKW/view?usp=sharing',
            'link_pdf_syarat'    => 'https://drive.google.com/file/d/1vbwof-2w_v2wzvosNYTzyE74EJqR0cEQ/view?usp=sharing',
            'link_beasiswa'      => 'https://s.id/BeasiswaMAHAKAM',
            'wa_otomatis'        => '1',
        ];

        foreach ($defaults as $kunci => $nilai) {
            Pengaturan::updateOrCreate(['kunci' => $kunci], ['nilai' => $nilai]);
        }

        // ─── Biaya Pendaftaran ─────────────────────────────────────────────
        $biayaPendaftaran = [
            ['kategori' => 'PENDAFTARAN', 'nama_item' => 'Uang Pendaftaran', 'biaya' => 150000, 'urutan' => 1],
            ['kategori' => 'PENDAFTARAN', 'nama_item' => 'Formulir Pendaftaran', 'biaya' => 50000, 'urutan' => 2],
        ];

        // ─── Biaya Daftar Ulang ────────────────────────────────────────────
        $biayaDaftarUlang = [
            ['kategori' => 'DAFTAR_ULANG', 'nama_item' => 'SPP Bulan Pertama', 'biaya' => 300000, 'urutan' => 1],
            ['kategori' => 'DAFTAR_ULANG', 'nama_item' => 'Uang Gedung', 'biaya' => 1500000, 'urutan' => 2],
            ['kategori' => 'DAFTAR_ULANG', 'nama_item' => 'Seragam', 'biaya' => 500000, 'urutan' => 3],
            ['kategori' => 'DAFTAR_ULANG', 'nama_item' => 'Infaq Bulan Pertama', 'biaya' => 750000, 'urutan' => 4],
        ];

        foreach ([...$biayaPendaftaran, ...$biayaDaftarUlang] as $b) {
            Biaya::firstOrCreate(
                ['kategori' => $b['kategori'], 'nama_item' => $b['nama_item']],
                $b
            );
        }

        // ─── Kontak ──────────────────────────────────────────────────────
        $kontakData = [
            ['lembaga' => 'PONDOK', 'nama' => 'Panitia PSB PP Mambaul Huda', 'no_whatsapp' => '6285999000003', 'link_wa' => 'https://wa.me/6285999000003'],
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

        $this->command->info('✅ Seeder selesai. Admin: username=admin_psb, password=admin123');
    }
}
