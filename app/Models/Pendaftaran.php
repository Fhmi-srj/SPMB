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

    /** Helper to safely transform values to uppercase */
    private function toUpper(?string $value): ?string
    {
        return $value !== null ? strtoupper($value) : null;
    }

    // Accessors for uppercase display
    public function getNamaAttribute($value) { return $this->toUpper($value); }
    public function getAlamatAttribute($value) { return $this->toUpper($value); }
    public function getTempatLahirAttribute($value) { return $this->toUpper($value); }
    public function getAsalSekolahAttribute($value) { return $this->toUpper($value); }
    public function getNamaAyahAttribute($value) { return $this->toUpper($value); }
    public function getNamaIbuAttribute($value) { return $this->toUpper($value); }
    public function getProvinsiAttribute($value) { return $this->toUpper($value); }
    public function getKotaKabAttribute($value) { return $this->toUpper($value); }
    public function getKecamatanAttribute($value) { return $this->toUpper($value); }
    public function getKelurahanDesaAttribute($value) { return $this->toUpper($value); }
    public function getTempatLahirAyahAttribute($value) { return $this->toUpper($value); }
    public function getTempatLahirIbuAttribute($value) { return $this->toUpper($value); }

    // Mutators to save as uppercase
    public function setNamaAttribute($value) { $this->attributes['nama'] = $this->toUpper($value); }
    public function setAlamatAttribute($value) { $this->attributes['alamat'] = $this->toUpper($value); }
    public function setTempatLahirAttribute($value) { $this->attributes['tempat_lahir'] = $this->toUpper($value); }
    public function setAsalSekolahAttribute($value) { $this->attributes['asal_sekolah'] = $this->toUpper($value); }
    public function setNamaAyahAttribute($value) { $this->attributes['nama_ayah'] = $this->toUpper($value); }
    public function setNamaIbuAttribute($value) { $this->attributes['nama_ibu'] = $this->toUpper($value); }
    public function setProvinsiAttribute($value) { $this->attributes['provinsi'] = $this->toUpper($value); }
    public function setKotaKabAttribute($value) { $this->attributes['kota_kab'] = $this->toUpper($value); }
    public function setKecamatanAttribute($value) { $this->attributes['kecamatan'] = $this->toUpper($value); }
    public function setKelurahanDesaAttribute($value) { $this->attributes['kelurahan_desa'] = $this->toUpper($value); }
    public function setTempatLahirAyahAttribute($value) { $this->attributes['tempat_lahir_ayah'] = $this->toUpper($value); }
    public function setTempatLahirIbuAttribute($value) { $this->attributes['tempat_lahir_ibu'] = $this->toUpper($value); }
}
