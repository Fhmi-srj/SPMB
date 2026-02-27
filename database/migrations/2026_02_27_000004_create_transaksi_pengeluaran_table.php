<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transaksi_pengeluaran', function (Blueprint $table) {
            $table->id();
            $table->string('invoice', 50)->unique();
            $table->date('tanggal');
            $table->integer('nominal');
            $table->string('kategori', 100)->comment('Sesuai item dari tabel biaya');
            $table->text('keterangan')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('approved');
            $table->unsignedBigInteger('input_by')->nullable();
            $table->dateTime('input_at')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->dateTime('approved_at')->nullable();
            $table->text('catatan_approval')->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->index('tanggal', 'idx_pengeluaran_tanggal');
            $table->index('kategori', 'idx_pengeluaran_kategori');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi_pengeluaran');
    }
};
