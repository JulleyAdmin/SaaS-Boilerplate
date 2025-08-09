#!/bin/bash

# Demo Deployment Script for Hospital Management System
# This script prepares and deploys the demo version

set -e

echo "🚀 Starting Demo Deployment Process..."
echo "======================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if on demo branch
CURRENT_BRANCH=$(git branch --show-current)
if [ "$CURRENT_BRANCH" != "ui-demo-deployment" ]; then
    echo -e "${YELLOW}Warning: Not on ui-demo-deployment branch${NC}"
    echo "Current branch: $CURRENT_BRANCH"
    read -p "Do you want to continue? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Step 1: Copy demo environment
echo -e "${GREEN}Step 1: Setting up demo environment${NC}"
cp .env.demo .env.local
echo "✓ Demo environment configured"

# Step 2: Install dependencies
echo -e "${GREEN}Step 2: Installing dependencies${NC}"
npm ci --prefer-offline --no-audit
echo "✓ Dependencies installed"

# Step 3: Run type checking
echo -e "${GREEN}Step 3: Type checking${NC}"
npm run check-types || echo -e "${YELLOW}Type errors detected but continuing for demo${NC}"

# Step 4: Build the application
echo -e "${GREEN}Step 4: Building application${NC}"
NEXT_PUBLIC_DEMO_MODE=true npm run build
echo "✓ Application built successfully"

# Step 5: Create deployment info file
echo -e "${GREEN}Step 5: Creating deployment info${NC}"
cat > public/demo-info.json << EOF
{
  "version": "$(node -p "require('./package.json').version")",
  "deployedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "branch": "$CURRENT_BRANCH",
  "commit": "$(git rev-parse --short HEAD)",
  "demoMode": true,
  "features": {
    "mockData": true,
    "authBypass": true,
    "apiInterception": true,
    "samplePatients": 50,
    "sampleAppointments": 100,
    "sampleDoctors": 20
  }
}
EOF
echo "✓ Deployment info created"

# Step 6: Deploy to Vercel
echo -e "${GREEN}Step 6: Deploying to Vercel${NC}"
if command -v vercel &> /dev/null; then
    vercel --prod --yes --env-file .env.demo --name hospitalos-demo
    echo "✓ Deployed to Vercel successfully"
else
    echo -e "${YELLOW}Vercel CLI not found. Install with: npm i -g vercel${NC}"
    echo "Manual deployment command:"
    echo "vercel --prod --yes --env-file .env.demo --name hospitalos-demo"
fi

# Step 7: Clean up
echo -e "${GREEN}Step 7: Cleaning up${NC}"
rm -f .env.local
echo "✓ Cleanup completed"

echo ""
echo -e "${GREEN}======================================"
echo "🎉 Demo deployment process completed!"
echo "======================================"
echo ""
echo "Demo URL: https://hospitalos-demo.vercel.app"
echo ""
echo "Demo Credentials:"
echo "  Email: admin@demo.hospital.com"
echo "  Password: (any password - auth is bypassed)"
echo ""
echo "Features available in demo:"
echo "  ✓ 50+ sample patients"
echo "  ✓ 100+ appointments"
echo "  ✓ 20+ doctors"
echo "  ✓ Mock API responses"
echo "  ✓ All UI features accessible"
echo -e "${NC}"