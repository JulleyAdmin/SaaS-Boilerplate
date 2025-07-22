#!/bin/bash

echo "🎨 Generating Visual Test Report for Hospital SSO Management..."

# Create directories
mkdir -p test-reports/screenshots

# Check if the app is running
if ! curl -s http://localhost:3002 > /dev/null; then
    echo "⚠️  Application not running at http://localhost:3002"
    echo "Please start the development server first:"
    echo "  npm run dev"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ Application is running at http://localhost:3002"
echo "📸 Starting screenshot capture..."

# Run Playwright visual tests
npx playwright test tests/e2e/capture-screenshots.spec.ts --reporter=list

# Check if report was generated
if [ -f "test-reports/visual-test-report.html" ]; then
    echo ""
    echo "✅ Visual test report generated successfully!"
    echo "📄 Report location: test-reports/visual-test-report.html"
    echo ""
    echo "To view the report:"
    echo "  open test-reports/visual-test-report.html"
    
    # Open report automatically on macOS
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open test-reports/visual-test-report.html
    fi
else
    echo "❌ Failed to generate visual test report"
    exit 1
fi