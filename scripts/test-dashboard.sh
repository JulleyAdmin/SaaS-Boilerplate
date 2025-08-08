#!/bin/bash

# Dashboard Testing Script for Hospital Management System
# This script helps validate and test the recently created dashboard pages

echo "🏥 Hospital Management System - Dashboard Testing"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color
BLUE='\033[0;34m'

# Check if development server is running
check_server() {
    echo "Checking if development server is running..."
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:3002 | grep -q "200\|301\|302"; then
        echo -e "${GREEN}✓ Server is running on port 3002${NC}"
        return 0
    else
        echo -e "${YELLOW}⚠ Server is not running on port 3002${NC}"
        return 1
    fi
}

# Start development server
start_server() {
    echo ""
    echo "Would you like to start the development server? (y/n)"
    read -r response
    if [[ "$response" == "y" ]]; then
        echo "Starting development server..."
        echo -e "${BLUE}Running: npm run dev${NC}"
        npm run dev &
        SERVER_PID=$!
        echo "Server starting with PID: $SERVER_PID"
        echo "Waiting for server to be ready..."
        sleep 10
        
        if check_server; then
            echo -e "${GREEN}✓ Server started successfully${NC}"
        else
            echo -e "${RED}✗ Failed to start server${NC}"
            exit 1
        fi
    fi
}

# Test a single page
test_page() {
    local url=$1
    local name=$2
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3002$url")
    
    if [[ "$response" == "200" ]]; then
        echo -e "  ${GREEN}✓${NC} $name - $url"
        return 0
    elif [[ "$response" == "404" ]]; then
        echo -e "  ${RED}✗${NC} $name - $url (404 Not Found)"
        return 1
    else
        echo -e "  ${YELLOW}⚠${NC} $name - $url (Status: $response)"
        return 1
    fi
}

# Main testing function
run_tests() {
    echo ""
    echo "Testing Dashboard Pages:"
    echo "------------------------"
    
    local total=0
    local success=0
    
    echo ""
    echo -e "${BLUE}Reception Dashboard:${NC}"
    test_page "/dashboard/queue" "Queue Management" && ((success++))
    ((total++))
    test_page "/dashboard/registration" "Patient Registration" && ((success++))
    ((total++))
    test_page "/dashboard/tokens" "Token Generation" && ((success++))
    ((total++))
    
    echo ""
    echo -e "${BLUE}Nurse Dashboard:${NC}"
    test_page "/dashboard/beds" "Bed Management" && ((success++))
    ((total++))
    test_page "/dashboard/medication-administration" "Medication Administration" && ((success++))
    ((total++))
    test_page "/dashboard/nursing-notes" "Nursing Notes" && ((success++))
    ((total++))
    
    echo ""
    echo -e "${BLUE}General Dashboard:${NC}"
    test_page "/dashboard/consultations" "Consultations" && ((success++))
    ((total++))
    test_page "/dashboard/analytics" "Real-time Analytics" && ((success++))
    ((total++))
    test_page "/dashboard/emergency" "Emergency Department" && ((success++))
    ((total++))
    
    echo ""
    echo -e "${BLUE}Billing Dashboard:${NC}"
    test_page "/dashboard/billing/insurance" "Insurance Claims" && ((success++))
    ((total++))
    test_page "/dashboard/billing" "Billing Overview" && ((success++))
    ((total++))
    
    echo ""
    echo "=================================================="
    echo -e "Test Results: ${GREEN}$success${NC}/${total} pages loaded successfully"
    
    if [[ $success -eq $total ]]; then
        echo -e "${GREEN}✓ All pages are working!${NC}"
    else
        echo -e "${YELLOW}⚠ Some pages need attention${NC}"
    fi
}

# Open browser for visual testing
open_browser() {
    echo ""
    echo "Would you like to open the dashboard in your browser? (y/n)"
    read -r response
    if [[ "$response" == "y" ]]; then
        echo "Opening dashboard..."
        if [[ "$OSTYPE" == "darwin"* ]]; then
            open "http://localhost:3002/dashboard"
        elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
            xdg-open "http://localhost:3002/dashboard"
        else
            echo "Please open http://localhost:3002/dashboard in your browser"
        fi
    fi
}

# Run validation script
run_validation() {
    echo ""
    echo "Would you like to run the detailed validation script? (y/n)"
    read -r response
    if [[ "$response" == "y" ]]; then
        echo ""
        echo "Running validation script..."
        node scripts/validate-dashboard-pages.js
    fi
}

# Main execution
main() {
    # Check if server is running
    if ! check_server; then
        start_server
    fi
    
    # Run tests
    run_tests
    
    # Open browser
    open_browser
    
    # Run validation
    run_validation
    
    echo ""
    echo "=================================================="
    echo "Testing complete!"
    echo ""
    echo "Quick Links for Manual Testing:"
    echo "  Reception: http://localhost:3002/dashboard/queue"
    echo "  Nurse: http://localhost:3002/dashboard/beds"
    echo "  Analytics: http://localhost:3002/dashboard/analytics"
    echo "  Emergency: http://localhost:3002/dashboard/emergency"
    echo ""
    echo "HTML Tester: Open scripts/test-dashboard-ui.html in your browser"
}

# Run the main function
main