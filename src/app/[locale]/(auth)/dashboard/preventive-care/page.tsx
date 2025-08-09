import PreventiveCareDashboard from '@/components/engagement/PreventiveCareDashboard';

export default async function PreventiveCareePage() {
  // Demo mode - allow access without authentication
  const DEMO_MODE = true;

  return (
    <div className="container mx-auto p-6">
      <PreventiveCareDashboard />
    </div>
  );
}