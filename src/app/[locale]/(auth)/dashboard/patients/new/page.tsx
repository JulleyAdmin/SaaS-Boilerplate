import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

import { PatientRegistrationForm } from '@/components/patients/PatientRegistrationForm';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Navigation');

  return {
    title: 'Register New Patient',
    description: 'Register a new patient in the hospital management system',
  };
}

export default function NewPatientPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Register New Patient</h1>
        <p className="text-muted-foreground mt-2">
          Enter patient details to create a new medical record
        </p>
      </div>
      <PatientRegistrationForm />
    </div>
  );
}