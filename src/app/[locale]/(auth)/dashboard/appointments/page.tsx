import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { EnhancedAppointmentScheduler } from '@/components/appointments/EnhancedAppointmentScheduler';
// Keep the original scheduler for fallback
// import { AppointmentScheduler } from '@/components/appointments/AppointmentScheduler';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('Navigation');

  return {
    title: 'Appointments - Hospital Management System',
    description: 'Advanced appointment scheduling with queue management, doctor schedules, and payment integration',
  };
}

export default function AppointmentsPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Appointment Management System</h1>
        <p className="text-muted-foreground mt-2">
          Schedule appointments, manage doctor availability, track queue status, and handle patient flow
        </p>
      </div>
      <EnhancedAppointmentScheduler />
    </div>
  );
}