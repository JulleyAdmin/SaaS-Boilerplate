import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { z } from 'zod';
import { db } from '@/libs/DB';
import { 
  networkDoctors, 
  users, 
  clinics,
  hospitalNetworks,
  departments 
} from '@/models/Schema';
import { eq, and, or, desc, sql, inArray } from 'drizzle-orm';

// Validation schemas
const networkDoctorSchema = z.object({
  doctorId: z.string().uuid().optional(),
  primaryClinicId: z.string().uuid(),
  networkId: z.string().uuid().optional(),
  practicingClinics: z.array(z.string().uuid()).optional(),
  visitingConsultantAt: z.array(z.string().uuid()).optional(),
  availabilitySchedule: z.object({
    monday: z.array(z.object({
      clinicId: z.string(),
      startTime: z.string(),
      endTime: z.string(),
    })).optional(),
    tuesday: z.array(z.object({
      clinicId: z.string(),
      startTime: z.string(),
      endTime: z.string(),
    })).optional(),
    wednesday: z.array(z.object({
      clinicId: z.string(),
      startTime: z.string(),
      endTime: z.string(),
    })).optional(),
    thursday: z.array(z.object({
      clinicId: z.string(),
      startTime: z.string(),
      endTime: z.string(),
    })).optional(),
    friday: z.array(z.object({
      clinicId: z.string(),
      startTime: z.string(),
      endTime: z.string(),
    })).optional(),
    saturday: z.array(z.object({
      clinicId: z.string(),
      startTime: z.string(),
      endTime: z.string(),
    })).optional(),
    sunday: z.array(z.object({
      clinicId: z.string(),
      startTime: z.string(),
      endTime: z.string(),
    })).optional(),
  }).optional(),
  consultationModes: z.array(z.enum(['In-Person', 'Video', 'Phone'])).optional(),
  networkRole: z.enum(['Network Specialist', 'Visiting Consultant', 'Locum']).optional(),
  specializedServices: z.array(z.string()).optional(),
  acceptsReferrals: z.boolean().default(true),
  referralSpecialties: z.array(z.string()).optional(),
  preferredReferralTypes: z.array(z.string()).optional(),
  maxReferralsPerWeek: z.number().optional(),
  networkRegistrationNumber: z.string().optional(),
  networkPrivileges: z.array(z.string()).optional(),
});

