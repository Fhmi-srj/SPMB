<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengaturan extends Model
{
    protected $table = 'pengaturan';
    public $timestamps = false;
    protected $primaryKey = 'kunci';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['kunci', 'nilai', 'keterangan'];
}
