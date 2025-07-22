import { Text, Button, Section, Heading } from '@react-email/components';
import { HospitalEmailLayout } from './HospitalEmailLayout';

interface StaffInvitationEmailProps {
  hospitalName: string;
  inviteeName: string;
  inviterName: string;
  inviterRole: string;
  role: string;
  department: string;
  acceptInviteUrl: string;
  expirationDate: string;
  hospitalType?: 'clinic' | 'hospital' | 'health_system';
  supportEmail?: string;
}

export const StaffInvitationEmail = ({
  hospitalName,
  inviteeName,
  inviterName,
  inviterRole,
  role,
  department,
  acceptInviteUrl,
  expirationDate,
  hospitalType = 'hospital',
  supportEmail,
}: StaffInvitationEmailProps) => {
  const getRoleDescription = (role: string) => {
    const descriptions: Record<string, string> = {
      'administrator': 'Full system administration access with user management capabilities',
      'doctor': 'Clinical access with patient management and medical record permissions',
      'nurse': 'Patient care access with documentation and monitoring capabilities',
      'technician': 'Equipment and laboratory access with specialized workflow permissions',
      'viewer': 'Read-only access to assigned department information',
    };
    return descriptions[role.toLowerCase()] || 'Specialized access permissions for your role';
  };

  return (
    <HospitalEmailLayout
      hospitalName={hospitalName}
      supportEmail={supportEmail}
      complianceLevel="hipaa"
      footerText={`You've been invited to join the ${hospitalName} team on HospitalOS.`}
    >
      <Heading className="text-2xl font-bold text-gray-900 mb-4">
        You're Invited to Join {hospitalName}! 🏥
      </Heading>
      
      <Text className="text-gray-700 mb-4">
        Hello {inviteeName},
      </Text>
      
      <Text className="text-gray-700 mb-6">
        {inviterName} ({inviterRole}) has invited you to join the {hospitalName} team 
        as a <strong>{role}</strong> in the <strong>{department}</strong> department.
      </Text>

      {/* Invitation Details */}
      <Section className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <Text className="text-blue-800 font-medium m-0 mb-3">
          📋 Invitation Details
        </Text>
        <div className="text-blue-700 text-sm space-y-1">
          <Text className="m-0">
            <strong>{hospitalType === 'clinic' ? 'Clinic' : 'Hospital'}:</strong> {hospitalName}
          </Text>
          <Text className="m-0">
            <strong>Your Role:</strong> {role}
          </Text>
          <Text className="m-0">
            <strong>Department:</strong> {department}
          </Text>
          <Text className="m-0">
            <strong>Invited by:</strong> {inviterName} ({inviterRole})
          </Text>
          <Text className="m-0">
            <strong>Invitation expires:</strong> {expirationDate}
          </Text>
        </div>
      </Section>

      {/* Role Permissions */}
      <Section className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <Text className="text-green-800 font-medium m-0 mb-2">
          🔐 Your Access Level: {role}
        </Text>
        <Text className="text-green-700 text-sm m-0">
          {getRoleDescription(role)}
        </Text>
      </Section>

      <Text className="text-gray-700 mb-4">
        To accept this invitation and set up your account, click the button below:
      </Text>

      <Section className="text-center mb-6">
        <Button
          href={acceptInviteUrl}
          className="bg-green-600 text-white px-6 py-3 rounded-lg text-base font-medium no-underline"
        >
          Accept Invitation
        </Button>
      </Section>

      <Text className="text-gray-600 text-sm mb-6">
        If the button doesn't work, you can copy and paste this link into your browser:
      </Text>
      <Text className="text-blue-600 text-sm mb-6 break-all">
        {acceptInviteUrl}
      </Text>

      {/* What to Expect */}
      <Section className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
        <Text className="font-medium text-gray-900 m-0 mb-3">
          🚀 What to expect after accepting:
        </Text>
        <div className="space-y-2">
          <div className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mr-3 mt-0.5">
              1
            </span>
            <Text className="text-gray-700 text-sm m-0">
              Create your secure account with two-factor authentication
            </Text>
          </div>
          <div className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mr-3 mt-0.5">
              2
            </span>
            <Text className="text-gray-700 text-sm m-0">
              Complete your profile and department-specific training
            </Text>
          </div>
          <div className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mr-3 mt-0.5">
              3
            </span>
            <Text className="text-gray-700 text-sm m-0">
              Access your role-specific dashboard and tools
            </Text>
          </div>
          <div className="flex items-start">
            <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-800 text-xs font-medium rounded-full mr-3 mt-0.5">
              4
            </span>
            <Text className="text-gray-700 text-sm m-0">
              Start collaborating with your team on HospitalOS
            </Text>
          </div>
        </div>
      </Section>

      {/* Security & Compliance Notice */}
      <Section className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
        <Text className="text-purple-800 font-medium m-0 mb-2">
          🔒 Security & Compliance
        </Text>
        <Text className="text-purple-700 text-sm m-0 mb-2">
          HospitalOS is fully HIPAA compliant and includes:
        </Text>
        <ul className="text-purple-600 text-sm m-0 pl-4">
          <li>End-to-end encryption for all data</li>
          <li>Role-based access controls</li>
          <li>Comprehensive audit logging</li>
          <li>Regular security monitoring and updates</li>
          <li>Multi-factor authentication</li>
        </ul>
      </Section>

      <Text className="text-gray-700 mb-4">
        <strong>Important:</strong> This invitation will expire on {expirationDate}. 
        If you don't accept by then, please contact {inviterName} to request a new invitation.
      </Text>

      <Text className="text-gray-700">
        If you have any questions about this invitation or need technical assistance, 
        please don't hesitate to reach out to our support team.
      </Text>

      <Text className="text-gray-700 mt-4">
        We're excited to have you join the team!<br />
        {hospitalName} & HospitalOS Team
      </Text>
    </HospitalEmailLayout>
  );
};