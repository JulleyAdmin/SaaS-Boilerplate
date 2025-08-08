/**
 * HMS Pharmacy Management Type Definitions
 * Matching pharmacy tables from Schema.ts
 */

import type { Consultation } from './clinical.types';
import type { Patient } from './patient.types';
import type { User } from './user.types';

// Medicine Master Interface
export type MedicineMaster = {
  medicineId: string;
  medicineCode: string;
  medicineName: string;
  genericName: string;

  // Classification
  category: string;
  drugClass?: string;
  scheduleType?: 'OTC' | 'H' | 'H1' | 'X' | 'G' | 'J' | 'C' | 'C1';

  // Formulation
  dosageForm: string;
  strength?: string;

  // Manufacturer
  manufacturer?: string;
  brandName?: string;

  // Storage
  storageConditions?: string;
  requiresRefrigeration?: boolean;
  lightSensitive?: boolean;

  // Regulatory
  drugLicenseNumber?: string;
  isBanned?: boolean;
  isNarcotic?: boolean;

  // Prescription Requirements
  prescriptionRequired?: boolean;
  maxRetailPrice: number;

  isActive?: boolean;
  createdAt?: Date | string;
};

// Pharmacy Inventory Interface
export type PharmacyInventory = {
  inventoryId: string;
  clinicId: string;
  medicineId: string;

  // Stock Information
  currentStock: number;
  unitOfMeasurement: string;

  // Batch Information
  batchNumber?: string;
  expiryDate: Date | string;
  manufacturingDate?: Date | string;

  // Procurement Details
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
  discountPercentage?: number;

  // Stock Levels
  reorderLevel: number;
  minimumStock: number;
  maximumStock: number;

  // Location
  rackNumber?: string;
  shelfNumber?: string;

  // Status
  stockStatus?: 'Normal' | 'Low' | 'Critical' | 'Expired' | 'NearExpiry';

  lastUpdated?: Date | string;
  createdAt?: Date | string;

  // Extended info
  medicine?: MedicineMaster;
};

// Medicine Order Interface
export type MedicineOrder = {
  orderId: string;
  orderNumber: string;

  // Patient and Clinical Info
  patientId: string;
  clinicId: string;
  prescribedBy: string;
  consultationId?: string;

  // Order Details
  orderDate?: Date | string;
  orderType: string;

  // Status
  orderStatus?: 'Pending' | 'Processing' | 'Ready' | 'Dispensed' | 'Cancelled' | 'Partial';

  // Dispensing Info
  dispensedBy?: string;
  dispensedAt?: Date | string;

  // Financial
  totalAmount?: number;
  discountAmount?: number;
  netAmount?: number;

  // Notes
  prescriptionNotes?: string;
  pharmacistNotes?: string;

  createdAt?: Date | string;
  updatedAt?: Date | string;

  // Extended info
  patient?: Patient;
  prescribedByDoctor?: User;
  dispensedByUser?: User;
  consultation?: Consultation;
  items?: MedicineOrderItem[];
};

// Medicine Order Item Interface
export type MedicineOrderItem = {
  orderItemId: string;
  orderId: string;
  medicineId: string;

  // Prescription Details
  dosage?: string;
  frequency?: string;
  durationDays?: number;
  durationType?: string;

  // Instructions
  beforeFood?: boolean;
  afterFood?: boolean;
  specialInstructions?: string;

  // Quantity
  prescribedQuantity: number;
  dispensedQuantity?: number;
  returnedQuantity?: number;

  // Substitution
  substituted?: boolean;
  substitutedMedicineId?: string;
  substitutionReason?: string;

  // Financial
  unitPrice: number;
  discountPercentage?: number;
  taxPercentage?: number;
  totalPrice: number;

  // Stock Reference
  inventoryId?: string;
  batchNumber?: string;

  createdAt?: Date | string;

  // Extended info
  medicine?: MedicineMaster;
  substitutedMedicine?: MedicineMaster;
  inventory?: PharmacyInventory;
};

// Pharmacy Stock Movement Interface
export type PharmacyStockMovement = {
  movementId: string;
  clinicId: string;
  medicineId: string;
  inventoryId: string;

  // Movement Details
  movementType: 'Purchase' | 'Sale' | 'Return' | 'Adjustment' | 'Transfer' | 'Expired' | 'Damaged';
  movementDate?: Date | string;

  // Quantity
  quantity: number;
  unitOfMeasurement?: string;

  // Reference
  referenceType?: string;
  referenceId?: string;

  // Stock Levels
  stockBefore: number;
  stockAfter: number;

  // Financial Impact
  unitCost?: number;
  totalCost?: number;

  // User and Notes
  performedBy: string;
  notes?: string;

  createdAt?: Date | string;

  // Extended info
  medicine?: MedicineMaster;
  performedByUser?: User;
};

