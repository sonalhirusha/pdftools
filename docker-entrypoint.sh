#!/bin/sh
set -e

echo "Running database setup..."
npx prisma generate
npx prisma db push --accept-data-loss 2>/dev/null || echo "DB push skipped (will be retried at runtime)"

echo "Starting application..."
exec "$@"
