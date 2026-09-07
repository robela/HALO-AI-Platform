# CORS and OAuth Troubleshooting Guide

## Overview

This guide explains the CORS and Cross-Origin-Opener-Policy (COOP) issues when deploying the HALO AI Platform with Google OAuth Sign-In across different Cloud Run services.

## Issue 1: CORS "No 'Access-Control-Allow-Origin' header" Error

### Symptoms
```
Access to XMLHttpRequest at 'https://halo-backend-main-presence-500410-f8.us-central1.run.app/auth/google' 
from origin 'https://halo-africa-site-397980615504.us-central1.run.app' has been blocked by CORS policy
```

### Root Cause
When the frontend and backend are deployed as separate Cloud Run services, they have different origins. The browser blocks cross-origin requests unless the backend explicitly allows them via CORS headers.

### Solution

The backend (`backend/app/factory.py`) has been updated with:

1. **CORS Middleware** - Added with permissive settings:
   ```python
   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],  # Allow all origins
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

2. **Middleware Order** - CORS middleware is added FIRST so it runs first in the request chain

3. **Environment Configuration** - Set `ALLOWED_ORIGINS` in your `.env` file:
   ```bash
   # For development (allow all):
   ALLOWED_ORIGINS=*
   
   # For production (specific domains):
   ALLOWED_ORIGINS=https://halo-africa-site-397980615504.us-central1.run.app,https://api.haloafrica.org
   ```

### Verification
Check your browser's Network tab for the `auth/google` request. You should see:
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: content-type, authorization, ...
```

## Issue 2: COOP "Cross-Origin-Opener-Policy blocks postMessage" Warning

### Symptoms
```
Cross-Origin-Opener-Policy policy would block the window.postMessage call
```

### Root Cause
Google Sign-In uses `window.postMessage()` to communicate between an OAuth iframe and the parent window. Modern browsers enforce Cross-Origin-Opener-Policy (COOP) to prevent security vulnerabilities. By default, COOP blocks this communication.

### Solution

The backend now sets proper COOP headers:

```python
@app.middleware("http")
async def add_coop_headers(request, call_next):
    response = await call_next(request)
    # Allow cross-origin window access for Google Sign-In
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin-allow-popups"
    response.headers["Cross-Origin-Embedder-Policy"] = "require-corp"
    return response
```

These headers tell the browser:
- `same-origin-allow-popups`: Allow window.open() and postMessage from same-origin or OAuth windows
- `require-corp`: Resources must explicitly allow cross-origin embedding

### Verification
Check your browser's Network response headers for any request:
```
Cross-Origin-Opener-Policy: same-origin-allow-popups
Cross-Origin-Embedder-Policy: require-corp
```

## Environment Configuration

### Production Cloud Run Deployment

1. **Frontend Service** (.env.local or cloud build substitution):
   ```bash
   VITE_API_BASE_URL=https://halo-backend-main-presence-500410-f8.us-central1.run.app
   VITE_GOOGLE_CLIENT_ID=397980615504-bk84p5ecc8ml3k5c6raccduk1okqvcdq.apps.googleusercontent.com
   ```

2. **Backend Service** (.env or Cloud Run secret):
   ```bash
   GOOGLE_CLIENT_ID=397980615504-bk84p5ecc8ml3k5c6raccduk1okqvcdq.apps.googleusercontent.com
   ALLOWED_ORIGINS=https://halo-africa-site-397980615504.us-central1.run.app,https://haloafrica.org
   ```

3. **Google OAuth Console**:
   - Add authorized origins: `https://halo-africa-site-397980615504.us-central1.run.app`
   - Add authorized redirect URIs: `https://halo-backend-main-presence-500410-f8.us-central1.run.app/`

## Testing

### Local Development
```bash
# Terminal 1: Backend
cd backend
pip install -r requirements.txt
export VITE_API_BASE_URL=http://localhost:8000
uvicorn main:app --reload --port 8000

# Terminal 2: Frontend
npm install
export VITE_API_BASE_URL=http://localhost:8000
export VITE_GOOGLE_CLIENT_ID=your-client-id
npm run dev
```

### Production Testing
1. Open your deployed frontend: `https://halo-africa-site-397980615504.us-central1.run.app`
2. Open DevTools → Network tab
3. Click "Sign in with Google"
4. Verify:
   - POST request to `/auth/google` returns 200
   - Response includes `Access-Control-Allow-Origin` header
   - No COOP warnings in console

## Common Issues and Fixes

### Issue: Still getting "No 'Access-Control-Allow-Origin'" error

**Check:**
1. Is the backend service redeployed after code changes? `gcloud run deploy halo-backend`
2. Is `ALLOWED_ORIGINS` set correctly in Cloud Run environment variables?
3. Check backend logs: `gcloud run logs read halo-backend --limit=50`

**Fix:**
```bash
# Update backend with new CORS configuration
git add backend/
git commit -m "fix: add CORS and COOP headers"
gcloud run deploy halo-backend --source . --project main-presence-500410-f8
```

### Issue: COOP warning persists

**Check:**
1. Are response headers being set? Open DevTools → Network → any request → Response Headers
2. Is middleware being applied? Check that `add_coop_headers` middleware is in `factory.py`

**Fix:** Clear browser cache (Ctrl+Shift+Delete) and hard refresh (Ctrl+F5)

### Issue: Google Sign-In button doesn't appear

**Check:**
1. Is `VITE_GOOGLE_CLIENT_ID` set in frontend?
2. Is the client ID valid? Check Google Cloud Console
3. Are origins registered in Google OAuth settings?

**Fix:**
```bash
# Update frontend env vars
echo "VITE_GOOGLE_CLIENT_ID=your-actual-client-id" > .env.local
npm run dev
```

## References

- [MDN: Cross-Origin-Opener-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy)
- [FastAPI CORS Middleware](https://fastapi.tiangolo.com/tutorial/cors/)
- [Google Identity Platform](https://developers.google.com/identity/protocols/oauth2)

## Code Changes Summary

### Modified Files
1. **backend/app/factory.py**
   - Reordered CORS middleware to run first
   - Added COOP headers middleware

2. **backend/app/config.py**
   - Added `ALLOWED_ORIGINS` configuration parameter

3. **backend/.env.example**
   - Documented CORS configuration

### No Changes Needed
- Frontend code works as-is once backend is fixed
- Dockerfile doesn't require changes
- Database configuration unchanged

## Next Steps

1. **Commit changes:**
   ```bash
   git add backend/ CORS_AND_OAUTH_TROUBLESHOOTING.md
   git commit -m "fix: CORS and COOP headers for cross-origin OAuth"
   ```

2. **Deploy backend:**
   ```bash
   gcloud run deploy halo-backend --source . --project main-presence-500410-f8
   ```

3. **Test in staging first:**
   - Verify on staging environment before production
   - Check DevTools Network tab for correct headers

4. **Monitor logs:**
   - Watch for any new CORS errors
   - Check backend logs for middleware execution

