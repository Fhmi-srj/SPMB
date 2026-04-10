<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransaksiPemasukan extends Model
{
    protected $table = 'transaksi_pemasukan';
    public $timestamps = false;

    protected $fillable = [
        'invoice', 'pendaftaran_id', 'tanggal', 'nominal',
        'jenis_pembayaran', 'keterangan', 'status',
        'input_by', 'input_at', 'approved_by', 'approved_at', 'catatan_approval',
        'created_at',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'input_at' => 'datetime',
        'approved_at' => 'datetime',
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

    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class);
    }

    public function inputByUser()
    {
        return $this->belongsTo(User::class, 'input_by');
    }

    public function approvedByUser()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
