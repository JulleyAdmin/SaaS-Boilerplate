'use client';

import { useState } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { useSSOConnections, createSSOConnection, deleteSSOConnection } from '@/hooks/useSSOConnections';

export default function SSOManagementPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  
  const { organization } = useOrganization();
  const { connections, isLoading, isError, mutate } = useSSOConnections();

  const handleCreateConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization) return;
    
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    setCreating(true);
    try {
      await createSSOConnection(organization.id, {
        name: formData.get('name') as string,
        description: formData.get('description') as string,
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
    if (!organization || !confirm('Are you sure you want to delete this SSO connection?')) return;
    
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
      <h1 className="text-2xl font-bold mb-4">SSO Management</h1>
      <p className="mb-6">Configure SAML single sign-on for your hospital staff.</p>
      
      <div className="bg-white border rounded-lg p-6">
        <button 
          onClick={() => setShowCreateDialog(true)}
          disabled={creating}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4 disabled:opacity-50"
        >
          {creating ? 'Creating...' : '+ Create SSO Connection'}
        </button>
        
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">
            <p>Loading SSO connections...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500">
            <p className="mb-2">Failed to load SSO connections.</p>
            <button 
              onClick={() => mutate()}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Try again
            </button>
          </div>
        ) : connections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">No SSO connections configured yet.</p>
            <p className="text-sm">Create your first SAML connection.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Configured Connections ({connections.length})</h3>
            {connections.map(conn => (
              <div key={conn.clientID} className="border rounded p-4">
                <h4 className="font-semibold">{conn.name}</h4>
                <p className="text-sm text-gray-600">{conn.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Tenant: {conn.tenant} | Product: {conn.product}
                  {conn.defaultRedirectUrl && ` | Redirect: ${conn.defaultRedirectUrl}`}
                </p>
                <div className="mt-2 space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
                  <button 
                    onClick={() => handleDeleteConnection(conn.clientID)}
                    disabled={deleting === conn.clientID}
                    className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                  >
                    {deleting === conn.clientID ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="bg-green-50 border border-green-200 rounded p-4 mt-6">
          <h3 className="font-semibold text-green-900 mb-2">🚀 Phase 2 - Backend Integration Active</h3>
          <p className="text-green-800 text-sm">
            SSO connections are now stored in the database via Jackson SAML service.
            Create and manage real SAML connections for hospital authentication.
          </p>
        </div>
      </div>

      {/* Create Connection Dialog */}
      {showCreateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Create SSO Connection</h2>
            
            <form onSubmit={handleCreateConnection}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Connection Name *
                  </label>
                  <input
                    name="name"
                    type="text"
                    required
                    defaultValue="St. Mary's Hospital SAML"
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g., Hospital SAML"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    name="description"
                    type="text"
                    defaultValue="Primary SAML connection for hospital staff"
                    className="w-full border rounded px-3 py-2"
                    placeholder="Brief description"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tenant (Organization ID) *
                  </label>
                  <input
                    name="tenant"
                    type="text"
                    required
                    defaultValue="st-marys-hospital"
                    className="w-full border rounded px-3 py-2"
                    placeholder="e.g., st-marys-hospital"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Redirect URL *
                  </label>
                  <input
                    name="redirectUrl"
                    type="url"
                    required
                    defaultValue="http://localhost:3002/api/auth/sso/callback"
                    className="w-full border rounded px-3 py-2"
                    placeholder="https://..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SAML Metadata (URL or XML)
                  </label>
                  <textarea
                    name="metadata"
                    className="w-full border rounded px-3 py-2"
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
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
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