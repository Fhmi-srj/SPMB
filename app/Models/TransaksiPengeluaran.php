<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TransaksiPengeluaran extends Model
{
    protected $table = 'transaksi_pengeluaran';
    public $timestamps = false;

    protected $fillable = [
        'invoice', 'tanggal', 'nominal', 'kategori', 'keterangan', 'status',
        'input_by', 'input_at', 'approved_by', 'approved_at', 'catatan_approval',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'input_at' => 'datetime',
        'approved_at' => 'datetime',
    ];

    public function inputByUser()
    {
        return $this->belongsTo(User::class, 'input_by');
    }

    public function approvedByUser()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }
}
