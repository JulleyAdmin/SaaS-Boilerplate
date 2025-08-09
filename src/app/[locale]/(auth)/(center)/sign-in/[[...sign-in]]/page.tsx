// Check if we're in demo mode at build time
const isDemoMode = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.DEMO_MODE === 'true';

// Export the appropriate component based on demo mode
if (isDemoMode) {
  // In demo mode, use the demo page that doesn't import Clerk
  module.exports = require('./demo-page').default;
  module.exports.default = require('./demo-page').default;
} else {
  // In production mode, use the actual Clerk sign-in
  const { SignIn } = require('@clerk/nextjs');
  const { getTranslations } = require('next-intl/server');
  const { getI18nPath } = require('@/utils/Helpers');

  async function generateMetadata(props: { params: { locale: string } }) {
    const t = await getTranslations({
      locale: props.params.locale,
      namespace: 'SignIn',
    });

    return {
      title: t('meta_title'),
      description: t('meta_description'),
    };
  }

  const SignInPage = (props: { params: { locale: string } }) => (
    <SignIn path={getI18nPath('/sign-in', props.params.locale)} />
  );

  module.exports = SignInPage;
  module.exports.default = SignInPage;
  module.exports.generateMetadata = generateMetadata;
}