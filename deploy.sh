#!/bin/bash
# =============================================
# Deploy Script - SPMB
# Jalankan di terminal hosting cPanel:
#   cd ~/daftar.mambaulhuda.ponpes.id
#   bash deploy.sh
# =============================================

echo "=========================================="
echo "🚀 MEMULAI DEPLOYMENT SPMB"
echo "=========================================="

# Backup config hosting sebelum pull
if [ -f api/config.php ]; then
    cp api/config.php api/config.php.bak
    echo "✅ Backup config.php"
fi

echo "📥 1. Menarik pembaruan terbaru dari GitHub..."
git fetch origin
git reset --hard origin/main
echo "✅ Pull selesai"

# Restore config hosting
if [ -f api/config.php.bak ]; then
    cp api/config.php.bak api/config.php
    rm api/config.php.bak
    echo "✅ Config.php hosting di-restore"
    
    # Ensure functions.php is included in hosting config
    if ! grep -q "functions.php" api/config.php; then
        # Add require_once before the closing ?>
        sed -i 's|?>|// Load shared functions (auth, CSRF, helpers, RBAC)\nrequire_once __DIR__ . "/functions.php";\n?>|' api/config.php
        echo "✅ functions.php di-inject ke config hosting"
    fi
fi

echo "📦 2. Menginstall dependensi PHP (Composer)..."
composer install --no-interaction --prefer-dist --optimize-autoloader

echo "📦 3. Menginstall dependensi Node.js (NPM)..."
npm install

echo "🛠️ 4. Membangun aset frontend (Vite)..."
npm run build

echo "🗄️ 5. Menjalankan migrasi database..."
php artisan migrate --force

echo "🧹 6. Membersihkan dan memperbarui cache aplikasi..."
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "🔒 7. Mengatur hak akses file..."
find . -type d -exec chmod 0755 {} \;
find . -type f -exec chmod 0644 {} \;
chmod 0755 deploy.sh

echo "=========================================="
echo "✅ DEPLOYMENT SELESAI DENGAN SUKSES!"
echo "=========================================="

