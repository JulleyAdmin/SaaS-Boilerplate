import { getDb } from '@/libs/DB';
import { patients, clinics } from '@/models/Schema';
import { eq } from 'drizzle-orm';
import { DEMO_CLINIC_ID } from '@/libs/init-demo-data';

async function checkDemoDatabase() {
  console.log('🔍 Checking demo database...\n');
  
  try {
    const db = await getDb();
    
    // Check clinics
    console.log('📍 Checking clinics...');
    const allClinics = await db.select().from(clinics);
    console.log(`Total clinics: ${allClinics.length}`);
    
    const demoClinic = await db
      .select()
      .from(clinics)
      .where(eq(clinics.clinicId, DEMO_CLINIC_ID))
      .limit(1);
    
    console.log(`Demo clinic exists: ${demoClinic.length > 0}`);
    if (demoClinic.length > 0) {
      console.log(`Demo clinic name: ${demoClinic[0].clinicName}`);
    }
    
    // Check patients
    console.log('\n👥 Checking patients...');
    const allPatients = await db.select().from(patients);
    console.log(`Total patients: ${allPatients.length}`);
    
    const demoPatients = await db
      .select()
      .from(patients)
      .where(eq(patients.clinicId, DEMO_CLINIC_ID));
    
    console.log(`Demo clinic patients: ${demoPatients.length}`);
    
    if (demoPatients.length > 0) {
      console.log('\nPatient list:');
      demoPatients.forEach((patient, index) => {
        console.log(`${index + 1}. ${patient.firstName} ${patient.lastName} (${patient.patientCode})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
  
  process.exit(0);
}

// Set demo mode
process.env.DEMO_MODE = 'true';

checkDemoDatabase();