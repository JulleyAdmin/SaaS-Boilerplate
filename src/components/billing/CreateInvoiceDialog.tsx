'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useCreateInvoice } from '@/hooks/api/useBilling';
import { useGovernmentSchemes } from '@/hooks/api/useGovernmentSchemes';
import { usePatients } from '@/hooks/api/usePatients';
import { formatCurrency } from '@/utils/format';

const invoiceItemSchema = z.object({
  itemType: z.enum(['consultation', 'procedure', 'medicine', 'lab_test', 'bed_charge', 'service', 'other']),
  itemCode: z.string().min(1, 'Item code is required'),
  itemName: z.string().min(1, 'Item name is required'),
  description: z.string().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  unitPrice: z.number().min(0, 'Unit price must be non-negative'),
  discountType: z.enum(['percentage', 'fixed']).optional(),
  discountValue: z.number().min(0).optional(),
  discountReason: z.string().optional(),
  taxRate: z.number().min(0).max(100).default(18), // Default GST
});

const createInvoiceSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
  invoiceType: z.enum(['consultation', 'pharmacy', 'lab', 'procedure', 'admission', 'general']).default('general'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  discountType: z.enum(['percentage', 'fixed']).optional(),
  discountValue: z.number().min(0).optional(),
  discountReason: z.string().optional(),
  schemeId: z.string().optional(),
  schemeCoverage: z.number().min(0).max(100).optional(),
  paymentMethod: z.enum(['cash', 'card', 'upi', 'netbanking', 'insurance', 'scheme']).optional(),
  paymentDue: z.string().optional(),
  notes: z.string().optional(),
  internalNotes: z.string().optional(),
});

type CreateInvoiceData = z.infer<typeof createInvoiceSchema>;

type CreateInvoiceDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreateInvoiceDialog({ open, onOpenChange }: CreateInvoiceDialogProps) {
  const t = useTranslations('billing');
  const { mutate: createInvoice, isLoading } = useCreateInvoice();
  const { data: patientsData } = usePatients() as { data?: { data?: any[] } };
  const { data: schemesData } = useGovernmentSchemes();

  const form = useForm<CreateInvoiceData>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      invoiceType: 'general',
      items: [{
        itemType: 'consultation',
        itemCode: '',
        itemName: '',
        quantity: 1,
        unitPrice: 0,
        taxRate: 18,
      }],
    },
  });

  const items = form.watch('items');
  const selectedSchemeId = form.watch('schemeId');
  const schemeCoverage = form.watch('schemeCoverage') || 0;

  // Calculate totals
  const calculateTotals = () => {
    let subtotal = 0;
    let totalTax = 0;
    let totalDiscount = 0;

    items.forEach((item) => {
      const lineTotal = item.quantity * item.unitPrice;
      let itemDiscount = 0;

      if (item.discountType && item.discountValue) {
        itemDiscount = item.discountType === 'percentage'
          ? (lineTotal * item.discountValue / 100)
          : item.discountValue;
      }

      const taxableAmount = lineTotal - itemDiscount;
      const itemTax = taxableAmount * (item.taxRate || 0) / 100;

      subtotal += lineTotal;
      totalDiscount += itemDiscount;
      totalTax += itemTax;
    });

    // Apply invoice-level discount
    const invoiceDiscountType = form.watch('discountType');
    const invoiceDiscountValue = form.watch('discountValue') || 0;
    let invoiceDiscount = 0;

    if (invoiceDiscountType && invoiceDiscountValue) {
      invoiceDiscount = invoiceDiscountType === 'percentage'
        ? ((subtotal - totalDiscount) * invoiceDiscountValue / 100)
        : invoiceDiscountValue;
    }

    const finalAmount = subtotal - totalDiscount - invoiceDiscount + totalTax;
    const schemeAmount = selectedSchemeId ? (finalAmount * schemeCoverage / 100) : 0;
    const patientAmount = finalAmount - schemeAmount;

    return {
      subtotal,
      totalDiscount: totalDiscount + invoiceDiscount,
      totalTax,
      finalAmount,
      schemeAmount,
      patientAmount,
    };
  };

  const totals = calculateTotals();

  const handleSubmit = (data: CreateInvoiceData) => {
    createInvoice(data);
    form.reset();
    onOpenChange(false);
  };

  const addItem = () => {
    const currentItems = form.getValues('items');
    form.setValue('items', [
      ...currentItems,
      {
        itemType: 'consultation',
        itemCode: '',
        itemName: '',
        quantity: 1,
        unitPrice: 0,
        taxRate: 18,
      },
    ]);
  };

  const removeItem = (index: number) => {
    const currentItems = form.getValues('items');
    form.setValue('items', currentItems.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('createInvoice')}</DialogTitle>
          <DialogDescription>{t('createInvoiceDescription')}</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Patient and Type Selection */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="patientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('patient')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectPatient')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {patientsData?.data?.map(patient => (
                          <SelectItem key={patient.patientId} value={patient.patientId}>
                            {patient.firstName}
                            {' '}
                            {patient.lastName}
                            {' '}
                            -
                            {patient.patientId}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="invoiceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('invoiceType')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="consultation">{t('invoiceType.consultation')}</SelectItem>
                        <SelectItem value="pharmacy">{t('invoiceType.pharmacy')}</SelectItem>
                        <SelectItem value="lab">{t('invoiceType.lab')}</SelectItem>
                        <SelectItem value="procedure">{t('invoiceType.procedure')}</SelectItem>
                        <SelectItem value="admission">{t('invoiceType.admission')}</SelectItem>
                        <SelectItem value="general">{t('invoiceType.general')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Invoice Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">{t('invoiceItems')}</h3>
                <Button type="button" size="sm" onClick={addItem}>
                  <Plus className="mr-2 size-4" />
                  {t('addItem')}
                </Button>
              </div>

              <div className="space-y-4">
                {items.map((_, index) => (
                  <div key={`invoice-item-${index}`} className="space-y-4 rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">
                        {t('item')}
                        {' '}
                        {index + 1}
                      </h4>
                      {items.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(index)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                      <FormField
                        control={form.control}
                        name={`items.${index}.itemType`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('itemType')}</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="consultation">{t('itemType.consultation')}</SelectItem>
                                <SelectItem value="procedure">{t('itemType.procedure')}</SelectItem>
                                <SelectItem value="medicine">{t('itemType.medicine')}</SelectItem>
                                <SelectItem value="lab_test">{t('itemType.lab_test')}</SelectItem>
                                <SelectItem value="bed_charge">{t('itemType.bed_charge')}</SelectItem>
                                <SelectItem value="service">{t('itemType.service')}</SelectItem>
                                <SelectItem value="other">{t('itemType.other')}</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.itemCode`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('itemCode')}</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder={t('itemCodePlaceholder')} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.itemName`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('itemName')}</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder={t('itemNamePlaceholder')} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid gap-4 md:grid-cols-4">
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('quantity')}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={e => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.unitPrice`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('unitPrice')}</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={e => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`items.${index}.taxRate`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>
                              {t('taxRate')}
                              {' '}
                              (%)
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                onChange={e => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div>
                        <Label>{t('lineTotal')}</Label>
                        <div className="mt-2 font-medium">
                          {formatCurrency((items[index]?.quantity || 0) * (items[index]?.unitPrice || 0))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Government Scheme */}
            <div className="grid gap-4 md:grid-cols-2">
              <FormField
                control={form.control}
                name="schemeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('governmentScheme')}
                      {' '}
                      (
                      {t('optional')}
                      )
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('selectScheme')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">{t('none')}</SelectItem>
                        {schemesData?.map((scheme: any) => (
                          <SelectItem key={scheme.schemeId} value={scheme.schemeId}>
                            {scheme.schemeName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedSchemeId && (
                <FormField
                  control={form.control}
                  name="schemeCoverage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t('schemeCoverage')}
                        {' '}
                        (%)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={e => field.onChange(Number(e.target.value))}
                          min={0}
                          max={100}
                        />
                      </FormControl>
                      <FormDescription>
                        {t('schemeCoverageDescription')}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('notes')}
                    {' '}
                    (
                    {t('optional')}
                    )
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder={t('notesPlaceholder')}
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Totals Summary */}
            <div className="space-y-2 rounded-lg bg-muted p-4">
              <div className="flex justify-between">
                <span>
                  {t('subtotal')}
                  :
                </span>
                <span>{formatCurrency(totals.subtotal)}</span>
              </div>
              {totals.totalDiscount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>
                    {t('discount')}
                    :
                  </span>
                  <span>
                    -
                    {formatCurrency(totals.totalDiscount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span>
                  {t('tax')}
                  :
                </span>
                <span>{formatCurrency(totals.totalTax)}</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-lg font-semibold">
                <span>
                  {t('total')}
                  :
                </span>
                <span>{formatCurrency(totals.finalAmount)}</span>
              </div>
              {totals.schemeAmount > 0 && (
                <>
                  <div className="flex justify-between text-blue-600">
                    <span>
                      {t('schemeCoverage')}
                      :
                    </span>
                    <span>
                      -
                      {formatCurrency(totals.schemeAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold">
                    <span>
                      {t('patientAmount')}
                      :
                    </span>
                    <span>{formatCurrency(totals.patientAmount)}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('creating') : t('createInvoice')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
