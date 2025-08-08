import { getDb } from '@/libs/DB';
import { clinics, patients } from '@/models/Schema';
import { eq, count } from 'drizzle-orm';

// Fixed UUID for demo clinic
export const DEMO_CLINIC_ID = '11111111-1111-1111-1111-111111111111';

// Demo clinic data
const demoClinicData = {
  clinicId: DEMO_CLINIC_ID,
  clinicName: "St. Mary's Hospital",
  clinicCode: 'STM-DEMO-001',
  clinicType: 'Multi-Specialty Hospital',
  registrationNumber: 'MH/MUM/2024/001',
  address: '123 Healthcare Avenue, Bandra West',
  city: 'Mumbai',
  state: 'Maharashtra',
  country: 'India',
  pincode: '400050',
  phone: '+91-22-26551234',
  email: 'demo@stmarys.hospital.com',
  website: 'https://stmarys-demo.hospital.com',
  totalBeds: 250,
  icuBeds: 50,
  emergencyBeds: 20,
  emergencyServices24x7: true,
  servicesOffered: [
    'General Medicine',
    'Surgery',
    'Pediatrics',
    'Orthopedics',
    'Cardiology',
    'Emergency Care',
    'ICU',
    'Laboratory',
    'Radiology',
    'Pharmacy'
  ],
  specialties: [
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Obstetrics & Gynecology'
  ],
  operatingHours: {
    monday: { open: '00:00', close: '23:59' },
    tuesday: { open: '00:00', close: '23:59' },
    wednesday: { open: '00:00', close: '23:59' },
    thursday: { open: '00:00', close: '23:59' },
    friday: { open: '00:00', close: '23:59' },
    saturday: { open: '00:00', close: '23:59' },
    sunday: { open: '00:00', close: '23:59' }
  }
};

// Demo patient data
const demoPatients = [
  {
    patientCode: 'P-2025-0001',
    firstName: 'John',
    lastName: 'Doe',
    middleName: 'Michael',
    dateOfBirth: new Date('1985-05-15'),
    age: 39,
    gender: 'Male' as const,
    phone: '+91-9876543210',
    email: 'john.doe@example.com',
    address: '456 Park Street, Andheri East',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400069',
    bloodGroup: 'O+' as const,
    allergies: ['Penicillin', 'Dust'],
    chronicConditions: ['Hypertension'],
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '+91-9876543211',
    emergencyContactRelation: 'Spouse',
    aadhaarNumber: '123456789012',
    status: 'outpatient' as const,
    isActive: true,
  },
  {
    patientCode: 'P-2025-0002',
    firstName: 'Sarah',
    lastName: 'Smith',
    dateOfBirth: new Date('1990-08-22'),
    age: 34,
    gender: 'Female' as const,
    phone: '+91-9876543212',
    email: 'sarah.smith@example.com',
    address: '789 Marine Drive',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400020',
    bloodGroup: 'A+' as const,
    allergies: [],
    chronicConditions: ['Diabetes Type 2'],
    emergencyContactName: 'Mike Smith',
    emergencyContactPhone: '+91-9876543213',
    emergencyContactRelation: 'Husband',
    aadhaarNumber: '123456789013',
    status: 'admitted' as const,
    admissionDate: new Date('2025-01-01'),
    admissionReason: 'Diabetic complications',
    isActive: true,
  },
  {
    patientCode: 'P-2025-0003',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    middleName: 'Singh',
    dateOfBirth: new Date('1978-03-10'),
    age: 47,
    gender: 'Male' as const,
    phone: '+91-9876543214',
    email: 'rajesh.kumar@example.com',
    address: '321 Linking Road, Bandra',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400050',
    bloodGroup: 'B+' as const,
    allergies: ['Sulfa drugs'],
    chronicConditions: ['Asthma', 'High cholesterol'],
    emergencyContactName: 'Priya Kumar',
    emergencyContactPhone: '+91-9876543215',
    emergencyContactRelation: 'Wife',
    aadhaarNumber: '123456789014',
    abhaNumber: 'ABHA123456789014',
    governmentSchemeNumber: 'PMJAY2025001',
    status: 'outpatient' as const,
    isActive: true,
  },
  {
    patientCode: 'P-2025-0004',
    firstName: 'Priya',
    lastName: 'Patel',
    dateOfBirth: new Date('1995-12-05'),
    age: 29,
    gender: 'Female' as const,
    phone: '+91-9876543216',
    email: 'priya.patel@example.com',
    address: '654 SV Road, Kandivali',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400067',
    bloodGroup: 'AB+' as const,
    allergies: [],
    chronicConditions: [],
    emergencyContactName: 'Amit Patel',
    emergencyContactPhone: '+91-9876543217',
    emergencyContactRelation: 'Father',
    aadhaarNumber: '123456789015',
    status: 'emergency' as const,
    admissionDate: new Date('2025-01-04'),
    admissionReason: 'Acute chest pain',
    isActive: true,
  },
  {
    patientCode: 'P-2025-0005',
    firstName: 'Arun',
    lastName: 'Nair',
    dateOfBirth: new Date('1962-07-18'),
    age: 63,
    gender: 'Male' as const,
    phone: '+91-9876543218',
    email: 'arun.nair@example.com',
    address: '987 Carter Road, Bandra',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    pincode: '400050',
    bloodGroup: 'O-' as const,
    allergies: ['Latex', 'Eggs'],
    chronicConditions: ['Coronary artery disease', 'Arthritis'],
    emergencyContactName: 'Lakshmi Nair',
    emergencyContactPhone: '+91-9876543219',
    emergencyContactRelation: 'Wife',
    aadhaarNumber: '123456789016',
    abhaNumber: 'ABHA123456789016',
    insuranceDetails: {
      provider: 'Star Health Insurance',
      policyNumber: 'SH2025001234',
      validTill: '2026-03-31'
    },
    status: 'admitted' as const,
    admissionDate: new Date('2024-12-30'),
    admissionReason: 'Cardiac catheterization',
    isVip: true,
    isActive: true,
  }
];

