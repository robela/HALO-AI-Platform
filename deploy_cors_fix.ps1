#!/usr/bin/env pwsh
# Deploy HALO Backend with CORS and COOP fixes
# Run from PowerShell or PowerShell Core

$PROJECT_ID = "main-presence-500410-f8"
$SERVICE_NAME = "halo-backend"
$REGION = "us-central1"

Write-Host "🚀 Deploying $SERVICE_NAME with CORS/COOP fixes..." -ForegroundColor Cyan
Write-Host "Project: $PROJECT_ID"
Write-Host "Region: $REGION"
Write-Host ""

# Step 1: Commit changes
Write-Host "📝 Step 1: Committing backend changes..." -ForegroundColor Yellow
try {
    git add backend/
    git commit -m "fix: add CORS and COOP headers for Google OAuth cross-origin requests"
    git push origin develop
    Write-Host "✓ Changes pushed to GitHub" -ForegroundColor Green
} catch {
    Write-Host "Note: $($_.Exception.Message)" -ForegroundColor Gray
}

# Step 2: Deploy to Cloud Run
Write-Host ""
Write-Host "🔧 Step 2: Deploying to Cloud Run..." -ForegroundColor Yellow

gcloud run deploy $SERVICE_NAME `
    --source . `
    --project $PROJECT_ID `
    --region $REGION `
    --allow-unauthenticated `
    --platform managed `
    --memory 2Gi `
    --cpu 2 `
    --timeout 300 `
    --max-instances 100

# Step 3: Get the service URL
Write-Host ""
Write-Host "✅ Step 3: Getting service URL..." -ForegroundColor Green

$SERVICE_URL = gcloud run services describe $SERVICE_NAME `
    --project $PROJECT_ID `
    --region $REGION `
    --format='value(status.url)'

Write-Host ""
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "Backend URL: $SERVICE_URL"
Write-Host ""
Write-Host "📋 Verify the fix:" -ForegroundColor Cyan
Write-Host "1. Open DevTools (F12) → Network tab"
Write-Host "2. Make a request to: $SERVICE_URL/health"
Write-Host "3. Check response headers for:"
Write-Host "   ✓ Access-Control-Allow-Origin: *"
Write-Host "   ✓ Cross-Origin-Opener-Policy: same-origin-allow-popups"
Write-Host "   ✓ Cross-Origin-Embedder-Policy: require-corp"
