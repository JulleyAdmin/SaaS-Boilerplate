'use client';

import { useQuery } from '@tanstack/react-query';

type InvoiceFilters = {
  status?: string;
  invoiceNumber?: string;
  dateFrom?: string;
  dateTo?: string;
  includePatient?: boolean;
  includeItems?: boolean;
  includePayments?: boolean;
};

type BillingReportsFilters = {
  reportType: string;
  dateFrom?: string;
  dateTo?: string;
};

type Invoice = {
  invoiceId: string;
  invoiceNumber: string;
  patientId: string;
  patientName?: string;
  totalAmount: number;
  patientAmount: number;
  status: string;
  invoiceDate: string;
  invoiceType: string;
  payments?: any[];
};

type InvoicesResponse = {
  data: Invoice[];
  summary: {
    byStatus: Record<string, number>;
    revenue: Record<string, number>;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type BillingReportsResponse = {
  data: {
    totalRevenue: number;
    revenueChange: number;
  };
};

// Mock data for development
const mockInvoices: Invoice[] = [
  {
    invoiceId: '1',
    invoiceNumber: 'INV-2024-001',
    patientId: 'P001',
    patientName: 'Rajesh Kumar',
    totalAmount: 2500,
    patientAmount: 2500,
    status: 'paid',
    invoiceDate: '2024-01-15',
    invoiceType: 'consultation',
    payments: [
      {
        paymentId: 'PAY-001',
        amount: 2500,
        paymentMethod: 'upi',
        paymentDate: '2024-01-15T10:30:00Z',
        transactionId: 'TXN123456',
        receivedBy: 'Dr. Priya Sharma',
      },
    ],
  },
  {
    invoiceId: '2',
    invoiceNumber: 'INV-2024-002',
    patientId: 'P002',
    patientName: 'Sunita Devi',
    totalAmount: 1800,
    patientAmount: 1800,
    status: 'pending',
    invoiceDate: '2024-01-16',
    invoiceType: 'lab',
    payments: [],
  },
  {
    invoiceId: '3',
    invoiceNumber: 'INV-2024-003',
    patientId: 'P003',
    patientName: 'Amit Singh',
    totalAmount: 5200,
    patientAmount: 3200,
    status: 'partial',
    invoiceDate: '2024-01-17',
    invoiceType: 'procedure',
    payments: [
      {
        paymentId: 'PAY-002',
        amount: 2000,
        paymentMethod: 'insurance',
        paymentDate: '2024-01-17T14:15:00Z',
        transactionId: 'INS789012',
        receivedBy: 'Reception',
      },
    ],
  },
];

const mockSummary = {
  byStatus: {
    draft: 2,
    pending: 5,
    paid: 12,
    partial: 3,
    overdue: 1,
    cancelled: 0,
  },
  revenue: {
    draft: 0,
    pending: 15400,
    paid: 156000,
    partial: 18900,
    overdue: 2300,
    cancelled: 0,
  },
};

const mockReports = {
  totalRevenue: 192600,
  revenueChange: 12.5,
};

export function useInvoices(filters: InvoiceFilters = {}) {
  return useQuery<InvoicesResponse>({
    queryKey: ['invoices', filters],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      // Filter mock data based on filters
      let filteredInvoices = mockInvoices;

      if (filters.status && filters.status !== 'all') {
        filteredInvoices = filteredInvoices.filter(invoice => invoice.status === filters.status);
      }

      if (filters.invoiceNumber) {
        filteredInvoices = filteredInvoices.filter(invoice =>
          invoice.invoiceNumber.toLowerCase().includes(filters.invoiceNumber!.toLowerCase()),
        );
      }

      if (filters.dateFrom) {
        filteredInvoices = filteredInvoices.filter(invoice =>
          invoice.invoiceDate >= filters.dateFrom!,
        );
      }

      if (filters.dateTo) {
        filteredInvoices = filteredInvoices.filter(invoice =>
          invoice.invoiceDate <= filters.dateTo!,
        );
      }

      return {
        data: filteredInvoices,
        summary: mockSummary,
        pagination: {
          page: 1,
          limit: 20,
          total: filteredInvoices.length,
          totalPages: Math.ceil(filteredInvoices.length / 20),
        },
      };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useBillingReports(filters: BillingReportsFilters) {
  return useQuery<BillingReportsResponse>({
    queryKey: ['billing-reports', filters],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));

      return {
        data: mockReports,
      };
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useInvoice(invoiceId: string) {
  return useQuery<Invoice>({
    queryKey: ['invoice', invoiceId],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 400));

      const invoice = mockInvoices.find(inv => inv.invoiceId === invoiceId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      return invoice;
    },
    enabled: !!invoiceId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateInvoice() {
  return {
    mutate: async (invoiceData: any) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Creating invoice:', invoiceData);
      return { invoiceId: 'new-invoice-id' };
    },
    isLoading: false,
    error: null,
  };
}
