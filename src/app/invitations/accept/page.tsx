'use client';

import { useAuth } from '@clerk/nextjs';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AcceptInvitationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isSignedIn, isLoaded } = useAuth();
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (!isSignedIn) {
      // Save the invitation URL to redirect after sign in
      const currentUrl = window.location.href;
      sessionStorage.setItem('invitationUrl', currentUrl);
      router.push('/sign-in');
    }
  }, [isSignedIn, isLoaded, router]);

  const handleAcceptInvitation = async () => {
    if (!token) {
      setError('Invalid invitation link');
      return;
    }

    setIsAccepting(true);
    try {
      const response = await fetch('/api/invitations/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to accept invitation');
      }

      const result = await response.json();
      toast.success('Invitation accepted successfully!');

      // Redirect to the organization's dashboard
      router.push(`/dashboard?org=${result.data.organizationId}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to accept invitation');
      toast.error(error instanceof Error ? error.message : 'Failed to accept invitation');
    } finally {
      setIsAccepting(false);
    }
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Invitation</CardTitle>
            <CardDescription>
              This invitation link appears to be invalid or incomplete.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invitation Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full"
            >
              Go to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Team Invitation</CardTitle>
          <CardDescription>
            You've been invited to join a team. Click below to accept the invitation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={handleAcceptInvitation}
            disabled={isAccepting}
            className="w-full"
          >
            {isAccepting ? 'Accepting...' : 'Accept Invitation'}
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard')}
            disabled={isAccepting}
            className="w-full"
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
