# 🎭 Hospital Management System - Demo Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying a UI-only demo version of the Hospital Management System. The demo mode allows stakeholders to explore all features without backend dependencies, using mock data and simulated API responses.

## 🚀 Quick Start

### 1. Switch to Demo Branch
```bash
git checkout ui-demo-deployment
```

### 2. Deploy to Vercel (Automatic)
```bash
chmod +x scripts/deploy-demo.sh
./scripts/deploy-demo.sh
```

### 3. Access Demo
- **URL**: https://hospitalos-demo.vercel.app
- **Sign In**: Click "Sign In to Demo" (no credentials needed)

## 📋 Features

### Demo Capabilities
- ✅ **50+ Sample Patients** with complete medical histories
- ✅ **100+ Appointments** across multiple departments
- ✅ **20+ Doctors** with various specializations
- ✅ **5 Departments** (Emergency, ICU, Surgery, etc.)
- ✅ **Real-time Dashboard** with live statistics
- ✅ **Prescription Management** with medication tracking
- ✅ **Lab Test Results** with sample reports
- ✅ **Billing System** with insurance claims
- ✅ **Authentication Bypass** for easy access
- ✅ **API Interception** with realistic response delays

### Mock Data Categories

#### Patients
- Registration numbers, personal information
- Medical history, allergies, chronic conditions
- Current medications and vital signs
- Insurance information
- Emergency contacts

#### Appointments
- Scheduled, confirmed, in-progress, completed statuses
- Multiple appointment types (consultation, follow-up, emergency)
- Doctor assignments and room allocations
- Time slots and duration tracking

#### Medical Records
- Prescriptions with dosage instructions
- Lab test results with reference ranges
- Diagnostic reports
- Treatment history

#### Billing
- Itemized bills with tax calculations
- Insurance claims processing
- Payment status tracking
- Multiple payment methods

## 🏗️ Architecture

### Demo Mode Components

```
src/
├── lib/
│   └── demo/
│       ├── mockDataProvider.ts    # Mock data generation
│       ├── apiInterceptor.ts      # API call interception
│       └── authProvider.tsx       # Demo authentication
├── app/
│   └── demo-provider.tsx          # Demo context provider
└── scripts/
    └── deploy-demo.sh              # Deployment script
```

### How It Works

1. **Environment Detection**: Checks `NEXT_PUBLIC_DEMO_MODE` flag
2. **API Interception**: Intercepts fetch calls to `/api/*` routes
3. **Mock Data Generation**: Uses faker.js for realistic data
4. **Authentication Bypass**: Auto-signs in demo user
5. **State Management**: Maintains session state in localStorage

## 🔧 Configuration

### Environment Variables

Create `.env.demo` file:
```env
# Demo Mode
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_BYPASS_AUTH=true
DEMO_MODE=true

# Mock Authentication
CLERK_SECRET_KEY=sk_test_demo_only
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_demo_only

# Disable External Services
DATABASE_URL=memory://demo
USE_MOCK_DATA=true
ENABLE_MOCK_API=true

# Demo Settings
NEXT_PUBLIC_DEMO_HOSPITAL="Demo General Hospital"
SHOW_DEMO_BANNER=true
```

### Vercel Configuration

The `vercel.demo.json` file contains:
- Environment variable mappings
- Build settings
- Caching headers
- Redirect rules
- Function configurations

## 📦 Deployment

### Method 1: Automatic Deployment (Recommended)

```bash
# Run deployment script
./scripts/deploy-demo.sh
```

This script will:
1. Set up demo environment
2. Install dependencies
3. Build the application
4. Deploy to Vercel
5. Create deployment info

### Method 2: Manual Deployment

```bash
# Step 1: Set environment
cp .env.demo .env.local

# Step 2: Install dependencies
npm ci

# Step 3: Build
NEXT_PUBLIC_DEMO_MODE=true npm run build

# Step 4: Deploy to Vercel
vercel --prod --env-file .env.demo
```

### Method 3: GitHub Actions

Push to `ui-demo-deployment` branch to trigger automatic deployment:

```bash
git add .
git commit -m "feat: demo deployment update"
git push origin ui-demo-deployment
```

## 🔄 Continuous Deployment

### GitHub Actions Workflow

The `.github/workflows/deploy-demo.yml` workflow:

1. **Triggers**:
   - Push to `ui-demo-deployment` branch
   - Pull requests to demo branch
   - Manual workflow dispatch

2. **Steps**:
   - Checkout code
   - Setup Node.js
   - Install dependencies
   - Run tests (non-blocking)
   - Build application
   - Deploy to Vercel
   - Run Lighthouse checks
   - Post deployment comment (PRs)

