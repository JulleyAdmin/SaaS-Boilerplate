'use client';

import { CreditCard, Settings, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

export function PaymentGatewaySettings() {
  const t = useTranslations('billing');

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="size-5" />
            {t('paymentMethodsSettingsDescription')}
          </CardTitle>
          <CardDescription>
            {t('paymentMethodsSettingsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="card-payments" className="flex items-center gap-2">
                <CreditCard className="size-4" />
                {t('cardPayments')}
              </Label>
              <Switch id="card-payments" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="upi-payments" className="flex items-center gap-2">
                <CreditCard className="size-4" />
                {t('upiPayments')}
              </Label>
              <Switch id="upi-payments" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="net-banking" className="flex items-center gap-2">
                <CreditCard className="size-4" />
                {t('netBanking')}
              </Label>
              <Switch id="net-banking" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="insurance" className="flex items-center gap-2">
                <Shield className="size-4" />
                {t('insurancePayments')}
              </Label>
              <Switch id="insurance" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="government" className="flex items-center gap-2">
                <Shield className="size-4" />
                {t('governmentSchemes')}
              </Label>
              <Switch id="government" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('gatewayConfiguration')}</CardTitle>
          <CardDescription>{t('gatewayConfigurationDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="card-gateway">{t('cardPaymentGateway')}</Label>
              <Select defaultValue="razorpay">
                <SelectTrigger>
                  <SelectValue placeholder="Select gateway" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="razorpay">Razorpay</SelectItem>
                  <SelectItem value="payu">PayU</SelectItem>
                  <SelectItem value="stripe">Stripe</SelectItem>
                  <SelectItem value="paytm">Paytm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="upi-provider">{t('upiProvider')}</Label>
              <Select defaultValue="upi">
                <SelectTrigger>
                  <SelectValue placeholder="Select UPI provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upi">UPI (Generic)</SelectItem>
                  <SelectItem value="phonepe">PhonePe</SelectItem>
                  <SelectItem value="gpay">Google Pay</SelectItem>
                  <SelectItem value="paytm">Paytm UPI</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="size-5" />
            {t('securitySettings')}
          </CardTitle>
          <CardDescription>{t('securitySettingsDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="require-otp">{t('requireOTP')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('requireOTPDescription')}
              </p>
            </div>
            <Switch id="require-otp" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('additionalSettings')}</CardTitle>
          <CardDescription>{t('additionalSettingsDescription')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="auto-reconciliation">{t('autoReconciliation')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('autoReconciliationDescription')}
              </p>
            </div>
            <Switch id="auto-reconciliation" />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="send-receipts">{t('sendPaymentReceipts')}</Label>
              <p className="text-sm text-muted-foreground">
                {t('sendPaymentReceiptsDescription')}
              </p>
            </div>
            <Switch id="send-receipts" defaultChecked />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button>
          {t('saveSettings')}
        </Button>
      </div>
    </div>
  );
}
