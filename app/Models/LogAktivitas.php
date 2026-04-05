<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogAktivitas extends Model
{
    protected $table = 'log_aktivitas';
    public $timestamps = false;

    protected $fillable = ['user_id', 'user_name', 'aksi', 'modul', 'detail'];
}
