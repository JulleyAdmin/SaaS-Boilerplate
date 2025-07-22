'use client';

import { useUser } from '@clerk/nextjs';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MFASetupFlowProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export const MFASetupFlow = ({ onComplete, onCancel }: MFASetupFlowProps) => {
  const { user } = useUser();
  const [step, setStep] = useState<'intro' | 'qr' | 'verify' | 'backup' | 'complete'>('intro');
  const [totpUri, setTotpUri] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [secret, setSecret] = useState<string>('');

  const startSetup = async () => {
    try {
      // In Clerk, we need to redirect to the user profile page for TOTP setup
      // or use the Clerk API directly
      const response = await user?.createTOTP();
      
      if (response?.uri) {
        setTotpUri(response.uri);
        setSecret(response.secret || '');
        setStep('qr');
      } else {
        // Fallback to redirect method
        window.location.href = '/dashboard/user-profile?section=security';
      }
    } catch (error) {
      toast.error('Failed to start MFA setup');
      console.error('MFA setup error:', error);
    }
  };

  const verifyTOTP = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit code');
      return;
    }

    setIsVerifying(true);
    try {
      await user?.verifyTOTP({ code: verificationCode });
      
      // Generate backup codes after successful verification
      const backupResponse = await user?.createBackupCode();
      if (backupResponse?.codes) {
        setBackupCodes(backupResponse.codes);
        setStep('backup');
      } else {
        setStep('complete');
      }
    } catch (error) {
      toast.error('Invalid verification code. Please try again.');
      console.error('TOTP verification error:', error);
    } finally {
      setIsVerifying(false);
    }
  };

  const completeSetup = () => {
    setStep('complete');
    setTimeout(() => {
      onComplete?.();
    }, 2000);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard');
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {step === 'intro' && (
        <Card>
          <CardHeader>
            <CardTitle>Set Up Two-Factor Authentication</CardTitle>
            <CardDescription>
              Add an extra layer of security to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Install an authenticator app</h4>
                  <p className="text-sm text-gray-600">
                    Download Google Authenticator, Authy, or another TOTP app on your phone
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Scan the QR code</h4>
                  <p className="text-sm text-gray-600">
                    Use your authenticator app to scan the QR code we'll show you
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Enter the verification code</h4>
                  <p className="text-sm text-gray-600">
                    Enter the 6-digit code from your authenticator app to verify setup
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-semibold text-sm">4</span>
                </div>
                <div>
                  <h4 className="font-medium">Save backup codes</h4>
                  <p className="text-sm text-gray-600">
                    Store backup codes safely in case you lose access to your device
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button onClick={startSetup}>
                Start Setup
              </Button>
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'qr' && (
        <Card>
          <CardHeader>
            <CardTitle>Scan QR Code</CardTitle>
            <CardDescription>
              Scan this QR code with your authenticator app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              {totpUri ? (
                <QRCodeSVG value={totpUri} size={200} />
              ) : (
                <div className="w-[200px] h-[200px] bg-gray-100 animate-pulse rounded" />
              )}
            </div>
            
            <div className="space-y-2">
              <Label>Can't scan? Enter this code manually:</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-gray-100 rounded text-sm font-mono break-all">
                  {secret || 'Loading...'}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(secret)}
                  disabled={!secret}
                >
                  Copy
                </Button>
              </div>
            </div>
            
            <Alert>
              <AlertDescription>
                After scanning, your authenticator app will show a 6-digit code that changes every 30 seconds.
              </AlertDescription>
            </Alert>
            
            <div className="flex gap-3">
              <Button onClick={() => setStep('verify')}>
                Continue
              </Button>
              <Button variant="outline" onClick={() => setStep('intro')}>
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'verify' && (
        <Card>
          <CardHeader>
            <CardTitle>Verify Setup</CardTitle>
            <CardDescription>
              Enter the 6-digit code from your authenticator app
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="000000"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl font-mono tracking-widest"
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                onClick={verifyTOTP}
                disabled={isVerifying || verificationCode.length !== 6}
              >
                {isVerifying ? 'Verifying...' : 'Verify'}
              </Button>
              <Button variant="outline" onClick={() => setStep('qr')}>
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'backup' && (
        <Card>
          <CardHeader>
            <CardTitle>Save Your Backup Codes</CardTitle>
            <CardDescription>
              Store these codes safely. Each can be used once if you lose access to your authenticator app.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                ⚠️ These codes will not be shown again. Save them in a secure location.
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-lg">
              {backupCodes.map((code, index) => (
                <code key={index} className="font-mono text-sm">
                  {code}
                </code>
              ))}
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => copyToClipboard(backupCodes.join('\n'))}
              >
                Copy All Codes
              </Button>
              <Button onClick={completeSetup}>
                I've Saved My Codes
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'complete' && (
        <Card>
          <CardHeader>
            <CardTitle>Setup Complete! 🎉</CardTitle>
            <CardDescription>
              Two-factor authentication is now enabled on your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center py-6">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <p className="text-center text-gray-600">
              Your account is now protected with two-factor authentication.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};