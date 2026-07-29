# Deploy via Google Cloud Console (Web UI)

## 🌐 Step-by-Step Guide - Cloud Run Web Console

### Step 1: Open Cloud Run Services Page
Go to: https://console.cloud.google.com/run/services?project=main-presence-500410-f8&region=us-central1

### Step 2: Find halo-backend Service
- Look for **"halo-backend"** in the services list
- Click on it to open the service details page

### Step 3: Click "EDIT & DEPLOY"
On the service detail page, look for one of these buttons:
- **"EDIT & DEPLOY NEW REVISION"** (preferred)
- **"REDEPLOY"** 
- **"DEPLOY"**

Click the button to open the deployment editor.

### Step 4: Update Deployment Settings

In the deployment form, verify/set these values:

**Service name:** `halo-backend`

**Container image:**
```
gcr.io/main-presence-500410-f8/halo-backend
```
(or let it auto-build from source)

**Memory:** `2 GiB`

**CPU:** `2`

**Timeout:** `300 seconds`

**Max instances:** `100`

**Authentication:** 
- Select: **Allow unauthenticated invocations**

### Step 5: Source Code Configuration

If prompted for source:
- **Source location:** `GitHub`
- **Repository:** `robela/HALO-AI-Platform`
- **Branch:** `develop`
- **Build type:** `Dockerfile`

Or skip this and just click "Deploy" to rebuild from your GitHub code.

### Step 6: Click "DEPLOY"

Click the blue **"DEPLOY"** button at the bottom right.

You should see:
```
Deploying...
Preparing Cloud Build
Building image
Pushing to Container Registry  
Deploying to Cloud Run
✓ Deployment successful
```

**Wait time:** 4-5 minutes

### Step 7: Verify Deployment Complete

When complete, you should see:
- Service status: **✓ Active**
- Service URL: `https://halo-backend-main-presence-500410-f8.us-central1.run.app`
- Revision is running with **100% traffic**

### Step 8: Test in Browser

1. Open your frontend: `https://halo-africa-site-397980615504.us-central1.run.app`
2. Press `F12` → Console
3. Click "Sign in with Google"
4. Check console - should NOT see CORS errors anymore ✅

---

## Alternative: Use Command Line (Faster)

If the web console is slow, use this command in Terminal/PowerShell:

```bash
cd c:\Code\HALO-AI-Platform
gcloud run deploy halo-backend --source . --project main-presence-500410-f8 --region us-central1 --allow-unauthenticated
```

---

## Troubleshooting

### Issue: Can't find "EDIT & DEPLOY" button
- Make sure you're on the service detail page (not the services list)
- The URL should be: `https://console.cloud.google.com/run/detail/us-central1/halo-backend?...`
- Look for buttons near the top of the page

### Issue: Build fails
- Check the Build logs
- Make sure `Dockerfile` exists in repository root
- Make sure `backend/` folder has all required files

### Issue: Deployment succeeds but still getting CORS errors
- Hard refresh browser: **Ctrl+Shift+Delete** (clear cache) then **Ctrl+F5**
- Wait a few minutes for CloudFlare/CDN to update
- Check that you're accessing the correct backend URL

---

## Status Check

To verify deployment status:

**In Cloud Run Console:**
1. Go to Services
2. Look for **halo-backend**
3. Check the **Status** column - should say ✓ Active
4. Click on it and check **Latest revision** - should be running

**In Terminal:**
```bash
gcloud run services describe halo-backend \
  --project main-presence-500410-f8 \
  --region us-central1 \
  --format='table(metadata.name, status.conditions[0].status, status.url)'
```

---

## What Gets Updated

When you deploy:
✅ Code changes (CORS/COOP headers) get deployed
✅ Python dependencies get installed
✅ Docker image gets built with latest code
✅ New revision starts handling traffic
✅ Old revisions stop getting traffic (but stay available)

---

Choose either:
1. **Web Console** (what you mentioned) - Go through Steps 1-8 above
2. **Command Line** (faster) - Run the command above

Let me know which method you prefer!
