@echo off
REM Quick Deploy Script for Windows PowerShell
REM This will deploy the CORS/COOP fixes to Cloud Run

cd c:\Code\HALO-AI-Platform

echo.
echo ================================================================================
echo   🚀 Deploying HALO Backend with CORS/COOP Fixes
echo ================================================================================
echo.
echo Project: main-presence-500410-f8
echo Region: us-central1
echo Service: halo-backend
echo.

gcloud run deploy halo-backend ^
    --source . ^
    --project main-presence-500410-f8 ^
    --region us-central1 ^
    --allow-unauthenticated ^
    --platform managed ^
    --memory 2Gi ^
    --cpu 2 ^
    --timeout 300 ^
    --max-instances 100

echo.
echo ================================================================================
echo   ✅ Deployment submitted!
echo ================================================================================
echo.
echo Waiting for build and deployment (4-5 minutes)...
echo.
pause
