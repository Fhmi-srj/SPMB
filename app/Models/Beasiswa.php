<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Beasiswa extends Model
{
    protected $table = 'beasiswa';
    public $timestamps = false;
    protected $fillable = ['jenis', 'kategori', 'syarat', 'benefit', 'urutan'];
}
