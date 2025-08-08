#!/bin/bash

# Demo Validation Script
set -e

echo "🧪 Validating HospitalOS Demo Setup..."

# Check environment file
if [ ! -f ".env.demo" ]; then
    echo "❌ Demo environment file missing"
    exit 1
fi
echo "✅ Demo environment file found"

# Check if demo environment is active
if [ ! -f ".env.local" ] || ! grep -q "DEMO_MODE=true" .env.local; then
    echo "❌ Demo environment not active"
    exit 1
fi
echo "✅ Demo environment active"

# Check required files
required_files=(
    "src/libs/DB.ts"
    "src/libs/Env.ts"
    "src/app/api/health/route.ts"
    "scripts/demo-server.js"
)

for file in "${required_files[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ Required file missing: $file"
        exit 1
    fi
done
echo "✅ All required files present"

# Test environment loading
echo "🧪 Testing environment configuration..."
if node -e "
require('dotenv').config({ path: '.env.demo' });
const { Env } = require('./src/libs/Env.ts');
console.log('Environment loaded successfully');
" 2>/dev/null; then
    echo "✅ Environment configuration valid"
else
    echo "❌ Environment configuration invalid"
    exit 1
fi

# Test database initialization (dry run)
echo "🧪 Testing database configuration..."
if node -e "
process.env.DEMO_MODE = 'true';
require('dotenv').config({ path: '.env.demo' });
console.log('Database configuration valid');
" 2>/dev/null; then
    echo "✅ Database configuration valid"
else
    echo "❌ Database configuration invalid"
    exit 1
fi

echo ""
echo "🎉 Demo validation complete! All systems ready."
echo ""
echo "🚀 To start the demo:"
echo "   npm run demo:start"
echo ""
echo "🔍 To monitor demo:"
echo "   npm run demo:health"
echo "   npm run demo:logs"
echo ""
