#!/usr/bin/env python3
import subprocess
import sys
import os

os.chdir(r'c:\Code\HALO-AI-Platform')

print("=== Checking npm and node versions ===")
result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
print(f"npm version: {result.stdout.strip()}")

result = subprocess.run(['node', '--version'], capture_output=True, text=True)
print(f"node version: {result.stdout.strip()}")

print("\n=== Clearing npm cache ===")
subprocess.run(['npm', 'cache', 'clean', '--force'], capture_output=True)
print("Cache cleared")

print("\n=== Running npm install ===")
result = subprocess.run(['npm', 'install'], capture_output=True, text=True, timeout=300)

if "up to date" in result.stdout.lower():
    print("✓ npm install succeeded - packages up to date")
elif result.returncode == 0:
    print("✓ npm install succeeded")
    print(result.stdout[-500:])
else:
    print(f"✗ npm install failed with exit code {result.returncode}")
    print("\nSTDOUT (last 1000 chars):")
    print(result.stdout[-1000:])
    print("\nSTDERR (last 1000 chars):")
    print(result.stderr[-1000:])
