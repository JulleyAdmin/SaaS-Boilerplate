import type { Metadata } from 'next';
import { PatientDetails } from '@/components/patients/PatientDetails';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: 'Patient Details',
    description: 'View patient medical records and history',
  };
}

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  return <PatientDetails patientId={params.id} />;
}