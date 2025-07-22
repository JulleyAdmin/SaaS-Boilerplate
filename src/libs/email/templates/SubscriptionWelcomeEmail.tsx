import { Text, Button, Section, Heading } from '@react-email/components';
import { HospitalEmailLayout } from './HospitalEmailLayout';

interface SubscriptionWelcomeEmailProps {
  hospitalName: string;
  administratorName: string;
  planName: string;
  loginUrl: string;
  setupGuideUrl?: string;
  supportEmail?: string;
}

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
      <Heading className="text-2xl font-bold text-gray-900 mb-4">
        Welcome to HospitalOS! 🏥
      </Heading>
      
      <Text className="text-gray-700 mb-4">
        Hello {administratorName},
      </Text>
      
      <Text className="text-gray-700 mb-4">
        Congratulations! Your HospitalOS {planName} subscription for {hospitalName} is now active and ready to use.
      </Text>

      <Section className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <Text className="text-green-800 font-medium m-0 mb-2">
          ✅ Your subscription is active
        </Text>
        <Text className="text-green-700 text-sm m-0">
          Plan: {planName} • Hospital: {hospitalName}
        </Text>
      </Section>

      <Heading className="text-lg font-semibold text-gray-900 mb-3">
        Next Steps
      </Heading>

      <div className="space-y-3 mb-6">
        <div className="flex items-start">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mr-3 mt-0.5">
            1
          </span>
          <div>
            <Text className="font-medium text-gray-900 m-0">Access your dashboard</Text>
            <Text className="text-gray-600 text-sm m-0">
              Log in to start configuring your hospital management system
            </Text>
          </div>
        </div>

        <div className="flex items-start">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mr-3 mt-0.5">
            2
          </span>
          <div>
            <Text className="font-medium text-gray-900 m-0">Set up departments</Text>
            <Text className="text-gray-600 text-sm m-0">
              Configure your hospital departments and assign roles
            </Text>
          </div>
        </div>

        <div className="flex items-start">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mr-3 mt-0.5">
            3
          </span>
          <div>
            <Text className="font-medium text-gray-900 m-0">Invite team members</Text>
            <Text className="text-gray-600 text-sm m-0">
              Add doctors, nurses, and staff to your system
            </Text>
          </div>
        </div>

        <div className="flex items-start">
          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mr-3 mt-0.5">
            4
          </span>
          <div>
            <Text className="font-medium text-gray-900 m-0">Configure SSO (Optional)</Text>
            <Text className="text-gray-600 text-sm m-0">
              Set up single sign-on for seamless access
            </Text>
          </div>
        </div>
      </div>

      <Section className="text-center mb-6">
        <Button
          href={loginUrl}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg text-base font-medium no-underline"
        >
          Access Your Dashboard
        </Button>
      </Section>

      {setupGuideUrl && (
        <Section className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <Text className="text-blue-800 font-medium m-0 mb-2">
            📚 New to HospitalOS?
          </Text>
          <Text className="text-blue-700 text-sm m-0 mb-3">
            Check out our comprehensive setup guide to get the most out of your system.
          </Text>
          <Button
            href={setupGuideUrl}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded text-sm font-medium no-underline border border-blue-300"
          >
            View Setup Guide
          </Button>
        </Section>
      )}

      <Section className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <Text className="font-medium text-gray-900 m-0 mb-2">
          🔒 Security & Compliance
        </Text>
        <Text className="text-gray-700 text-sm m-0 mb-2">
          Your HospitalOS instance is fully HIPAA compliant with:
        </Text>
        <ul className="text-gray-600 text-sm m-0 pl-4">
          <li>End-to-end encryption</li>
          <li>Comprehensive audit logging</li>
          <li>Role-based access controls</li>
          <li>Regular security monitoring</li>
        </ul>
      </Section>

      <Text className="text-gray-700 mt-6">
        If you have any questions or need assistance getting started, our support team is here to help.
      </Text>

      <Text className="text-gray-700">
        Welcome aboard!<br />
        The HospitalOS Team
      </Text>
    </HospitalEmailLayout>
  );
};