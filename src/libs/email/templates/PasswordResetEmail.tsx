import { Button, Heading, Section, Text } from '@react-email/components';

import { HospitalEmailLayout } from './HospitalEmailLayout';

type PasswordResetEmailProps = {
  hospitalName: string;
  userEmail: string;
  resetUrl: string;
  expirationTime?: string;
  ipAddress?: string;
  userAgent?: string;
  supportEmail?: string;
};

export const PasswordResetEmail = ({
  hospitalName,
  userEmail,
  resetUrl,
  expirationTime = '1 hour',
  ipAddress,
  userAgent,
  supportEmail,
}: PasswordResetEmailProps) => {
  return (
    <HospitalEmailLayout
      hospitalName={hospitalName}
      supportEmail={supportEmail}
      complianceLevel="hipaa"
      footerText="This password reset request was generated from your hospital management system."
    >
      <Heading className="mb-4 text-2xl font-bold text-gray-900">
        Password Reset Request 🔐
      </Heading>

      <Text className="mb-4 text-gray-700">
        A password reset was requested for your account (
        {userEmail}
        ) in the
        {' '}
        {hospitalName}
        {' '}
        system.
      </Text>

      <Section className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
        <Text className="m-0 mb-2 font-medium text-yellow-800">
          ⚠️ Security Notice
        </Text>
        <Text className="m-0 text-sm text-yellow-700">
          If you did not request this password reset, please ignore this email or contact your system administrator immediately.
        </Text>
      </Section>

      <Text className="mb-4 text-gray-700">
        To reset your password, click the button below. This link will expire in
        {' '}
        {expirationTime}
        .
      </Text>

      <Section className="mb-6 text-center">
        <Button
          href={resetUrl}
          className="rounded-lg bg-red-600 px-6 py-3 text-base font-medium text-white no-underline"
        >
          Reset Your Password
        </Button>
      </Section>

      <Text className="mb-4 text-sm text-gray-600">
        If the button doesn't work, you can copy and paste this link into your browser:
      </Text>
      <Text className="mb-6 break-all text-sm text-blue-600">
        {resetUrl}
      </Text>

      {/* Security Details */}
      <Section className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <Text className="m-0 mb-2 font-medium text-gray-900">
          📋 Request Details
        </Text>
        <div className="text-sm text-gray-600">
          <Text className="m-0 mb-1">
            <strong>Email:</strong>
            {' '}
            {userEmail}
          </Text>
          <Text className="m-0 mb-1">
            <strong>Hospital:</strong>
            {' '}
            {hospitalName}
          </Text>
          <Text className="m-0 mb-1">
            <strong>Request Time:</strong>
            {' '}
            {new Date().toLocaleString()}
          </Text>
          {ipAddress && (
            <Text className="m-0 mb-1">
              <strong>IP Address:</strong>
              {' '}
              {ipAddress}
            </Text>
          )}
          {userAgent && (
            <Text className="m-0 mb-1">
              <strong>Device:</strong>
              {' '}
              {userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop Computer'}
            </Text>
          )}
        </div>
      </Section>

      <Section className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <Text className="m-0 mb-2 font-medium text-blue-800">
          🔒 Security Best Practices
        </Text>
        <ul className="m-0 pl-4 text-sm text-blue-700">
          <li>Choose a strong, unique password</li>
          <li>Use a combination of letters, numbers, and symbols</li>
          <li>Don't reuse passwords from other accounts</li>
          <li>Consider using a password manager</li>
          <li>Enable two-factor authentication if available</li>
        </ul>
      </Section>

      <Text className="mb-4 text-gray-700">
        For security reasons, this password reset link will expire in
        {' '}
        {expirationTime}
        .
        If you need a new reset link after this expires, you can request another one from the login page.
      </Text>

      <Text className="text-gray-700">
        If you continue to experience issues accessing your account, please contact your system administrator
        or our support team for assistance.
      </Text>

      <Text className="mt-4 text-gray-700">
        Best regards,
        <br />
        {hospitalName}
        {' '}
        IT Security Team
      </Text>
    </HospitalEmailLayout>
  );
};
