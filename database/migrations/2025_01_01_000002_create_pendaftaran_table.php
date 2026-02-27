<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('pendaftaran')) { Schema::create('pendaftaran', function (Blueprint $table) {
            $table->id();
            $table->string('no_registrasi', 20)->nullable();
            $table->string('nama', 100);
            $table->enum('lembaga', ['SMP NU BP', 'MA ALHIKAM']);
            $table->string('nisn', 20)->nullable();
            $table->string('tempat_lahir', 50)->nullable();
            $table->date('tanggal_lahir')->nullable();
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->integer('jumlah_saudara')->default(0);
            $table->string('no_kk', 20)->nullable();
            $table->string('nik', 20)->nullable();
            $table->text('alamat')->nullable();
            $table->string('provinsi', 100)->nullable();
            $table->string('kota_kab', 100)->nullable();
            $table->string('kecamatan', 100)->nullable();
            $table->string('kelurahan_desa', 100)->nullable();
            $table->string('asal_sekolah', 100)->nullable();
            $table->string('prestasi', 200)->nullable();
            $table->enum('tingkat_prestasi', ['KABUPATEN', 'PROVINSI', 'NASIONAL'])->nullable();
            $table->enum('juara', ['1', '2', '3'])->nullable();
            $table->string('file_sertifikat', 255)->nullable();
            $table->string('pip_pkh', 50)->nullable();
            $table->enum('status_mukim', ['PONDOK PP MAMBAUL HUDA', 'PONDOK SELAIN PP MAMBAUL HUDA', 'TIDAK PONDOK']);
            $table->string('sumber_info', 50)->nullable();

            // Data Ayah
            $table->string('nama_ayah', 100)->nullable();
            $table->string('tempat_lahir_ayah', 50)->nullable();
            $table->date('tanggal_lahir_ayah')->nullable();
            $table->string('nik_ayah', 20)->nullable();
            $table->string('pekerjaan_ayah', 100)->nullable();
            $table->string('penghasilan_ayah', 20)->nullable();

            // Data Ibu
            $table->string('nama_ibu', 100)->nullable();
            $table->string('tempat_lahir_ibu', 50)->nullable();
            $table->date('tanggal_lahir_ibu')->nullable();
            $table->string('nik_ibu', 20)->nullable();
            $table->string('pekerjaan_ibu', 100)->nullable();
            $table->string('penghasilan_ibu', 20)->nullable();

            // Kontak & Auth
            $table->string('no_hp_wali', 20)->unique();
            $table->string('password', 255)->nullable();
            $table->string('reset_token', 64)->nullable();
            $table->dateTime('reset_token_expires')->nullable();

            // Dokumen Upload
            $table->string('file_kk', 255)->nullable();
            $table->string('file_ktp_ortu', 255)->nullable();
            $table->string('file_akta', 255)->nullable();
            $table->string('file_ijazah', 255)->nullable();

            // Status Admin
            $table->enum('status', ['pending', 'verified', 'rejected'])->default('pending');
            $table->text('catatan_admin')->nullable();
            $table->timestamp('catatan_updated_at')->nullable();

            $table->timestamps();

            $table->index('reset_token');
        });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('pendaftaran');
    }
};

