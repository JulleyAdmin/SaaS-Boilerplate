/**
 * HMS Billing & Administrative Type Definitions
 * Matching billing, government schemes, and related tables from Schema.ts
 */

import type {
  BillStatus,
  GovernmentScheme,
  PaymentMethod,
} from './enums.types';
import type { Patient } from './patient.types';

// Government Scheme Configuration Interface
export type GovernmentSchemeConfig = {
  schemeId: string;
  clinicId: string;

  // Scheme details
  schemeName: GovernmentScheme;
  schemeCode: string;
  description?: string;

  // Configuration
  isActive?: boolean;
  empanelmentNumber?: string;
  empanelmentDate?: Date | string;
  validTill?: Date | string;

  // Coverage limits
  maxCoverageAmount?: number;
  familySize?: number;

  // Contact details
  nodOfficerName?: string;
  nodOfficerContact?: string;

  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

// Subscription Interface
export type Subscription = {
  id: string;
  organizationId: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  stripeCustomerId?: string;
  status: string;
  currentPeriodStart?: Date | string;
  currentPeriodEnd?: Date | string;
  canceledAt?: Date | string;
  trialStart?: Date | string;
  trialEnd?: Date | string;
  metadata?: Record<string, any>;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

// Invoice Interface
export type Invoice = {
  id: string;
  organizationId: string;
  amount: number;
  status: string;
  stripeInvoiceId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

// Patient Bill Interface
export type PatientBill = {
  billId: string;
  billNumber: string;
  clinicId: string;
  patientId: string;

  // Bill details
  billDate: Date | string;
  billType: 'Consultation' | 'Pharmacy' | 'Investigation' | 'Procedure' | 'Admission' | 'Emergency' | 'Other';

  // Status
  status: BillStatus;

  // Amounts
  totalAmount: number;
  discountAmount?: number;
  taxAmount?: number;
  netAmount: number;
  paidAmount?: number;
  balanceAmount?: number;

  // Payment details
  paymentMethod?: PaymentMethod;
  paymentDate?: Date | string;
  paymentReference?: string;

  // Insurance/Scheme
  insuranceClaim?: boolean;
  insuranceProvider?: string;
  insuranceClaimNumber?: string;
  insuranceApprovedAmount?: number;

  // Government scheme
  governmentScheme?: GovernmentScheme;
  schemeClaimNumber?: string;
  schemeApprovedAmount?: number;

  // Notes
  remarks?: string;

  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: string;

  // Extended info
  patient?: Patient;
  items?: BillItem[];
  payments?: PaymentRecord[];
};

// Bill Item Interface
export type BillItem = {
  itemId: string;
  billId: string;

  // Item details
  itemType: 'Consultation' | 'Medicine' | 'Investigation' | 'Procedure' | 'Room' | 'Other';
  itemCode?: string;
  itemName: string;
  itemDescription?: string;

  // Reference
  referenceType?: string;
  referenceId?: string;

  // Quantity and pricing
  quantity: number;
  unitPrice: number;
  discountAmount?: number;
  taxPercentage?: number;
  taxAmount?: number;
  totalAmount: number;

  // Service details
  serviceDate?: Date | string;
  servicedBy?: string;
  departmentId?: string;
};

// Payment Record Interface
export type PaymentRecord = {
  paymentId: string;
  billId: string;

  // Payment details
  paymentDate: Date | string;
  paymentAmount: number;
  paymentMethod: PaymentMethod;

  // Reference
  transactionReference?: string;
  bankName?: string;
  chequeNumber?: string;
  cardLastFour?: string;

  // Status
  status: 'Success' | 'Failed' | 'Pending' | 'Reversed';

  // Metadata
  receivedBy: string;
  receiptNumber?: string;
  remarks?: string;
  createdAt?: Date | string;
};

// Billing Statistics
export type BillingStatistics = {
  today: {
    totalBills: number;
    totalAmount: number;
    collectedAmount: number;
    pendingAmount: number;
    cancelledBills: number;
  };

  month: {
    totalBills: number;
    totalAmount: number;
    collectedAmount: number;
    pendingAmount: number;
    averageBillValue: number;
  };

  paymentMethods: {
    cash: number;
    card: number;
    upi: number;
    insurance: number;
    governmentScheme: number;
  };

  outstanding: {
    totalBills: number;
    totalAmount: number;
    overdueBills: number;
    overdueAmount: number;
  };

  schemes: {
    ayushmanBharat: { count: number; amount: number };
    cghs: { count: number; amount: number };
    esic: { count: number; amount: number };
    others: { count: number; amount: number };
  };
};

// Bill Search Filters
export type BillSearchFilters = {
  searchQuery?: string;
  status?: BillStatus[];
  billType?: string[];
  paymentMethod?: PaymentMethod[];
  dateRange?: {
    from?: Date | string;
    to?: Date | string;
  };
  amountRange?: {
    min?: number;
    max?: number;
  };
  patientId?: string;
  hasInsurance?: boolean;
  hasGovernmentScheme?: boolean;
  isPending?: boolean;
  isOverdue?: boolean;
};

// Organization Interface
export type Organization = {
  id: string;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  stripeSubscriptionPriceId?: string;
  stripeSubscriptionStatus?: string;
  stripeSubscriptionCurrentPeriodEnd?: number;
  updatedAt?: Date | string;
  createdAt?: Date | string;
};

// Pricing Plan Interface
export type PricingPlan = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId?: string;
  isPopular?: boolean;
  maxUsers?: number;
  maxPatients?: number;
  maxStorage?: string;
  supportLevel?: string;
};

// Payment Intent Interface (for Stripe)
export type PaymentIntent = {
  intentId: string;
  amount: number;
  currency: string;
  status: string;
  patientId?: string;
  billId?: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt?: Date | string;
};

// Insurance Claim Interface
export type InsuranceClaim = {
  claimId: string;
  patientId: string;
  billId: string;

  // Insurance details
  insuranceProvider: string;
  policyNumber: string;
  claimNumber: string;

  // Claim amounts
  claimedAmount: number;
  approvedAmount?: number;
  rejectedAmount?: number;
  coPayAmount?: number;

  // Status
  status: 'Submitted' | 'UnderReview' | 'Approved' | 'Partial' | 'Rejected' | 'Settled';
  submittedDate: Date | string;
  approvalDate?: Date | string;
  settlementDate?: Date | string;

  // Documents
  documents?: ClaimDocument[];

  // Rejection/Partial approval
  rejectionReason?: string;
  remarks?: string;

  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;
  createdBy?: string;
};

// Claim Document Interface
export type ClaimDocument = {
  documentId: string;
  documentType: string;
  documentName: string;
  documentUrl: string;
  uploadedAt: Date | string;
  uploadedBy: string;
};

// Government Scheme Claim Interface
export type GovernmentSchemeClaim = {
  claimId: string;
  patientId: string;
  billId: string;

  // Scheme details
  schemeName: GovernmentScheme;
  beneficiaryId: string;
  claimNumber: string;

  // Claim details
  claimedAmount: number;
  approvedAmount?: number;
  rejectedAmount?: number;

  // Status
  status: 'Submitted' | 'Verified' | 'Approved' | 'Rejected' | 'Settled';
  submittedDate: Date | string;
  verificationDate?: Date | string;
  approvalDate?: Date | string;
  settlementDate?: Date | string;

  // Verification
  verifiedBy?: string;
  verificationRemarks?: string;

  // Settlement
  settlementReference?: string;
  bankAccountNumber?: string;
  ifscCode?: string;

  // Metadata
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

// Bill Creation Form Data
export type BillCreationData = {
  patientId: string;
  billType: string;

  items: {
    itemType: string;
    itemName: string;
    quantity: number;
    unitPrice: number;
    discountAmount?: number;
    taxPercentage?: number;
    referenceId?: string;
  }[];

  // Discount
  overallDiscountPercentage?: number;
  discountReason?: string;

  // Insurance
  hasInsurance?: boolean;
  insuranceProvider?: string;
  policyNumber?: string;

  // Government scheme
  hasGovernmentScheme?: boolean;
  schemeName?: GovernmentScheme;
  beneficiaryId?: string;

  remarks?: string;
};

// Payment Collection Form Data
export type PaymentCollectionData = {
  billId: string;
  paymentAmount: number;
  paymentMethod: PaymentMethod;

  // Cash
  cashReceived?: number;
  changeGiven?: number;

  // Card
  cardType?: 'Credit' | 'Debit';
  cardLastFour?: string;

  // Cheque
  chequeNumber?: string;
  bankName?: string;
  chequeDate?: Date | string;

  // Online
  transactionReference?: string;

  remarks?: string;
};

// Revenue Report Interface
export type RevenueReport = {
  period: {
    from: Date | string;
    to: Date | string;
  };

  summary: {
    totalRevenue: number;
    totalCollected: number;
    totalPending: number;
    totalDiscounts: number;
  };

  byDepartment: {
    departmentName: string;
    revenue: number;
    patientCount: number;
  }[];

  byService: {
    serviceType: string;
    revenue: number;
    count: number;
  }[];

  byPaymentMethod: {
    method: PaymentMethod;
    amount: number;
    count: number;
  }[];

  byScheme: {
    schemeName: string;
    claimedAmount: number;
    approvedAmount: number;
    patientCount: number;
  }[];

  trends: {
    date: Date | string;
    revenue: number;
    collections: number;
  }[];
};
