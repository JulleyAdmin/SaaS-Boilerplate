'use client';

import { format } from 'date-fns';
import { Download, FileText, MoreHorizontal, Receipt } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
};

type InvoiceListProps = {
  invoices: Invoice[];
  isLoading?: boolean;
  onRecordPayment?: (invoiceId: string) => void;
};

export function InvoiceList({ invoices, isLoading, onRecordPayment }: InvoiceListProps) {
  const t = useTranslations('billing');

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { variant: 'secondary' as const, label: t('status.draft') },
      pending: { variant: 'default' as const, label: t('status.pending') },
      paid: { variant: 'success' as const, label: t('status.paid') },
      partial: { variant: 'warning' as const, label: t('status.partial') },
      overdue: { variant: 'destructive' as const, label: t('status.overdue') },
      cancelled: { variant: 'outline' as const, label: t('status.cancelled') },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-4 rounded-lg border p-4">
            <Skeleton className="size-12 rounded" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-6 w-16" />
            <Skeleton className="size-8" />
          </div>
        ))}
      </div>
    );
  }

  if (invoices.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-center">
        <div>
          <Receipt className="mx-auto mb-4 size-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium">{t('noInvoicesFound')}</h3>
          <p className="text-muted-foreground">{t('noInvoicesFoundDescription')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('invoiceNumber')}</TableHead>
            <TableHead>{t('patient')}</TableHead>
            <TableHead>{t('date')}</TableHead>
            <TableHead>{t('type')}</TableHead>
            <TableHead className="text-right">{t('totalAmount')}</TableHead>
            <TableHead className="text-right">{t('patientAmount')}</TableHead>
            <TableHead>{t('status')}</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map(invoice => (
            <TableRow key={invoice.invoiceId}>
              <TableCell className="font-medium">{invoice.invoiceNumber}</TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">
                    {invoice.patientName || t('unknownPatient')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ID:
                    {' '}
                    {invoice.patientId}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {format(new Date(invoice.invoiceDate), 'MMM dd, yyyy')}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {t(`invoiceType.${invoice.invoiceType}`) || invoice.invoiceType}
                </Badge>
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(invoice.totalAmount)}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(invoice.patientAmount)}
              </TableCell>
              <TableCell>{getStatusBadge(invoice.status)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="size-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem
                      onClick={() => navigator.clipboard.writeText(invoice.invoiceId)}
                    >
                      Copy invoice ID
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <FileText className="mr-2 size-4" />
                      {t('viewDetails')}
                    </DropdownMenuItem>
                    {(invoice.status === 'pending' || invoice.status === 'partial') && (
                      <DropdownMenuItem onClick={() => onRecordPayment?.(invoice.invoiceId)}>
                        <Receipt className="mr-2 size-4" />
                        {t('recordPayment')}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <Download className="mr-2 size-4" />
                      {t('download')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
