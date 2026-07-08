<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\PendaftaranController;

Route::get('/admin/pendaftaran/print-kartu', [PendaftaranController::class, 'printKartu']);

// Catch-all: semua request diteruskan ke React SPA
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
