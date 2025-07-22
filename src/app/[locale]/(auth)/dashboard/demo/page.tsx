'use client';

import { useState } from 'react';
import { useOrganization, useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { createApiKey } from '@/hooks/useApiKeys';

export default function DemoPage() {
  const { user } = useUser();
  const { organization } = useOrganization();
  const [isCreating, setIsCreating] = useState(false);
  const [createdKeys, setCreatedKeys] = useState<Array<{ name: string; key: string }>>([]);

  const demoApiKeys = [
    {
      name: 'Production API - Main Service',
      description: 'Primary API key for production environment',
    },
    {
      name: 'Development API - Testing',
      description: 'Development environment testing key',
    },
    {
      name: 'Mobile App Integration',
      description: 'iOS/Android app authentication',
    },
    {
      name: 'CI/CD Pipeline',
      description: 'Automated deployment and testing',
    },
    {
      name: 'Analytics Service',
      description: 'Data analytics and reporting API',
    },
  ];

  const createDemoApiKeys = async () => {
    if (!organization?.id) {
      toast.error('Please select an organization first');
      return;
    }

    setIsCreating(true);
    const newKeys: Array<{ name: string; key: string }> = [];

    try {
      for (const keyData of demoApiKeys) {
        const result = await createApiKey(organization.id, keyData.name);
        newKeys.push({ name: keyData.name, key: result.plainKey });
        toast.success(`Created: ${keyData.name}`);
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      setCreatedKeys(newKeys);
      toast.success('All demo API keys created successfully!');
    } catch (error) {
      toast.error('Failed to create some API keys');
      console.error(error);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Demo Data Setup</h1>
          <p className="text-gray-600 mt-2">
            Quick setup for testing Phase 4 features
          </p>
        </div>

        {/* User Info */}
        <Card>
          <CardHeader>
            <CardTitle>Current Context</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">User:</span>
              <span className="font-medium">{user?.primaryEmailAddress?.emailAddress || 'Not signed in'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Organization:</span>
              <span className="font-medium">{organization?.name || 'No organization selected'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Organization ID:</span>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                {organization?.id || 'N/A'}
              </code>
            </div>
          </CardContent>
        </Card>

        {/* Demo API Keys */}
        <Card>
          <CardHeader>
            <CardTitle>Demo API Keys</CardTitle>
            <CardDescription>
              Create sample API keys for testing
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">This will create the following API keys:</p>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                {demoApiKeys.map((key, index) => (
                  <li key={index}>• {key.name}</li>
                ))}
              </ul>
            </div>
            
            <Button 
              onClick={createDemoApiKeys} 
              disabled={isCreating || !organization}
              className="w-full"
            >
              {isCreating ? 'Creating Demo Keys...' : 'Create Demo API Keys'}
            </Button>

            {!organization && (
              <p className="text-sm text-red-600">
                ⚠️ Please select or create an organization first
              </p>
            )}
          </CardContent>
        </Card>

        {/* Created Keys Display */}
        {createdKeys.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Created API Keys</CardTitle>
              <CardDescription>
                Save these keys now - they won't be shown again!
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {createdKeys.map((key, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{key.name}</span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(key.key)}
                    >
                      Copy
                    </Button>
                  </div>
                  <code className="text-xs text-gray-600 break-all">
                    {key.key}
                  </code>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* MFA Status */}
        <Card>
          <CardHeader>
            <CardTitle>MFA Demo Status</CardTitle>
            <CardDescription>
              Current multi-factor authentication configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">TOTP Enabled:</span>
                <Badge variant={user?.totpEnabled ? 'success' : 'secondary'}>
                  {user?.totpEnabled ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Backup Codes:</span>
                <Badge variant={user?.backupCodeEnabled ? 'success' : 'secondary'}>
                  {user?.backupCodeEnabled ? 'Generated' : 'Not Generated'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Phone Numbers:</span>
                <Badge variant={user?.phoneNumbers?.length ? 'success' : 'secondary'}>
                  {user?.phoneNumbers?.length || 0} configured
                </Badge>
              </div>
            </div>
            
            <div className="pt-2 space-y-2">
              <a href="/dashboard/security/mfa">
                <Button variant="outline" className="w-full">
                  Configure MFA Settings
                </Button>
              </a>
              <a href="/dashboard/user-profile?section=security">
                <Button variant="outline" className="w-full">
                  Clerk Security Settings
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Navigation</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <a href="/dashboard/api-keys">
              <Button variant="outline" className="w-full">
                API Key Management
              </Button>
            </a>
            <a href="/dashboard/security/mfa">
              <Button variant="outline" className="w-full">
                MFA Settings
              </Button>
            </a>
            <a href="/dashboard/test-features">
              <Button variant="outline" className="w-full">
                Feature Overview
              </Button>
            </a>
            <a href="/dashboard/user-profile">
              <Button variant="outline" className="w-full">
                User Profile
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}