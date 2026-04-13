<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pendaftaran extends Model
{
    protected $table = 'pendaftaran';
    const UPDATED_AT = null; // Table only has created_at, no updated_at column

    protected $fillable = [
        'no_registrasi', 'nama', 'lembaga', 'nisn', 'tempat_lahir', 'tanggal_lahir',
        'jenis_kelamin', 'jumlah_saudara', 'no_kk', 'nik', 'alamat', 'provinsi',
        'kota_kab', 'kecamatan', 'kelurahan_desa', 'asal_sekolah', 'prestasi',
        'tingkat_prestasi', 'juara', 'file_sertifikat', 'pip_pkh', 'status_mukim',
        'sumber_info', 'nama_ayah', 'tempat_lahir_ayah', 'tanggal_lahir_ayah',
        'nik_ayah', 'pekerjaan_ayah', 'penghasilan_ayah', 'nama_ibu',
        'tempat_lahir_ibu', 'tanggal_lahir_ibu', 'nik_ibu', 'pekerjaan_ibu',
        'penghasilan_ibu', 'no_hp_wali', 'password', 'reset_token',
        'reset_token_expires', 'file_kk', 'file_ktp_ortu', 'file_akta',
        'file_ijazah', 'status', 'catatan_admin', 'catatan_updated_at',
    ];

    protected $hidden = ['password', 'reset_token'];

    protected $casts = [
        'tanggal_lahir' => 'date',
        'tanggal_lahir_ayah' => 'date',
        'tanggal_lahir_ibu' => 'date',
        'reset_token_expires' => 'datetime',
        'catatan_updated_at' => 'datetime',
    ];
}
