<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PerlengkapanItem extends Model
{
    protected $table = 'perlengkapan_items';
    public $timestamps = false;

    protected $fillable = ['nama_item', 'nominal', 'urutan', 'aktif'];

    protected $casts = [
        'aktif' => 'boolean',
    ];

    public function pesanan()
    {
        return $this->hasMany(PerlengkapanPesanan::class);
    }
}
