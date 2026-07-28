#!/usr/bin/env python3
"""Push the Docker fix to GitHub and trigger Cloud Build."""

import subprocess
import sys

def run_cmd(cmd, **kwargs):
    """Run command and return output."""
    print(f"Running: {' '.join(cmd)}")
    result = subprocess.run(cmd, capture_output=True, text=True, **kwargs)
    if result.stdout:
        print(result.stdout[:500])
    if result.returncode != 0 and result.stderr:
        print(f"Error: {result.stderr[:500]}")
    return result

def main():
    import os
    os.chdir("/mnt/c/Code/HALO-AI-Platform")
    
    # Add and commit
    print("📝 Committing Dockerfile changes...")
    run_cmd(["git", "add", "backend/Dockerfile"])
    run_cmd(["git", "commit", "-m", "fix: use /tmp for SQLite database and increase health check timeout"])
    
    # Push
    print("🚀 Pushing to GitHub...")
    run_cmd(["git", "push", "origin", "develop"])
    
    # Trigger Cloud Build
    print("🏗️  Triggering Cloud Build...")
    run_cmd([
        "gcloud", "builds", "submit", 
        "--config=cloudbuild.yaml",
        "--substitutions=_BRANCH_NAME=develop",
        "--project=main-presence-500410-f8",
        "--region=us-central1",
        "--no-source"
    ])
    
    print("✅ Done!")

if __name__ == "__main__":
    main()
