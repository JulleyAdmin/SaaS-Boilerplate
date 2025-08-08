# Vercel Deployment Guide for HospitalOS Demo

## 🚀 Quick Deploy to Vercel (Recommended for Demo)

### Prerequisites
- Vercel account (free at vercel.com)
- Git repository (GitHub/GitLab/Bitbucket)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Push your code to GitHub**:
```bash
git add .
git commit -m "feat: HMS demo implementation with billing analytics and family management"
git push origin feature/complete-ui-demo
```

2. **Go to Vercel Dashboard**:
   - Visit https://vercel.com/new
   - Import your GitHub repository
   - Select the `hospitalos` repository

3. **Configure Build Settings**:
   - Framework Preset: `Next.js` (auto-detected)
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next` (auto-detected)

4. **Set Environment Variables** (Required):
```env
# Database (Use Vercel Postgres or external DB)
DATABASE_URL=postgresql://[connection-string]

# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_[your-key]
CLERK_SECRET_KEY=sk_test_[your-key]
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Demo Mode (Optional - for demo without real services)
DEMO_MODE=true
NEXT_PUBLIC_DEMO_MODE=true

# Optional Services (Can skip for demo)
STRIPE_SECRET_KEY=sk_test_[your-key]
STRIPE_WEBHOOK_SECRET=whsec_[your-secret]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_[your-key]

# Email (Optional for demo)
EMAIL_SERVER_USER=optional
EMAIL_SERVER_PASSWORD=optional
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_FROM=noreply@hospital.com

# Jackson SSO (Optional for demo)
JACKSON_API_KEY=optional
JACKSON_PRODUCT_ID=optional
JACKSON_URL=https://jackson.boxyhq.com

# Sentry (Optional for demo)
NEXT_PUBLIC_SENTRY_DSN=optional
SENTRY_AUTH_TOKEN=optional
```

### Option 2: Deploy via Vercel CLI

1. **Install dependencies and build**:
```bash
npm install
npm run build
```

2. **Deploy with Vercel CLI**:
```bash
npx vercel

# Follow prompts:
# - Set up and deploy: Y
# - Which scope: Select your account
# - Link to existing project?: N (for first time)
# - Project name: hospitalos-demo
# - In which directory: ./
# - Override settings?: N
```

3. **Set environment variables**:
```bash
npx vercel env add DATABASE_URL
npx vercel env add NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
npx vercel env add CLERK_SECRET_KEY
# Add other required variables...
```

4. **Deploy to production**:
```bash
npx vercel --prod
```

## 🗄️ Database Options for Demo

### Option 1: Vercel Postgres (Easiest)
1. Go to Vercel Dashboard → Storage
2. Create a Postgres database
3. Copy connection string to `DATABASE_URL`

### Option 2: Supabase (Free Tier)
1. Create account at supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string

### Option 3: Neon Database (Free Tier)
1. Sign up at neon.tech
2. Create database
3. Copy connection string

### Option 4: Local SQLite (Demo Only)
```env
DATABASE_URL=file:./dev.db
```

## 🔑 Quick Setup for Demo Services

### Clerk Authentication (Required)
1. Sign up at clerk.com (free tier available)
2. Create application
3. Copy API keys from dashboard

### Demo Mode (No External Services)
Set these environment variables for demo mode:
```env
DEMO_MODE=true
NEXT_PUBLIC_DEMO_MODE=true
SKIP_ENV_VALIDATION=true
```

## 📝 Post-Deployment Steps

1. **Run database migrations**:
```bash
# After deployment, run migrations
npx vercel env pull .env.local
npm run db:migrate
```

2. **Access your demo**:
- Production: `https://hospitalos-demo.vercel.app`
- Preview: Each PR gets a unique URL

## 🎯 Demo-Specific Configuration

### Minimal Environment Variables (Demo Only)
```env
# Required
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Demo flags
DEMO_MODE=true
NEXT_PUBLIC_DEMO_MODE=true
SKIP_ENV_VALIDATION=true

# Disable external services
NEXT_PUBLIC_APP_URL=https://your-demo.vercel.app
```

### Features Available in Demo Mode
✅ Patient Management
✅ Appointment Scheduling
✅ Billing & Payments (Mock)
✅ Family Management
✅ Doctor Dashboard
✅ Lab Management
✅ Pharmacy Management
✅ Emergency Department
✅ Analytics Dashboard
✅ Government Schemes
✅ Insurance Management

### Features Requiring Configuration
- Real payment processing (Stripe)
- Email notifications
- SSO authentication (Jackson)
- Error monitoring (Sentry)

## 🚨 Troubleshooting

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Database Connection Issues
- Ensure DATABASE_URL is properly formatted
- Check if database allows connections from Vercel IPs
- For Vercel Postgres, ensure it's in same region

### Authentication Issues
- Verify Clerk keys are correct
- Check callback URLs in Clerk dashboard
- Ensure NEXT_PUBLIC_CLERK_* variables are set

## 🔗 Alternative: AWS Deployment

If you prefer AWS deployment:

### Option 1: AWS Amplify (Easiest for AWS)
- Similar to Vercel, with automatic deployments
- Integrates with AWS services

### Option 2: EC2 with Docker
- More control but requires setup
- Good for production deployments

### Option 3: AWS Elastic Beanstalk
- Managed platform for Node.js apps
- Auto-scaling capabilities

## 📞 Support

For demo deployment issues:
1. Check Vercel logs: `npx vercel logs`
2. Review build output in Vercel dashboard
3. Ensure all required environment variables are set

## 🎉 Quick Start Commands

```bash
# For immediate demo deployment
git add .
git commit -m "feat: HMS demo ready for deployment"
git push origin feature/complete-ui-demo

# Then visit https://vercel.com/new
# Import your repository and deploy!
```

---

**Note**: This demo deployment is perfect for showcasing the HMS system. For production deployment, additional security configurations and performance optimizations are recommended.