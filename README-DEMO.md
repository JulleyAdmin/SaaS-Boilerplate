# Hospital Management System - Demo Deployment

## 🚀 One-Click Deploy to Vercel

Deploy the demo version of Hospital Management System with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FJulleyAdmin%2FSaaS-Boilerplate%2Ftree%2Fui-demo-deployment&env=NEXT_PUBLIC_DEMO_MODE,NEXT_PUBLIC_BYPASS_AUTH,DEMO_MODE,SKIP_ENV_VALIDATION,CLERK_SECRET_KEY,NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY&envDescription=Demo%20Mode%20Configuration&envLink=https%3A%2F%2Fgithub.com%2FJulleyAdmin%2FSaaS-Boilerplate%2Fblob%2Fui-demo-deployment%2F.env.demo&project-name=hospitalos-demo&repository-name=hospitalos-demo&demo-title=Hospital%20Management%20System&demo-description=Complete%20HMS%20with%20mock%20data&demo-url=https%3A%2F%2Fhospitalos-demo.vercel.app)

## Manual Deployment from Specific Branch

### Step 1: Import with Branch URL
Go to: https://vercel.com/import/git

Enter this URL:
```
https://github.com/JulleyAdmin/SaaS-Boilerplate
```

### Step 2: Configure Build Settings
After import, configure:

1. **Framework Preset**: Next.js
2. **Root Directory**: `./`
3. **Build Command**: `npm run build`
4. **Install Command**: `npm install`

### Step 3: Set Environment Variables
Add these environment variables:

```env
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
NEXT_PUBLIC_DEMO_HOSPITAL=Demo General Hospital
```

### Step 4: Configure Git Branch
In Project Settings → Git:
- **Production Branch**: `ui-demo-deployment`
- **Preview Branches**: All branches

## 🎯 Direct Branch Deployment

If Vercel is not showing the branch option, try:

1. **Clone and Deploy Locally**:
```bash
# Clone the specific branch
git clone -b ui-demo-deployment https://github.com/JulleyAdmin/SaaS-Boilerplate.git hospitalos-demo
cd hospitalos-demo

# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

2. **Use GitHub Integration**:
- Go to: https://vercel.com/dashboard
- Click "Add New..." → "Project"
- Connect GitHub if not connected
- Search for "SaaS-Boilerplate"
- After import, go to Settings → Git
- Change "Production Branch" to `ui-demo-deployment`

## 📝 Troubleshooting

### Branch Not Showing?
1. Make sure the branch is pushed to GitHub:
```bash
git push origin ui-demo-deployment
```

2. In Vercel project settings:
- Go to Settings → Git → Production Branch
- Manually type: `ui-demo-deployment`
- Save changes

### Build Failing?
Ensure these environment variables are set:
- `SKIP_ENV_VALIDATION=true`
- `NEXT_PUBLIC_DEMO_MODE=true`

### Need Help?
- Repository: https://github.com/JulleyAdmin/SaaS-Boilerplate
- Demo Branch: https://github.com/JulleyAdmin/SaaS-Boilerplate/tree/ui-demo-deployment
- Environment File: https://github.com/JulleyAdmin/SaaS-Boilerplate/blob/ui-demo-deployment/.env.demo