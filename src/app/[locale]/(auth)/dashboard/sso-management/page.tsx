'use client';

import { useState } from 'react';

export default function SSOManagementPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [connections, setConnections] = useState<any[]>([]);

  const handleCreateConnection = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const newConnection = {
      id: Date.now(),
      name: formData.get('name'),
      description: formData.get('description'),
      tenant: formData.get('tenant'),
      redirectUrl: formData.get('redirectUrl'),
      createdAt: new Date().toISOString()
    };
    
    setConnections([...connections, newConnection]);
    setShowCreateDialog(false);
    form.reset();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">SSO Management</h1>
      <p className="mb-6">Configure SAML single sign-on for your hospital staff.</p>
      
      <div className="bg-white border rounded-lg p-6">
        <button 
          onClick={() => setShowCreateDialog(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
        >
          + Create SSO Connection
        </button>
        
        {connections.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p className="mb-2">No SSO connections configured yet.</p>
            <p className="text-sm">Create your first SAML connection.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900">Configured Connections</h3>
            {connections.map(conn => (
              <div key={conn.id} className="border rounded p-4">
                <h4 className="font-semibold">{conn.name}</h4>
                <p className="text-sm text-gray-600">{conn.description}</p>
                <p className="text-xs text-gray-500 mt-2">
                  Tenant: {conn.tenant} | Created: {new Date(conn.createdAt).toLocaleDateString()}
                </p>
                <div className="mt-2 space-x-2">
                  <button className="text-blue-600 hover:text-blue-700 text-sm">Edit</button>
                  <button 
                    onClick={() => setConnections(connections.filter(c => c.id !== conn.id))}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="bg-blue-50 border border-blue-200 rounded p-4 mt-6">
          <h3 className="font-semibold text-blue-900 mb-2">🧪 Phase 1 Testing</h3>
          <p className="text-blue-800 text-sm">
            Click "Create SSO Connection" to test the SSO configuration interface.
            This simulates the SAML connection creation process for hospital authentication.
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
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Create Connection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}