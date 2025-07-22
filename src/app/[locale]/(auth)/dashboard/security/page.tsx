import { getTranslations } from 'next-intl/server';

import { MFASettings } from '@/components/security/MFASettings';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'security_management',
  });

  return {
    title: t('meta_title'),
  };
}

const SecurityPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Security Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account security settings including multi-factor authentication
        </p>
      </div>

      <MFASettings />
    </div>
  );
};

export default SecurityPage;