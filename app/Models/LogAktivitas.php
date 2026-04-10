<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class LogAktivitas extends Model
{
    protected $table = 'log_aktivitas';
    public $timestamps = false;

    protected $fillable = ['user_id', 'user_name', 'aksi', 'modul', 'detail', 'created_at'];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    // Auto-fill created_at since timestamps = false
    protected static function booted()
    {
        static::creating(function ($model) {
            if (!$model->created_at) {
                $model->created_at = now();
            }
        });
    }
}
