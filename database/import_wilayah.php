<?php
/**
 * Fast import of Indonesian wilayah data using multi-curl parallel downloads.
 * 
 * Run: php database/import_wilayah.php
 * Expected time: ~15-20 minutes (vs hours with sequential approach)
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);
set_time_limit(0);
ini_set('memory_limit', '512M');

$host = 'localhost';
$user = 'root';
$pass = '';
$dbname = 'spmb_db';

$conn = new mysqli($host, $user, $pass, $dbname);
if ($conn->connect_error) die("DB Connection failed: " . $conn->connect_error . "\n");
$conn->set_charset("utf8mb4");

$baseUrl = 'https://raw.githubusercontent.com/emsifa/api-wilayah-indonesia/master/static/api';

/**
 * Fetch multiple URLs in parallel using multi-curl
 * @param array $urls ['key' => 'url', ...]
 * @return array ['key' => decoded_json, ...]
 */
function fetchMulti($urls, $concurrency = 20) {
    $results = [];
    $handles = [];
    $mh = curl_multi_init();
    
    $keys = array_keys($urls);
    $pending = [];
    $pos = 0;
    
    // Add initial batch
    while ($pos < min($concurrency, count($keys))) {
        $key = $keys[$pos];
        $ch = curl_init();
        curl_setopt_array($ch, [
            CURLOPT_URL => $urls[$key],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_USERAGENT => 'SPMB-Import/1.0',
        ]);
        curl_multi_add_handle($mh, $ch);
        $pending[(int)$ch] = $key;
        $pos++;
    }
    
    // Process
    do {
        $status = curl_multi_exec($mh, $active);
        
        while ($info = curl_multi_info_read($mh)) {
            $ch = $info['handle'];
            $key = $pending[(int)$ch];
            $response = curl_multi_getcontent($ch);
            $results[$key] = json_decode($response, true);
            
            curl_multi_remove_handle($mh, $ch);
            curl_close($ch);
            unset($pending[(int)$ch]);
            
            // Add next URL if available
            if ($pos < count($keys)) {
                $nextKey = $keys[$pos];
                $ch2 = curl_init();
                curl_setopt_array($ch2, [
                    CURLOPT_URL => $urls[$nextKey],
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_TIMEOUT => 30,
                    CURLOPT_SSL_VERIFYPEER => false,
                    CURLOPT_FOLLOWLOCATION => true,
                    CURLOPT_USERAGENT => 'SPMB-Import/1.0',
                ]);
                curl_multi_add_handle($mh, $ch2);
                $pending[(int)$ch2] = $nextKey;
                $pos++;
            }
        }
        
        if ($active) curl_multi_select($mh, 1);
    } while ($active || !empty($pending));
    
    curl_multi_close($mh);
    return $results;
}

function fetchJson($url) {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_FOLLOWLOCATION => true,
    ]);
    $response = curl_exec($ch);
    curl_close($ch);
    return json_decode($response, true);
}

