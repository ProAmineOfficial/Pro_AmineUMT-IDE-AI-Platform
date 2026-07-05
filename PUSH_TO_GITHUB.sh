#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────
# Pro_AmineUMT-IDE-AI-Platform — Repository Push Script
#
# This script pushes the fully-bootstrapped repository to GitHub.
# Run it from the extracted repo directory after downloading the ZIP.
#
# Prerequisites:
#   1. Git installed (git --version).
#   2. A GitHub account with push access to
#      https://github.com/ProAmineOfficial/Pro_AmineUMT-IDE-AI-Platform
#   3. GitHub authentication configured (SSH key or Personal Access Token).
#
# © Pro_Amine LLC · Developed by Amine Saoud ibn al-Bashir
# Recognized by Corporate Vision Magazine UK · Technology Innovator Awards 2025
# Rising Star in Microchip Technology Solutions in Europe
# ─────────────────────────────────────────────────────────────────

set -euo pipefail

REMOTE_HTTPS="https://github.com/ProAmineOfficial/Pro_AmineUMT-IDE-AI-Platform.git"
REMOTE_SSH="git@github.com:ProAmineOfficial/Pro_AmineUMT-IDE-AI-Platform.git"

# Sanity check: are we in the right directory?
if [ ! -f LICENSE ] || [ ! -f NOTICE ] || [ ! -d adr ] || [ ! -d standards ]; then
  echo "ERROR: this script must be run from the root of the extracted repository."
  echo "Expected files: LICENSE, NOTICE, adr/, standards/"
  exit 1
fi

# Choose remote protocol
echo ""
echo "Choose the remote protocol:"
echo "  1) HTTPS (works everywhere, prompts for username + PAT on push)"
echo "  2) SSH   (requires ssh-agent + SSH key configured with GitHub)"
read -p "Enter 1 or 2 [1]: " choice
choice=${choice:-1}

case "$choice" in
  1) REMOTE="$REMOTE_HTTPS" ;;
  2) REMOTE="$REMOTE_SSH"   ;;
  *) echo "Invalid choice"; exit 1 ;;
esac

# Check existing remote
if git remote get-url origin >/dev/null 2>&1; then
  CURRENT=$(git remote get-url origin)
  echo "Existing 'origin' remote: $CURRENT"
  echo "Updating to: $REMOTE"
  git remote set-url origin "$REMOTE"
else
  git remote add origin "$REMOTE"
fi

# Show what will be pushed
echo ""
echo "=== Commits to be pushed ==="
git log --oneline
echo ""
echo "=== Summary ==="
echo "  Directories: $(find . -type d -not -path './.git*' | wc -l)"
echo "  Files:       $(find . -type f -not -path './.git*' | wc -l)"
echo ""

# Confirm and push
read -p "Push to $REMOTE ? [y/N] " confirm
if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
  echo "Aborted. No changes pushed."
  exit 0
fi

echo ""
echo "Pushing..."
git push -u origin main

echo ""
echo "─────────────────────────────────────────────────────────────────"
echo "Push complete."
echo "Repository:  https://github.com/ProAmineOfficial/Pro_AmineUMT-IDE-AI-Platform"
echo "─────────────────────────────────────────────────────────────────"
