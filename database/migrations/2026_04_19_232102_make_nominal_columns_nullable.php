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
        // Make 'biaya' optional in 'biaya' table
        Schema::table('biaya', function (Blueprint $table) {
            $table->integer('biaya')->nullable()->change();
        });

        // Make 'nominal' optional in 'perlengkapan_items' table
        Schema::table('perlengkapan_items', function (Blueprint $table) {
            $table->integer('nominal')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('biaya', function (Blueprint $table) {
            $table->integer('biaya')->nullable(false)->change();
        });

        Schema::table('perlengkapan_items', function (Blueprint $table) {
            $table->integer('nominal')->nullable(false)->change();
        });
    }
};
