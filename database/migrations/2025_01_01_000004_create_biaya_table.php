<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('biaya')) { Schema::create('biaya', function (Blueprint $table) {
            $table->id();
            $table->enum('kategori', ['PENDAFTARAN', 'DAFTAR_ULANG']);
            $table->string('nama_item', 100);
            $table->integer('biaya_pondok')->default(0);
            $table->integer('biaya_smp')->default(0);
            $table->integer('biaya_ma')->default(0);
            $table->integer('urutan')->default(0);
        });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('biaya');
    }
};

