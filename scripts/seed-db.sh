#!/bin/bash

# Script to seed test data into the database

echo "🌱 Database Seeding Script"
echo "========================"
echo ""

# Check if organization ID is provided
if [ -z "$1" ]; then
    echo "⚠️  No organization ID provided!"
    echo ""
    echo "Usage: ./scripts/seed-db.sh <organization-id>"
    echo ""
    echo "To find your organization ID:"
    echo "1. Sign in to your app"
    echo "2. Open browser DevTools (F12)"
    echo "3. Go to Application > Local Storage"
    echo "4. Look for Clerk session data"
    echo "5. Find the 'org_' prefixed ID"
    echo ""
    echo "Example: ./scripts/seed-db.sh org_2abc123def456"
    exit 1
fi

export TEST_ORG_ID=$1

echo "Using Organization ID: $TEST_ORG_ID"
echo ""

# Run the TypeScript seeding script
echo "Running database seed..."
npx tsx scripts/seed-test-data.ts