// Map Clerk org IDs to demo clinic ID
export function getDemoClinicId(clerkOrgId: string | null): string {
  // In demo mode, always return the demo clinic ID
  if (process.env.DEMO_MODE === 'true') {
    return DEMO_CLINIC_ID;
  }
  // In production, this would map org IDs to actual clinic UUIDs
  return clerkOrgId || DEMO_CLINIC_ID;
}

// Initialize demo data
export async function initializeDemoData() {
  console.log('[DEMO] Starting demo data initialization...');
  
  try {
    const db = await getDb();
    
    // Check if demo clinic exists
    const [existingClinic] = await db
      .select()
      .from(clinics)
      .where(eq(clinics.clinicId, DEMO_CLINIC_ID))
      .limit(1);
    
    if (!existingClinic) {
      console.log('[DEMO] Creating demo clinic...');
      await db.insert(clinics).values(demoClinicData);
      console.log('[DEMO] Demo clinic created successfully');
    } else {
      console.log('[DEMO] Demo clinic already exists');
    }
    
    // Check if demo patients exist
    const [patientCount] = await db
      .select({ count: count() })
      .from(patients)
      .where(eq(patients.clinicId, DEMO_CLINIC_ID));
    
    if (patientCount.count === 0) {
      console.log('[DEMO] Creating demo patients...');
      
      for (const patient of demoPatients) {
        await db.insert(patients).values({
          ...patient,
          clinicId: DEMO_CLINIC_ID,
          // In demo mode, we don't have users table, so leave these null
          createdBy: null,
          updatedBy: null,
        });
      }
      
      console.log(`[DEMO] Created ${demoPatients.length} demo patients successfully`);
    } else {
      console.log(`[DEMO] Demo patients already exist (${patientCount.count} found)`);
    }
    
    console.log('[DEMO] Demo data initialization complete');
    return true;
  } catch (error) {
    console.error('[DEMO] Error initializing demo data:', error);
    return false;
  }
}

// Check if demo data exists
export async function checkDemoData() {
  try {
    const db = await getDb();
    
    const [clinicExists] = await db
      .select()
      .from(clinics)
      .where(eq(clinics.clinicId, DEMO_CLINIC_ID))
      .limit(1);
    
    const [patientCount] = await db
      .select({ count: count() })
      .from(patients)
      .where(eq(patients.clinicId, DEMO_CLINIC_ID));
    
    return {
      clinicExists: !!clinicExists,
      patientCount: patientCount.count || 0,
      isComplete: !!clinicExists && patientCount.count > 0
    };
  } catch (error) {
    console.error('[DEMO] Error checking demo data:', error);
    return {
      clinicExists: false,
      patientCount: 0,
      isComplete: false
    };
  }
}