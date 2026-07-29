#!/bin/bash
# Deploy HALO Backend with CORS and COOP fixes

PROJECT_ID="main-presence-500410-f8"
SERVICE_NAME="halo-backend"
REGION="us-central1"

echo "🚀 Deploying $SERVICE_NAME with CORS/COOP fixes..."
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo ""

# Step 1: Commit changes
echo "📝 Step 1: Committing backend changes..."
git add backend/
git commit -m "fix: add CORS and COOP headers for Google OAuth cross-origin requests" || echo "No changes to commit"
git push origin develop || echo "Push completed"

# Step 2: Deploy to Cloud Run
echo ""
echo "🔧 Step 2: Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
    --source . \
    --project $PROJECT_ID \
    --region $REGION \
    --allow-unauthenticated \
    --platform managed \
    --memory 2Gi \
    --cpu 2 \
    --timeout 300 \
    --max-instances 100

# Step 3: Get the service URL
echo ""
echo "✅ Step 3: Getting service URL..."
SERVICE_URL=$(gcloud run services describe $SERVICE_NAME \
    --project $PROJECT_ID \
    --region $REGION \
    --format='value(status.url)')

echo ""
echo "✅ Deployment Complete!"
echo "Backend URL: $SERVICE_URL"
echo ""
echo "📋 Verify the fix:"
echo "1. Open DevTools (F12) → Network tab"
echo "2. Make a request to: $SERVICE_URL/health"
echo "3. Check response headers for:"
echo "   ✓ Access-Control-Allow-Origin: *"
echo "   ✓ Cross-Origin-Opener-Policy: same-origin-allow-popups"
echo "   ✓ Cross-Origin-Embedder-Policy: require-corp"
