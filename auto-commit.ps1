# Auto-commit and push script
Write-Host "Checking git status..." -ForegroundColor Cyan
git status

Write-Host "`nAdding all changes..." -ForegroundColor Cyan
git add .

Write-Host "`nCreating commit..." -ForegroundColor Cyan
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Auto-commit: Dashboard updates on $timestamp"

Write-Host "`nPushing to remote..." -ForegroundColor Cyan
git push

Write-Host "`nDone!" -ForegroundColor Green
