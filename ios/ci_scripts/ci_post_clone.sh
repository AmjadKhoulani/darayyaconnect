#!/bin/sh

# Fail correctly if any command fails
set -e

# Xcode Cloud environments typically have Node.js installed. 
# If not, or if a specific version is needed, we manage it here.

echo "📦 Installing npm dependencies..."
# Use ci for cleaner installs in CI environments
npm ci || npm install

echo "🔄 Syncing Capacitor projects..."
npx cap sync ios

echo "✅ Dependencies installed and project synced."
