import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Img,
  Text,
  Hr,
  Link,
  Tailwind,
} from '@react-email/components';
import { ReactNode } from 'react';

interface HospitalEmailLayoutProps {
  children: ReactNode;
  hospitalName: string;
  hospitalLogo?: string;
  footerText?: string;
  complianceLevel?: 'basic' | 'hipaa' | 'hipaa_plus';
  supportEmail?: string;
}

export const HospitalEmailLayout = ({
  children,
  hospitalName,
  hospitalLogo,
  footerText,
  complianceLevel = 'hipaa',
  supportEmail = 'support@hospitalos.com',
}: HospitalEmailLayoutProps) => {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-gray-50 font-sans">
          <Container className="mx-auto py-5 pb-12">
            {/* Header */}
            <Section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
              <div className="flex items-center">
                {hospitalLogo && (
                  <Img
                    src={hospitalLogo}
                    alt={`${hospitalName} Logo`}
                    className="h-12 w-auto mr-4"
                  />
                )}
                <div>
                  <Text className="text-xl font-bold text-gray-900 m-0">
                    {hospitalName}
                  </Text>
                  <Text className="text-sm text-gray-600 m-0">
                    Healthcare Management System
                  </Text>
                </div>
              </div>
            </Section>

            {/* Main Content */}
            <Section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-4">
              {children}
            </Section>

            {/* Footer */}
            <Section className="bg-gray-100 rounded-lg p-6 text-center">
              <Text className="text-sm text-gray-600 mb-4">
                {footerText || `This message was sent by ${hospitalName} via HospitalOS.`}
              </Text>

              {/* Compliance Notice */}
              {complianceLevel === 'hipaa' && (
                <Section className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <Text className="text-xs text-blue-800 m-0 font-medium">
                    🔒 HIPAA COMPLIANT COMMUNICATION
                  </Text>
                  <Text className="text-xs text-blue-700 m-0 mt-1">
                    This email contains no Protected Health Information (PHI). 
                    All patient data is securely managed within our HIPAA-compliant system.
                  </Text>
                </Section>
              )}

              <Hr className="border-gray-300 my-4" />
              
              {/* Support Information */}
              <div className="text-xs text-gray-500">
                <Text className="m-0 mb-2">
                  Need help? Contact us at{' '}
                  <Link href={`mailto:${supportEmail}`} className="text-blue-600 underline">
                    {supportEmail}
                  </Link>
                </Text>
                
                <Text className="m-0 mb-2">
                  Powered by{' '}
                  <Link href="https://hospitalos.com" className="text-blue-600 underline">
                    HospitalOS
                  </Link>{' '}
                  - Secure Healthcare Management Platform
                </Text>

                <Text className="m-0 text-xs">
                  This email was sent to you as part of your healthcare management system. 
                  If you believe you received this email in error, please contact your system administrator.
                </Text>
              </div>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};