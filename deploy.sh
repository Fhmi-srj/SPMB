#!/bin/bash
# ============================================
# SPMB Laravel+React - Deploy Script
# Jalankan di hosting: bash deploy.sh
# ============================================

set -e

echo "🚀 Memulai deployment SPMB..."
echo "================================"

# 1. Pull latest code
echo ""
echo "📥 Pull code terbaru dari Git..."
git pull origin main

# 2. Install/update PHP dependencies
echo ""
echo "📦 Install dependencies PHP (composer)..."
composer install --no-dev --optimize-autoloader --no-interaction

# 3. Run migrations
echo ""
echo "🗄️  Menjalankan migrasi database..."
php artisan migrate --force

# 4. Clear all caches
echo ""
echo "🧹 Membersihkan semua cache..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# 5. Rebuild caches for production
echo ""
echo "⚡ Rebuild cache untuk production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 6. Optimize
echo ""
echo "🔧 Optimasi..."
php artisan optimize

# 7. Storage link (jika belum ada)
if [ ! -L "public/storage" ]; then
    echo ""
    echo "🔗 Membuat storage symlink..."
    php artisan storage:link
fi

echo ""
echo "================================"
echo "✅ Deployment selesai!"
echo "================================"
