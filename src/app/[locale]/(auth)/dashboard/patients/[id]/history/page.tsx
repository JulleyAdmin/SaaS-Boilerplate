import PatientHistory from '@/components/patients/PatientHistory';

interface PatientHistoryPageProps {
  params: {
    id: string;
    locale: string;
  };
}

export default function PatientHistoryPage({ params }: PatientHistoryPageProps) {
  return <PatientHistory patientId={params.id} />;
}