@echo off
cd /d "c:\Code\HALO-AI-Platform"

echo === GIT STATUS ===
git log --oneline -3

echo.
echo === Checking for unpushed commits ===
git diff --quiet origin/develop HEAD || echo "Changes to push found"

echo.
echo === Testing backend health ===
curl -s -m 5 "https://halo-backend-main-presence-500410-f8.us-central1.run.app/health" || echo "Backend not responding"

echo.
echo === Attempting git push ===
git push origin develop 2>&1 | findstr /R "^" | head -20

echo DONE
pause