3. **Environments**:
   - Uses `demo` environment
   - Requires Vercel secrets

### Setting Up Secrets

Add to GitHub repository secrets:
```
VERCEL_TOKEN=<your-vercel-token>
VERCEL_ORG_ID=<your-org-id>
VERCEL_PROJECT_ID_DEMO=<demo-project-id>
```

## 🧪 Testing Demo Mode

### Local Testing

```bash
# Start demo server locally
npm run demo:start

# Run demo tests
npm run demo:test

# Check demo health
npm run demo:health
```

### E2E Testing

```bash
# Run Playwright tests in demo mode
E2E_TESTING=true DEMO_MODE=true npm run test:e2e
```

## 🎨 Customization

### Adding Mock Data

Edit `src/lib/demo/mockDataProvider.ts`:

```typescript
// Add new data type
export interface MockCustomData {
  id: string;
  // ... fields
}

// Add generation method
generateCustomData(count: number = 10): MockCustomData[] {
  // ... implementation
}
```

### Adding API Routes

Edit `src/lib/demo/apiInterceptor.ts`:

```typescript
// Add route handler
private handleCustomRoutes(pathname: string, method: string): MockResponse {
  if (pathname === '/api/custom' && method === 'GET') {
    return {
      data: mockDataProvider.generateCustomData(),
      status: 200
    };
  }
  // ... more routes
}
```

### Customizing Demo Banner

Edit `src/lib/demo/authProvider.tsx`:

```typescript
export function DemoBanner() {
  // Customize banner appearance and message
}
```

## 🔍 Monitoring

### Deployment Status

Check deployment status:
- **Vercel Dashboard**: https://vercel.com/dashboard
- **GitHub Actions**: Actions tab in repository
- **Deployment Info**: `/public/demo-deployment.json`

### Performance Metrics

Lighthouse scores are automatically generated:
- Performance
- Accessibility
- Best Practices
- SEO

### Analytics

Demo mode includes basic analytics:
- Page views
- Feature usage
- Error tracking (console only)

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm ci
npm run build
```

#### 2. API Interception Not Working
- Check `NEXT_PUBLIC_DEMO_MODE=true` is set
- Verify `demoApiInterceptor.init()` is called
- Check browser console for errors

#### 3. Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Check demo auth provider is wrapped correctly
- Verify environment variables

#### 4. Mock Data Not Loading
- Check `mockDataProvider` initialization
- Verify cache isn't corrupted
- Call `mockDataProvider.clearCache()`

### Debug Mode

Enable debug logging:
```javascript
// In browser console
localStorage.setItem('demo_debug', 'true');
location.reload();
```

## 🔒 Security Considerations

### Demo Mode Security

- ✅ No real patient data
- ✅ No database connections
- ✅ No external API calls
- ✅ Session data in localStorage only
- ✅ Robots.txt blocks indexing
- ✅ X-Robots-Tag headers

### Best Practices

1. **Never use production data** in demo mode
2. **Disable demo mode** in production builds
3. **Use separate domain** for demo deployment
4. **Regular security audits** of demo code
5. **Monitor for accidental data exposure**

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Deployment](https://vercel.com/docs)
- [GitHub Actions](https://docs.github.com/actions)

### Support
- **Issues**: Create issue in GitHub repository
- **Discussions**: Use GitHub Discussions
- **Email**: support@hospitalos.demo

## 📝 Maintenance

### Regular Updates

1. **Weekly**: Update mock data patterns
2. **Bi-weekly**: Review and fix demo bugs
3. **Monthly**: Update dependencies
4. **Quarterly**: Major feature additions

### Version Management

Demo versions follow pattern: `demo-vYYYYMMDD-HHMMSS`

Example: `demo-v20240315-143022`

## 🎉 Success Metrics

### Demo Engagement
- User session duration
- Features explored
- Feedback collected
- Conversion to production inquiry

### Technical Metrics
- Deployment success rate
- Page load performance
- Error rate
- Uptime percentage

---

## Quick Commands Reference

```bash
# Local development
npm run dev                    # Start dev server
npm run demo:start            # Start demo server

# Testing
npm run demo:test             # Run demo tests
npm run demo:validate         # Validate demo setup

# Deployment
./scripts/deploy-demo.sh      # Deploy to Vercel
vercel --prod                 # Manual deploy

# Maintenance
npm run demo:reset            # Reset demo data
npm run demo:logs             # View demo logs
```

---

**Last Updated**: March 2024
**Version**: 1.0.0
**Maintainer**: Hospital OS Team