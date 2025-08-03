'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { toast } from 'sonner';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const MFASettings = () => {
  const { user, isLoaded } = useUser();
  const [showEnableMFA, setShowEnableMFA] = useState(false);
  const [isEnabling, setIsEnabling] = useState(false);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <Alert>
        <AlertTitle>Not authenticated</AlertTitle>
        <AlertDescription>
          Please sign in to manage your security settings.
        </AlertDescription>
      </Alert>
    );
  }

  // Check if user has MFA enabled
  const hasTOTP = user.totpEnabled;
  const hasBackupCodes = user.backupCodeEnabled;
  const phoneNumbers = user.phoneNumbers || [];
  const hasSMS = phoneNumbers.some(phone => phone.verification?.status === 'verified');

  const handleEnableTOTP = async () => {
    setIsEnabling(true);
    try {
      // Clerk handles the TOTP setup flow automatically
      await user.createTOTP();
      toast.success('TOTP authenticator app setup initiated');
      window.location.href = '/dashboard/user-profile?section=security';
    } catch (error) {
      toast.error('Failed to enable TOTP authentication');
      console.error('TOTP setup error:', error);
    } finally {
      setIsEnabling(false);
    }
  };

  const handleDisableTOTP = async () => {
    if (!confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
      return;
    }

    try {
      await user.disableTOTP();
      toast.success('Two-factor authentication disabled');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to disable TOTP authentication');
      console.error('TOTP disable error:', error);
    }
  };

  const handleGenerateBackupCodes = async () => {
    try {
      await user.createBackupCode();
      // Clerk will handle displaying the backup codes
      toast.success('Backup codes generated successfully');
      window.location.href = '/dashboard/user-profile?section=security';
    } catch (error) {
      toast.error('Failed to generate backup codes');
      console.error('Backup codes error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* MFA Status Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Security Status</CardTitle>
          <CardDescription>
            Your current multi-factor authentication configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* TOTP Status */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Authenticator App</h4>
                <p className="text-sm text-gray-600">
                  Use an app like Google Authenticator or Authy
                </p>
              </div>
              <Badge variant={hasTOTP ? 'success' : 'secondary'}>
                {hasTOTP ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>

            {/* SMS Status */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">SMS Authentication</h4>
                <p className="text-sm text-gray-600">
                  Receive codes via text message
                </p>
              </div>
              <Badge variant={hasSMS ? 'success' : 'secondary'}>
                {hasSMS ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>

            {/* Backup Codes Status */}
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Backup Codes</h4>
                <p className="text-sm text-gray-600">
                  One-time use codes for emergency access
                </p>
              </div>
              <Badge variant={hasBackupCodes ? 'success' : 'secondary'}>
                {hasBackupCodes ? 'Available' : 'Not Generated'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Manage your multi-factor authentication methods
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!hasTOTP
            ? (
                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                  <h4 className="mb-2 font-medium text-yellow-800">
                    Two-Factor Authentication Not Enabled
                  </h4>
                  <p className="mb-4 text-sm text-yellow-700">
                    Protect your account by enabling two-factor authentication. This adds an extra layer of security.
                  </p>
                  <Button onClick={() => setShowEnableMFA(true)}>
                    Enable Two-Factor Authentication
                  </Button>
                </div>
              )
            : (
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/dashboard/user-profile?section=security'}
                    className="w-full justify-start"
                  >
                    <svg className="mr-2 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Manage TOTP Settings
                  </Button>

                  {!hasBackupCodes && (
                    <Button
                      variant="outline"
                      onClick={handleGenerateBackupCodes}
                      className="w-full justify-start"
                    >
                      <svg className="mr-2 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                      Generate Backup Codes
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => window.location.href = '/dashboard/user-profile?section=security'}
                    className="w-full justify-start"
                  >
                    <svg className="mr-2 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    Add Phone Number for SMS
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={handleDisableTOTP}
                    className="w-full justify-start"
                  >
                    <svg className="mr-2 size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                    Disable Two-Factor Authentication
                  </Button>
                </div>
              )}
        </CardContent>
      </Card>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Security Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <svg className="mr-2 mt-0.5 size-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Use a dedicated authenticator app instead of SMS when possible
            </li>
            <li className="flex items-start">
              <svg className="mr-2 mt-0.5 size-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Store backup codes in a secure location separate from your device
            </li>
            <li className="flex items-start">
              <svg className="mr-2 mt-0.5 size-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Enable MFA on all accounts that support it
            </li>
            <li className="flex items-start">
              <svg className="mr-2 mt-0.5 size-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Never share your authentication codes with anyone
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Enable MFA Dialog */}
      <Dialog open={showEnableMFA} onOpenChange={setShowEnableMFA}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enable Two-Factor Authentication</DialogTitle>
            <DialogDescription>
              Choose how you'd like to secure your account
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Button
              onClick={handleEnableTOTP}
              disabled={isEnabling}
              className="w-full justify-start"
            >
              <svg className="mr-3 size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div className="text-left">
                <div className="font-medium">Authenticator App</div>
                <div className="text-sm text-gray-600">Use Google Authenticator, Authy, or similar</div>
              </div>
            </Button>

            <Button
              onClick={() => {
                setShowEnableMFA(false);
                window.location.href = '/dashboard/user-profile?section=security';
              }}
              variant="outline"
              className="w-full justify-start"
            >
              <svg className="mr-3 size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <div className="text-left">
                <div className="font-medium">SMS Authentication</div>
                <div className="text-sm text-gray-600">Receive codes via text message</div>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
