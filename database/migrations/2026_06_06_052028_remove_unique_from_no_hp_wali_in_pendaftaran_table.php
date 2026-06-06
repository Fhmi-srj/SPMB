<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        try {
            Schema::table('pendaftaran', function (Blueprint $table) {
                $table->dropUnique('pendaftaran_no_hp_wali_unique');
            });
        } catch (\Exception $e) {
            try {
                Schema::table('pendaftaran', function (Blueprint $table) {
                    $table->dropUnique('unique_phone');
                });
            } catch (\Exception $ex) {
                // Silently fail if both fail
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pendaftaran', function (Blueprint $table) {
            $table->unique('no_hp_wali', 'pendaftaran_no_hp_wali_unique');
        });
    }
};
