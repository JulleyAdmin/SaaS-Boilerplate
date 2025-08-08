'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Types aligned with hospital billing schema
export type BillStatus = 'Draft' | 'Pending' | 'Partially-Paid' | 'Paid' | 'Overdue' | 'Cancelled';
export type PaymentMethod = 'Cash' | 'Card' | 'UPI' | 'Net-Banking' | 'Cheque' | 'DD' | 'Insurance';
export type BillType = 'consultation' | 'emergency' | 'admission' | 'lab' | 'pharmacy' | 'procedure' | 'imaging';

export interface PatientBill {
  billId: string;
  billNumber: string;
  clinicId: string;
  patientId: string;
  consultationId?: string;
  
  // Bill Details
  billDate: string;
  billType: BillType;
  
  // Financial Summary
  grossAmount: number;
  discountAmount: number;
  taxAmount: number;
  netAmount: number;
  
  // Government Scheme Integration
  governmentSchemeId?: string;
  schemeName?: string;
  schemeCoverageAmount: number;
  patientAmount: number;
  
  // Status
  billStatus: BillStatus;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: string;
  
  // Notes
  billNotes?: string;
  internalNotes?: string;
  
  // Patient Info (populated)
  patientName?: string;
  patientPhone?: string;
  patientAge?: number;
  
  // Items
  billItems?: BillItem[];
  
  // Payments
  payments?: Payment[];
  totalPaid?: number;
  remainingAmount?: number;
  
  createdAt: string;
  updatedAt: string;
}

export interface BillItem {
  billItemId: string;
  billId: string;
  
  // Service Reference
  serviceId?: string;
  itemDescription: string;
  itemCategory: string;
  itemCode?: string;
  
  // Pricing
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
  discountAmount: number;
  taxPercentage: number;
  taxAmount: number;
  lineTotal: number;
  
  // Medical Context
  prescribedBy?: string;
  serviceDate?: string;
  departmentId?: string;
  departmentName?: string;
  
  // Government Scheme Coverage
  schemeCoverage: boolean;
  schemeRate?: number;
  patientShare?: number;
  
  createdAt: string;
}

export interface Payment {
  paymentId: string;
  paymentNumber: string;
  billId: string;
  
  // Payment Details
  paymentDate: string;
  paymentMethod: PaymentMethod;
  amount: number;
  
  // Transaction Details
  transactionId?: string;
  referenceNumber?: string;
  gatewayResponse?: any;
  
  // Collection Details
  collectedBy: string;
  collectorName?: string;
  collectionPoint: string;
  
  // Status
  paymentStatus: string;
  reconciled: boolean;
  
  // Notes
  paymentNotes?: string;
  
  createdAt: string;
}

export interface GovernmentScheme {
  schemeId: string;
  schemeName: string;
  schemeCode: string;
  description?: string;
  isActive: boolean;
  maxCoverageAmount?: number;
  familySize?: number;
}

export interface CreateBillRequest {
  patientId: string;
  consultationId?: string;
  billType: BillType;
  billItems: {
    serviceId?: string;
    itemDescription: string;
    itemCategory: string;
    quantity: number;
    unitPrice: number;
    discountPercentage?: number;
    taxPercentage?: number;
    prescribedBy?: string;
    serviceDate?: string;
    departmentId?: string;
  }[];
  governmentSchemeId?: string;
  discountAmount?: number;
  billNotes?: string;
}

export interface BillFilters {
  status?: BillStatus | 'all';
  billType?: BillType | 'all';
  patientName?: string;
  billNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  governmentSchemeId?: string;
  departmentId?: string;
  createdBy?: string;
  page?: number;
  limit?: number;
}

