#!/bin/sh
set -e

# Wait for the database to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Run migrations
echo "Running database migrations..."
bunx prisma migrate deploy

# Start the application
echo "Starting the application..."
exec "$@"
