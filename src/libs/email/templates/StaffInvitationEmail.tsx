import { Button, Heading, Section, Text } from '@react-email/components';

import { HospitalEmailLayout } from './HospitalEmailLayout';

type StaffInvitationEmailProps = {
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
};

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
      administrator: 'Full system administration access with user management capabilities',
      doctor: 'Clinical access with patient management and medical record permissions',
      nurse: 'Patient care access with documentation and monitoring capabilities',
      technician: 'Equipment and laboratory access with specialized workflow permissions',
      viewer: 'Read-only access to assigned department information',
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
      <Heading className="mb-4 text-2xl font-bold text-gray-900">
        You're Invited to Join
        {' '}
        {hospitalName}
        ! 🏥
      </Heading>

      <Text className="mb-4 text-gray-700">
        Hello
        {' '}
        {inviteeName}
        ,
      </Text>

      <Text className="mb-6 text-gray-700">
        {inviterName}
        {' '}
        (
        {inviterRole}
        ) has invited you to join the
        {hospitalName}
        {' '}
        team
        as a
        <strong>{role}</strong>
        {' '}
        in the
        <strong>{department}</strong>
        {' '}
        department.
      </Text>

      {/* Invitation Details */}
      <Section className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
        <Text className="m-0 mb-3 font-medium text-blue-800">
          📋 Invitation Details
        </Text>
        <div className="space-y-1 text-sm text-blue-700">
          <Text className="m-0">
            <strong>
              {hospitalType === 'clinic' ? 'Clinic' : 'Hospital'}
              :
            </strong>
            {' '}
            {hospitalName}
          </Text>
          <Text className="m-0">
            <strong>Your Role:</strong>
            {' '}
            {role}
          </Text>
          <Text className="m-0">
            <strong>Department:</strong>
            {' '}
            {department}
          </Text>
          <Text className="m-0">
            <strong>Invited by:</strong>
            {' '}
            {inviterName}
            {' '}
            (
            {inviterRole}
            )
          </Text>
          <Text className="m-0">
            <strong>Invitation expires:</strong>
            {' '}
            {expirationDate}
          </Text>
        </div>
      </Section>

      {/* Role Permissions */}
      <Section className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
        <Text className="m-0 mb-2 font-medium text-green-800">
          🔐 Your Access Level:
          {' '}
          {role}
        </Text>
        <Text className="m-0 text-sm text-green-700">
          {getRoleDescription(role)}
        </Text>
      </Section>

      <Text className="mb-4 text-gray-700">
        To accept this invitation and set up your account, click the button below:
      </Text>

      <Section className="mb-6 text-center">
        <Button
          href={acceptInviteUrl}
          className="rounded-lg bg-green-600 px-6 py-3 text-base font-medium text-white no-underline"
        >
          Accept Invitation
        </Button>
      </Section>

      <Text className="mb-6 text-sm text-gray-600">
        If the button doesn't work, you can copy and paste this link into your browser:
      </Text>
      <Text className="mb-6 break-all text-sm text-blue-600">
        {acceptInviteUrl}
      </Text>

      {/* What to Expect */}
      <Section className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <Text className="m-0 mb-3 font-medium text-gray-900">
          🚀 What to expect after accepting:
        </Text>
        <div className="space-y-2">
          <div className="flex items-start">
            <span className="mr-3 mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800">
              1
            </span>
            <Text className="m-0 text-sm text-gray-700">
              Create your secure account with two-factor authentication
            </Text>
          </div>
          <div className="flex items-start">
            <span className="mr-3 mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800">
              2
            </span>
            <Text className="m-0 text-sm text-gray-700">
              Complete your profile and department-specific training
            </Text>
          </div>
          <div className="flex items-start">
            <span className="mr-3 mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800">
              3
            </span>
            <Text className="m-0 text-sm text-gray-700">
              Access your role-specific dashboard and tools
            </Text>
          </div>
          <div className="flex items-start">
            <span className="mr-3 mt-0.5 inline-flex size-6 items-center justify-center rounded-full bg-blue-100 text-xs font-medium text-blue-800">
              4
            </span>
            <Text className="m-0 text-sm text-gray-700">
              Start collaborating with your team on HospitalOS
            </Text>
          </div>
        </div>
      </Section>

      {/* Security & Compliance Notice */}
      <Section className="mb-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
        <Text className="m-0 mb-2 font-medium text-purple-800">
          🔒 Security & Compliance
        </Text>
        <Text className="m-0 mb-2 text-sm text-purple-700">
          HospitalOS is fully HIPAA compliant and includes:
        </Text>
        <ul className="m-0 pl-4 text-sm text-purple-600">
          <li>End-to-end encryption for all data</li>
          <li>Role-based access controls</li>
          <li>Comprehensive audit logging</li>
          <li>Regular security monitoring and updates</li>
          <li>Multi-factor authentication</li>
        </ul>
      </Section>

      <Text className="mb-4 text-gray-700">
        <strong>Important:</strong>
        {' '}
        This invitation will expire on
        {expirationDate}
        .
        If you don't accept by then, please contact
        {inviterName}
        {' '}
        to request a new invitation.
      </Text>

      <Text className="text-gray-700">
        If you have any questions about this invitation or need technical assistance,
        please don't hesitate to reach out to our support team.
      </Text>

      <Text className="mt-4 text-gray-700">
        We're excited to have you join the team!
        <br />
        {hospitalName}
        {' '}
        & HospitalOS Team
      </Text>
    </HospitalEmailLayout>
  );
};