export interface BillsResponse {
  data: PatientBill[];
  summary: {
    totalBills: number;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    overdueAmount: number;
    byStatus: Record<BillStatus, number>;
    byType: Record<BillType, number>;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Mock data for development
const mockGovernmentSchemes: GovernmentScheme[] = [
  {
    schemeId: 'scheme-1',
    schemeName: 'Ayushman-Bharat',
    schemeCode: 'AB-001',
    description: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana',
    isActive: true,
    maxCoverageAmount: 500000,
    familySize: 5,
  },
  {
    schemeId: 'scheme-2',
    schemeName: 'CGHS',
    schemeCode: 'CGHS-001',
    description: 'Central Government Health Scheme',
    isActive: true,
    maxCoverageAmount: 200000,
  },
  {
    schemeId: 'scheme-3',
    schemeName: 'ESIC',
    schemeCode: 'ESIC-001',
    description: 'Employees State Insurance Corporation',
    isActive: true,
    maxCoverageAmount: 100000,
  },
];

const mockBills: PatientBill[] = [
  {
    billId: 'bill-1',
    billNumber: 'HMS-2024-001',
    clinicId: 'clinic-1',
    patientId: 'patient-1',
    consultationId: 'consultation-1',
    billDate: '2024-01-15T10:30:00Z',
    billType: 'consultation',
    grossAmount: 2500,
    discountAmount: 0,
    taxAmount: 450,
    netAmount: 2950,
    governmentSchemeId: 'scheme-1',
    schemeName: 'Ayushman-Bharat',
    schemeCoverageAmount: 2000,
    patientAmount: 950,
    billStatus: 'Paid',
    createdBy: 'user-1',
    approvedBy: 'user-2',
    approvedAt: '2024-01-15T11:00:00Z',
    billNotes: 'Regular consultation',
    patientName: 'Rajesh Kumar',
    patientPhone: '+91 9876543210',
    patientAge: 45,
    totalPaid: 950,
    remainingAmount: 0,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:30:00Z',
  },
  {
    billId: 'bill-2',
    billNumber: 'HMS-2024-002',
    clinicId: 'clinic-1',
    patientId: 'patient-2',
    billDate: '2024-01-16T09:15:00Z',
    billType: 'lab',
    grossAmount: 1800,
    discountAmount: 100,
    taxAmount: 306,
    netAmount: 2006,
    schemeCoverageAmount: 0,
    patientAmount: 2006,
    billStatus: 'Pending',
    createdBy: 'user-1',
    billNotes: 'Lab tests - Blood work',
    patientName: 'Sunita Devi',
    patientPhone: '+91 9876543211',
    patientAge: 38,
    totalPaid: 0,
    remainingAmount: 2006,
    createdAt: '2024-01-16T09:15:00Z',
    updatedAt: '2024-01-16T09:15:00Z',
  },
  {
    billId: 'bill-3',
    billNumber: 'HMS-2024-003',
    clinicId: 'clinic-1',
    patientId: 'patient-3',
    consultationId: 'consultation-3',
    billDate: '2024-01-17T14:20:00Z',
    billType: 'procedure',
    grossAmount: 15000,
    discountAmount: 500,
    taxAmount: 2610,
    netAmount: 17110,
    governmentSchemeId: 'scheme-2',
    schemeName: 'CGHS',
    schemeCoverageAmount: 12000,
    patientAmount: 5110,
    billStatus: 'Partially-Paid',
    createdBy: 'user-1',
    approvedBy: 'user-2',
    approvedAt: '2024-01-17T15:00:00Z',
    billNotes: 'Minor surgical procedure',
    patientName: 'Amit Singh',
    patientPhone: '+91 9876543212',
    patientAge: 29,
    totalPaid: 3000,
    remainingAmount: 2110,
    createdAt: '2024-01-17T14:20:00Z',
    updatedAt: '2024-01-17T16:45:00Z',
  },
];

const mockSummary = {
  totalBills: 45,
  totalAmount: 456000,
  paidAmount: 298000,
  pendingAmount: 125000,
  overdueAmount: 33000,
  byStatus: {
    'Draft': 3,
    'Pending': 12,
    'Partially-Paid': 8,
    'Paid': 20,
    'Overdue': 2,
    'Cancelled': 0,
  } as Record<BillStatus, number>,
  byType: {
    'consultation': 18,
    'lab': 12,
    'pharmacy': 8,
    'procedure': 5,
    'emergency': 2,
    'admission': 0,
    'imaging': 0,
  } as Record<BillType, number>,
};

// Custom hooks
export function usePatientBills(filters: BillFilters = {}) {
  return useQuery<BillsResponse>({
    queryKey: ['patientBills', filters],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Filter mock data
      let filteredBills = mockBills;

      if (filters.status && filters.status !== 'all') {
        filteredBills = filteredBills.filter(bill => bill.billStatus === filters.status);
      }

      if (filters.billType && filters.billType !== 'all') {
        filteredBills = filteredBills.filter(bill => bill.billType === filters.billType);
      }

      if (filters.patientName) {
        filteredBills = filteredBills.filter(bill =>
          bill.patientName?.toLowerCase().includes(filters.patientName!.toLowerCase())
        );
      }

      if (filters.billNumber) {
        filteredBills = filteredBills.filter(bill =>
          bill.billNumber.toLowerCase().includes(filters.billNumber!.toLowerCase())
        );
      }

      if (filters.dateFrom) {
        filteredBills = filteredBills.filter(bill => bill.billDate >= filters.dateFrom!);
      }

      if (filters.dateTo) {
        filteredBills = filteredBills.filter(bill => bill.billDate <= filters.dateTo!);
      }

      return {
        data: filteredBills,
        summary: mockSummary,
        pagination: {
          page: filters.page || 1,
          limit: filters.limit || 20,
          total: filteredBills.length,
          totalPages: Math.ceil(filteredBills.length / (filters.limit || 20)),
        },
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function usePatientBill(billId: string) {
  return useQuery<PatientBill>({
    queryKey: ['patientBill', billId],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 400));

      const bill = mockBills.find(b => b.billId === billId);
      if (!bill) {
        throw new Error('Bill not found');
      }

      return bill;
    },
    enabled: !!billId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useGovernmentSchemes() {
  return useQuery<GovernmentScheme[]>({
    queryKey: ['governmentSchemes'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockGovernmentSchemes.filter(scheme => scheme.isActive);
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useCreatePatientBill() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (billData: CreateBillRequest) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Creating patient bill:', billData);
      
      // Generate bill number
      const billNumber = `HMS-${new Date().getFullYear()}-${String(mockBills.length + 1).padStart(3, '0')}`;
      
      return { 
        billId: `bill-${Date.now()}`,
        billNumber,
        message: 'Bill created successfully'
      };
    },
    onSuccess: () => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['patientBills'] });
    },
  });
}

export function useRecordPayment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (paymentData: {
      billId: string;
      amount: number;
      paymentMethod: PaymentMethod;
      transactionId?: string;
      referenceNumber?: string;
      paymentNotes?: string;
    }) => {
      await new Promise(resolve => setTimeout(resolve, 800));
      console.log('Recording payment:', paymentData);
      
      const paymentNumber = `PAY-${new Date().getFullYear()}-${Date.now()}`;
      
      return {
        paymentId: `payment-${Date.now()}`,
        paymentNumber,
        message: 'Payment recorded successfully'
      };
    },
    onSuccess: (_, variables) => {
      // Invalidate bill queries to refresh payment status
      queryClient.invalidateQueries({ queryKey: ['patientBills'] });
      queryClient.invalidateQueries({ queryKey: ['patientBill', variables.billId] });
    },
  });
}

export function useUpdateBillStatus() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      billId: string;
      status: BillStatus;
      reason?: string;
    }) => {
      await new Promise(resolve => setTimeout(resolve, 600));
      console.log('Updating bill status:', data);
      
      return { message: 'Bill status updated successfully' };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['patientBills'] });
      queryClient.invalidateQueries({ queryKey: ['patientBill', variables.billId] });
    },
  });
}

export function useBillingSummary(filters: { dateFrom?: string; dateTo?: string } = {}) {
  return useQuery({
    queryKey: ['billingSummary', filters],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      return {
        totalRevenue: mockSummary.totalAmount,
        revenueChange: 12.5,
        totalBills: mockSummary.totalBills,
        avgBillAmount: mockSummary.totalAmount / mockSummary.totalBills,
        collectionEfficiency: (mockSummary.paidAmount / mockSummary.totalAmount) * 100,
        outstandingAmount: mockSummary.pendingAmount + mockSummary.overdueAmount,
      };
    },
    staleTime: 1000 * 60 * 10,
  });
}