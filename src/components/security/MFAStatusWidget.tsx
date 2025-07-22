'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const MFAStatusWidget = () => {
  const { user, isLoaded } = useUser();

  if (!isLoaded || !user) {
    return null;
  }

  const mfaEnabled = user.totpEnabled || user.backupCodeEnabled;
  const phoneVerified = user.phoneNumbers?.some(phone => phone.verification?.status === 'verified');

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium">Security Status</CardTitle>
          <Badge variant={mfaEnabled ? 'success' : 'secondary'}>
            {mfaEnabled ? 'Protected' : 'Not Protected'}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Two-Factor Auth</span>
            <span className={mfaEnabled ? 'text-green-600 font-medium' : 'text-gray-500'}>
              {mfaEnabled ? 'Enabled' : 'Disabled'}
            </span>
          </div>
          {user.totpEnabled && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Authenticator App</span>
              <span className="text-green-600 font-medium">Active</span>
            </div>
          )}
          {phoneVerified && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">SMS Backup</span>
              <span className="text-green-600 font-medium">Available</span>
            </div>
          )}
          {user.backupCodeEnabled && (
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Backup Codes</span>
              <span className="text-green-600 font-medium">Generated</span>
            </div>
          )}
        </div>
        
        {!mfaEnabled && (
          <div className="pt-2">
            <Link href="/dashboard/security/mfa">
              <Button size="sm" className="w-full">
                Enable Two-Factor Auth
              </Button>
            </Link>
          </div>
        )}
        
        {mfaEnabled && (
          <div className="pt-2">
            <Link href="/dashboard/security/mfa">
              <Button variant="outline" size="sm" className="w-full">
                Manage Security
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};