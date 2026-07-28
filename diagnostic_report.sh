#!/bin/bash

echo "======================================================"
echo "HALO Platform Login Issue - Diagnostic Report"
echo "======================================================"

echo ""
echo "1. Backend Source Code Check..."
echo "============================================"
# Check if health endpoint exists
if grep -q '@app.get.*health' backend/app/factory.py; then
    echo "✅ Health endpoint found in source code"
else
    echo "❌ Health endpoint NOT found in source code"
fi

# Check if error handling was added
if grep -q 'try:.*Base.metadata.create_all' backend/app/factory.py; then
    echo "✅ Error handling added to app startup"
else
    echo "❌ Error handling NOT found in app startup"
fi

# Check main.py imports
if grep -q 'from app import create_app' backend/main.py; then
    echo "✅ main.py imports create_app correctly"
else
    echo "❌ main.py import error"
fi

echo ""
echo "2. Git Commit History..."
echo "============================================"
git log --oneline -5

echo ""
echo "3. Backend Requirements..."
echo "============================================"
echo "Python packages in requirements.txt:"
head -15 backend/requirements.txt | sed 's/^/  /'

echo ""
echo "4. Deployment Status..."
echo "============================================"
echo "Frontend URL: https://halo-africa-site-staging-main-presence-500410-f8.us-central1.run.app"
echo "Backend URL: https://halo-backend-main-presence-500410-f8.us-central1.run.app"

echo ""
echo "Testing endpoints..."
echo -n "Backend /health: "
curl -s -o /dev/null -w "HTTP %{http_code}\n" "https://halo-backend-main-presence-500410-f8.us-central1.run.app/health"

echo -n "Backend /docs: "
curl -s -o /dev/null -w "HTTP %{http_code}\n" "https://halo-backend-main-presence-500410-f8.us-central1.run.app/docs"

echo ""
echo "5. Actions to Take..."
echo "============================================"
echo "The code changes are committed and pushed."
echo "But the services are returning 404, which means:"
echo "  • The deployed version hasn't been updated yet"
echo "  • Cloud Build may not have triggered automatically"
echo ""
echo "SOLUTION:"
echo "1. Wait for Cloud Build to complete automatically (checking webhook)"
echo "2. OR manually trigger: gcloud builds submit --config=cloudbuild.yaml ."
echo "3. Monitor Cloud Run: https://console.cloud.google.com/run?project=main-presence-500410-f8"
echo ""
echo "Once deployed, test login at:"
echo "https://halo-africa-site-staging-main-presence-500410-f8.us-central1.run.app/"
