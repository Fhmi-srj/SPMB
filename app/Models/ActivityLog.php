<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    protected $table = 'activity_log';
    public $timestamps = false;

    protected $fillable = ['admin_id', 'action', 'description', 'ip_address', 'created_at'];

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

    public function user()
    {
        return $this->belongsTo(User::class, 'admin_id');
    }
}
