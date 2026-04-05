<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PerlengkapanPesanan extends Model
{
    protected $table = 'perlengkapan_pesanan';

    protected $fillable = ['pendaftaran_id', 'perlengkapan_item_id', 'status'];

    protected $casts = [
        'status' => 'boolean',
    ];

    public function pendaftaran()
    {
        return $this->belongsTo(Pendaftaran::class);
    }

    public function item()
    {
        return $this->belongsTo(PerlengkapanItem::class, 'perlengkapan_item_id');
    }
}
