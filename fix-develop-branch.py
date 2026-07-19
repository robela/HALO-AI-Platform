#!/usr/bin/env python3
"""
Reset develop branch to the last known good commit (62fe7f8 with npm fix)
and remove the problematic draft commits that are blocking builds.
"""
import subprocess
import sys

def run_command(cmd, description):
    """Run command and print output"""
    print(f"\n{'='*60}")
    print(f"Running: {description}")
    print(f"Command: {cmd}")
    print('='*60)
    try:
        result = subprocess.run(
            cmd,
            shell=True,
            cwd=r"c:\Code\HALO-AI-Platform",
            capture_output=True,
            text=True
        )
        if result.stdout:
            print("STDOUT:\n" + result.stdout)
        if result.stderr:
            print("STDERR:\n" + result.stderr)
        if result.returncode != 0:
            print(f"ERROR: Command failed with exit code {result.returncode}")
            return False
        print("✓ SUCCESS")
        return True
    except Exception as e:
        print(f"EXCEPTION: {e}")
        return False

def main():
    print("FIXING DEVELOP BRANCH - Removing draft commits")
    print("=" * 60)
    
    steps = [
        # Check current status
        ('git --no-pager status', 'Check current git status'),
        ('git --no-pager log --oneline develop -5', 'Show last 5 commits'),
        
        # Reset to the good commit (62fe7f8)
        ('git reset --hard 62fe7f8', 'Reset develop to commit 62fe7f8 (npm fix)'),
        
        # Verify reset worked
        ('git --no-pager log --oneline develop -5', 'Verify reset - show last 5 commits'),
        
        # Force push to GitHub to remove draft commits
        ('git push origin develop --force', 'Force push to GitHub to remove draft commits'),
        
        # Verify
        ('git --no-pager log --oneline develop -5', 'Final verification of develop'),
    ]
    
    failed = False
    for cmd, description in steps:
        if not run_command(cmd, description):
            print(f"\n❌ FAILED at step: {description}")
            failed = True
            # Continue to show all steps
    
    print("\n" + "="*60)
    if not failed:
        print("✅ ALL STEPS COMPLETED SUCCESSFULLY")
        print("\nNext: Check Cloud Build to see if new build triggers successfully")
    else:
        print("❌ Some steps failed - review output above")
    print("="*60)

if __name__ == "__main__":
    main()
