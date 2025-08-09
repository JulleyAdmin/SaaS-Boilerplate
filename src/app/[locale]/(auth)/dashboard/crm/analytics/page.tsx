import CRMAnalyticsDashboard from '@/components/crm/CRMAnalyticsDashboard';

export default async function Page() {
  // Demo mode - allow access without authentication
  const DEMO_MODE = true;

  return (
    <div className="container mx-auto p-6">
      <CRMAnalyticsDashboard />
    </div>
  );
}
