<?php

use Illuminate\Support\Facades\Route;

// Catch-all: semua request diteruskan ke React SPA
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');
