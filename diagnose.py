#!/usr/bin/env python3
"""
Diagnostic script to check backend deployment and test API connectivity
"""
import subprocess
import json
import sys
import time
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError

def run_command(cmd, shell=False):
    """Run a shell command and return output"""
    try:
        result = subprocess.run(
            cmd if shell else cmd.split(),
            capture_output=True,
            text=True,
            shell=shell,
            timeout=10
        )
        return result.stdout.strip(), result.stderr.strip(), result.returncode
    except subprocess.TimeoutExpired:
        return "", "Command timed out", -1
    except Exception as e:
        return "", str(e), -1

def check_git_status():
    """Check if changes are committed and ready to push"""
    print("\n=== GIT STATUS ===")
    stdout, _, _ = run_command("git log --oneline -5", shell=True)
    print(stdout[:500])
    
    stdout, _, _ = run_command("git status --short", shell=True)
    if stdout:
        print(f"Modified files:\n{stdout}")
    else:
        print("No uncommitted changes")

def check_remote_status():
    """Check remote branch status"""
    print("\n=== REMOTE STATUS ===")
    stdout, _, _ = run_command("git ls-remote origin develop", shell=True)
    print(stdout[:200])

def test_backend_health():
    """Test backend /health endpoint"""
    print("\n=== BACKEND HEALTH CHECK ===")
    backend_urls = [
        "https://halo-backend-main-presence-500410-f8.us-central1.run.app/health",
        "http://localhost:8000/health"
    ]
    
    for url in backend_urls:
        print(f"\nTesting: {url}")
        try:
            req = Request(url, method='GET', headers={'User-Agent': 'Diagnostic Script'})
            response = urlopen(req, timeout=5)
            data = response.read().decode()
            print(f"✅ Status: {response.status}")
            print(f"Response: {data[:200]}")
        except HTTPError as e:
            print(f"❌ HTTP Error: {e.code} - {e.reason}")
        except URLError as e:
            print(f"❌ URL Error: {e.reason}")
        except Exception as e:
            print(f"❌ Error: {type(e).__name__} - {str(e)[:100]}")

def main():
    print("HALO Backend Deployment Diagnostic Tool")
    print("=" * 50)
    
    # Change to repo directory
    import os
    os.chdir('/mnt/c/Code/HALO-AI-Platform')
    
    check_git_status()
    check_remote_status()
    test_backend_health()
    
    print("\n" + "=" * 50)
    print("Diagnostic complete")

if __name__ == "__main__":
    main()
