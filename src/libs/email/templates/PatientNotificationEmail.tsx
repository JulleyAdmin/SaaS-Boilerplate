import { Text, Button, Section, Heading } from '@react-email/components';
import { HospitalEmailLayout } from './HospitalEmailLayout';

interface PatientNotificationEmailProps {
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
}

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
      <Heading className="text-2xl font-bold text-gray-900 mb-4">
        {getNotificationTitle()}
      </Heading>
      
      <Text className="text-gray-700 mb-4">
        Dear {patientFirstName},
      </Text>
      
      <Text className="text-gray-700 mb-6">
        {message}
      </Text>

      {/* Appointment Details (if applicable) */}
      {(appointmentDate || appointmentTime || departmentName) && (
        <Section className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <Text className="text-blue-800 font-medium m-0 mb-3">
            {getNotificationIcon()} Appointment Information
          </Text>
          <div className="text-blue-700 text-sm space-y-1">
            {appointmentDate && (
              <Text className="m-0">
                <strong>Date:</strong> {appointmentDate}
              </Text>
            )}
            {appointmentTime && (
              <Text className="m-0">
                <strong>Time:</strong> {appointmentTime}
              </Text>
            )}
            {departmentName && (
              <Text className="m-0">
                <strong>Department:</strong> {departmentName}
              </Text>
            )}
            <Text className="m-0">
              <strong>Location:</strong> {hospitalName}
            </Text>
          </div>
        </Section>
      )}

      {/* Action Button */}
      {actionUrl && actionButtonText && (
        <Section className="text-center mb-6">
          <Button
            href={actionUrl}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-base font-medium no-underline"
          >
            {actionButtonText}
          </Button>
        </Section>
      )}

      {/* Preparation Instructions (for appointment types) */}
      {(notificationType === 'appointment_reminder' || notificationType === 'appointment_confirmation') && (
        <Section className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <Text className="text-green-800 font-medium m-0 mb-2">
            📝 Important Reminders
          </Text>
          <ul className="text-green-700 text-sm m-0 pl-4">
            <li>Please arrive 15 minutes early for check-in</li>
            <li>Bring a valid photo ID and insurance card</li>
            <li>Bring a list of current medications</li>
            <li>Wear comfortable, easily removable clothing if applicable</li>
          </ul>
        </Section>
      )}

      {/* Contact Information */}
      <Section className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
        <Text className="font-medium text-gray-900 m-0 mb-2">
          📞 Need to make changes or have questions?
        </Text>
        <div className="text-gray-600 text-sm">
          {supportPhone && (
            <Text className="m-0 mb-1">
              <strong>Phone:</strong> {supportPhone}
            </Text>
          )}
          {supportEmail && (
            <Text className="m-0 mb-1">
              <strong>Email:</strong> {supportEmail}
            </Text>
          )}
          <Text className="m-0">
            <strong>Hospital:</strong> {hospitalName}
          </Text>
        </div>
      </Section>

      {/* Privacy Notice */}
      <Section className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
        <Text className="text-purple-800 font-medium m-0 mb-2">
          🔒 Privacy & Security Notice
        </Text>
        <Text className="text-purple-700 text-sm m-0">
          This email contains no personal health information (PHI). All medical details and sensitive 
          information are securely stored in your patient portal and are only accessible with your 
          secure login credentials.
        </Text>
      </Section>

      <Text className="text-gray-700">
        Thank you for choosing {hospitalName} for your healthcare needs. We look forward to seeing you.
      </Text>

      <Text className="text-gray-700 mt-4">
        Sincerely,<br />
        {hospitalName} Patient Services
      </Text>
    </HospitalEmailLayout>
  );
};