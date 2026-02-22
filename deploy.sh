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
git reset --hard origin/main
echo "✅ Pull selesai"

# Restore config hosting
if [ -f api/config.php.bak ]; then
    cp api/config.php.bak api/config.php
    rm api/config.php.bak
    echo "✅ Config.php hosting di-restore"
fi

# Set permission
find . -type d -exec chmod 0755 {} \;
find . -type f -exec chmod 0644 {} \;
chmod 0755 deploy.sh

echo ""
echo "========================================="
echo "✅ Deploy selesai!"
echo "========================================="
