#!/bin/bash
# Fix 503 and update application

# Stop on error
set -e

echo "🚀 Starting update..."

# 1. Bring app down (optional, but safe)
# php artisan down

# 2. Pull changes (if using git)
# git pull origin main

# 3. Install dependencies
# composer install --no-interaction --prefer-dist --optimize-autoloader

# 4. Migrate database
php artisan migrate --force

# 5. Clear caches
php artisan optimize:clear
php artisan config:clear
php artisan cache:clear
php artisan route:clear
php artisan view:clear

# 6. Bring app up
echo "🔌 Bringing application online..."
php artisan up

echo "✅ Update complete!"
