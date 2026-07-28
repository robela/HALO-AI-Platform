#!/usr/bin/env python3
"""Test HALO login flow end-to-end"""
import json
import sys
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError

def test_backend_health():
    """Test backend /health endpoint"""
    print("=" * 60)
    print("1. Testing Backend Health...")
    print("=" * 60)
    
    backend_url = "https://halo-backend-main-presence-500410-f8.us-central1.run.app"
    
    try:
        # Try /health
        url = f"{backend_url}/health"
        req = Request(url, method='GET')
        response = urlopen(req, timeout=5)
        data = response.read().decode()
        print(f"✅ /health endpoint working")
        print(f"Status: {response.status}")
        print(f"Response: {data}")
        return True
    except HTTPError as e:
        print(f"❌ HTTP {e.code}: {e.reason}")
        return False
    except URLError as e:
        print(f"❌ Connection error: {e.reason}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_frontend():
    """Test frontend loads"""
    print("\n" + "=" * 60)
    print("2. Testing Frontend...")
    print("=" * 60)
    
    frontend_url = "https://halo-africa-site-staging-main-presence-500410-f8.us-central1.run.app"
    
    try:
        url = f"{frontend_url}/"
        req = Request(url, method='GET')
        response = urlopen(req, timeout=5)
        data = response.read().decode('utf-8', errors='ignore')[:500]
        print(f"✅ Frontend responding")
        print(f"Status: {response.status}")
        print(f"Content preview:\n{data}")
        return True
    except HTTPError as e:
        print(f"❌ HTTP {e.code}: {e.reason}")
        return False
    except URLError as e:
        print(f"❌ Connection error: {e.reason}")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_backend_routes():
    """Test backend API endpoints"""
    print("\n" + "=" * 60)
    print("3. Testing Backend API Routes...")
    print("=" * 60)
    
    backend_url = "https://halo-backend-main-presence-500410-f8.us-central1.run.app"
    endpoints = ["/api/auth/callback", "/docs", "/health", "/api/health"]
    
    for endpoint in endpoints:
        try:
            url = f"{backend_url}{endpoint}"
            req = Request(url, method='GET')
            response = urlopen(req, timeout=3)
            print(f"✅ {endpoint}: {response.status}")
        except HTTPError as e:
            print(f"❌ {endpoint}: HTTP {e.code}")
        except URLError:
            print(f"❌ {endpoint}: Connection refused")
        except Exception as e:
            print(f"❌ {endpoint}: {type(e).__name__}")

def main():
    print("\n🔍 HALO Platform Deployment Diagnostic")
    backend_ok = test_backend_health()
    frontend_ok = test_frontend()
    test_backend_routes()
    
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Backend: {'✅ OK' if backend_ok else '❌ FAILED'}")
    print(f"Frontend: {'✅ OK' if frontend_ok else '❌ FAILED'}")
    print("\nNext Step: If both failed, check Cloud Build logs or manually trigger build")

if __name__ == "__main__":
    main()
