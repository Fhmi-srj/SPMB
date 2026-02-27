<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('perlengkapan_pesanan')) { Schema::create('perlengkapan_pesanan', function (Blueprint $table) {
            $table->id();
            $table->foreignId('pendaftaran_id')->constrained('pendaftaran')->cascadeOnDelete();
            $table->foreignId('perlengkapan_item_id')->constrained('perlengkapan_items')->cascadeOnDelete();
            $table->boolean('status')->default(true)->comment('1=dipesan, 0=dibatalkan');
            $table->timestamps();
            $table->unique(['pendaftaran_id', 'perlengkapan_item_id'], 'unique_pesanan');
        });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('perlengkapan_pesanan');
    }
};

