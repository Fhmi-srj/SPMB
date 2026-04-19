<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::table('pengaturan')->insertOrIgnore([
            [
                'kunci' => 'wa_otomatis',
                'nilai' => '1',
                'keterangan' => 'Status layanan WhatsApp otomatis (MPWA). 1: Aktif, 0: Nonaktif.'
            ]
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::table('pengaturan')->where('kunci', 'wa_otomatis')->delete();
    }
};
