import { getTranslations } from 'next-intl/server';
import MarketingIntelligenceDashboard from '@/components/analytics/marketing/MarketingIntelligenceDashboard';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Analytics',
  });

  return {
    title: 'Marketing Intelligence Analytics',
    description: 'Campaign performance, ROI tracking, and marketing insights',
  };
}

export default function MarketingAnalyticsPage() {
  return (
    <div className="container mx-auto p-6">
      <MarketingIntelligenceDashboard />
    </div>
  );
}