#!/bin/bash

# HospitalOS Comprehensive UI Review Script
# This script runs the server with enhanced logging and executes comprehensive Playwright tests

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Timestamp function
timestamp() {
    date '+%Y-%m-%d %H:%M:%S'
}

log() {
    echo -e "${BLUE}[$(timestamp)]${NC} $1"
}

success() {
    echo -e "${GREEN}[$(timestamp)]${NC} ✅ $1"
}

warning() {
    echo -e "${YELLOW}[$(timestamp)]${NC} ⚠️  $1"
}

error() {
    echo -e "${RED}[$(timestamp)]${NC} ❌ $1"
}

# Create logs directory
mkdir -p logs

# Generate log filename with timestamp
LOG_FILE="logs/ui-review-$(date +%Y%m%d-%H%M%S).log"
SERVER_LOG="logs/server-$(date +%Y%m%d-%H%M%S).log"
TEST_REPORT="logs/test-report-$(date +%Y%m%d-%H%M%S).json"

log "🚀 Starting Comprehensive UI Review for HospitalOS"
log "📝 Logs will be saved to: $LOG_FILE"
log "🖥️  Server logs: $SERVER_LOG"
log "📊 Test report: $TEST_REPORT"

# Check if server is already running
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    warning "Server already running on port 3001. Using existing instance."
    SERVER_PID=""
else
    log "🖥️  Starting development server with enhanced logging..."
    
    # Set environment variables for enhanced logging and testing
    export NODE_ENV=development
    export E2E_TESTING=true
    export TESTING=true
    export LOG_LEVEL=debug
    export PINO_LOG_LEVEL=debug
    
    # Start server in background with logging
    npm run dev > "$SERVER_LOG" 2>&1 &
    SERVER_PID=$!
    
    log "🔄 Server starting with PID: $SERVER_PID"
    log "⏳ Waiting for server to be ready..."
    
    # Wait for server to start
    RETRIES=30
    while [ $RETRIES -gt 0 ]; do
        if curl -s http://localhost:3001 >/dev/null 2>&1; then
            success "Server is ready!"
            break
        fi
        sleep 2
        RETRIES=$((RETRIES-1))
        if [ $RETRIES -eq 0 ]; then
            error "Server failed to start within 60 seconds"
            exit 1
        fi
    done
fi

# Function to cleanup on exit
cleanup() {
    log "🧹 Cleaning up..."
    if [ -n "$SERVER_PID" ]; then
        log "🛑 Stopping server (PID: $SERVER_PID)..."
        kill $SERVER_PID 2>/dev/null || true
        wait $SERVER_PID 2>/dev/null || true
    fi
    log "👋 Cleanup complete"
}

# Set trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Install Playwright browsers if needed
log "🌐 Checking Playwright browsers..."
if ! npx playwright --version >/dev/null 2>&1; then
    log "📥 Installing Playwright..."
    npm install -D @playwright/test
fi

if [ ! -d ~/.cache/ms-playwright ]; then
    log "📥 Installing Playwright browsers..."
    npx playwright install
fi

# Configure Playwright for enhanced logging and testing
export PLAYWRIGHT_JSON_OUTPUT_FILE="$TEST_REPORT"
export DEBUG=pw:api
export E2E_TESTING=true
export TESTING=true
export NODE_ENV=test

log "🧪 Running comprehensive UI tests..."

# Create Playwright config for this specific test
cat > playwright.ui-review.config.ts << 'EOF'
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/comprehensive-ui-review.spec.ts',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: 1, // Run tests sequentially for better monitoring
  reporter: [
    ['html', { outputFolder: 'logs/playwright-report' }],
    ['json', { outputFile: process.env.PLAYWRIGHT_JSON_OUTPUT_FILE }],
    ['line']
  ],
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: false, // Run in headed mode for better monitoring
  },
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: undefined, // We start the server manually
});
EOF

# Run the tests
log "🚀 Executing Playwright tests..."
if npx playwright test --config=playwright.ui-review.config.ts --reporter=line,html,json; then
    success "Tests completed successfully!"
    TEST_EXIT_CODE=0
else
    warning "Tests completed with issues"
    TEST_EXIT_CODE=1
fi

# Generate comprehensive report
log "📊 Generating comprehensive report..."

cat > "$LOG_FILE" << EOF
# HospitalOS Comprehensive UI Review Report
Generated: $(date)
Server Log: $SERVER_LOG
Test Report: $TEST_REPORT

## Summary
- Server Status: $(if [ -n "$SERVER_PID" ]; then echo "Started (PID: $SERVER_PID)"; else echo "Using existing instance"; fi)
- Test Execution: $(if [ $TEST_EXIT_CODE -eq 0 ]; then echo "SUCCESS"; else echo "COMPLETED WITH ISSUES"; fi)
- Log Files Generated: 3

## Log Files
1. Server Logs: $SERVER_LOG
2. Test Results: $TEST_REPORT  
3. Playwright Report: logs/playwright-report/index.html

## Next Steps
1. Review server logs for backend issues: tail -f $SERVER_LOG
2. Open Playwright report: open logs/playwright-report/index.html
3. Analyze test results: cat $TEST_REPORT | jq .

## Server Log Analysis
EOF

# Add server log analysis
if [ -f "$SERVER_LOG" ]; then
    echo "" >> "$LOG_FILE"
    echo "### Error Patterns in Server Logs:" >> "$LOG_FILE"
    if grep -i "error\|exception\|failed\|warning" "$SERVER_LOG" | head -20 >> "$LOG_FILE" 2>/dev/null; then
        echo "Found error patterns (showing first 20 lines)" >> "$LOG_FILE"
    else
        echo "No obvious error patterns found in server logs" >> "$LOG_FILE"
    fi
fi

# Show summary
echo ""
success "🎉 Comprehensive UI Review Complete!"
echo ""
log "📋 Report Summary:"
log "   • Server Log: $SERVER_LOG"
log "   • Main Report: $LOG_FILE" 
log "   • Test Results: $TEST_REPORT"
log "   • Playwright HTML Report: logs/playwright-report/index.html"
echo ""
log "🔍 To view results:"
log "   • Server issues: tail -f $SERVER_LOG"
log "   • Open visual report: open logs/playwright-report/index.html"
log "   • Read main report: cat $LOG_FILE"
echo ""

# If test report exists, show quick summary
if [ -f "$TEST_REPORT" ]; then
    if command -v jq >/dev/null 2>&1; then
        log "📊 Quick Test Summary:"
        echo "   • Total Tests: $(jq '.stats.total // 0' "$TEST_REPORT")"
        echo "   • Passed: $(jq '.stats.passed // 0' "$TEST_REPORT")"
        echo "   • Failed: $(jq '.stats.failed // 0' "$TEST_REPORT")"
        echo "   • Duration: $(jq '.stats.duration // 0' "$TEST_REPORT")ms"
    fi
fi

log "✨ Review complete! Check the reports above for detailed findings."

exit $TEST_EXIT_CODE