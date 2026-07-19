#!/usr/bin/env python3
import subprocess
import os

os.chdir(r"c:\Code\HALO-AI-Platform")

with open("git-reset.log", "w") as log:
    log.write("Starting git reset...\n")
    
    # Run git reset
    proc = subprocess.Popen(
        ["git", "reset", "--hard", "62fe7f8"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    stdout, stderr = proc.communicate()
    
    log.write(f"Reset output:\n{stdout}\n{stderr}\n")
    log.write(f"Return code: {proc.returncode}\n\n")
    
    # Verify
    log.write("Verifying commits:\n")
    proc = subprocess.Popen(
        ["git", "log", "--oneline", "develop", "-5"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    stdout, stderr = proc.communicate()
    log.write(f"{stdout}\n")
    
    # Push
    log.write("\nForce pushing:\n")
    proc = subprocess.Popen(
        ["git", "push", "origin", "develop", "--force"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    stdout, stderr = proc.communicate()
    log.write(f"Push output:\n{stdout}\n{stderr}\n")
    log.write(f"Return code: {proc.returncode}\n")

print("Done - check git-reset.log")
