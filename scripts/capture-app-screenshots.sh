#!/bin/bash

echo "📸 Hospital SSO Screenshot Capture Tool"
echo "======================================="
echo ""

# Check if app is running
if ! curl -s http://localhost:3002 > /dev/null; then
    echo "❌ Application not running at http://localhost:3002"
    echo ""
    echo "Please start the development server:"
    echo "  npm run dev"
    echo ""
    echo "Then run this script again."
    exit 1
fi

echo "✅ Application is running"
echo ""

# Create screenshots directory
mkdir -p test-reports/screenshots

# Show options
echo "Choose capture method:"
echo "1. Interactive capture (browser opens, 30 seconds to navigate)"
echo "2. Quick capture (attempts direct navigation)"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting interactive capture..."
        echo ""
        echo "A browser will open. You have 30 seconds to:"
        echo "  1. Sign in to the application"
        echo "  2. Navigate to SSO Management"
        echo "  3. Wait for automatic screenshot capture"
        echo ""
        read -p "Press Enter to continue..."
        
        node scripts/capture-screenshots-simple.js
        ;;
    2)
        echo ""
        echo "🚀 Starting quick capture..."
        npx playwright test tests/e2e/capture-direct-screenshots.spec.ts --reporter=list
        ;;
    *)
        echo "Invalid choice. Exiting."
        exit 1
        ;;
esac

echo ""
echo "📊 Generating comprehensive report..."

# Count screenshots
screenshot_count=$(ls test-reports/screenshots/*.png 2>/dev/null | wc -l)

if [ $screenshot_count -gt 0 ]; then
    echo "✅ Captured $screenshot_count screenshots"
    echo ""
    echo "📁 Screenshot files:"
    ls -la test-reports/screenshots/*.png | awk '{print "   " $9 " (" $5 " bytes)"}'
    echo ""
    echo "📄 Reports generated:"
    ls test-reports/*.html 2>/dev/null | awk '{print "   " $1}'
    echo ""
    echo "🌐 To view screenshots:"
    echo "   open test-reports/live-screenshot-report.html"
    echo "   # or #"
    echo "   open test-reports/visual-test-report.html"
else
    echo "⚠️  No screenshots were captured"
    echo ""
    echo "Troubleshooting:"
    echo "  - Make sure you signed in successfully"
    echo "  - Navigate to the SSO Management page"
    echo "  - Check that the application is working correctly"
fi

echo ""
echo "✨ Screenshot capture complete!"