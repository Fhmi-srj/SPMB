<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kontak extends Model
{
    protected $table = 'kontak';
    public $timestamps = false;
    protected $fillable = ['lembaga', 'nama', 'no_whatsapp', 'link_wa'];
}
