# 🚀 Deployment Guide - CORS/COOP Fix

## Current Status
✅ Backend code has CORS/COOP fixes committed  
❌ Cloud Run service needs to be redeployed with new code

## The Issue
Your frontend at `https://halo-africa-site-397980615504.us-central1.run.app` is getting:
- ❌ CORS error: "No 'Access-Control-Allow-Origin' header"
- ❌ COOP warning: "Cross-Origin-Opener-Policy blocks postMessage"

This means the Cloud Run backend service is still running the **old code** without CORS headers.

## Solution: Redeploy Backend

### Step 1: Open Terminal/PowerShell
Navigate to your project:
```bash
cd c:\Code\HALO-AI-Platform
```

### Step 2: Deploy to Cloud Run (Choose One)

#### Option A: Full Deploy with Build
```bash
gcloud run deploy halo-backend `
    --source . `
    --project main-presence-500410-f8 `
    --region us-central1 `
    --allow-unauthenticated
```

#### Option B: Quick Deploy (Recommended)
```bash
gcloud run deploy halo-backend `
    --source . `
    --project main-presence-500410-f8 `
    --region us-central1 `
    --allow-unauthenticated `
    --platform managed `
    --memory 2Gi `
    --cpu 2 `
    --timeout 300 `
    --max-instances 100
```

### Step 3: Wait for Deployment
The deployment will:
1. Build a Docker image (~2-3 minutes)
2. Push to Container Registry (~1 minute)
3. Deploy to Cloud Run (~1 minute)
4. **Total: 4-5 minutes**

You'll see:
```
✓ Building Cloud Run service...
✓ Pushing container...
✓ Deploying service...
✓ Service deployed successfully
Service URL: https://halo-backend-main-presence-500410-f8.us-central1.run.app
```

### Step 4: Verify the Fix

#### Test 1: Check Health Endpoint
```bash
curl -i https://halo-backend-main-presence-500410-f8.us-central1.run.app/health
```

Look for these headers in response:
```
HTTP/2 200
access-control-allow-origin: *
cross-origin-opener-policy: same-origin-allow-popups
cross-origin-embedder-policy: require-corp
```

#### Test 2: Browser Test
1. Go to: `https://halo-africa-site-397980615504.us-central1.run.app`
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Click **"Sign in with Google"** button
5. Check console for errors:
   - ✅ Should NOT see "CORS policy would block"
   - ✅ Should NOT see "Cross-Origin-Opener-Policy"
6. Go to **Network** tab
7. Look for POST to `/auth/google`
8. Click it and check **Response Headers**
9. Verify CORS headers are present

## Troubleshooting

### Issue: Deployment fails with "Docker build failed"
**Solution:**
```bash
# Verify Dockerfile exists
ls -la backend/Dockerfile

# Rebuild with no cache
gcloud run deploy halo-backend --source . --project main-presence-500410-f8 --no-cache
```

### Issue: Still getting CORS errors after deployment
**Solution:**
1. **Hard refresh browser:**
   - Windows/Linux: `Ctrl + Shift + Delete` (clear cache) then `Ctrl + F5`
   - macOS: `Cmd + Shift + Delete` (clear cache) then `Cmd + Shift + R`

2. **Check service is actually running:**
   ```bash
   gcloud run services describe halo-backend \
       --project main-presence-500410-f8 \
       --region us-central1 \
       --format='table(metadata.name, status.conditions[0].status)'
   ```

3. **Check recent logs:**
   ```bash
   gcloud run logs read halo-backend \
       --project main-presence-500410-f8 \
       --region us-central1 \
       --limit 50
   ```

### Issue: "Service not found" error
**Solution:**
The service doesn't exist yet. This is normal on first deployment. Just run the deploy command and it will create it.

## What Gets Deployed

The deployment includes:
- ✅ CORS middleware configuration
- ✅ COOP headers middleware  
- ✅ All authentication routes
- ✅ All API endpoints
- ✅ Health check endpoint

## Backend URL After Deployment
```
https://halo-backend-main-presence-500410-f8.us-central1.run.app
```

This URL is configured in your frontend `.env.local`:
```
VITE_API_BASE_URL=https://halo-backend-main-presence-500410-f8.us-central1.run.app
```

## Next Steps

1. ✅ Run deployment command above
2. ⏳ Wait 4-5 minutes for build/deploy
3. ✅ Test health endpoint
4. ✅ Test in browser
5. ✅ Click "Sign in with Google" - should work!

## Questions?

Check the logs if something goes wrong:
```bash
gcloud run logs read halo-backend --project main-presence-500410-f8 --limit 100
```

The first few lines of output should show:
```
🚀 Starting HALO AI Backend...
📦 Creating app...
✅ App created successfully!
```

If you see any Python errors, there's likely an issue with the code.
