import Link from 'next/link';

import { MFAStatusWidget } from '@/components/security/MFAStatusWidget';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestFeaturesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Phase 4 - New Features Test Page</h1>
          <p className="mt-2 text-gray-600">
            Testing API Key Management and Multi-Factor Authentication capabilities
          </p>
        </div>

        {/* Feature Overview */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* API Key Management Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>API Key Management</CardTitle>
                <Badge variant="success">Completed</Badge>
              </div>
              <CardDescription>
                Secure API key generation and management system
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Features Implemented:</h4>
                <ul className="ml-4 space-y-1 text-sm text-gray-600">
                  <li>✅ SHA-256 hashed key storage</li>
                  <li>✅ One-time key display on creation</li>
                  <li>✅ Organization-scoped access control</li>
                  <li>✅ Key expiration support</li>
                  <li>✅ Last usage tracking</li>
                  <li>✅ Full CRUD operations</li>
                </ul>
              </div>
              <Link href="/dashboard/api-keys">
                <Button className="w-full">
                  Manage API Keys
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* MFA Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Multi-Factor Authentication</CardTitle>
                <Badge variant="success">Completed</Badge>
              </div>
              <CardDescription>
                Clerk-powered two-factor authentication
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Features Implemented:</h4>
                <ul className="ml-4 space-y-1 text-sm text-gray-600">
                  <li>✅ TOTP authenticator app support</li>
                  <li>✅ SMS authentication backup</li>
                  <li>✅ Backup codes generation</li>
                  <li>✅ QR code setup flow</li>
                  <li>✅ MFA enforcement middleware</li>
                  <li>✅ Status dashboard widget</li>
                </ul>
              </div>
              <Link href="/dashboard/security/mfa">
                <Button className="w-full">
                  Configure MFA
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* MFA Status Widget Demo */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">MFA Status Widget Demo</h2>
          <div className="max-w-sm">
            <MFAStatusWidget />
          </div>
        </div>

        {/* API Examples */}
        <Card>
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
            <CardDescription>
              Available endpoints for programmatic access
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium">API Key Management</h4>
                <div className="space-y-2 rounded-lg bg-gray-50 p-3 font-mono text-sm">
                  <div>GET /api/organizations/[orgId]/api-keys</div>
                  <div>POST /api/organizations/[orgId]/api-keys</div>
                  <div>DELETE /api/organizations/[orgId]/api-keys/[apiKeyId]</div>
                </div>
              </div>
              <div>
                <h4 className="mb-2 font-medium">MFA Status</h4>
                <div className="space-y-2 rounded-lg bg-gray-50 p-3 font-mono text-sm">
                  <div>GET /api/auth/mfa/status</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Integration Status */}
        <Card>
          <CardHeader>
            <CardTitle>Integration Status</CardTitle>
            <CardDescription>
              Phase 4 template integration progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">API Key Management (BoxyHQ)</span>
                <Badge variant="success">100% Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Multi-Factor Auth (Clerk)</span>
                <Badge variant="success">100% Complete</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Team Management (BoxyHQ/Nextacular)</span>
                <Badge variant="secondary">Pending</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Webhook System (BoxyHQ)</span>
                <Badge variant="secondary">Pending</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Test Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-medium">Testing API Keys:</h4>
              <ol className="list-inside list-decimal space-y-1 text-sm text-gray-600">
                <li>Navigate to API Keys page using the button above</li>
                <li>Create a new API key with a descriptive name</li>
                <li>Copy the key immediately (shown only once)</li>
                <li>View the list of created keys</li>
                <li>Test deletion functionality</li>
              </ol>
            </div>
            <div>
              <h4 className="mb-2 font-medium">Testing MFA:</h4>
              <ol className="list-inside list-decimal space-y-1 text-sm text-gray-600">
                <li>Navigate to MFA settings using the button above</li>
                <li>Enable two-factor authentication</li>
                <li>Scan QR code with authenticator app</li>
                <li>Verify with 6-digit code</li>
                <li>Save backup codes securely</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
