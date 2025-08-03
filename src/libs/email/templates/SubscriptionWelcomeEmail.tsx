import { Button, Heading, Section, Text } from '@react-email/components';

import { HospitalEmailLayout } from './HospitalEmailLayout';

type SubscriptionWelcomeEmailProps = {
  hospitalName: string;
  administratorName: string;
  planName: string;
  loginUrl: string;
  setupGuideUrl?: string;
  supportEmail?: string;
};

export const SubscriptionWelcomeEmail = ({
  hospitalName,
  administratorName,
  planName,
  loginUrl,
  setupGuideUrl,
  supportEmail,
}: SubscriptionWelcomeEmailProps) => {
  return (
    <HospitalEmailLayout
      hospitalName={hospitalName}
      supportEmail={supportEmail}
      complianceLevel="hipaa"
      footerText={`Welcome to HospitalOS! Your ${planName} plan is now active.`}
    >
      <Heading className="mb-4 text-2xl font-bold text-gray-900">
        Welcome to HospitalOS! 🏥
      </Heading>

      <Text className="mb-4 text-gray-700">
        Hello
        {' '}
        {administratorName}
        ,
      </Text>

      <Text className="mb-4 text-gray-700">
        Congratulations! Your HospitalOS
        {' '}
        {planName}
        {' '}
        subscription for
        {' '}
        {hospitalName}
        {' '}
        is now active and ready to use.
      </Text>

      <Section className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
        <Text className="m-0 mb-2 font-medium text-green-800">
          ✅ Your subscription is active
        </Text>
        <Text className="m-0 text-sm text-green-700">
          Plan:
          {' '}
          {planName}
          {' '}
          • Hospital:
          {' '}
          {hospitalName}
        </Text>
      </Section>

      <Heading className="mb-3 text-lg font-semibold text-gray-900">
        Next Steps
      </Heading>

      <div className="mb-6 space-y-3">
        <div className="flex items-start">
          <span className="mr-3 mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-800">
            1
          </span>
          <div>
            <Text className="m-0 font-medium text-gray-900">Access your dashboard</Text>
            <Text className="m-0 text-sm text-gray-600">
              Log in to start configuring your hospital management system
            </Text>
          </div>
        </div>

        <div className="flex items-start">
          <span className="mr-3 mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-800">
            2
          </span>
          <div>
            <Text className="m-0 font-medium text-gray-900">Set up departments</Text>
            <Text className="m-0 text-sm text-gray-600">
              Configure your hospital departments and assign roles
            </Text>
          </div>
        </div>

        <div className="flex items-start">
          <span className="mr-3 mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-800">
            3
          </span>
          <div>
            <Text className="m-0 font-medium text-gray-900">Invite team members</Text>
            <Text className="m-0 text-sm text-gray-600">
              Add doctors, nurses, and staff to your system
            </Text>
          </div>
        </div>

        <div className="flex items-start">
          <span className="mr-3 mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-800">
            4
          </span>
          <div>
            <Text className="m-0 font-medium text-gray-900">Configure SSO (Optional)</Text>
            <Text className="m-0 text-sm text-gray-600">
              Set up single sign-on for seamless access
            </Text>
          </div>
        </div>
      </div>

      <Section className="mb-6 text-center">
        <Button
          href={loginUrl}
          className="rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white no-underline"
        >
          Access Your Dashboard
        </Button>
      </Section>

      {setupGuideUrl && (
        <Section className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <Text className="m-0 mb-2 font-medium text-blue-800">
            📚 New to HospitalOS?
          </Text>
          <Text className="m-0 mb-3 text-sm text-blue-700">
            Check out our comprehensive setup guide to get the most out of your system.
          </Text>
          <Button
            href={setupGuideUrl}
            className="rounded border border-blue-300 bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 no-underline"
          >
            View Setup Guide
          </Button>
        </Section>
      )}

      <Section className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <Text className="m-0 mb-2 font-medium text-gray-900">
          🔒 Security & Compliance
        </Text>
        <Text className="m-0 mb-2 text-sm text-gray-700">
          Your HospitalOS instance is fully HIPAA compliant with:
        </Text>
        <ul className="m-0 pl-4 text-sm text-gray-600">
          <li>End-to-end encryption</li>
          <li>Comprehensive audit logging</li>
          <li>Role-based access controls</li>
          <li>Regular security monitoring</li>
        </ul>
      </Section>

      <Text className="mt-6 text-gray-700">
        If you have any questions or need assistance getting started, our support team is here to help.
      </Text>

      <Text className="text-gray-700">
        Welcome aboard!
        <br />
        The HospitalOS Team
      </Text>
    </HospitalEmailLayout>
  );
};
