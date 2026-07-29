# 🚀 CORS/COOP Fix - Deployment Checklist

## Backend Changes Made ✓
- [x] Modified `backend/app/factory.py` - Added CORS and COOP headers
- [x] Modified `backend/app/config.py` - Added ALLOWED_ORIGINS config
- [x] Updated `backend/.env.example` - Documented configuration
- [x] Created `CORS_AND_OAUTH_TROUBLESHOOTING.md` - Complete guide

## Deployment Steps

### Option 1: Automated Deployment (Recommended)

**On Windows/PowerShell:**
```powershell
cd c:\Code\HALO-AI-Platform
pwsh .\deploy_cors_fix.ps1
```

**On Linux/macOS/WSL:**
```bash
cd /mnt/c/Code/HALO-AI-Platform
bash deploy_cors_fix.sh
```

### Option 2: Manual Deployment

**Step 1: Commit changes**
```bash
cd c:/Code/HALO-AI-Platform  # or c:\Code\HALO-AI-Platform on Windows
git add backend/
git commit -m "fix: add CORS and COOP headers for Google OAuth cross-origin requests"
git push origin develop
```

**Step 2: Deploy to Cloud Run**
```bash
gcloud run deploy halo-backend \
    --source . \
    --project main-presence-500410-f8 \
    --region us-central1 \
    --allow-unauthenticated \
    --platform managed \
    --memory 2Gi \
    --cpu 2 \
    --timeout 300 \
    --max-instances 100
```

**Step 3: Verify deployment**
```bash
# Check service status
gcloud run services describe halo-backend \
    --project main-presence-500410-f8 \
    --region us-central1

# Get the service URL
gcloud run services describe halo-backend \
    --project main-presence-500410-f8 \
    --region us-central1 \
    --format='value(status.url)'
```

## Verification Steps

After deployment, verify the CORS/COOP headers are working:

### 1. Browser DevTools Check
1. Open your frontend: `https://halo-africa-site-397980615504.us-central1.run.app`
2. Press `F12` to open DevTools
3. Go to **Network** tab
4. Click **"Sign in with Google"** button
5. Look for the POST request to `/auth/google`
6. Click on that request and go to **Response Headers**
7. Verify these headers are present:
   - ✓ `access-control-allow-origin: *`
   - ✓ `cross-origin-opener-policy: same-origin-allow-popups`
   - ✓ `cross-origin-embedder-policy: require-corp`

### 2. Command Line Check
```bash
# Test health endpoint
BACKEND_URL="https://halo-backend-main-presence-500410-f8.us-central1.run.app"

curl -i "$BACKEND_URL/health"

# Should see headers in the output:
# Access-Control-Allow-Origin: *
# Cross-Origin-Opener-Policy: same-origin-allow-popups
```

### 3. Console Check
1. In DevTools **Console** tab, you should NOT see:
   - ❌ "Cross-Origin-Opener-Policy policy would block the window.postMessage call"
   - ❌ "Access to XMLHttpRequest... has been blocked by CORS policy"

## Troubleshooting

### Issue: Still getting CORS errors after deployment

**Check:**
```bash
# 1. Verify backend is running
gcloud run services describe halo-backend --project main-presence-500410-f8 --region us-central1

# 2. Check recent logs
gcloud run logs read halo-backend --project main-presence-500410-f8 --limit 50

# 3. Force clear browser cache (Ctrl+Shift+Delete) and hard refresh (Ctrl+F5)
```

### Issue: Service is in error state

```bash
# Check deployment logs
gcloud run logs read halo-backend --project main-presence-500410-f8 --limit 100

# If Docker image failed to build, redeploy with more details
gcloud run deploy halo-backend \
    --source . \
    --project main-presence-500410-f8 \
    --region us-central1 \
    --no-cache
```

## Expected Timeline

- **Deployment time**: 2-5 minutes
- **Propagation time**: Immediate (Cloud Run updates service URL instantly)
- **Cache clear**: May need hard refresh in browser (Ctrl+F5)

## Files Changed

```
backend/app/factory.py           # Added CORS and COOP middleware
backend/app/config.py            # Added ALLOWED_ORIGINS config
backend/.env.example             # Updated documentation
CORS_AND_OAUTH_TROUBLESHOOTING.md # Comprehensive guide
deploy_cors_fix.sh               # Automated deployment script (Linux/macOS)
deploy_cors_fix.ps1              # Automated deployment script (Windows)
DEPLOYMENT_CHECKLIST.md          # This file
```

## Success Criteria

After deployment, you should be able to:
1. ✓ Click "Sign in with Google" without CORS errors
2. ✓ See no warnings in browser console about COOP
3. ✓ Successfully authenticate and redirect to dashboard
4. ✓ Access protected pages after login

## Questions?

Refer to `CORS_AND_OAUTH_TROUBLESHOOTING.md` for detailed explanations of:
- What CORS headers do
- What COOP headers do  
- How to debug if issues persist
- Environment-specific configuration

