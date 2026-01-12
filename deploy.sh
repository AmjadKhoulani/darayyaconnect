#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Navigate to the project directory
cd /home/darayya/domains/darayyaconnect.com/public_html

# Pull the latest changes from the main branch
echo "📥 Pulling latest changes..."
git pull origin main

# Install PHP dependencies
echo "📦 Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

# Install Node dependencies and build assets
echo "🏗️ Building frontend assets..."
npm install
npm run build

# Clear and cache configuration
echo "⚡ Preparing environment..."
php artisan config:clear

# Run database migrations and seed admin
echo "🗄️ Running migrations and seeding admin..."
php artisan migrate --force
php artisan db:seed --class=AdminUserSeeder --force

# Recache everything
echo "⚡ Optimizing Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

echo "✅ Deployment finished successfully!"
