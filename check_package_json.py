#!/usr/bin/env python3
"""
Check package.json content in the latest commit on GitHub
"""
import subprocess
import json

# Check what's in HEAD:package.json
result = subprocess.run(
    ['git', 'show', 'HEAD:package.json'],
    capture_output=True,
    text=True,
    cwd='/mnt/c/Code/HALO-AI-Platform'
)

if result.returncode == 0:
    try:
        data = json.loads(result.stdout)
        build_script = data.get('scripts', {}).get('build', 'NOT FOUND')
        print("="*60)
        print("package.json in HEAD commit:")
        print("="*60)
        print(f"Build script: {build_script}")
        print()
        if 'tsc --project' in build_script:
            print("✅ FIX IS IN COMMIT!")
        elif 'tsc -b' in build_script:
            print("❌ OLD BUILD SCRIPT STILL IN COMMIT!")
        else:
            print("⚠️  UNEXPECTED BUILD SCRIPT!")
    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        print("Raw output:")
        print(result.stdout[:500])
else:
    print(f"Error reading HEAD:package.json: {result.stderr}")

print("\n" + "="*60)
print("Local package.json:")
print("="*60)
try:
    with open('/mnt/c/Code/HALO-AI-Platform/package.json', 'r') as f:
        data = json.load(f)
        build_script = data.get('scripts', {}).get('build', 'NOT FOUND')
        print(f"Build script: {build_script}")
except Exception as e:
    print(f"Error: {e}")
