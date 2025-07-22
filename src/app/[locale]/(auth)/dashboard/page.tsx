export default function DashboardPage() {
  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">HospitalOS Dashboard</h1>
      <p className="mb-6">Welcome to the hospital management system.</p>

      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-2 text-xl font-semibold">SSO Management</h2>
        <p className="mb-4">Configure single sign-on for your hospital.</p>
        <a
          href="/dashboard/sso-management"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Manage SSO
        </a>
      </div>
    </div>
  );
}
