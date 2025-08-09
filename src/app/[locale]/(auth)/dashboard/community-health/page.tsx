import CommunityHealthPrograms from '@/components/engagement/CommunityHealthPrograms';

export default async function CommunityHealthPage() {
  // Demo mode - allow access without authentication
  const DEMO_MODE = true;

  return (
    <div className="container mx-auto p-6">
      <CommunityHealthPrograms />
    </div>
  );
}