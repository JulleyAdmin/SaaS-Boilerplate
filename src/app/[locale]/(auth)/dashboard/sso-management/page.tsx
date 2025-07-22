'use client';

import { useOrganization } from '@clerk/nextjs';
import { useState } from 'react';

import { createSSOConnection, deleteSSOConnection, useSSOConnections } from '@/hooks/useSSOConnections';

export default function SSOManagementPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const { organization } = useOrganization();
  const { connections, isLoading, isError, mutate } = useSSOConnections();

  const handleCreateConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) {
      return;
    }

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    setCreating(true);
    try {
      // Collect selected roles
      const roleElements = form.querySelectorAll('input[name="roles"]:checked');
      const selectedRoles = Array.from(roleElements).map((el: any) => el.value);

      const department = formData.get('department') as string;

      // Create enhanced description with hospital context
      const baseDescription = formData.get('description') as string;
      const enhancedDescription = `${baseDescription} | Department: ${department} | Roles: ${selectedRoles.join(', ')}`;

      await createSSOConnection(organization.id, {
        name: formData.get('name') as string,
        description: enhancedDescription,
        redirectUrl: formData.get('redirectUrl') as string,
        metadata: formData.get('metadata') as string,
      });

      setShowCreateDialog(false);
      form.reset();
      mutate(); // Refresh the connections list
    } catch (error) {
      console.error('Failed to create connection:', error);
      alert('Failed to create SSO connection. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteConnection = async (connectionId: string) => {
    if (!organization || !confirm('Are you sure you want to delete this SSO connection?')) {
      return;
    }

    setDeleting(connectionId);
    try {
      await deleteSSOConnection(organization.id, connectionId);
      mutate(); // Refresh the connections list
    } catch (error) {
      console.error('Failed to delete connection:', error);
      alert('Failed to delete SSO connection. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 text-2xl font-bold">SSO Management</h1>
      <p className="mb-6">Configure SAML single sign-on for your hospital staff.</p>

      <div className="rounded-lg border bg-white p-6">
        <button
          onClick={() => setShowCreateDialog(true)}
          disabled={creating}
          className="mb-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {creating ? 'Creating...' : '+ Create SSO Connection'}
        </button>

        {isLoading
          ? (
              <div className="py-8 text-center text-gray-500">
                <p>Loading SSO connections...</p>
              </div>
            )
          : isError
            ? (
                <div className="py-8 text-center text-red-500">
                  <p className="mb-2">Failed to load SSO connections.</p>
                  <button
                    onClick={() => mutate()}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Try again
                  </button>
                </div>
              )
            : connections.length === 0
              ? (
                  <div className="py-8 text-center text-gray-500">
                    <p className="mb-2">No SSO connections configured yet.</p>
                    <p className="text-sm">Create your first SAML connection.</p>
                  </div>
                )
              : (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">
                      Configured Connections (
                      {connections.length}
                      )
                    </h3>
                    {connections.map(conn => (
                      <div key={conn.clientID} className="rounded border p-4">
                        <h4 className="font-semibold">{conn.name}</h4>
                        <p className="text-sm text-gray-600">{conn.description}</p>
                        <p className="mt-2 text-xs text-gray-500">
                          Tenant:
                          {' '}
                          {conn.tenant}
                          {' '}
                          | Product:
                          {' '}
                          {conn.product}
                          {conn.defaultRedirectUrl && ` | Redirect: ${conn.defaultRedirectUrl}`}
                        </p>
                        <div className="mt-2 space-x-2">
                          <button className="text-sm text-blue-600 hover:text-blue-700">Edit</button>
                          <button
                            onClick={() => conn.clientID && handleDeleteConnection(conn.clientID)}
                            disabled={deleting === conn.clientID}
                            className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                          >
                            {deleting === conn.clientID ? 'Deleting...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

        <div className="mt-6 rounded border border-green-200 bg-green-50 p-4">
          <h3 className="mb-2 font-semibold text-green-900">🚀 Phase 2 - Backend Integration Active</h3>
          <p className="mb-3 text-sm text-green-800">
            SSO connections are now stored in the database via Jackson SAML service.
            Create and manage real SAML connections for hospital authentication.
          </p>
          {connections.length > 0 && organization && (
            <div className="space-y-2">
              <button
                onClick={() => window.open(`/api/auth/sso/test?tenant=${organization.id}`, '_blank')}
                className="rounded bg-green-600 px-3 py-1 text-xs text-white hover:bg-green-700"
              >
                🔧 Test SSO Integration
              </button>
              <button
                onClick={() => window.open(`/api/auth/sso/authorize?tenant=${organization.id}&product=hospitalos`, '_blank')}
                className="ml-2 rounded bg-blue-600 px-3 py-1 text-xs text-white hover:bg-blue-700"
              >
                🔐 Test SSO Login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Connection Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-bold">Create SSO Connection</h2>

            <form onSubmit={handleCreateConnection}>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Connection Name *
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    defaultValue="St. Mary's Hospital SAML"
                    className="w-full rounded border px-3 py-2"
                    placeholder="e.g., Hospital SAML"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <input
                    name="description"
                    type="text"
                    defaultValue="Primary SAML connection for hospital staff"
                    className="w-full rounded border px-3 py-2"
                    placeholder="Brief description"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Hospital Department
                  </label>
                  <select
                    name="department"
                    className="w-full rounded border px-3 py-2"
                    defaultValue="general"
                  >
                    <option value="general">General Hospital Access</option>
                    <option value="emergency">Emergency Department</option>
                    <option value="icu">Intensive Care Unit</option>
                    <option value="surgery">Surgery Department</option>
                    <option value="laboratory">Laboratory</option>
                    <option value="radiology">Radiology</option>
                    <option value="pharmacy">Pharmacy</option>
                    <option value="administration">Administration</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Redirect URL *
                  </label>
                  <input
                    name="redirectUrl"
                    type="url"
                    required
                    defaultValue="http://localhost:3002/api/auth/sso/callback"
                    className="w-full rounded border px-3 py-2"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Allowed Staff Roles
                  </label>
                  <div className="mb-2 grid grid-cols-2 gap-2">
                    <label className="flex items-center">
                      <input type="checkbox" name="roles" value="doctor" defaultChecked className="mr-2" />
                      Doctor
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="roles" value="nurse" defaultChecked className="mr-2" />
                      Nurse
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="roles" value="technician" className="mr-2" />
                      Technician
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="roles" value="administrator" className="mr-2" />
                      Administrator
                    </label>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    SAML Metadata (URL or XML)
                  </label>
                  <textarea
                    name="metadata"
                    className="w-full rounded border px-3 py-2"
                    rows={3}
                    placeholder="Paste SAML metadata URL or XML"
                    defaultValue="https://mocksaml.com/api/saml/metadata"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateDialog(false)}
                  className="rounded border px-4 py-2 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Connection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
