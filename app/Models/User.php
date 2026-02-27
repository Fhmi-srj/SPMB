<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $table = 'admin';

    protected $fillable = [
        'username', 'password', 'nama', 'role',
    ];

    protected $hidden = ['password'];
}
