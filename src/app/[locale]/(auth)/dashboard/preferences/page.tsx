import PatientPreferencesDashboard from '@/components/engagement/PatientPreferencesDashboard';

export default async function PreferencesPage() {
  // Demo mode - allow access without authentication
  const DEMO_MODE = true;
  const userId = 'demo-user';

  return (
    <div className="container mx-auto p-6">
      <PatientPreferencesDashboard 
        patientId={userId}
        isProvider={false}
      />
    </div>
  );
}
