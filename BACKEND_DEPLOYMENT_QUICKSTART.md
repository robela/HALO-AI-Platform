# 🚀 Backend Deployment - Quick Start

## ✅ What's Been Set Up

I've created a **complete backend deployment setup** for your HALO AI Platform:

### Files Created/Modified:

1. **`backend/Dockerfile`** - Production-ready backend container
2. **`cloudbuild.yaml`** - Updated to build & deploy both frontend + backend
3. **`Dockerfile`** - Updated frontend to accept API base URL at build time
4. **`backend/.env.example`** - Backend configuration template
5. **`.env.local.example`** - Frontend local development config
6. **`.env`** - Updated to use deployed staging backend
7. **`BACKEND_DEPLOYMENT.md`** - Complete deployment guide

### Architecture:

```
Deployed Frontend → Deployed Backend
https://halo-africa-site-staging-*.us-central1.run.app
         ↓ API calls ↓
https://halo-backend-staging-*.us-central1.run.app
```

---

## 🎯 Quick Deployment (Next Steps)

### 1️⃣ Authenticate with GCP

```bash
gcloud auth login
gcloud config set project main-presence-500410-f8
```

### 2️⃣ Deploy Staging (Test)

```bash
cd /mnt/c/Code/HALO-AI-Platform
gcloud builds submit . \
  --config=cloudbuild.yaml \
  --substitutions=SHORT_SHA=v1,BRANCH_NAME=develop,_DEPLOY_ENV=staging,_SERVICE_NAME_FRONTEND=halo-africa-site-staging,_SERVICE_NAME_BACKEND=halo-backend-staging
```

### 3️⃣ Get Service URLs

```bash
# Frontend
gcloud run services describe halo-africa-site-staging \
  --region=us-central1 \
  --format='value(status.url)'

# Backend  
gcloud run services describe halo-backend-staging \
  --region=us-central1 \
  --format='value(status.url)'
```

### 4️⃣ Test Google Login

1. Open the frontend URL from step 3
2. Click "Sign in with Google"
3. Select account → Should work! ✅

---

## 🔧 How It Works

### Build Process:

```
GitHub push (develop)
  ↓
Cloud Build triggered
  ├─ Set environment (staging/prod)
  ├─ Build frontend with VITE_API_BASE_URL=https://backend-url
  ├─ Push frontend image
  ├─ Build backend (FastAPI)
  ├─ Push backend image
  ├─ Deploy frontend to Cloud Run
  └─ Deploy backend to Cloud Run
```

### CORS Flow:

1. Frontend (deployed) requests `/auth/google` to Backend (deployed)
2. Browser checks CORS headers from Backend
3. Backend's allowed_origins includes frontend URL ✅
4. Request succeeds

### Key Configuration:

**Build Args (Cloud Build → Docker):**
- `VITE_API_BASE_URL=https://halo-backend-staging-*.us-central1.run.app`
- `VITE_GOOGLE_CLIENT_ID=397980615504-...`

**Backend Environment:**
- `FRONTEND_URL=https://halo-africa-site-staging-*.us-central1.run.app`
- `GOOGLE_CLIENT_ID=397980615504-...`

---

## 📋 Deployment Checklist

- [ ] `gcloud auth login` ✅
- [ ] Run staging deployment command
- [ ] Verify both services deployed successfully
- [ ] Test Google login on deployed frontend
- [ ] Set up CI/CD triggers (see BACKEND_DEPLOYMENT.md)
- [ ] Deploy to production

---

## ⚠️ If Google Login Still Fails

1. **Check browser console (F12):**
   - Network tab → Look at `/auth/google` request
   - Check exact error response

2. **Check backend logs:**
   ```bash
   gcloud run logs read halo-backend-staging --region=us-central1 --limit=50
   ```

3. **Verify backend health:**
   ```bash
   curl https://halo-backend-staging-XXX.us-central1.run.app/health
   ```

4. **Check CORS:**
   - Frontend URL in `backend/app/factory.py` allowed_origins?
   - See BACKEND_DEPLOYMENT.md for troubleshooting

---

## 📚 Full Documentation

See **`BACKEND_DEPLOYMENT.md`** for:
- ✅ Detailed deployment steps
- ✅ CI/CD trigger setup
- ✅ Production deployment
- ✅ Custom domain configuration
- ✅ Troubleshooting guide

---

## 🎬 Local Testing (Before Deploying)

```bash
# Terminal 1: Backend
cd backend
python main.py
# Runs on http://localhost:8000

# Terminal 2: Frontend  
npm install --legacy-peer-deps
npm run dev
# Runs on http://localhost:5173

# Use .env.local.example for local setup
```

---

## 🆘 Need Help?

Check:
1. **BACKEND_DEPLOYMENT.md** - Full deployment guide
2. **Backend logs**: `gcloud run logs read halo-backend-staging --region=us-central1 --limit=100`
3. **Browser console**: F12 → Network → Check `/auth/google` request details

---

**Ready to deploy? Run the deployment command from step 2️⃣ above!** 🚀
