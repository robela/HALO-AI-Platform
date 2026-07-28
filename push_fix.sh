#!/bin/bash
# Push changes to GitHub

cd /mnt/c/Code/HALO-AI-Platform

# Configure git to use credential cache temporarily
git config --global credential.helper cache
git config --global credential.cache.daemon.timeout 3600

# Show current status
echo "📌 Current commits:"
git log --oneline -3

echo ""
echo "🚀 Attempting to push to origin develop..."
git push origin develop

echo ""
echo "✅ Push complete!"
echo ""
echo "Cloud Build should trigger automatically. Check:"
echo "https://console.cloud.google.com/cloud-build/builds?project=main-presence-500410-f8"
