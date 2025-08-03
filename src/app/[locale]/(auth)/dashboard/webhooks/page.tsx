import { getTranslations } from 'next-intl/server';

import { Webhooks } from '@/components/webhooks/Webhooks';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'webhook_management',
  });

  return {
    title: t('meta_title'),
  };
}

const WebhookManagementPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Webhook Management</h1>
        <p className="mt-1 text-gray-600">
          Configure webhook endpoints to receive real-time notifications about events in your organization
        </p>
      </div>

      <Webhooks />
    </div>
  );
};

export default WebhookManagementPage;
