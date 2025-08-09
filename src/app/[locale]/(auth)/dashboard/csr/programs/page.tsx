import CSRProgramDashboard from '@/components/csr/CSRProgramDashboard';

export default async function CSRPage() {
  // Demo mode - allow access without authentication
  const DEMO_MODE = true;

  return (
    <div className="container mx-auto p-6">
      <CSRProgramDashboard />
    </div>
  );
}
