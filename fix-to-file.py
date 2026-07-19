#!/usr/bin/env python3
"""
Reset develop branch to fix draft commits - write output to file
"""
import subprocess
import os
import sys

output_file = r"c:\Code\HALO-AI-Platform\fix-output.txt"

with open(output_file, 'w') as f:
    os.chdir(r"c:\Code\HALO-AI-Platform")
    
    commands = [
        ('git status', 'Current status'),
        ('git log --oneline develop -5', 'Last 5 commits'),
        ('git reset --hard 62fe7f8', 'Reset to 62fe7f8'),
        ('git log --oneline develop -5', 'Verify reset'),
        ('git push origin develop --force', 'Force push'),
    ]
    
    for cmd, desc in commands:
        f.write(f"\n{'='*60}\n")
        f.write(f"{desc}\n{cmd}\n{'='*60}\n")
        try:
            result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
            f.write(result.stdout)
            if result.stderr:
                f.write(f"\nSTDERR:\n{result.stderr}")
            f.write(f"\nReturn code: {result.returncode}\n")
        except Exception as e:
            f.write(f"ERROR: {e}\n")

print(f"Output written to {output_file}")
