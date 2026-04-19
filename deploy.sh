#!/bin/bash
# =============================================
# Deploy Script - SPMB
# Jalankan di terminal hosting cPanel:
#   cd ~/daftar.mambaulhuda.ponpes.id
#   bash deploy.sh
# =============================================

echo "🚀 Mulai deploy SPMB..."

# Backup config hosting sebelum pull
if [ -f api/config.php ]; then
    cp api/config.php api/config.php.bak
    echo "✅ Backup config.php"
fi

# Pull latest dari GitHub
echo "📥 Pulling dari GitHub..."
git fetch origin
git reset --hard origin/Nurul-Huda
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

# Set permission
find . -type d -exec chmod 0755 {} \;
find . -type f -exec chmod 0644 {} \;
chmod 0755 deploy.sh

echo ""
echo "========================================="
echo "✅ Deploy selesai!"
echo "========================================="
