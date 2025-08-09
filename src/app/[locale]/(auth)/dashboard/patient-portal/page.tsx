import PatientPortalEnhanced from '@/components/engagement/PatientPortalEnhanced';

export default async function PatientPortalPage() {
  // Demo mode - allow access without authentication
  const DEMO_MODE = true;

  return (
    <div className="container mx-auto p-6">
      <PatientPortalEnhanced />
    </div>
  );
}