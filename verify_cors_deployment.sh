#!/bin/bash
# Verify CORS/COOP deployment to Cloud Run

echo "🔍 Checking CORS/COOP deployment status..."
echo ""

# Check if service exists
echo "1️⃣ Checking if halo-backend service exists..."
gcloud run services describe halo-backend \
    --project main-presence-500410-f8 \
    --region us-central1 \
    --format='table(metadata.name, status.url, status.conditions[0].status)' \
    2>/dev/null || echo "❌ Service not found"

echo ""
echo "2️⃣ Getting service URL..."
SERVICE_URL=$(gcloud run services describe halo-backend \
    --project main-presence-500410-f8 \
    --region us-central1 \
    --format='value(status.url)' 2>/dev/null)

if [ -z "$SERVICE_URL" ]; then
    echo "❌ Could not get service URL"
    exit 1
fi

echo "✅ Service URL: $SERVICE_URL"

echo ""
echo "3️⃣ Testing CORS headers..."
echo "Requesting: $SERVICE_URL/health"
echo ""

curl -s -i "$SERVICE_URL/health" | grep -E "^(HTTP|access-control|cross-origin)" || echo "No CORS headers found"

echo ""
echo "4️⃣ Testing OAuth endpoint..."
curl -s -i -X OPTIONS "$SERVICE_URL/auth/google" | grep -E "^(HTTP|access-control)" || echo "No CORS preflight response"

echo ""
echo "✅ Verification complete!"
echo ""
echo "📝 Expected headers (from step 3):"
echo "   - access-control-allow-origin: *"
echo "   - cross-origin-opener-policy: same-origin-allow-popups"
echo "   - cross-origin-embedder-policy: require-corp"
