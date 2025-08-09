import { SignUp } from '@clerk/nextjs';
import { getTranslations } from 'next-intl/server';
import { redirect } from 'next/navigation';

import { getI18nPath } from '@/utils/Helpers';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'SignUp',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const SignUpPage = (props: { params: { locale: string } }) => {
  // In demo mode, redirect directly to dashboard
  const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.DEMO_MODE === 'true';
  
  if (isDemoMode) {
    redirect(getI18nPath('/dashboard', props.params.locale));
  }

  return <SignUp path={getI18nPath('/sign-up', props.params.locale)} />;
};

export default SignUpPage;
