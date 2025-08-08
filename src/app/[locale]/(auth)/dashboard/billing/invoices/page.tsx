'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { CreateInvoiceDialog } from '@/components/billing/CreateInvoiceDialog';
import { InvoiceList } from '@/components/billing/InvoiceList';
import { Button } from '@/components/ui/button';

export default function InvoicesPage() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Mock data for demo
  const mockInvoices = [
    {
      invoiceId: 'INV-2024-001',
      invoiceNumber: 'INV-001',
      patientId: 'P-12345',
      patientName: 'John Doe',
      totalAmount: 25000,
      patientAmount: 5000,
      status: 'paid',
      invoiceDate: '2024-01-15',
      invoiceType: 'consultation',
    },
    {
      invoiceId: 'INV-2024-002',
      invoiceNumber: 'INV-002',
      patientId: 'P-12346',
      patientName: 'Jane Smith',
      totalAmount: 45000,
      patientAmount: 10000,
      status: 'pending',
      invoiceDate: '2024-01-14',
      invoiceType: 'surgery',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Invoice Management</h1>
          <p className="text-muted-foreground">
            Create, manage, and track patient invoices and payments
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 size-4" />
          Create Invoice
        </Button>
      </div>

      <InvoiceList invoices={mockInvoices} />

      <CreateInvoiceDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
}
