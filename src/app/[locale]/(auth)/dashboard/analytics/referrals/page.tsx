import { getTranslations } from 'next-intl/server';
import ReferralAnalyticsDashboard from '@/components/analytics/referrals/ReferralAnalyticsDashboard';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Analytics',
  });

  return {
    title: 'Referral Analytics',
    description: 'Track referral performance, conversion rates, and ROI',
  };
}

export default function ReferralAnalyticsPage() {
  return (
    <div className="container mx-auto p-6">
      <ReferralAnalyticsDashboard />
    </div>
  );
}