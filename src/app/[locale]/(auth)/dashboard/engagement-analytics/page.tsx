import EngagementAnalyticsDashboard from '@/components/engagement/EngagementAnalyticsDashboard';

export default async function EngagementAnalyticsPage() {
  // Demo mode - allow access without authentication
  const DEMO_MODE = true;

  return (
    <div className="container mx-auto p-6">
      <EngagementAnalyticsDashboard />
    </div>
  );
}