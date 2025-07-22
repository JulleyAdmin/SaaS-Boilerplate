import { Text, Button, Section, Heading } from '@react-email/components';
import { HospitalEmailLayout } from './HospitalEmailLayout';

interface PasswordResetEmailProps {
  hospitalName: string;
  userEmail: string;
  resetUrl: string;
  expirationTime?: string;
  ipAddress?: string;
  userAgent?: string;
  supportEmail?: string;
}

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
      <Heading className="text-2xl font-bold text-gray-900 mb-4">
        Password Reset Request 🔐
      </Heading>
      
      <Text className="text-gray-700 mb-4">
        A password reset was requested for your account ({userEmail}) in the {hospitalName} system.
      </Text>

      <Section className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <Text className="text-yellow-800 font-medium m-0 mb-2">
          ⚠️ Security Notice
        </Text>
        <Text className="text-yellow-700 text-sm m-0">
          If you did not request this password reset, please ignore this email or contact your system administrator immediately.
        </Text>
      </Section>

      <Text className="text-gray-700 mb-4">
        To reset your password, click the button below. This link will expire in {expirationTime}.
      </Text>

      <Section className="text-center mb-6">
        <Button
          href={resetUrl}
          className="bg-red-600 text-white px-6 py-3 rounded-lg text-base font-medium no-underline"
        >
          Reset Your Password
        </Button>
      </Section>

      <Text className="text-gray-600 text-sm mb-4">
        If the button doesn't work, you can copy and paste this link into your browser:
      </Text>
      <Text className="text-blue-600 text-sm mb-6 break-all">
        {resetUrl}
      </Text>

      {/* Security Details */}
      <Section className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <Text className="font-medium text-gray-900 m-0 mb-2">
          📋 Request Details
        </Text>
        <div className="text-gray-600 text-sm">
          <Text className="m-0 mb-1">
            <strong>Email:</strong> {userEmail}
          </Text>
          <Text className="m-0 mb-1">
            <strong>Hospital:</strong> {hospitalName}
          </Text>
          <Text className="m-0 mb-1">
            <strong>Request Time:</strong> {new Date().toLocaleString()}
          </Text>
          {ipAddress && (
            <Text className="m-0 mb-1">
              <strong>IP Address:</strong> {ipAddress}
            </Text>
          )}
          {userAgent && (
            <Text className="m-0 mb-1">
              <strong>Device:</strong> {userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop Computer'}
            </Text>
          )}
        </div>
      </Section>

      <Section className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <Text className="text-blue-800 font-medium m-0 mb-2">
          🔒 Security Best Practices
        </Text>
        <ul className="text-blue-700 text-sm m-0 pl-4">
          <li>Choose a strong, unique password</li>
          <li>Use a combination of letters, numbers, and symbols</li>
          <li>Don't reuse passwords from other accounts</li>
          <li>Consider using a password manager</li>
          <li>Enable two-factor authentication if available</li>
        </ul>
      </Section>

      <Text className="text-gray-700 mb-4">
        For security reasons, this password reset link will expire in {expirationTime}. 
        If you need a new reset link after this expires, you can request another one from the login page.
      </Text>

      <Text className="text-gray-700">
        If you continue to experience issues accessing your account, please contact your system administrator 
        or our support team for assistance.
      </Text>

      <Text className="text-gray-700 mt-4">
        Best regards,<br />
        {hospitalName} IT Security Team
      </Text>
    </HospitalEmailLayout>
  );
};