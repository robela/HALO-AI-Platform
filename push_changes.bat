@echo off
setlocal enabledelayedexpansion

cd /d "c:\Code\HALO-AI-Platform"

echo Committing Dockerfile...
git add backend\Dockerfile
git commit -m "fix: use /tmp for SQLite database and increase health check timeout"

echo Pushing to GitHub...
git push origin develop

echo Done!
pause
