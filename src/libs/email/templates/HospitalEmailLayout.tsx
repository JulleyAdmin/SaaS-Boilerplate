import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';
import type { ReactNode } from 'react';

type HospitalEmailLayoutProps = {
  children: ReactNode;
  hospitalName: string;
  hospitalLogo?: string;
  footerText?: string;
  complianceLevel?: 'basic' | 'hipaa' | 'hipaa_plus';
  supportEmail?: string;
};

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
            <Section className="mb-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex items-center">
                {hospitalLogo && (
                  <Img
                    src={hospitalLogo}
                    alt={`${hospitalName} Logo`}
                    className="mr-4 h-12 w-auto"
                  />
                )}
                <div>
                  <Text className="m-0 text-xl font-bold text-gray-900">
                    {hospitalName}
                  </Text>
                  <Text className="m-0 text-sm text-gray-600">
                    Healthcare Management System
                  </Text>
                </div>
              </div>
            </Section>

            {/* Main Content */}
            <Section className="mb-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              {children}
            </Section>

            {/* Footer */}
            <Section className="rounded-lg bg-gray-100 p-6 text-center">
              <Text className="mb-4 text-sm text-gray-600">
                {footerText || `This message was sent by ${hospitalName} via HospitalOS.`}
              </Text>

              {/* Compliance Notice */}
              {complianceLevel === 'hipaa' && (
                <Section className="mb-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <Text className="m-0 text-xs font-medium text-blue-800">
                    🔒 HIPAA COMPLIANT COMMUNICATION
                  </Text>
                  <Text className="m-0 mt-1 text-xs text-blue-700">
                    This email contains no Protected Health Information (PHI).
                    All patient data is securely managed within our HIPAA-compliant system.
                  </Text>
                </Section>
              )}

              <Hr className="my-4 border-gray-300" />

              {/* Support Information */}
              <div className="text-xs text-gray-500">
                <Text className="m-0 mb-2">
                  Need help? Contact us at
                  {' '}
                  <Link href={`mailto:${supportEmail}`} className="text-blue-600 underline">
                    {supportEmail}
                  </Link>
                </Text>

                <Text className="m-0 mb-2">
                  Powered by
                  {' '}
                  <Link href="https://hospitalos.com" className="text-blue-600 underline">
                    HospitalOS
                  </Link>
                  {' '}
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
