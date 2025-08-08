#!/usr/bin/env tsx

import { db } from '../src/libs/DB';
import { patients } from '../src/models/Schema';

const samplePatients = [
  {
    patientCode: 'P-2025-0001',
    firstName: 'Raj',
    lastName: 'Sharma',
    dateOfBirth: new Date('1985-03-15'),
    age: 39,
    gender: 'Male' as const,
    phone: '+91-9876543210',
    email: 'raj.sharma@email.com',
    address: '123 MG Road, Sector 14',
    city: 'Gurgaon',
    state: 'Haryana',
    pincode: '122001',
    bloodGroup: 'B+' as const,
    status: 'outpatient' as const,
    emergencyContactName: 'Priya Sharma',
    emergencyContactPhone: '+91-9876543211',
    emergencyContactRelation: 'Spouse',
    isActive: true,
    isVip: false,
    totalVisits: 3,
  },
  {
    patientCode: 'P-2025-0002',
    firstName: 'Priya',
    lastName: 'Patel',
    dateOfBirth: new Date('1992-07-22'),
    age: 31,
    gender: 'Female' as const,
    phone: '+91-9876543212',
    email: 'priya.patel@email.com',
    address: '456 Park Street, Cyber City',
    city: 'Gurgaon',
    state: 'Haryana',
    pincode: '122002',
    bloodGroup: 'A+' as const,
    status: 'admitted' as const,
    emergencyContactName: 'Vijay Patel',
    emergencyContactPhone: '+91-9876543213',
    emergencyContactRelation: 'Father',
    admissionDate: new Date('2025-01-20'),
    admissionReason: 'Pneumonia treatment',
    isActive: true,
    isVip: false,
    totalVisits: 1,
  },
  {
    patientCode: 'P-2025-0003',
    firstName: 'Amit',
    lastName: 'Kumar',
    dateOfBirth: new Date('1975-11-08'),
    age: 49,
    gender: 'Male' as const,
    phone: '+91-9876543214',
    email: 'amit.kumar@email.com',
    address: '789 Brigade Road, DLF Phase 1',
    city: 'Gurgaon',
    state: 'Haryana',
    pincode: '122003',
    bloodGroup: 'O+' as const,
    status: 'emergency' as const,
    emergencyContactName: 'Sunita Kumar',
    emergencyContactPhone: '+91-9876543215',
    emergencyContactRelation: 'Wife',
    admissionDate: new Date(),
    admissionReason: 'Cardiac emergency',
    isActive: true,
    isVip: true,
    totalVisits: 2,
    allergies: ['Penicillin', 'Nuts'],
    chronicConditions: ['Hypertension', 'Diabetes Type 2'],
  },
  {
    patientCode: 'P-2025-0004',
    firstName: 'Deepika',
    lastName: 'Singh',
    dateOfBirth: new Date('1988-05-12'),
    age: 36,
    gender: 'Female' as const,
    phone: '+91-9876543216',
    email: 'deepika.singh@email.com',
    address: '321 Golf Course Road, Sector 43',
    city: 'Gurgaon',
    state: 'Haryana',
    pincode: '122004',
    bloodGroup: 'AB+' as const,
    status: 'discharged' as const,
    emergencyContactName: 'Rohit Singh',
    emergencyContactPhone: '+91-9876543217',
    emergencyContactRelation: 'Husband',
    admissionDate: new Date('2025-01-15'),
    dischargeDate: new Date('2025-01-18'),
    dischargeReason: 'Recovery complete',
    isActive: true,
    isVip: false,
    totalVisits: 5,
  },
  {
    patientCode: 'P-2025-0005',
    firstName: 'Vikram',
    lastName: 'Gupta',
    dateOfBirth: new Date('1965-09-30'),
    age: 59,
    gender: 'Male' as const,
    phone: '+91-9876543218',
    email: 'vikram.gupta@email.com',
    address: '654 Sohna Road, Sector 49',
    city: 'Gurgaon',
    state: 'Haryana',
    pincode: '122005',
    bloodGroup: 'A-' as const,
    status: 'outpatient' as const,
    emergencyContactName: 'Meera Gupta',
    emergencyContactPhone: '+91-9876543219',
    emergencyContactRelation: 'Wife',
    isActive: true,
    isVip: false,
    totalVisits: 8,
    abhaNumber: 'ABHA-1234567890',
    aadhaarNumber: '1234-5678-9012',
  }
];

async function seedPatients() {
  try {
    console.log('🌱 Starting patient seeding...');
    
    // Use a test organization ID (this should match a real org in Clerk or be configured)
    const testOrgId = 'org_test_demo_hospitalos';
    
    const patientsWithOrg = samplePatients.map(patient => ({
      ...patient,
      clinicId: testOrgId,
      createdBy: 'user_demo_admin',
      updatedBy: 'user_demo_admin',
    }));

    // Insert patients
    const insertedPatients = await db
      .insert(patients)
      .values(patientsWithOrg)
      .returning();

    console.log(`✅ Successfully inserted ${insertedPatients.length} patients:`);
    insertedPatients.forEach(patient => {
      console.log(`   - ${patient.patientCode}: ${patient.firstName} ${patient.lastName} (${patient.status})`);
    });

    console.log('\n📊 Patient summary:');
    console.log(`   Total patients: ${insertedPatients.length}`);
    console.log(`   Outpatients: ${insertedPatients.filter(p => p.status === 'outpatient').length}`);
    console.log(`   Admitted: ${insertedPatients.filter(p => p.status === 'admitted').length}`);
    console.log(`   Emergency: ${insertedPatients.filter(p => p.status === 'emergency').length}`);
    console.log(`   Discharged: ${insertedPatients.filter(p => p.status === 'discharged').length}`);

  } catch (error) {
    console.error('❌ Error seeding patients:', error);
    throw error;
  }
}

// Run the seed if this script is executed directly
if (require.main === module) {
  seedPatients()
    .then(() => {
      console.log('🎉 Patient seeding completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Patient seeding failed:', error);
      process.exit(1);
    });
}

export { seedPatients };