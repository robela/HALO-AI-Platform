#!/bin/bash
cd /mnt/c/Code/HALO-AI-Platform
echo "📤 Attempting git push..."
git push origin develop 2>&1 &
sleep 3
if pgrep -f "git push" > /dev/null; then
    echo "⏳ Push in progress..."
    wait
else
    echo "✅ Push completed"
fi
git log --oneline -1
