import CampaignManagementEnhanced from '@/components/engagement/CampaignManagementEnhanced';

export default async function CampaignsPage() {
  // Demo mode - allow access without authentication
  const DEMO_MODE = true;

  return (
    <div className="container mx-auto p-6">
      <CampaignManagementEnhanced />
    </div>
  );
}