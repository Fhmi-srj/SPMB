<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transaksi_pemasukan', function (Blueprint $table) {
            if (!Schema::hasColumn('transaksi_pemasukan', 'input_by')) {
                $table->unsignedBigInteger('input_by')->nullable()->after('status');
                $table->dateTime('input_at')->nullable()->after('input_by');
                $table->unsignedBigInteger('approved_by')->nullable()->after('input_at');
                $table->dateTime('approved_at')->nullable()->after('approved_by');
                $table->text('catatan_approval')->nullable()->after('approved_at');
            }
        });

        Schema::table('transaksi_pengeluaran', function (Blueprint $table) {
            if (!Schema::hasColumn('transaksi_pengeluaran', 'input_by')) {
                $table->unsignedBigInteger('input_by')->nullable()->after('status');
                $table->dateTime('input_at')->nullable()->after('input_by');
                $table->unsignedBigInteger('approved_by')->nullable()->after('input_at');
                $table->dateTime('approved_at')->nullable()->after('approved_by');
                $table->text('catatan_approval')->nullable()->after('approved_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('transaksi_pemasukan', function (Blueprint $table) {
            $table->dropColumn(['input_by', 'input_at', 'approved_by', 'approved_at', 'catatan_approval']);
        });

        Schema::table('transaksi_pengeluaran', function (Blueprint $table) {
            $table->dropColumn(['input_by', 'input_at', 'approved_by', 'approved_at', 'catatan_approval']);
        });
    }
};
