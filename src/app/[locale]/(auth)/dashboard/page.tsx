import { getTranslations } from 'next-intl/server';

import { DashboardOverview } from '@/components/dashboard/DashboardOverview';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
  };
}

export default function DashboardPage() {
  return <DashboardOverview />;
}
