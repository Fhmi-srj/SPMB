<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('log_aktivitas')) { Schema::create('log_aktivitas', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('user_name', 100)->default('Admin');
            $table->string('aksi', 50)->comment('CREATE, UPDATE, DELETE');
            $table->string('modul', 50)->comment('PEMASUKAN, PENGELUARAN');
            $table->text('detail');
            $table->timestamp('created_at')->useCurrent();

            $table->index('modul', 'idx_log_modul');
            $table->index('aksi', 'idx_log_aksi');
            $table->index('created_at', 'idx_log_created');
        });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('log_aktivitas');
    }
};

