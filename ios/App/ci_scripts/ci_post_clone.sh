#!/bin/sh

# Fail correctly if any command fails
set -e

# Xcode Cloud environments typically have Node.js installed. 
# If not, or if a specific version is needed, we manage it here.

# Prevent homebrew auto-update which can be slow or fail
export HOMEBREW_NO_AUTO_UPDATE=1

echo "📦 Installing Node.js..."
# Try installing node, but don't fail if it's already installed or if brew fails (fallback to pre-installed)
brew install node || echo "brew install node failed or already installed, continuing..."

echo "📦 Installing npm dependencies..."
# Use npm install which is more robust than ci for slightly out-of-sync lockfiles
npm install

echo "🔄 Syncing Capacitor projects..."
npx cap sync ios

echo "✅ Dependencies installed and project synced."
