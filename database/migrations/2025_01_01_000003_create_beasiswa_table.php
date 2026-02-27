<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('beasiswa')) { Schema::create('beasiswa', function (Blueprint $table) {
            $table->id();
            $table->string('jenis', 100);
            $table->string('kategori', 100);
            $table->string('syarat', 200);
            $table->string('benefit', 100);
            $table->integer('urutan')->default(0);
        });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('beasiswa');
    }
};

