export interface PlanFeatures {
  departments: number | 'unlimited';
  users: number | 'unlimited';
  storage: number | 'unlimited'; // in GB
  sso: boolean;
  scim?: boolean;
  apiKeys: number | 'unlimited';
  webhooks: number | 'unlimited';
  auditRetention: number | 'custom'; // days
  support: 'email' | 'priority' | 'dedicated';
  sla?: boolean;
  customIntegrations?: boolean;
  mfa?: boolean;
  customBranding?: boolean;
  advancedReporting?: boolean;
  apiRateLimit?: number; // requests per hour
}

export interface HospitalPlan {
  name: string;
  stripePriceId?: string;
  price: number | 'custom';
  currency?: string;
  interval?: 'month' | 'year';
  features: PlanFeatures;
  description?: string;
  popular?: boolean;
}

export const HOSPITAL_PLANS: Record<string, HospitalPlan> = {
  CLINIC: {
    name: 'Clinic',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_CLINIC_PRICE_ID,
    price: 299,
    currency: 'usd',
    interval: 'month',
    description: 'Perfect for small clinics and medical practices',
    features: {
      departments: 5,
      users: 50,
      storage: 25,
      sso: true,
      apiKeys: 10,
      webhooks: 20,
      auditRetention: 90, // 90 days
      support: 'email',
      mfa: true,
      apiRateLimit: 1000,
    }
  },
  HOSPITAL: {
    name: 'Hospital',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_HOSPITAL_PRICE_ID,
    price: 999,
    currency: 'usd',
    interval: 'month',
    description: 'Ideal for hospitals and healthcare systems',
    popular: true,
    features: {
      departments: 25,
      users: 500,
      storage: 250,
      sso: true,
      scim: true,
      apiKeys: 50,
      webhooks: 100,
      auditRetention: 365, // 1 year
      support: 'priority',
      mfa: true,
      customBranding: true,
      advancedReporting: true,
      apiRateLimit: 5000,
    }
  },
  ENTERPRISE: {
    name: 'Enterprise',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_ENTERPRISE_PRICE_ID,
    price: 'custom',
    description: 'Custom solutions for large healthcare networks',
    features: {
      departments: 'unlimited',
      users: 'unlimited',
      storage: 'unlimited',
      sso: true,
      scim: true,
      apiKeys: 'unlimited',
      webhooks: 'unlimited',
      auditRetention: 'custom',
      support: 'dedicated',
      sla: true,
      customIntegrations: true,
      mfa: true,
      customBranding: true,
      advancedReporting: true,
    }
  }
};

// Metered billing configuration
export const USAGE_METRICS = {
  API_CALLS: {
    name: 'API Calls',
    unit: 'call',
    stripePriceId: process.env.STRIPE_API_CALLS_PRICE_ID,
    unitAmount: 0.01, // $0.01 per API call over limit
    freeQuota: {
      CLINIC: 10000,
      HOSPITAL: 50000,
      ENTERPRISE: 'unlimited',
    }
  },
  STORAGE: {
    name: 'Storage',
    unit: 'GB',
    stripePriceId: process.env.STRIPE_STORAGE_PRICE_ID,
    unitAmount: 0.10, // $0.10 per GB over limit
    freeQuota: {
      CLINIC: 25,
      HOSPITAL: 250,
      ENTERPRISE: 'unlimited',
    }
  },
  DATA_TRANSFER: {
    name: 'Data Transfer',
    unit: 'GB',
    stripePriceId: process.env.STRIPE_DATA_TRANSFER_PRICE_ID,
    unitAmount: 0.05, // $0.05 per GB
    freeQuota: {
      CLINIC: 100,
      HOSPITAL: 1000,
      ENTERPRISE: 'unlimited',
    }
  }
};

// Helper functions
export function getPlanByPriceId(priceId: string): HospitalPlan | undefined {
  return Object.values(HOSPITAL_PLANS).find(
    plan => plan.stripePriceId === priceId
  );
}

export function getPlanLimits(planName: string): PlanFeatures {
  const plan = HOSPITAL_PLANS[planName];
  return plan ? plan.features : HOSPITAL_PLANS.CLINIC.features;
}

export function isFeatureAvailable(
  planName: string, 
  feature: keyof PlanFeatures
): boolean {
  const plan = HOSPITAL_PLANS[planName];
  if (!plan) return false;
  
  const value = plan.features[feature];
  return value !== undefined && value !== false && value !== 0;
}

export function getUsageLimit(
  planName: string,
  metric: keyof typeof USAGE_METRICS
): number | 'unlimited' {
  const quota = USAGE_METRICS[metric].freeQuota[planName as keyof typeof USAGE_METRICS[typeof metric]['freeQuota']];
  return (quota as number | 'unlimited') || 0;
}

// Billing-related constants
export const TRIAL_PERIOD_DAYS = 14;
export const GRACE_PERIOD_DAYS = 7;
export const PAYMENT_RETRY_ATTEMPTS = 3;

// Compliance features by plan
export const COMPLIANCE_FEATURES = {
  CLINIC: {
    hipaaCompliant: true,
    encryptionAtRest: true,
    encryptionInTransit: true,
    auditLogs: true,
    dataRetention: 90,
    backupFrequency: 'daily',
  },
  HOSPITAL: {
    hipaaCompliant: true,
    encryptionAtRest: true,
    encryptionInTransit: true,
    auditLogs: true,
    dataRetention: 365,
    backupFrequency: 'hourly',
    disasterRecovery: true,
    soc2Compliant: true,
  },
  ENTERPRISE: {
    hipaaCompliant: true,
    encryptionAtRest: true,
    encryptionInTransit: true,
    auditLogs: true,
    dataRetention: 'custom',
    backupFrequency: 'continuous',
    disasterRecovery: true,
    soc2Compliant: true,
    customCompliance: true,
    dedicatedInfrastructure: true,
  }
};