# Phase 2 Visual Test Documentation

## Overview

This document provides instructions for capturing screenshots and generating visual test reports for the Hospital SSO Management system.

## Prerequisites

1. **Development Environment**
   - Node.js v20+ installed
   - All dependencies installed (`npm install`)
   - Playwright browsers installed (`npx playwright install`)

2. **Application Running**
   - Start the development server: `npm run dev`
   - Application should be accessible at `http://localhost:3002`

## Quick Start

To generate a visual test report with screenshots:

```bash
# 1. Start the development server (in one terminal)
npm run dev

# 2. Generate visual report (in another terminal)
./scripts/generate-visual-report.sh
```

The report will be generated at `test-reports/visual-test-report.html` and will open automatically.

## What Gets Captured

### 1. **Main Application States**
- Landing page
- Sign-in page (if not authenticated)
- SSO Management dashboard
- Empty state (no connections)
- Loading state
- Error state

### 2. **SSO Connection Management**
- Create connection dialog (empty)
- Create connection dialog (filled with data)
- Department dropdown expanded
- Connection list with hover states
- Phase 2 backend integration status

### 3. **Mobile Responsive Views**
- Mobile dashboard (375x812 viewport)
- Mobile create dialog
- Touch-friendly interface elements

### 4. **Hospital-Specific Features**
- All 7 department options:
  - General Hospital Access
  - Emergency Department
  - Intensive Care Unit
  - Surgery Department
  - Laboratory
  - Radiology
  - Pharmacy
  - Administration
- Role selections (Doctor, Nurse, Technician, Administrator)
- SAML metadata configuration

## Manual Screenshot Capture

If you need to capture screenshots manually:

```bash
# Run the Playwright test directly
npx playwright test tests/e2e/capture-screenshots.spec.ts --headed
```

Use `--headed` to see the browser while screenshots are being captured.

## Customizing Screenshots

To add new screenshots, edit `tests/e2e/capture-screenshots.spec.ts`:

```typescript
// Add a new screenshot
await page.screenshot({
  path: path.join(SCREENSHOTS_DIR, 'my-new-screenshot.png'),
  fullPage: true // or use clip for partial screenshots
});
```

## Test Report Features

The generated HTML report includes:

1. **Interactive Screenshots**
   - Click any screenshot to view full size
   - Lightbox view with escape key support
   - Organized by categories

2. **Status Indicators**
   - Each screenshot marked as CAPTURED
   - Visual feedback for test completion

3. **Mobile Device Frames**
   - Mobile screenshots displayed in device frames
   - Realistic representation of mobile experience

## Troubleshooting

### Application Not Running
```
⚠️  Application not running at http://localhost:3002
Please start the development server first:
  npm run dev
```

**Solution**: Start the dev server before running the visual report script.

### Authentication Issues
If the test can't sign in:
1. Check that Clerk is properly configured in `.env.local`
2. Use dev instance bypass if available
3. Create a test user if needed

### Missing Screenshots
If some screenshots are missing:
1. Check the browser console for errors
2. Increase wait times in the test
3. Verify selectors match current UI

### Playwright Issues
```bash
# Reinstall Playwright browsers
npx playwright install

# Run with debug mode
DEBUG=pw:api npx playwright test
```

## Generated Files

After running the visual report generator:

```
test-reports/
├── screenshots/
│   ├── 00-landing-page.png
│   ├── 01-sso-management-main.png
│   ├── 02-empty-state.png
│   ├── 03-create-dialog-empty.png
│   ├── 04-create-dialog-filled.png
│   ├── 05-department-dropdown.png
│   ├── 06-phase2-status.png
│   ├── 07-mobile-view.png
│   ├── 08-mobile-dialog.png
│   ├── 09-loading-state.png
│   └── 10-error-state.png
└── visual-test-report.html
```

## Best Practices

1. **Consistent Environment**
   - Always use the same viewport sizes
   - Clear browser cache between runs if needed
   - Use consistent test data

2. **Screenshot Quality**
   - Capture at appropriate zoom levels
   - Wait for animations to complete
   - Include relevant UI context

3. **Documentation**
   - Label screenshots clearly
   - Include state descriptions
   - Document any special setup required

## Integration with CI/CD

To run visual tests in CI:

```yaml
# Example GitHub Actions workflow
- name: Install Playwright
  run: npx playwright install --with-deps

- name: Start application
  run: npm run dev &

- name: Wait for app
  run: npx wait-on http://localhost:3002

- name: Capture screenshots
  run: npx playwright test tests/e2e/capture-screenshots.spec.ts

- name: Upload screenshots
  uses: actions/upload-artifact@v3
  with:
    name: screenshots
    path: test-reports/
```

## Summary

The visual test documentation system provides:
- ✅ Automated screenshot capture
- ✅ Beautiful HTML reports
- ✅ Mobile responsive testing
- ✅ All application states covered
- ✅ Hospital-specific features documented
- ✅ Easy to maintain and extend

Use this system to document UI changes, validate implementations, and provide visual proof of functionality for stakeholders.
