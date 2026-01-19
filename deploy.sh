#!/bin/bash
set -e

echo "🚀 Starting deployment..."

# Navigate to the project directory
cd /home/darayya/domains/darayyaconnect.com/public_html

# Enter maintenance mode
echo "🚧 Entering maintenance mode..."
php artisan down || echo "Already down"

# Pull the latest changes from the main branch
echo "📥 Pulling latest changes..."
git reset --hard HEAD
git clean -fd
git pull origin main

# Install PHP dependencies
echo "📦 Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

# Install Node dependencies and build assets
echo "🏗️ Building frontend assets..."
npm install
npm run build

# Run database migrations and seed admin
echo "🗄️ Running migrations and seeding admin..."
php artisan migrate --force
php artisan db:seed --class=AdminUserSeeder --force

# Ensure storage link exists
echo "🔗 Linking storage..."
php artisan storage:link --quiet || echo "Storage link already exists"

# Recache everything
echo "⚡ Optimizing Laravel..."
php artisan optimize
php artisan view:cache

# Exit maintenance mode
echo "☀️ Exiting maintenance mode..."
php artisan up

echo "✅ Deployment finished successfully!"
