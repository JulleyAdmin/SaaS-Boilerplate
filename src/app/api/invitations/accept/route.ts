import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';
import { z } from 'zod';

import { acceptInvitation } from '@/models/invitation';

const acceptInvitationSchema = z.object({
  token: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = acceptInvitationSchema.parse(body);

    // Accept the invitation
    const result = await acceptInvitation(validatedData.token, userId);

    return Response.json({ data: result });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 },
      );
    }

    if (error instanceof Error) {
      // Check for specific error messages
      if (error.message.includes('expired')) {
        return Response.json({ error: error.message }, { status: 410 });
      }
      if (error.message.includes('not found') || error.message.includes('Invalid')) {
        return Response.json({ error: error.message }, { status: 404 });
      }
      if (error.message.includes('already a member')) {
        return Response.json({ error: error.message }, { status: 409 });
      }
    }

    console.error('Error accepting invitation:', error);
    return Response.json(
      { error: 'Failed to accept invitation' },
      { status: 500 },
    );
  }
}
