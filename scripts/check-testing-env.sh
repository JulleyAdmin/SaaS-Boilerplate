#!/bin/bash

# Quick health check for UI testing environment

echo "🏥 HospitalOS UI Testing Environment Check"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

check_service() {
    local url=$1
    local name=$2
    
    if curl -f -s "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $name is running${NC}"
        return 0
    else
        echo -e "${RED}❌ $name is not accessible${NC}"
        return 1
    fi
}

echo ""
echo "🔍 Checking Services..."

# Check main app
check_service "http://localhost:3000" "HospitalOS App (localhost:3000)"

# Check Jackson SSO
check_service "http://localhost:5225/api/v1/health" "Jackson SSO Service (localhost:5225)"

# Check database
echo ""
echo "🗄️  Checking Database..."
if pg_isready -h localhost -p 5432 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ PostgreSQL is running${NC}"
else
    echo -e "${RED}❌ PostgreSQL is not running${NC}"
fi

# Check Docker
echo ""
echo "🐳 Checking Docker Services..."
if docker ps | grep -q jackson-hospitalos; then
    echo -e "${GREEN}✅ Jackson container is running${NC}"
else
    echo -e "${RED}❌ Jackson container not found${NC}"
    echo -e "${YELLOW}   Run: docker run -d --name jackson-hospitalos -p 5225:5225 boxyhq/jackson${NC}"
fi

# Check environment file
echo ""
echo "⚙️  Checking Configuration..."
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✅ .env.local exists${NC}"
    
    # Check key variables
    if grep -q "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY" .env.local; then
        echo -e "${GREEN}✅ Clerk configuration found${NC}"
    else
        echo -e "${YELLOW}⚠️  Clerk configuration may be incomplete${NC}"
    fi
    
    if grep -q "DATABASE_URL" .env.local; then
        echo -e "${GREEN}✅ Database URL configured${NC}"
    else
        echo -e "${YELLOW}⚠️  Database URL not found${NC}"
    fi
else
    echo -e "${RED}❌ .env.local not found${NC}"
    echo -e "${YELLOW}   Run: ./scripts/setup-ui-testing.sh${NC}"
fi

# Check if development server is ready
echo ""
echo "🚀 Development Server Status..."
if check_service "http://localhost:3000/api/health" "API Health Endpoint"; then
    echo -e "${GREEN}✅ Development server is ready for testing${NC}"
else
    echo -e "${YELLOW}⚠️  Development server may not be running${NC}"
    echo -e "${YELLOW}   Run: npm run dev${NC}"
fi

echo ""
echo "📋 Next Steps:"
echo "==============="

if curl -f -s "http://localhost:3000" > /dev/null 2>&1 && curl -f -s "http://localhost:5225/api/v1/health" > /dev/null 2>&1; then
    echo -e "${GREEN}🎉 Environment is ready for UI testing!${NC}"
    echo ""
    echo "📚 Open the testing documentation:"
    echo "   • UI Testing Plan: docs/PHASE_1_UI_TESTING_PLAN.md"
    echo "   • Testing Checklist: docs/UI_TESTING_CHECKLIST.md"
    echo ""
    echo "🧪 Start testing:"
    echo "   1. Open http://localhost:3000 in your browser"
    echo "   2. Create test organization in Clerk dashboard"
    echo "   3. Begin with Scenario 1: SSO Connection Management"
    echo ""
    echo "🛠️  Test helper commands:"
    echo "   • node scripts/test-sso-ui.js test-data"
    echo "   • node scripts/test-sso-ui.js scenarios"
    echo "   • node scripts/test-sso-ui.js urls"
else
    echo -e "${RED}⚠️  Environment needs setup${NC}"
    echo ""
    echo "🔧 Run these commands:"
    echo "   1. ./scripts/setup-ui-testing.sh"
    echo "   2. npm run dev"
    echo "   3. ./scripts/check-testing-env.sh (run this again)"
fi

echo ""