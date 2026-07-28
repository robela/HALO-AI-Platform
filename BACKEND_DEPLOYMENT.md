# HALO AI Platform - Backend Deployment Guide

## Overview

This guide sets up both **Frontend** and **Backend** deployment to Google Cloud Run.

### Services to Deploy:
- **Frontend (Vite)**: `halo-africa-site` (prod) / `halo-africa-site-staging` (staging)
- **Backend (FastAPI)**: `halo-backend` (prod) / `halo-backend-staging` (staging)

---

## Prerequisites

1. **Google Cloud Project**: `main-presence-500410-f8`
2. **Artifact Registry**: Repository `halo-platform` (already created)
3. **gcloud CLI**: Installed and authenticated
4. **Git**: Configured with GitHub

---

## Deployment Steps

### Step 1: Verify Environment Setup

```bash
# Set default project
gcloud config set project main-presence-500410-f8

# Enable required APIs
gcloud services enable cloudbuild.googleapis.com run.googleapis.com artifactregistry.googleapis.com
```

### Step 2: Manual Staging Deployment (Test)

Deploy staging to verify everything works:

```bash
gcloud builds submit . \
  --config=cloudbuild.yaml \
  --substitutions=SHORT_SHA=manual-staging,BRANCH_NAME=develop,_DEPLOY_ENV=staging,_SERVICE_NAME_FRONTEND=halo-africa-site-staging,_SERVICE_NAME_BACKEND=halo-backend-staging
```

### Step 3: Verify Staging Deployment

```bash
# Check frontend
gcloud run services describe halo-africa-site-staging \
  --region=us-central1 \
  --format='value(status.url)'

# Check backend
gcloud run services describe halo-backend-staging \
  --region=us-central1 \
  --format='value(status.url)'
```

Expected output:
- Frontend: `https://halo-africa-site-staging-XXXXX.us-central1.run.app`
- Backend: `https://halo-backend-staging-XXXXX.us-central1.run.app`

### Step 4: Set Up CI/CD Triggers

#### Create GitHub Connection

```bash
gcloud builds connections create github halo-github-connection \
  --region=us-central1
```

Then register your repository:

```bash
gcloud builds repositories create halo-ai-platform \
  --remote-uri=https://github.com/robela/HALO-AI-Platform.git \
  --connection=halo-github-connection \
  --region=us-central1
```

#### Create Staging Trigger (develop → staging)

```bash
gcloud builds triggers create repository \
  --name=deploy-halo-staging \
  --region=us-central1 \
  --repository=projects/main-presence-500410-f8/locations/us-central1/connections/halo-github-connection/repositories/halo-ai-platform \
  --branch-pattern=^develop$ \
  --build-config=cloudbuild.yaml
```

#### Create Production Trigger (main → production)

```bash
gcloud builds triggers create repository \
  --name=deploy-halo-production \
  --region=us-central1 \
  --repository=projects/main-presence-500410-f8/locations/us-central1/connections/halo-github-connection/repositories/halo-ai-platform \
  --branch-pattern=^main$ \
  --build-config=cloudbuild.yaml
```

### Step 5: Manual Production Deployment

Once staging is verified, deploy production:

```bash
gcloud builds submit . \
  --config=cloudbuild.yaml \
  --substitutions=SHORT_SHA=manual-prod,BRANCH_NAME=main,_DEPLOY_ENV=production,_SERVICE_NAME_FRONTEND=halo-africa-site,_SERVICE_NAME_BACKEND=halo-backend
```

### Step 6: Configure Backend Environment Variables

The backend needs proper configuration. Update `.env` for deployed instances:

```bash
# For staging backend
gcloud run services update halo-backend-staging \
  --region=us-central1 \
  --update-env-vars="LOG_LEVEL=INFO,FRONTEND_URL=https://halo-africa-site-staging-XXXXX.us-central1.run.app"

# For production backend
gcloud run services update halo-backend \
  --region=us-central1 \
  --update-env-vars="LOG_LEVEL=INFO,FRONTEND_URL=https://halo-africa-site-XXXXX.us-central1.run.app"
```

---

## Testing Google Login

### From Deployed Frontend:

1. Visit: `https://halo-africa-site-staging-XXXXX.us-central1.run.app`
2. Click "Sign in with Google"
3. Select your account
4. Should redirect to dashboard ✅

### If Still Getting CORS Error:

Check backend CORS configuration:
```bash
# Check logs
gcloud run logs read halo-backend-staging --region=us-central1 --limit=50
```

---

## Troubleshooting

### Backend Requests Failing

**Check logs:**
```bash
gcloud run logs read halo-backend-staging --region=us-central1 --limit=100
```

**Check health endpoint:**
```bash
curl https://halo-backend-staging-XXXXX.us-central1.run.app/health
```

### Frontend Can't Reach Backend

**Check CORS allowed origins:**
- Backend should have frontend URL in allowed_origins
- See `backend/app/factory.py` line ~50

**Check frontend's API base URL:**
- Built with `VITE_API_BASE_URL=https://halo-backend-staging-XXXXX.us-central1.run.app`

### Google Login Still Not Working

1. Verify Google Client ID is set in environment
2. Check browser console for exact error
3. Check backend logs for token validation errors
4. Verify Google OAuth app settings:
   - Authorized JavaScript origins includes your frontend URL
   - Redirect URIs include your frontend URL

---

## Local Testing

To test locally before deployment:

```bash
# Terminal 1: Backend
cd backend
python main.py

# Terminal 2: Frontend
npm install --legacy-peer-deps
npm run dev
```

Access at: `http://localhost:5173`

Environment variables:
- `VITE_API_BASE_URL=http://localhost:8000`
- `VITE_GOOGLE_CLIENT_ID=397980615504-bk84p5ecc8ml3k5c6raccduk1okqvcdq.apps.googleusercontent.com`

---

## Current Deployment Architecture

```
┌─ GitHub (develop/main branches)
│
└─ Cloud Build (cloudbuild.yaml)
   ├─ Build Frontend (Dockerfile)
   │  └─ Push to Artifact Registry
   │     └─ Deploy to Cloud Run (halo-africa-site / halo-africa-site-staging)
   │
   ├─ Build Backend (backend/Dockerfile)
   │  └─ Push to Artifact Registry
   │     └─ Deploy to Cloud Run (halo-backend / halo-backend-staging)
   │
   └─ Frontend receives Backend URL via VITE_API_BASE_URL build arg
```

---

## Next Steps

1. ✅ Backend Dockerfile created
2. ✅ Cloud Build config updated for both services
3. ✅ CORS settings updated
4. 📋 Deploy staging and test
5. 📋 Set up CI/CD triggers
6. 📋 Deploy production
7. 📋 Configure custom domain (optional): `api.haloafrica.ai`

**Ready to deploy!**
