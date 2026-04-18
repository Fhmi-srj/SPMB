<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Biaya extends Model
{
    protected $table = 'biaya';
    public $timestamps = false;
    protected $fillable = ['kategori', 'nama_item', 'biaya', 'urutan'];
}
