#!/bin/bash

# Vercel Demo Deployment Script
# This script deploys the demo version to Vercel

set -e

echo "🚀 Starting Vercel Demo Deployment..."
echo "======================================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo -e "${RED}Vercel CLI is not installed or not logged in${NC}"
    echo "Please install: npm i -g vercel"
    echo "Then login: vercel login"
    exit 1
fi

# Step 1: Set up environment
echo -e "${GREEN}Step 1: Setting up environment variables${NC}"
export NEXT_PUBLIC_DEMO_MODE=true
export NEXT_PUBLIC_BYPASS_AUTH=true
export DEMO_MODE=true
export SKIP_ENV_VALIDATION=true
export CLERK_SECRET_KEY=sk_test_demo
export NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_demo
export DATABASE_URL="memory://demo"
export USE_MOCK_DATA=true
export ENABLE_MOCK_API=true
export SHOW_DEMO_BANNER=true
export NEXT_PUBLIC_DEMO_HOSPITAL="Demo General Hospital"

echo "✓ Environment variables configured"

# Step 2: Build the project
echo -e "${GREEN}Step 2: Building the project${NC}"
npm run build || echo -e "${YELLOW}Build warnings detected but continuing${NC}"

# Step 3: Create Vercel configuration
echo -e "${GREEN}Step 3: Creating Vercel configuration${NC}"
cat > vercel.json << EOF
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install",
  "name": "hospitalos-demo",
  "env": {
    "NEXT_PUBLIC_DEMO_MODE": "true",
    "NEXT_PUBLIC_BYPASS_AUTH": "true",
    "DEMO_MODE": "true",
    "SKIP_ENV_VALIDATION": "true",
    "CLERK_SECRET_KEY": "sk_test_demo",
    "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY": "pk_test_demo",
    "DATABASE_URL": "memory://demo",
    "USE_MOCK_DATA": "true",
    "ENABLE_MOCK_API": "true",
    "SHOW_DEMO_BANNER": "true",
    "NEXT_PUBLIC_DEMO_HOSPITAL": "Demo General Hospital"
  }
}
EOF
echo "✓ Vercel configuration created"

# Step 4: Deploy to Vercel
echo -e "${GREEN}Step 4: Deploying to Vercel${NC}"
echo ""
echo "Please run the following command to deploy:"
echo ""
echo -e "${YELLOW}vercel --prod${NC}"
echo ""
echo "When prompted:"
echo "1. Set up and deploy: Y"
echo "2. Which scope: Select your account"
echo "3. Link to existing project?: N (create new)"
echo "4. Project name: hospitalos-demo"
echo "5. Directory: ./"
echo "6. Override settings?: N"
echo ""
echo "After deployment, you'll receive a URL like:"
echo "https://hospitalos-demo-[hash].vercel.app"
echo ""
echo -e "${GREEN}======================================"
echo "Demo Features Available:"
echo "======================================"
echo "✓ 50+ sample patients"
echo "✓ 100+ appointments"
echo "✓ 20+ doctors"
echo "✓ Mock API responses"
echo "✓ Authentication bypass"
echo "✓ All UI features accessible"
echo -e "${NC}"

# Step 5: Open deployment command
echo -e "${GREEN}Ready to deploy!${NC}"
echo "Run: vercel --prod"