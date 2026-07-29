#!/bin/bash
# Quick Deploy - Cloud Run Backend
# Run this command to deploy the CORS/COOP fixes to production

PROJECT_ID="main-presence-500410-f8"
SERVICE_NAME="halo-backend"
REGION="us-central1"

echo "🚀 Deploying $SERVICE_NAME to Cloud Run..."
echo "Project: $PROJECT_ID"
echo "Region: $REGION"
echo ""

gcloud run deploy $SERVICE_NAME \
    --source . \
    --project $PROJECT_ID \
    --region $REGION \
    --allow-unauthenticated \
    --platform managed \
    --memory 2Gi \
    --cpu 2 \
    --timeout 300 \
    --max-instances 100 \
    --set-env-vars="LOG_LEVEL=INFO"

echo ""
echo "✅ Deployment submitted!"
echo ""
echo "Next steps:"
echo "1. Wait 2-5 minutes for Cloud Run to build and deploy"
echo "2. Test on https://halo-africa-site-397980615504.us-central1.run.app"
echo "3. Click 'Sign in with Google' and verify no CORS/COOP errors"
