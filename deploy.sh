#!/bin/bash
# ==============================================================================
# Deploy Script - SPMB (Laravel 11 + React)
# Optimized for cPanel/Shared Hosting with Local Build Workflow
#
# Instructions:
# 1. Ensure you have run 'npm run build' locally before pushing to GitHub.
# 2. Run this script in your server terminal:
#    bash deploy.sh
# ==============================================================================

echo "🚀 Starting Deployment for SPMB..."

# 1. Pull the latest code from GitHub
echo "📥 Pulling latest changes from GitHub (branch: Nurul-Huda)..."
git fetch origin
git reset --hard origin/Nurul-Huda
echo "✅ Pull complete."

# 2. Install PHP Dependencies
echo "📦 Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader
echo "✅ Composer dependencies installed."


# 3. Clear/Setup Caches
echo "⚡ Optimizing Laravel..."
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan optimize
echo "✅ Laravel optimized."

# 4. Set Permissions
echo "🔐 Setting permissions..."
# cPanel standard: 755 for directories, 644 for files
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;

# Ensure storage and bootstrap/cache are writable
chmod -R 775 storage
chmod -R 775 bootstrap/cache
echo "✅ Permissions set."

# 5. Check for Storage Link
if [ ! -L public/storage ]; then
    echo "🔗 Creating storage link..."
    php artisan storage:link
    echo "✅ Storage link created."
fi

echo ""
echo "========================================="
echo "✅ Deployment Successful!"
echo "========================================="
echo "URL: https://psb.nurulhudaannajah.com"
