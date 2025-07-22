import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

export async function GET(_request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await currentUser();

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    const mfaStatus = {
      enabled: user.totpEnabled || user.backupCodeEnabled,
      methods: {
        totp: user.totpEnabled,
        sms: user.phoneNumbers?.some(phone => phone.verification?.status === 'verified') || false,
        backupCodes: user.backupCodeEnabled,
      },
      lastUpdated: user.updatedAt,
    };

    return Response.json({ data: mfaStatus });
  } catch (error) {
    console.error('Error fetching MFA status:', error);
    return Response.json(
      { error: 'Failed to fetch MFA status' },
      { status: 500 },
    );
  }
}