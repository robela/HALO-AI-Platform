#!/bin/bash
set +e

cd /mnt/c/Code/HALO-AI-Platform

# Create empty commit to trigger rebuild
git config --global core.pager cat
git commit --allow-empty -m "chore: trigger Cloud Build to redeploy backend with CORS fix" 2>&1

# Push to GitHub
echo "Pushing to GitHub..."
git push origin develop 2>&1

echo "Done. Check Cloud Build console for deployment progress."
