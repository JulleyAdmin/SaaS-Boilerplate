import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import AppointmentsRedesigned from '@/components/appointments/AppointmentsRedesigned';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Navigation');

  return {
    title: 'Appointments - Hospital Management System',
    description: 'Advanced appointment scheduling with queue management, doctor schedules, and payment integration',
  };
}

export default function AppointmentsPage() {
  return <AppointmentsRedesigned />;
}