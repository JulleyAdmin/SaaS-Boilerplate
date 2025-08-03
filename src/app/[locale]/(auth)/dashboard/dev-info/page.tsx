'use client';

import { useAuth, useOrganization, useUser } from '@clerk/nextjs';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DevInfoPage() {
  const { userId, orgId, sessionId } = useAuth();
  const { user } = useUser();
  const { organization } = useOrganization();

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Developer Information</h1>
          <p className="mt-2 text-gray-600">
            IDs and information needed for development and testing
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
            <CardDescription>
              Use the Organization ID for seeding test data
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
              <div>
                <p className="text-sm text-gray-600">Organization Name</p>
                <p className="font-mono font-medium">{organization?.name || 'No organization'}</p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-lg border border-yellow-200 bg-yellow-50 p-3">
              <div>
                <p className="text-sm text-gray-600">Organization ID</p>
                <p className="font-mono text-lg font-medium">{orgId || 'Not in an organization'}</p>
              </div>
              {orgId && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(orgId, 'Organization ID')}
                >
                  Copy
                </Button>
              )}
            </div>
            {orgId && (
              <div className="rounded-lg bg-blue-50 p-3">
                <p className="mb-2 text-sm font-medium text-blue-900">To seed test data:</p>
                <code className="block rounded bg-white p-2 text-xs">
                  ./scripts/seed-db.sh
                  {' '}
                  {orgId}
                </code>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm text-gray-600">User ID</p>
                <p className="font-mono text-sm">{userId || 'Not authenticated'}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-sm text-gray-600">Session ID</p>
                <p className="truncate font-mono text-sm">{sessionId || 'No session'}</p>
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-mono">{user?.primaryEmailAddress?.emailAddress || 'No email'}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-sm text-gray-600">MFA Status</p>
              <div className="mt-1 flex gap-2">
                <span className={`rounded px-2 py-1 text-sm ${user?.totpEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  TOTP:
                  {' '}
                  {user?.totpEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <span className={`rounded px-2 py-1 text-sm ${user?.backupCodeEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                  Backup Codes:
                  {' '}
                  {user?.backupCodeEnabled ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <a href="/dashboard/api-keys">
              <Button variant="outline" className="w-full">View API Keys</Button>
            </a>
            <a href="/dashboard/security/mfa">
              <Button variant="outline" className="w-full">MFA Settings</Button>
            </a>
            <a href="/dashboard/organization-profile">
              <Button variant="outline" className="w-full">Organization Settings</Button>
            </a>
            <a href="/dashboard/test-features">
              <Button variant="outline" className="w-full">Test Features</Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
