#!/bin/sh

# Fail correctly if any command fails
set -e

echo "📦 Installing Node.js..."
brew install node

echo "📦 Installing npm dependencies..."
npm install

echo "🔄 Syncing Capacitor projects..."
npx cap sync ios

echo "✅ Dependencies installed and project synced."