// Pharmacy Dashboard Statistics
export type PharmacyDashboardStats = {
  inventory: {
    totalMedicines: number;
    totalValue: number;
    lowStockItems: number;
    expiredItems: number;
    nearExpiryItems: number;
  };

  orders: {
    pendingOrders: number;
    todayOrders: number;
    readyForPickup: number;
    dispensedToday: number;
  };

  financial: {
    todaySales: number;
    monthSales: number;
    pendingPayments: number;
    averageOrderValue: number;
  };

  compliance: {
    controlledSubstances: number;
    narcoticRegisterEntries: number;
    pendingVerifications: number;
  };
};

// Medicine Search Filters
export type MedicineSearchFilters = {
  searchQuery?: string;
  category?: string[];
  drugClass?: string[];
  scheduleType?: string[];
  dosageForm?: string[];
  manufacturer?: string[];
  inStock?: boolean;
  requiresPrescription?: boolean;
  priceRange?: {
    min?: number;
    max?: number;
  };
};

// Inventory Search Filters
export type InventorySearchFilters = {
  medicineId?: string[];
  stockStatus?: string[];
  expiryDateRange?: {
    from?: Date | string;
    to?: Date | string;
  };
  belowReorderLevel?: boolean;
  batchNumber?: string;
  rackNumber?: string;
};

// Order Search Filters
export type OrderSearchFilters = {
  searchQuery?: string;
  orderStatus?: string[];
  patientId?: string;
  doctorId?: string;
  dateRange?: {
    from?: Date | string;
    to?: Date | string;
  };
  orderType?: string[];
};

// Stock Alert Interface
export type StockAlert = {
  alertId?: string;
  medicineId: string;
  medicineName: string;
  alertType: 'LowStock' | 'Expired' | 'NearExpiry' | 'ReorderLevel';
  currentStock?: number;
  reorderLevel?: number;
  expiryDate?: Date | string;
  batchNumber?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  createdAt?: Date | string;
};

// Purchase Order Interface
export type PurchaseOrder = {
  purchaseOrderId: string;
  orderNumber: string;
  supplier: string;

  // Order details
  orderDate: Date | string;
  expectedDeliveryDate?: Date | string;
  actualDeliveryDate?: Date | string;

  // Financial
  totalAmount: number;
  taxAmount?: number;
  discountAmount?: number;
  netAmount: number;

  // Status
  status: 'Draft' | 'Ordered' | 'Partial' | 'Received' | 'Cancelled';

  // Items
  items: PurchaseOrderItem[];

  // Metadata
  createdBy: string;
  approvedBy?: string;
  receivedBy?: string;
  createdAt?: Date | string;
};

// Purchase Order Item Interface
export type PurchaseOrderItem = {
  itemId?: string;
  medicineId: string;
  medicineName: string;

  // Quantity
  orderedQuantity: number;
  receivedQuantity?: number;
  unitOfMeasurement: string;

  // Pricing
  unitPrice: number;
  taxPercentage?: number;
  discountPercentage?: number;
  totalPrice: number;

  // Batch info (filled on receipt)
  batchNumber?: string;
  expiryDate?: Date | string;
  manufacturingDate?: Date | string;
};

// Controlled Substance Register
export type ControlledSubstanceEntry = {
  entryId: string;
  medicineId: string;
  medicineName: string;
  scheduleType: string;

  // Transaction details
  transactionType: 'Receipt' | 'Dispensing' | 'Destruction' | 'Transfer';
  transactionDate: Date | string;

  // Quantity
  quantity: number;
  balanceStock: number;

  // Reference
  referenceType?: string;
  referenceNumber?: string;

  // Patient/Prescription (for dispensing)
  patientId?: string;
  prescriptionId?: string;
  doctorId?: string;

  // Verification
  enteredBy: string;
  verifiedBy?: string;

  // Notes
  remarks?: string;

  createdAt?: Date | string;
};

// Medicine Dispensing Form Data
export type MedicineDispensingData = {
  orderId: string;
  items: {
    orderItemId: string;
    medicineId: string;
    dispensedQuantity: number;
    batchNumber: string;
    inventoryId: string;
    substituted?: boolean;
    substitutedMedicineId?: string;
    substitutionReason?: string;
  }[];

  paymentMode?: 'Cash' | 'Card' | 'UPI' | 'Insurance' | 'Credit';
  paymentAmount?: number;

  pharmacistNotes?: string;
};

// Stock Adjustment Form Data
export type StockAdjustmentData = {
  medicineId: string;
  inventoryId: string;
  adjustmentType: 'Increase' | 'Decrease';
  quantity: number;
  reason: 'Damaged' | 'Expired' | 'Lost' | 'Found' | 'Correction' | 'Other';
  notes: string;
};

// Prescription Verification
export type PrescriptionVerification = {
  prescriptionId: string;
  verifiedBy: string;
  verificationTime: Date | string;

  checks: {
    patientAllergies: boolean;
    dosageAppropriate: boolean;
    duplicateTherapy: boolean;
    contraindicationsClear: boolean;
  };

  issues?: string[];
  pharmacistRecommendations?: string;
  doctorContacted?: boolean;
  doctorResponse?: string;
};
