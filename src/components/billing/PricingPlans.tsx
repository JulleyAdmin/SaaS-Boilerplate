'use client';

import { useOrganization } from '@clerk/nextjs';
import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/utils/Helpers';
import { COMPLIANCE_FEATURES, HOSPITAL_PLANS } from '@/utils/pricing';

type PricingPlansProps = {
  currentPlan?: string;
  className?: string;
};

export function PricingPlans({ currentPlan, className }: PricingPlansProps) {
  const router = useRouter();
  const { organization } = useOrganization();
  const [loading, setLoading] = useState<string | null>(null);

  const handleSelectPlan = async (planKey: string, priceId?: string) => {
    if (!organization) {
      toast.error('Please create an organization first');
      return;
    }

    if (!priceId) {
      // Enterprise plan - redirect to contact form
      router.push('/contact?plan=enterprise');
      return;
    }

    setLoading(planKey);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          planKey,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { checkoutUrl } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to start checkout');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className={cn('grid gap-6 md:grid-cols-3', className)}>
      {Object.entries(HOSPITAL_PLANS).map(([key, plan]) => {
        const isCurrentPlan = currentPlan === key;
        const compliance = COMPLIANCE_FEATURES[key as keyof typeof COMPLIANCE_FEATURES];

        return (
          <Card
            key={key}
            className={cn(
              'relative flex flex-col',
              plan.popular && 'border-primary shadow-lg',
            )}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
            )}

            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                {plan.price === 'custom'
                  ? (
                      <div className="text-3xl font-bold">Custom Pricing</div>
                    )
                  : (
                      <div className="flex items-baseline">
                        <span className="text-3xl font-bold">
                          $
                          {plan.price}
                        </span>
                        <span className="ml-2 text-muted-foreground">
                          /
                          {plan.interval}
                        </span>
                      </div>
                    )}
              </div>
            </CardHeader>

            <CardContent className="flex-1 space-y-4">
              <div>
                <h4 className="mb-2 font-semibold">Features</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Check className="mr-2 mt-0.5 size-4 shrink-0 text-green-500" />
                    <span>
                      {typeof plan.features.departments === 'number'
                        ? `Up to ${plan.features.departments} departments`
                        : 'Unlimited departments'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-0.5 size-4 shrink-0 text-green-500" />
                    <span>
                      {typeof plan.features.users === 'number'
                        ? `Up to ${plan.features.users} users`
                        : 'Unlimited users'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-0.5 size-4 shrink-0 text-green-500" />
                    <span>
                      {typeof plan.features.storage === 'number'
                        ? `${plan.features.storage} GB storage`
                        : 'Unlimited storage'}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-0.5 size-4 shrink-0 text-green-500" />
                    <span>SSO/SAML authentication</span>
                  </li>
                  {plan.features.scim && (
                    <li className="flex items-start">
                      <Check className="mr-2 mt-0.5 size-4 shrink-0 text-green-500" />
                      <span>SCIM directory sync</span>
                    </li>
                  )}
                  <li className="flex items-start">
                    <Check className="mr-2 mt-0.5 size-4 shrink-0 text-green-500" />
                    <span>
                      {plan.features.support === 'email' && 'Email support'}
                      {plan.features.support === 'priority' && 'Priority support'}
                      {plan.features.support === 'dedicated' && 'Dedicated support team'}
                    </span>
                  </li>
                  {plan.features.sla && (
                    <li className="flex items-start">
                      <Check className="mr-2 mt-0.5 size-4 shrink-0 text-green-500" />
                      <span>99.9% uptime SLA</span>
                    </li>
                  )}
                </ul>
              </div>

              <div>
                <h4 className="mb-2 font-semibold">Compliance</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <Check className="mr-2 mt-0.5 size-4 shrink-0 text-green-500" />
                    <span>HIPAA compliant</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="mr-2 mt-0.5 size-4 shrink-0 text-green-500" />
                    <span>
                      {typeof plan.features.auditRetention === 'number'
                        ? `${plan.features.auditRetention} days audit retention`
                        : 'Custom audit retention'}
                    </span>
                  </li>
                  {'soc2Compliant' in compliance && compliance.soc2Compliant && (
                    <li className="flex items-start">
                      <Check className="mr-2 mt-0.5 size-4 shrink-0 text-green-500" />
                      <span>SOC 2 Type II certified</span>
                    </li>
                  )}
                  {'dedicatedInfrastructure' in compliance && compliance.dedicatedInfrastructure && (
                    <li className="flex items-start">
                      <Check className="mr-2 mt-0.5 size-4 shrink-0 text-green-500" />
                      <span>Dedicated infrastructure</span>
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>

            <CardFooter>
              {isCurrentPlan
                ? (
                    <Button className="w-full" variant="outline" disabled>
                      Current Plan
                    </Button>
                  )
                : (
                    <Button
                      className="w-full"
                      onClick={() => handleSelectPlan(key, plan.stripePriceId)}
                      disabled={loading !== null}
                    >
                      {loading === key
                        ? (
                            <>
                              <Loader2 className="mr-2 size-4 animate-spin" />
                              Loading...
                            </>
                          )
                        : (
                            plan.price === 'custom' ? 'Contact Sales' : 'Get Started'
                          )}
                    </Button>
                  )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