// Create table
echo "Creating wilayah table...\n";
$conn->query("DROP TABLE IF EXISTS wilayah");
$conn->query("
    CREATE TABLE wilayah (
        id VARCHAR(15) PRIMARY KEY,
        nama VARCHAR(100) NOT NULL,
        id_provinsi VARCHAR(2) NOT NULL,
        nama_provinsi VARCHAR(100) NOT NULL,
        id_kota VARCHAR(4) NOT NULL,
        nama_kota VARCHAR(100) NOT NULL,
        id_kecamatan VARCHAR(7) NOT NULL,
        nama_kecamatan VARCHAR(100) NOT NULL,
        INDEX idx_nama (nama),
        INDEX idx_kecamatan (nama_kecamatan),
        INDEX idx_kota (nama_kota)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
");

// Step 1: Fetch provinces
echo "Fetching provinces...\n";
$provinces = fetchJson("$baseUrl/provinces.json");
if (!$provinces) die("Failed to fetch provinces!\n");
$provMap = [];
foreach ($provinces as $p) $provMap[$p['id']] = $p['name'];
echo "Found " . count($provinces) . " provinces\n\n";

// Step 2: Fetch all regencies in parallel
echo "Fetching all regencies (parallel)...\n";
$regUrls = [];
foreach ($provinces as $p) {
    $regUrls[$p['id']] = "$baseUrl/regencies/{$p['id']}.json";
}
$allRegencies = fetchMulti($regUrls);
$regMap = []; // reg_id => ['name', 'prov_id']
foreach ($allRegencies as $provId => $regs) {
    if (!is_array($regs)) continue;
    foreach ($regs as $r) {
        $regMap[$r['id']] = ['name' => $r['name'], 'prov_id' => $provId];
    }
}
echo "Found " . count($regMap) . " regencies\n\n";

// Step 3: Fetch all districts in parallel
echo "Fetching all districts (parallel)...\n";
$distUrls = [];
foreach ($regMap as $regId => $reg) {
    $distUrls[$regId] = "$baseUrl/districts/{$regId}.json";
}
$allDistricts = fetchMulti($distUrls, 30);
$distMap = []; // dist_id => ['name', 'reg_id']
foreach ($allDistricts as $regId => $dists) {
    if (!is_array($dists)) continue;
    foreach ($dists as $d) {
        $distMap[$d['id']] = ['name' => $d['name'], 'reg_id' => $regId];
    }
}
echo "Found " . count($distMap) . " districts\n\n";

// Step 4: Fetch all villages in parallel (this is the big one ~7000 requests)
echo "Fetching all villages (parallel, ~7000 requests)...\n";
$vilUrls = [];
foreach ($distMap as $distId => $dist) {
    $vilUrls[$distId] = "$baseUrl/villages/{$distId}.json";
}

// Process in chunks to avoid memory issues
$vilUrlChunks = array_chunk($vilUrls, 500, true);
$totalVillages = 0;

$chunkNum = 0;
foreach ($vilUrlChunks as $chunk) {
    $chunkNum++;
    echo "  Chunk $chunkNum/" . count($vilUrlChunks) . " (" . count($chunk) . " districts)... ";
    
    $villageData = fetchMulti($chunk, 30);
    $chunkVillages = 0;
    $batch = [];
    
    foreach ($villageData as $distId => $villages) {
        if (!is_array($villages)) continue;
        
        $dist = $distMap[$distId] ?? null;
        if (!$dist) continue;
        $reg = $regMap[$dist['reg_id']] ?? null;
        if (!$reg) continue;
        $provId = $reg['prov_id'];
        $provName = $provMap[$provId] ?? '';
        $regId = $dist['reg_id'];
        
        foreach ($villages as $vil) {
            $batch[] = sprintf("('%s','%s','%s','%s','%s','%s','%s','%s')",
                $conn->real_escape_string($vil['id']),
                $conn->real_escape_string($vil['name']),
                $conn->real_escape_string($provId),
                $conn->real_escape_string($provName),
                $conn->real_escape_string($regId),
                $conn->real_escape_string($reg['name']),
                $conn->real_escape_string($distId),
                $conn->real_escape_string($dist['name'])
            );
            $chunkVillages++;
            $totalVillages++;
            
            // Insert in batches of 500
            if (count($batch) >= 500) {
                $sql = "INSERT INTO wilayah (id, nama, id_provinsi, nama_provinsi, id_kota, nama_kota, id_kecamatan, nama_kecamatan) VALUES\n" . implode(",\n", $batch);
                if (!$conn->query($sql)) {
                    echo "INSERT ERROR: " . $conn->error . "\n";
                }
                $batch = [];
            }
        }
    }
    
    // Insert remaining
    if (!empty($batch)) {
        $sql = "INSERT INTO wilayah (id, nama, id_provinsi, nama_provinsi, id_kota, nama_kota, id_kecamatan, nama_kecamatan) VALUES\n" . implode(",\n", $batch);
        if (!$conn->query($sql)) {
            echo "INSERT ERROR: " . $conn->error . "\n";
        }
    }
    
    echo "$chunkVillages villages [total: $totalVillages]\n";
}

echo "\nAdding FULLTEXT index...\n";
$conn->query("ALTER TABLE wilayah ADD FULLTEXT idx_search (nama, nama_kecamatan, nama_kota, nama_provinsi)");

echo "\nImport complete! Total: $totalVillages villages\n";

// Generate SQL dump
echo "\nGenerating SQL dump for hosting...\n";
$result = $conn->query("SELECT * FROM wilayah");
$sqlFile = __DIR__ . '/wilayah_data.sql';
$f = fopen($sqlFile, 'w');

fwrite($f, "-- Wilayah Indonesia - $totalVillages villages\n");
fwrite($f, "-- Generated: " . date('Y-m-d H:i:s') . "\n\n");
fwrite($f, "DROP TABLE IF EXISTS wilayah;\n");
fwrite($f, "CREATE TABLE wilayah (
    id VARCHAR(15) PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    id_provinsi VARCHAR(2) NOT NULL,
    nama_provinsi VARCHAR(100) NOT NULL,
    id_kota VARCHAR(4) NOT NULL,
    nama_kota VARCHAR(100) NOT NULL,
    id_kecamatan VARCHAR(7) NOT NULL,
    nama_kecamatan VARCHAR(100) NOT NULL,
    INDEX idx_nama (nama),
    INDEX idx_kecamatan (nama_kecamatan),
    INDEX idx_kota (nama_kota),
    FULLTEXT idx_search (nama, nama_kecamatan, nama_kota, nama_provinsi)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;\n\n");

$batch = [];
while ($row = $result->fetch_assoc()) {
    $vals = sprintf("('%s','%s','%s','%s','%s','%s','%s','%s')",
        $conn->real_escape_string($row['id']),
        $conn->real_escape_string($row['nama']),
        $conn->real_escape_string($row['id_provinsi']),
        $conn->real_escape_string($row['nama_provinsi']),
        $conn->real_escape_string($row['id_kota']),
        $conn->real_escape_string($row['nama_kota']),
        $conn->real_escape_string($row['id_kecamatan']),
        $conn->real_escape_string($row['nama_kecamatan'])
    );
    $batch[] = $vals;
    if (count($batch) >= 500) {
        fwrite($f, "INSERT INTO wilayah (id, nama, id_provinsi, nama_provinsi, id_kota, nama_kota, id_kecamatan, nama_kecamatan) VALUES\n" . implode(",\n", $batch) . ";\n\n");
        $batch = [];
    }
}
if (!empty($batch)) {
    fwrite($f, "INSERT INTO wilayah (id, nama, id_provinsi, nama_provinsi, id_kota, nama_kota, id_kecamatan, nama_kecamatan) VALUES\n" . implode(",\n", $batch) . ";\n\n");
}
fclose($f);

$fileSize = round(filesize($sqlFile) / 1024 / 1024, 1);
echo "SQL dump: $sqlFile ({$fileSize}MB)\n";
$conn->close();
echo "All done!\n";
?>
