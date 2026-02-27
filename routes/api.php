<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PendaftaranController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ActivityLogController;
use App\Http\Controllers\Api\BeasiswaController;
use App\Http\Controllers\Api\BiayaController;
use App\Http\Controllers\Api\KontakController;
use App\Http\Controllers\Api\PengaturanController;
use App\Http\Controllers\Api\TransaksiController;
use App\Http\Controllers\Api\PerlengkapanController;
use App\Http\Controllers\Api\PosKeuanganController;
use App\Http\Controllers\Api\UserManagementController;
use App\Http\Controllers\Api\ProfilController;
use App\Http\Controllers\Api\UserPortalController;
use App\Http\Controllers\Api\PasswordResetController;

// =============================================
// Public Routes (tanpa auth)
// =============================================
Route::post('auth/login', [AuthController::class, 'login']);

// Pengaturan publik (untuk landing page)
Route::get('pengaturan/public', [PengaturanController::class, 'publicSettings']);

// Beasiswa & Biaya (read-only publik)
Route::get('beasiswa', [BeasiswaController::class, 'index']);
Route::get('biaya', [BiayaController::class, 'index']);
Route::get('kontak', [KontakController::class, 'index']);

// Pendaftaran publik
Route::post('pendaftaran', [PendaftaranController::class, 'store']);
Route::post('pendaftaran/cek-status', [PendaftaranController::class, 'cekStatus']);

// User Portal (pendaftar) - Public
Route::post('user/login', [UserPortalController::class, 'login']);
Route::post('user/forgot-password', [PasswordResetController::class, 'requestReset']);
Route::get('user/validate-token', [PasswordResetController::class, 'validateToken']);
Route::post('user/reset-password', [PasswordResetController::class, 'resetPassword']);

// User Portal - Protected (simple auth via user_id)
Route::post('user/dashboard', [UserPortalController::class, 'dashboard']);
Route::post('user/update-field', [UserPortalController::class, 'updateField']);
Route::post('user/upload-file', [UserPortalController::class, 'uploadFile']);
Route::post('user/change-password', [UserPortalController::class, 'changePassword']);
Route::get('user/tagihan', [UserPortalController::class, 'getTagihan']);

// =============================================
// Protected Routes (auth:sanctum - Admin)
// =============================================
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/me', [AuthController::class, 'me']);
    Route::post('auth/change-password', [AuthController::class, 'changePassword']);

    // Dashboard
    Route::get('dashboard/statistics', [DashboardController::class, 'statistics']);
    Route::get('dashboard/recent-activity', [DashboardController::class, 'recentActivity']);

    // Pendaftaran (admin CRUD)
    Route::get('pendaftaran', [PendaftaranController::class, 'index']);
    Route::get('pendaftaran/{id}', [PendaftaranController::class, 'show']);
    Route::put('pendaftaran/{id}', [PendaftaranController::class, 'update']);
    Route::delete('pendaftaran/{id}', [PendaftaranController::class, 'destroy']);
    Route::post('pendaftaran/{id}/upload-dokumen', [PendaftaranController::class, 'uploadDokumen']);
    Route::get('pendaftaran/export/excel', [PendaftaranController::class, 'exportExcel']);
    Route::post('pendaftaran/{id}/notify-berkas', [PendaftaranController::class, 'notifyBerkas']);
    Route::post('pendaftaran/{id}/notify-welcome', [PendaftaranController::class, 'notifyWelcome']);

    // Beasiswa CRUD
    Route::post('beasiswa', [BeasiswaController::class, 'store']);
    Route::put('beasiswa/{id}', [BeasiswaController::class, 'update']);
    Route::delete('beasiswa/{id}', [BeasiswaController::class, 'destroy']);

    // Biaya CRUD
    Route::post('biaya', [BiayaController::class, 'store']);
    Route::put('biaya/{id}', [BiayaController::class, 'update']);
    Route::delete('biaya/{id}', [BiayaController::class, 'destroy']);

    // Kontak CRUD
    Route::post('kontak', [KontakController::class, 'store']);
    Route::put('kontak/{id}', [KontakController::class, 'update']);
    Route::delete('kontak/{id}', [KontakController::class, 'destroy']);

    // Pengaturan
    Route::get('pengaturan', [PengaturanController::class, 'index']);
    Route::put('pengaturan/{key}', [PengaturanController::class, 'update']);
    Route::post('pengaturan/bulk', [PengaturanController::class, 'updateBulk']);

    // Activity Log
    Route::get('activity-log', [ActivityLogController::class, 'index']);

    // ─── NEW: Transaksi ──────────────────────────────────────
    Route::get('transaksi/pemasukan', [TransaksiController::class, 'indexPemasukan']);
    Route::post('transaksi/pemasukan', [TransaksiController::class, 'storePemasukan']);
    Route::put('transaksi/pemasukan/{id}', [TransaksiController::class, 'updatePemasukan']);
    Route::delete('transaksi/pemasukan/{id}', [TransaksiController::class, 'destroyPemasukan']);
    Route::post('transaksi/pemasukan/{id}/approve', [TransaksiController::class, 'approvePemasukan']);
    Route::post('transaksi/pemasukan/{id}/reject', [TransaksiController::class, 'rejectPemasukan']);

    Route::get('transaksi/pengeluaran', [TransaksiController::class, 'indexPengeluaran']);
    Route::post('transaksi/pengeluaran', [TransaksiController::class, 'storePengeluaran']);
    Route::put('transaksi/pengeluaran/{id}', [TransaksiController::class, 'updatePengeluaran']);
    Route::delete('transaksi/pengeluaran/{id}', [TransaksiController::class, 'destroyPengeluaran']);
    Route::post('transaksi/pengeluaran/{id}/approve', [TransaksiController::class, 'approvePengeluaran']);
    Route::post('transaksi/pengeluaran/{id}/reject', [TransaksiController::class, 'rejectPengeluaran']);

    Route::get('transaksi/search-peserta', [TransaksiController::class, 'searchPeserta']);
    Route::get('transaksi/log-aktivitas', [TransaksiController::class, 'logAktivitas']);

    // ─── NEW: Perlengkapan ───────────────────────────────────
    Route::get('perlengkapan/items', [PerlengkapanController::class, 'indexItems']);
    Route::post('perlengkapan/items', [PerlengkapanController::class, 'storeItem']);
    Route::put('perlengkapan/items/{id}', [PerlengkapanController::class, 'updateItem']);
    Route::delete('perlengkapan/items/{id}', [PerlengkapanController::class, 'destroyItem']);
    Route::get('perlengkapan/pesanan', [PerlengkapanController::class, 'indexPesanan']);
    Route::post('perlengkapan/toggle', [PerlengkapanController::class, 'togglePesanan']);

    // ─── NEW: Pos Keuangan ───────────────────────────────────
    Route::get('pos-keuangan', [PosKeuanganController::class, 'index']);

    // ─── NEW: User Management (super_admin only) ─────────────
    Route::get('users', [UserManagementController::class, 'index']);
    Route::post('users', [UserManagementController::class, 'store']);
    Route::put('users/{id}', [UserManagementController::class, 'update']);
    Route::post('users/{id}/reset-password', [UserManagementController::class, 'resetPassword']);
    Route::delete('users/{id}', [UserManagementController::class, 'destroy']);

    // ─── NEW: Profil ─────────────────────────────────────────
    Route::get('profil', [ProfilController::class, 'show']);
    Route::put('profil', [ProfilController::class, 'updateProfile']);
    Route::post('profil/password', [ProfilController::class, 'updatePassword']);
});
