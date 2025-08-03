import { getTranslations } from 'next-intl/server';

import { ModernDashboardLayout } from '@/components/layout/ModernDashboardLayout';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function DashboardLayout(props: { children: React.ReactNode }) {
  return (
    <ModernDashboardLayout>
      {props.children}
    </ModernDashboardLayout>
  );
}

export const dynamic = 'force-dynamic';
