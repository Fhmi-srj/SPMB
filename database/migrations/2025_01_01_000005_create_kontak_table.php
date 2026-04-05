<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('kontak', function (Blueprint $table) {
            $table->id();
            $table->string('lembaga', 50);
            $table->string('nama', 100);
            $table->string('no_whatsapp', 20);
            $table->string('link_wa', 255)->nullable();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kontak');
    }
};
