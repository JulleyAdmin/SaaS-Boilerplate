import { Button, Heading, Section, Text } from '@react-email/components';

import { HospitalEmailLayout } from './HospitalEmailLayout';

type PatientNotificationEmailProps = {
  hospitalName: string;
  patientFirstName: string; // Only first name to minimize PHI
  notificationType: 'appointment_reminder' | 'appointment_confirmation' | 'general_notification' | 'portal_access';
  appointmentDate?: string;
  appointmentTime?: string;
  departmentName?: string;
  message: string;
  actionUrl?: string;
  actionButtonText?: string;
  supportPhone?: string;
  supportEmail?: string;
};

export const PatientNotificationEmail = ({
  hospitalName,
  patientFirstName,
  notificationType,
  appointmentDate,
  appointmentTime,
  departmentName,
  message,
  actionUrl,
  actionButtonText,
  supportPhone,
  supportEmail,
}: PatientNotificationEmailProps) => {
  const getNotificationTitle = () => {
    switch (notificationType) {
      case 'appointment_reminder':
        return 'Appointment Reminder 📅';
      case 'appointment_confirmation':
        return 'Appointment Confirmed ✅';
      case 'portal_access':
        return 'Patient Portal Access 💻';
      default:
        return 'Important Notice 📋';
    }
  };

  const getNotificationIcon = () => {
    switch (notificationType) {
      case 'appointment_reminder':
        return '🕐';
      case 'appointment_confirmation':
        return '✅';
      case 'portal_access':
        return '🔐';
      default:
        return 'ℹ️';
    }
  };

  return (
    <HospitalEmailLayout
      hospitalName={hospitalName}
      supportEmail={supportEmail}
      complianceLevel="hipaa"
      footerText="This notification contains no personal health information. All medical details are securely stored in your patient portal."
    >
      <Heading className="mb-4 text-2xl font-bold text-gray-900">
        {getNotificationTitle()}
      </Heading>

      <Text className="mb-4 text-gray-700">
        Dear
        {' '}
        {patientFirstName}
        ,
      </Text>

      <Text className="mb-6 text-gray-700">
        {message}
      </Text>

      {/* Appointment Details (if applicable) */}
      {(appointmentDate || appointmentTime || departmentName) && (
        <Section className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
          <Text className="m-0 mb-3 font-medium text-blue-800">
            {getNotificationIcon()}
            {' '}
            Appointment Information
          </Text>
          <div className="space-y-1 text-sm text-blue-700">
            {appointmentDate && (
              <Text className="m-0">
                <strong>Date:</strong>
                {' '}
                {appointmentDate}
              </Text>
            )}
            {appointmentTime && (
              <Text className="m-0">
                <strong>Time:</strong>
                {' '}
                {appointmentTime}
              </Text>
            )}
            {departmentName && (
              <Text className="m-0">
                <strong>Department:</strong>
                {' '}
                {departmentName}
              </Text>
            )}
            <Text className="m-0">
              <strong>Location:</strong>
              {' '}
              {hospitalName}
            </Text>
          </div>
        </Section>
      )}

      {/* Action Button */}
      {actionUrl && actionButtonText && (
        <Section className="mb-6 text-center">
          <Button
            href={actionUrl}
            className="rounded-lg bg-blue-600 px-6 py-3 text-base font-medium text-white no-underline"
          >
            {actionButtonText}
          </Button>
        </Section>
      )}

      {/* Preparation Instructions (for appointment types) */}
      {(notificationType === 'appointment_reminder' || notificationType === 'appointment_confirmation') && (
        <Section className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
          <Text className="m-0 mb-2 font-medium text-green-800">
            📝 Important Reminders
          </Text>
          <ul className="m-0 pl-4 text-sm text-green-700">
            <li>Please arrive 15 minutes early for check-in</li>
            <li>Bring a valid photo ID and insurance card</li>
            <li>Bring a list of current medications</li>
            <li>Wear comfortable, easily removable clothing if applicable</li>
          </ul>
        </Section>
      )}

      {/* Contact Information */}
      <Section className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <Text className="m-0 mb-2 font-medium text-gray-900">
          📞 Need to make changes or have questions?
        </Text>
        <div className="text-sm text-gray-600">
          {supportPhone && (
            <Text className="m-0 mb-1">
              <strong>Phone:</strong>
              {' '}
              {supportPhone}
            </Text>
          )}
          {supportEmail && (
            <Text className="m-0 mb-1">
              <strong>Email:</strong>
              {' '}
              {supportEmail}
            </Text>
          )}
          <Text className="m-0">
            <strong>Hospital:</strong>
            {' '}
            {hospitalName}
          </Text>
        </div>
      </Section>

      {/* Privacy Notice */}
      <Section className="mb-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
        <Text className="m-0 mb-2 font-medium text-purple-800">
          🔒 Privacy & Security Notice
        </Text>
        <Text className="m-0 text-sm text-purple-700">
          This email contains no personal health information (PHI). All medical details and sensitive
          information are securely stored in your patient portal and are only accessible with your
          secure login credentials.
        </Text>
      </Section>

      <Text className="text-gray-700">
        Thank you for choosing
        {' '}
        {hospitalName}
        {' '}
        for your healthcare needs. We look forward to seeing you.
      </Text>

      <Text className="mt-4 text-gray-700">
        Sincerely,
        <br />
        {hospitalName}
        {' '}
        Patient Services
      </Text>
    </HospitalEmailLayout>
  );
};
