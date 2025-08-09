import type { Metadata } from 'next';
import AppointmentsRedesigned from '@/components/appointments/AppointmentsRedesigned';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Appointments - Hospital Management System',
    description: 'Advanced appointment scheduling with queue management, doctor schedules, and payment integration',
  };
}

export default function AppointmentsPage() {
  return <AppointmentsRedesigned />;
}