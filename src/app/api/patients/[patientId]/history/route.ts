import { auth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

import { getPatientHistory } from '@/models/patient';



// GET /api/patients/[patientId]/history - Get patient history
export async function GET(
  request: NextRequest,
  { params }: { params: { patientId: string } }
) {
  try {
    const { userId, orgId } = await auth();

    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orgId) {
      return Response.json({ error: 'Organization context required' }, { status: 400 });
    }

    const history = await getPatientHistory(orgId, params.patientId);

    return Response.json({ data: history });
  } catch (error) {
    console.error('Error fetching patient history:', error);
    return Response.json(
      { error: 'Failed to fetch patient history' },
      { status: 500 }
    );
  }
}