// GET /api/network/doctors - List network doctors
export async function GET(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const specialty = searchParams.get('specialty');
    const clinicId = searchParams.get('clinicId');
    const acceptsReferrals = searchParams.get('acceptsReferrals');
    const consultationMode = searchParams.get('consultationMode');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    // Build query conditions
    const conditions = [];
    
    if (clinicId) {
      // Find doctors practicing at specific clinic
      conditions.push(
        or(
          eq(networkDoctors.primaryClinicId, clinicId),
          sql`${clinicId} = ANY(${networkDoctors.practicingClinics})`,
          sql`${clinicId} = ANY(${networkDoctors.visitingConsultantAt})`
        )
      );
    }

    if (acceptsReferrals === 'true') {
      conditions.push(eq(networkDoctors.acceptsReferrals, true));
    }

    if (specialty) {
      conditions.push(
        sql`${specialty} = ANY(${networkDoctors.referralSpecialties})`
      );
    }

    if (consultationMode) {
      conditions.push(
        sql`${consultationMode} = ANY(${networkDoctors.consultationModes})`
      );
    }

    conditions.push(eq(networkDoctors.isActive, true));

    // Get network doctors with user and clinic details
    const doctors = await db
      .select({
        networkDoctor: networkDoctors,
        doctor: {
          userId: users.userId,
          name: users.name,
          email: users.email,
          phoneNumber: users.phoneNumber,
          designation: users.designation,
          qualification: users.qualification,
          specialization: users.specialization,
          yearsOfExperience: users.yearsOfExperience,
        },
        primaryClinic: {
          clinicId: clinics.clinicId,
          clinicName: clinics.clinicName,
        },
        network: {
          networkId: hospitalNetworks.networkId,
          networkName: hospitalNetworks.networkName,
        },
      })
      .from(networkDoctors)
      .leftJoin(users, eq(networkDoctors.doctorId, users.userId))
      .leftJoin(clinics, eq(networkDoctors.primaryClinicId, clinics.clinicId))
      .leftJoin(hospitalNetworks, eq(networkDoctors.networkId, hospitalNetworks.networkId))
      .where(and(...conditions))
      .orderBy(
        desc(networkDoctors.patientSatisfactionScore),
        desc(networkDoctors.totalNetworkConsultations)
      )
      .limit(limit)
      .offset(offset);

    // Get practicing clinics details for each doctor
    const doctorsWithClinics = await Promise.all(
      doctors.map(async (doctor) => {
        let practicingClinicsDetails = [];
        if (doctor.networkDoctor.practicingClinics?.length) {
          practicingClinicsDetails = await db
            .select({
              clinicId: clinics.clinicId,
              clinicName: clinics.clinicName,
            })
            .from(clinics)
            .where(inArray(clinics.clinicId, doctor.networkDoctor.practicingClinics));
        }

        return {
          ...doctor,
          practicingClinicsDetails,
        };
      })
    );

    // Get total count
    const totalCount = await db
      .select({ count: sql`count(*)` })
      .from(networkDoctors)
      .where(and(...conditions));

    return NextResponse.json({
      data: doctorsWithClinics,
      pagination: {
        page,
        limit,
        total: Number(totalCount[0]?.count || 0),
        totalPages: Math.ceil(Number(totalCount[0]?.count || 0) / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching network doctors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch network doctors' },
      { status: 500 }
    );
  }
}

// POST /api/network/doctors - Register doctor in network
export async function POST(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = networkDoctorSchema.parse(body);

    // Use current user as doctor if not specified
    const doctorId = validatedData.doctorId || userId;

    // Check if doctor already registered in network
    const existingNetworkDoctor = await db
      .select()
      .from(networkDoctors)
      .where(eq(networkDoctors.doctorId, doctorId))
      .limit(1);

    if (existingNetworkDoctor.length) {
      return NextResponse.json(
        { error: 'Doctor already registered in network' },
        { status: 400 }
      );
    }

    // Verify doctor exists
    const doctor = await db
      .select()
      .from(users)
      .where(eq(users.userId, doctorId))
      .limit(1);

    if (!doctor.length) {
      return NextResponse.json({ error: 'Doctor not found' }, { status: 404 });
    }

    // Create network doctor registration
    const newNetworkDoctor = await db
      .insert(networkDoctors)
      .values({
        ...validatedData,
        doctorId,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      data: newNetworkDoctor[0],
      message: 'Doctor registered in network successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error registering network doctor:', error);
    return NextResponse.json(
      { error: 'Failed to register network doctor' },
      { status: 500 }
    );
  }
}

// PATCH /api/network/doctors - Update network doctor details
export async function PATCH(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const networkDoctorId = searchParams.get('id');
    
    if (!networkDoctorId) {
      return NextResponse.json({ error: 'Network Doctor ID required' }, { status: 400 });
    }

    const body = await request.json();
    const validatedData = networkDoctorSchema.partial().parse(body);

    // Get the network doctor
    const existingNetworkDoctor = await db
      .select()
      .from(networkDoctors)
      .where(eq(networkDoctors.networkDoctorId, networkDoctorId))
      .limit(1);

    if (!existingNetworkDoctor.length) {
      return NextResponse.json({ error: 'Network doctor not found' }, { status: 404 });
    }

    // Check if user has permission to update (must be the doctor themselves or admin)
    if (existingNetworkDoctor[0].doctorId !== userId) {
      // Check if user is admin
      const currentUser = await db
        .select()
        .from(users)
        .where(eq(users.userId, userId))
        .limit(1);

      if (!currentUser.length || currentUser[0].role !== 'Admin') {
        return NextResponse.json({ error: 'Unauthorized to update this profile' }, { status: 403 });
      }
    }

    // Update the network doctor
    const updatedNetworkDoctor = await db
      .update(networkDoctors)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(networkDoctors.networkDoctorId, networkDoctorId))
      .returning();

    return NextResponse.json({
      data: updatedNetworkDoctor[0],
      message: 'Network doctor profile updated successfully',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error updating network doctor:', error);
    return NextResponse.json(
      { error: 'Failed to update network doctor' },
      { status: 500 }
    );
  }
}

// GET /api/network/doctors/availability - Get doctor availability across clinics
export async function getAvailability(request: NextRequest) {
  try {
    const { userId, orgId } = await auth();
    if (!userId || !orgId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const doctorId = searchParams.get('doctorId');
    const date = searchParams.get('date');
    
    if (!doctorId) {
      return NextResponse.json({ error: 'Doctor ID required' }, { status: 400 });
    }

    // Get network doctor details
    const networkDoctor = await db
      .select()
      .from(networkDoctors)
      .where(eq(networkDoctors.doctorId, doctorId))
      .limit(1);

    if (!networkDoctor.length) {
      return NextResponse.json({ error: 'Network doctor not found' }, { status: 404 });
    }

    const availability = networkDoctor[0].availabilitySchedule || {};
    
    // If specific date requested, filter by day of week
    if (date) {
      const dayOfWeek = new Date(date).toLocaleLowerCase();
      const daySchedule = availability[dayOfWeek as keyof typeof availability] || [];
      
      return NextResponse.json({
        data: {
          date,
          dayOfWeek,
          schedule: daySchedule,
          consultationModes: networkDoctor[0].consultationModes,
        },
      });
    }

    // Return full weekly availability
    return NextResponse.json({
      data: {
        weeklySchedule: availability,
        consultationModes: networkDoctor[0].consultationModes,
        practicingClinics: networkDoctor[0].practicingClinics,
      },
    });
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch doctor availability' },
      { status: 500 }
    );
  }
}