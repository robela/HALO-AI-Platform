# Run with: uvicorn main:app --reload --port 8000
# Deployment version: with explicit CORS response headers (no middleware)
# Deploy attempt: 2026-07-28 17:18 UTC
import sys
print("🚀 Starting HALO AI Backend...", file=sys.stderr, flush=True)
import uvicorn
from app import create_app
from app.config import Settings

print("📦 Creating app...", file=sys.stderr, flush=True)
app = create_app()
print("✅ App created successfully!", file=sys.stderr, flush=True)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
