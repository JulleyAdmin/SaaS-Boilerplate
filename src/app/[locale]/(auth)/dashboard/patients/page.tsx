import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { PatientManagement } from '@/components/patients/patient-management';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Navigation');

  return {
    title: t('patients'),
    description: 'Manage patients, view medical records, and track patient care',
  };
}

export default function PatientsPage() {
  return <PatientManagement />;
}
