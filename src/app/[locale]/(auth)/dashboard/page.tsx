export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">HospitalOS Dashboard</h1>
      <p className="mb-6">Welcome to the hospital management system.</p>
      
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">SSO Management</h2>
        <p className="mb-4">Configure single sign-on for your hospital.</p>
        <a 
          href="/dashboard/sso-management"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Manage SSO
        </a>
      </div>
    </div>
  );
}