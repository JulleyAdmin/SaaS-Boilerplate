# 🚀 Vercel Demo Deployment Instructions

## Prerequisites
1. Install Vercel CLI: `npm i -g vercel`
2. Login to Vercel: `vercel login`
   - Choose your preferred login method (GitHub recommended)
   - Follow the browser authentication flow

## Deployment Steps

### Option 1: Quick Deploy (Recommended)
```bash
# Run the deployment script
./scripts/vercel-deploy.sh

# Then execute the deployment
vercel --prod
```

When prompted:
- **Set up and deploy?** → `Y`
- **Which scope?** → Select your account
- **Link to existing project?** → `N` (create new)
- **Project name?** → `hospitalos-demo`
- **Directory?** → `./` (current directory)
- **Override settings?** → `N`

### Option 2: Manual Deployment with Environment Variables
```bash
vercel --prod \
  -e NEXT_PUBLIC_DEMO_MODE=true \
  -e NEXT_PUBLIC_BYPASS_AUTH=true \
  -e DEMO_MODE=true \
  -e SKIP_ENV_VALIDATION=true \
  -e CLERK_SECRET_KEY=sk_test_demo \
  -e NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_demo
```

### Option 3: Deploy via Vercel Dashboard
1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Select the `ui-demo-deployment` branch
4. Configure environment variables:
   ```
   NEXT_PUBLIC_DEMO_MODE=true
   NEXT_PUBLIC_BYPASS_AUTH=true
   DEMO_MODE=true
   SKIP_ENV_VALIDATION=true
   CLERK_SECRET_KEY=sk_test_demo
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_demo
   DATABASE_URL=memory://demo
   USE_MOCK_DATA=true
   ENABLE_MOCK_API=true
   SHOW_DEMO_BANNER=true
   ```
5. Click "Deploy"

## Post-Deployment

### Accessing Your Demo
After deployment, you'll receive a URL like:
- Production: `https://hospitalos-demo.vercel.app`
- Preview: `https://hospitalos-demo-[hash].vercel.app`

### Custom Domain (Optional)
```bash
vercel domains add demo.yourdomain.com
vercel alias set hospitalos-demo-[hash].vercel.app demo.yourdomain.com
```

### Environment Variables Management
```bash
# List environment variables
vercel env ls

# Add a new variable
vercel env add VARIABLE_NAME

# Pull environment variables
vercel env pull .env.local
```

## Troubleshooting

### Build Failures
If the build fails, try:
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm ci
NEXT_PUBLIC_DEMO_MODE=true npm run build
vercel --prod --force
```

### Authentication Issues
If you see authentication errors:
```bash
# Re-login to Vercel
vercel logout
vercel login
```

### Environment Variable Issues
Ensure all required variables are set:
```bash
# Check current variables
vercel env ls --environment=production

# Re-add if missing
vercel env add NEXT_PUBLIC_DEMO_MODE production
```

## Demo Features
Once deployed, your demo will include:
- ✅ 50+ sample patients with medical history
- ✅ 100+ appointments across departments
- ✅ 20+ doctors with specializations
- ✅ Real-time dashboard statistics
- ✅ Prescription management
- ✅ Lab test results
- ✅ Billing system
- ✅ Emergency and ICU modules
- ✅ Complete UI navigation without backend

## Updating the Demo

### Deploy Updates
```bash
# Make changes
git add .
git commit -m "Update demo"
git push origin ui-demo-deployment

# Redeploy
vercel --prod
```

### Rollback if Needed
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]
```

## Support
- Vercel Documentation: https://vercel.com/docs
- GitHub Issues: https://github.com/JulleyAdmin/SaaS-Boilerplate/issues
- Demo Branch: https://github.com/JulleyAdmin/SaaS-Boilerplate/tree/ui-demo-deployment