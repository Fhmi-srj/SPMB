<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class WilayahController extends Controller
{
    /**
     * Base URL for the public Indonesian region API (emsifa)
     */
    private const BASE_URL = 'https://www.emsifa.com/api-wilayah-indonesia/api';

    /**
     * Cache duration in seconds (24 hours - data wilayah jarang berubah)
     */
    private const CACHE_TTL = 86400;

    /**
     * Handle all wilayah requests via query params:
     *   ?type=provinsi
     *   ?type=kota&id={province_id}
     *   ?type=kecamatan&id={regency_id}
     *   ?type=kelurahan&id={district_id}
     */
    public function index(Request $request)
    {
        $type = $request->query('type');
        $id   = $request->query('id');

        try {
            switch ($type) {
                case 'provinsi':
                    return $this->getProvinsi();

                case 'kota':
                    if (!$id) return response()->json([]);
                    return $this->getKota($id);

                case 'kecamatan':
                    if (!$id) return response()->json([]);
                    return $this->getKecamatan($id);

                case 'kelurahan':
                    if (!$id) return response()->json([]);
                    return $this->getKelurahan($id);

                default:
                    return response()->json([]);
            }
        } catch (\Exception $e) {
            return response()->json([]);
        }
    }

    private function getProvinsi()
    {
        $data = Cache::remember('wilayah_provinsi', self::CACHE_TTL, function () {
            $response = Http::timeout(10)->get(self::BASE_URL . '/provinces.json');
            return $response->successful() ? $response->json() : [];
        });

        return response()->json($data);
    }

    private function getKota($provinsiId)
    {
        $data = Cache::remember("wilayah_kota_{$provinsiId}", self::CACHE_TTL, function () use ($provinsiId) {
            $response = Http::timeout(10)->get(self::BASE_URL . "/regencies/{$provinsiId}.json");
            return $response->successful() ? $response->json() : [];
        });

        return response()->json($data);
    }

    private function getKecamatan($kotaId)
    {
        $data = Cache::remember("wilayah_kecamatan_{$kotaId}", self::CACHE_TTL, function () use ($kotaId) {
            $response = Http::timeout(10)->get(self::BASE_URL . "/districts/{$kotaId}.json");
            return $response->successful() ? $response->json() : [];
        });

        return response()->json($data);
    }

    private function getKelurahan($kecamatanId)
    {
        $data = Cache::remember("wilayah_kelurahan_{$kecamatanId}", self::CACHE_TTL, function () use ($kecamatanId) {
            $response = Http::timeout(10)->get(self::BASE_URL . "/villages/{$kecamatanId}.json");
            return $response->successful() ? $response->json() : [];
        });

        return response()->json($data);
    }
}
