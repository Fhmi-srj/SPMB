<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Modify pendaftaran table: lembaga → string with default, drop status_mukim
        Schema::table('pendaftaran', function (Blueprint $table) {
            // Change lembaga from enum to string with default
            $table->string('lembaga', 100)->default('PP MAMBAUL HUDA')->change();
        });

        // Update all existing lembaga data
        DB::table('pendaftaran')->update(['lembaga' => 'PP MAMBAUL HUDA']);

        // Drop status_mukim column
        Schema::table('pendaftaran', function (Blueprint $table) {
            $table->dropColumn('status_mukim');
        });

        // 2. Simplify biaya table: drop biaya_smp & biaya_ma, rename biaya_pondok → biaya
        Schema::table('biaya', function (Blueprint $table) {
            $table->dropColumn(['biaya_smp', 'biaya_ma']);
            $table->renameColumn('biaya_pondok', 'biaya');
        });

        // 3. Update admin user
        DB::table('users')->where('username', 'admin_spmb')->update([
            'username' => 'admin_psb',
            'nama' => 'Admin PSB',
        ]);

        // 4. Update kontak data
        DB::table('kontak')->where('lembaga', 'SMP NU BP')->delete();
        DB::table('kontak')->where('lembaga', 'MA ALHIKAM')->delete();
        DB::table('kontak')->where('lembaga', 'UMUM')->update([
            'lembaga' => 'PONDOK',
            'nama' => 'Panitia PSB PP Mambaul Huda',
        ]);
    }

    public function down(): void
    {
        // Reverse biaya
        Schema::table('biaya', function (Blueprint $table) {
            $table->renameColumn('biaya', 'biaya_pondok');
            $table->integer('biaya_smp')->default(0);
            $table->integer('biaya_ma')->default(0);
        });

        // Reverse pendaftaran
        Schema::table('pendaftaran', function (Blueprint $table) {
            $table->enum('status_mukim', ['PONDOK PP MAMBAUL HUDA', 'PONDOK SELAIN PP MAMBAUL HUDA', 'TIDAK PONDOK'])->nullable();
        });

        // Reverse admin user
        DB::table('users')->where('username', 'admin_psb')->update([
            'username' => 'admin_spmb',
            'nama' => 'Admin SPMB',
        ]);
    }
};
