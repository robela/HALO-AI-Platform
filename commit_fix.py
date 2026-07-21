#!/usr/bin/env python3
"""
Simple script to commit and push the package.json fix
"""
import subprocess
import sys
import os

os.chdir('/mnt/c/Code/HALO-AI-Platform')

commands = [
    ('git', 'add', 'package.json'),
    ('git', 'commit', '-m', 'Fix: change build script from tsc -b to tsc --project tsconfig.app.json'),
    ('git', 'push', 'origin', 'develop'),
]

for cmd in commands:
    print(f"\n{'='*60}")
    print(f"Running: {' '.join(cmd)}")
    print(f"{'='*60}")
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=False)
        if result.stdout:
            print("STDOUT:", result.stdout)
        if result.stderr:
            print("STDERR:", result.stderr)
        print(f"Return code: {result.returncode}")
        if result.returncode != 0 and 'push' in cmd:
            print("\n❌ Push failed! Showing git status:")
            subprocess.run(('git', 'status'), check=False)
    except Exception as e:
        print(f"❌ Error: {e}")
        sys.exit(1)

print(f"\n{'='*60}")
print("✅ Completed!")
print(f"{'='*60}")
