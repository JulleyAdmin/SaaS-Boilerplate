import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const Env = createEnv({
  server: {
    CLERK_SECRET_KEY: z.string().min(1),
    DATABASE_URL: z.string().optional(),
    LOGTAIL_SOURCE_TOKEN: z.string().optional(),
    STRIPE_SECRET_KEY: process.env.NODE_ENV === 'test' ? z.string().optional() : z.string().min(1),
    STRIPE_WEBHOOK_SECRET: process.env.NODE_ENV === 'test' ? z.string().optional() : z.string().min(1),
    BILLING_PLAN_ENV: z.enum(['dev', 'test', 'prod']).optional(),
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
  },
  client: {
    NEXT_PUBLIC_APP_URL: z.string().optional(),
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().min(1),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
    // Stripe price IDs for hospital plans
    NEXT_PUBLIC_STRIPE_CLINIC_PRICE_ID: z.string().optional(),
    NEXT_PUBLIC_STRIPE_HOSPITAL_PRICE_ID: z.string().optional(),
    NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID: z.string().optional(),
  },
  skipValidation: process.env.SKIP_ENV_VALIDATION === 'true' || process.env.NODE_ENV === 'test',
  shared: {
    NODE_ENV: z.enum(['test', 'development', 'production']).optional(),
  },
  // You need to destructure all the keys manually
  runtimeEnv: {
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    DATABASE_URL: process.env.DATABASE_URL,
    LOGTAIL_SOURCE_TOKEN: process.env.LOGTAIL_SOURCE_TOKEN,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || (process.env.NODE_ENV === 'test' ? 'sk_test_default' : ''),
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || (process.env.NODE_ENV === 'test' ? 'whsec_test_default' : ''),
    BILLING_PLAN_ENV: process.env.BILLING_PLAN_ENV || 'test',
    JACKSON_CLIENT_SECRET_VERIFIER: process.env.JACKSON_CLIENT_SECRET_VERIFIER,
    // Email service
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_DOMAIN: process.env.RESEND_DOMAIN,
    // Stripe metered billing price IDs
    STRIPE_API_CALLS_PRICE_ID: process.env.STRIPE_API_CALLS_PRICE_ID,
    STRIPE_STORAGE_PRICE_ID: process.env.STRIPE_STORAGE_PRICE_ID,
    STRIPE_DATA_TRANSFER_PRICE_ID: process.env.STRIPE_DATA_TRANSFER_PRICE_ID,
    // Retraced audit logging
    RETRACED_URL: process.env.RETRACED_URL,
    RETRACED_API_KEY: process.env.RETRACED_API_KEY,
    RETRACED_PROJECT_ID: process.env.RETRACED_PROJECT_ID,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
    // Stripe price IDs for hospital plans
    NEXT_PUBLIC_STRIPE_CLINIC_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_CLINIC_PRICE_ID,
    NEXT_PUBLIC_STRIPE_HOSPITAL_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_HOSPITAL_PRICE_ID,
    NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
    NODE_ENV: process.env.NODE_ENV,
  },
});
