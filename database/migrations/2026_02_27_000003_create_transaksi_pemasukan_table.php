<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaksi_pemasukan', function (Blueprint $table) {
            $table->id();
            $table->string('invoice', 50)->unique();
            $table->foreignId('pendaftaran_id')->constrained('pendaftaran')->cascadeOnDelete();
            $table->date('tanggal');
            $table->integer('nominal');
            $table->string('jenis_pembayaran', 100)->comment('Pendaftaran/Daftar Ulang/Perlengkapan/dll');
            $table->text('keterangan')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('approved');
            $table->unsignedBigInteger('input_by')->nullable();
            $table->dateTime('input_at')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->dateTime('approved_at')->nullable();
            $table->text('catatan_approval')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('pendaftaran_id', 'idx_pemasukan_pendaftaran');
            $table->index('tanggal', 'idx_pemasukan_tanggal');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi_pemasukan');
    }
};
