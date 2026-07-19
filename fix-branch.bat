@echo off
cd /d c:\Code\HALO-AI-Platform
echo Fixing develop branch... > fix-output.txt
echo. >> fix-output.txt
echo ===== Current Status ===== >> fix-output.txt
git status >> fix-output.txt 2>&1
echo. >> fix-output.txt
echo ===== Last 5 Commits ===== >> fix-output.txt
git log --oneline develop -5 >> fix-output.txt 2>&1
echo. >> fix-output.txt
echo ===== Resetting to 62fe7f8 ===== >> fix-output.txt
git reset --hard 62fe7f8 >> fix-output.txt 2>&1
echo. >> fix-output.txt
echo ===== Verifying Reset ===== >> fix-output.txt
git log --oneline develop -5 >> fix-output.txt 2>&1
echo. >> fix-output.txt
echo ===== Force Pushing ===== >> fix-output.txt
git push origin develop --force >> fix-output.txt 2>&1
echo. >> fix-output.txt
echo DONE >> fix-output.txt
type fix-output.txt
