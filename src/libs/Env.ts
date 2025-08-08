import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

const isTestMode = process.env.NODE_ENV === 'test' || process.env.E2E_TESTING === 'true' || process.env.TESTING === 'true';
const isDemoMode = process.env.DEMO_MODE === 'true';
const isDevMode = process.env.NODE_ENV === 'development';

// For demo mode, make most fields optional
const demoModeSchema = z.string().optional();
const requiredInProd = (field: any) => (isDemoMode || isTestMode || isDevMode) ? demoModeSchema : field;

export const Env = createEnv({
  server: {
    CLERK_SECRET_KEY: requiredInProd(z.string().min(1)),
    DATABASE_URL: z.string().optional(),
    LOGTAIL_SOURCE_TOKEN: z.string().optional(),
    STRIPE_SECRET_KEY: requiredInProd(z.string().min(1)),
    STRIPE_WEBHOOK_SECRET: requiredInProd(z.string().min(1)),
    BILLING_PLAN_ENV: z.enum(['dev', 'test', 'prod', 'demo']).optional(),
    JACKSON_CLIENT_SECRET_VERIFIER: z.string().optional(),
    // Email service
    RESEND_API_KEY: z.string().optional(),
    RESEND_DOMAIN: z.string().optional(),
    // Stripe metered billing price IDs
    STRIPE_API_CALLS_PRICE_ID: z.string().optional(),
    STRIPE_STORAGE_PRICE_ID: z.string().optional(),
    STRIPE_DATA_TRANSFER_PRICE_ID: z.string().optional(),
    // Retraced audit logging
    RETRACED_URL: z.string().optional(),
    RETRACED_API_KEY: z.string().optional(),
    RETRACED_PROJECT_ID: z.string().optional(),
    // Demo mode flags
    DEMO_MODE: z.string().optional(),
    ENABLE_DEMO_DATA: z.string().optional(),
    ENABLE_AUTO_LOGIN: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: requiredInProd(z.string().min(1)),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: requiredInProd(z.string().min(1)),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: requiredInProd(z.string().min(1)),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: z.string().optional(),
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: z.string().optional(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL,
  },
  skipValidation: isDemoMode || isTestMode,
  emptyStringAsUndefined: true,
});
