import MedicationDispensingInterface from '@/components/pharmacy/MedicationDispensingInterface';

interface MedicationDispensingPageProps {
  params: {
    id: string;
  };
}

export default function MedicationDispensingPage({ params }: MedicationDispensingPageProps) {
  return <MedicationDispensingInterface prescriptionId={params.id} />;
}