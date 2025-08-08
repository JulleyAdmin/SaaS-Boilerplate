'use client';

import { format } from 'date-fns';
import { Receipt } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Payment = {
  paymentId: string;
  invoiceId: string;
  amount: number;
  paymentMethod: string;
  paymentDate: string;
  transactionId?: string;
  receivedBy?: string;
  paymentType?: string;
};

type PaymentListProps = {
  payments: Payment[];
  isLoading?: boolean;
};

export function PaymentList({ payments, isLoading }: PaymentListProps) {
  const t = useTranslations('billing');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getPaymentMethodBadge = (method: string) => {
    const methodConfig = {
      cash: { variant: 'secondary' as const, label: t('paymentMethod.cash') },
      card: { variant: 'default' as const, label: t('paymentMethod.card') },
      upi: { variant: 'success' as const, label: t('paymentMethod.upi') },
      netbanking: { variant: 'outline' as const, label: t('paymentMethod.netbanking') },
      insurance: { variant: 'warning' as const, label: t('paymentMethod.insurance') },
      scheme: { variant: 'destructive' as const, label: t('paymentMethod.scheme') },
    };

    const config = methodConfig[method as keyof typeof methodConfig] || {
      variant: 'outline' as const,
      label: method,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaymentTypeBadge = (type: string) => {
    const typeConfig = {
      payment: { variant: 'success' as const, label: t('paymentType.payment') },
      refund: { variant: 'destructive' as const, label: t('paymentType.refund') },
    };

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.payment;
    return <Badge variant={config.variant}>{config.label}</Badge>;
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
          </div>
        ))}
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-center">
        <div>
          <Receipt className="mx-auto mb-4 size-12 text-muted-foreground" />
          <h3 className="mb-2 text-lg font-medium">{t('noPaymentsFound')}</h3>
          <p className="text-muted-foreground">No payment records to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t('paymentDate')}</TableHead>
            <TableHead>{t('amount')}</TableHead>
            <TableHead>{t('method')}</TableHead>
            <TableHead>{t('type')}</TableHead>
            <TableHead>{t('reference')}</TableHead>
            <TableHead>{t('receivedBy')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map(payment => (
            <TableRow key={payment.paymentId}>
              <TableCell>
                {format(new Date(payment.paymentDate), 'MMM dd, yyyy HH:mm')}
              </TableCell>
              <TableCell className="font-medium">
                {formatCurrency(payment.amount)}
              </TableCell>
              <TableCell>
                {getPaymentMethodBadge(payment.paymentMethod)}
              </TableCell>
              <TableCell>
                {getPaymentTypeBadge(payment.paymentType || 'payment')}
              </TableCell>
              <TableCell className="font-mono text-sm">
                {payment.transactionId || '-'}
              </TableCell>
              <TableCell>
                {payment.receivedBy || '-'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
