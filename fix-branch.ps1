cd "c:\Code\HALO-AI-Platform"

Write-Host "Current branch status:"
git status

Write-Host "`nResetting to commit 62fe7f8..."
git reset --hard 62fe7f8

Write-Host "`nForce pushing to GitHub..."
git push origin develop --force

Write-Host "`nVerifying:"
git log --oneline develop -3
