// Mock Data Provider for UI Demo
// @ts-expect-error - faker is available in devDependencies
import { faker } from '@faker-js/faker';

// Types
export interface MockPatient {
  id: string;
  registrationNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  bloodType: string;
  phoneNumber: string;
  email: string;
  address: string;
  emergencyContact: string;
  insuranceNumber?: string;
  allergies?: string[];
  chronicConditions?: string[];
  currentMedications?: string[];
  lastVisit?: Date;
  nextAppointment?: Date;
  status: 'active' | 'inactive' | 'critical';
  department?: string;
  assignedDoctor?: string;
  vitalSigns?: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    weight: number;
    height: number;
    bmi: number;
  };
}

export interface MockAppointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: Date;
  time: string;
  duration: number;
  type: 'consultation' | 'follow-up' | 'emergency' | 'surgery' | 'test';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
  room?: string;
}

export interface MockDoctor {
  id: string;
  name: string;
  specialization: string;
  department: string;
  qualification: string;
  experience: number;
  email: string;
  phone: string;
  availability: string[];
  rating: number;
  patientsToday: number;
  nextAvailable: Date;
  status: 'available' | 'busy' | 'on-leave';
}

export interface MockDepartment {
  id: string;
  name: string;
  head: string;
  bedCount: number;
  occupiedBeds: number;
  staffCount: number;
  activePatients: number;
  waitingPatients: number;
  equipment: string[];
  services: string[];
}

export interface MockPrescription {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }[];
  diagnosis: string;
  followUpDate?: Date;
  status: 'active' | 'completed' | 'cancelled';
}

export interface MockLabTest {
  id: string;
  patientId: string;
  doctorId: string;
  testName: string;
  category: string;
  date: Date;
  status: 'pending' | 'in-progress' | 'completed';
  results?: any;
  criticalValues?: boolean;
  reportUrl?: string;
}

export interface MockBilling {
  id: string;
  patientId: string;
  date: Date;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'paid' | 'partial' | 'overdue';
  paymentMethod?: string;
  insuranceClaimed?: number;
}

// Mock Data Generation
class MockDataProvider {
  private cache: Map<string, any> = new Map();

  // Generate Patients
  generatePatients(count: number = 50): MockPatient[] {
    const cacheKey = `patients_${count}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const patients: MockPatient[] = [];
    const departments = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Emergency', 'ICU', 'General Medicine'];
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'];
    const _statuses: MockPatient['status'][] = ['active', 'inactive', 'critical'];

    for (let i = 0; i < count; i++) {
      const patient: MockPatient = {
        id: faker.string.uuid(),
        registrationNumber: `PAT${String(i + 1).padStart(6, '0')}`,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        dateOfBirth: faker.date.birthdate({ min: 1, max: 90 }),
        gender: faker.helpers.arrayElement(['male', 'female', 'other']),
        bloodType: faker.helpers.arrayElement(bloodTypes),
        phoneNumber: faker.phone.number(),
        email: faker.internet.email(),
        address: faker.location.streetAddress(true),
        emergencyContact: faker.phone.number(),
        insuranceNumber: faker.helpers.maybe(() => `INS${faker.string.numeric(10)}`),
        allergies: faker.helpers.maybe(() => faker.helpers.arrayElements(['Penicillin', 'Peanuts', 'Latex', 'Dust', 'Pollen'], { min: 1, max: 3 })),
        chronicConditions: faker.helpers.maybe(() => faker.helpers.arrayElements(['Diabetes', 'Hypertension', 'Asthma', 'Arthritis'], { min: 1, max: 2 })),
        currentMedications: faker.helpers.maybe(() => faker.helpers.arrayElements(['Metformin', 'Lisinopril', 'Aspirin', 'Atorvastatin'], { min: 1, max: 3 })),
        lastVisit: faker.date.recent({ days: 30 }),
        nextAppointment: faker.helpers.maybe(() => faker.date.soon({ days: 30 })),
        status: faker.helpers.arrayElement(_statuses),
        department: faker.helpers.maybe(() => faker.helpers.arrayElement(departments)),
        assignedDoctor: faker.helpers.maybe(() => `Dr. ${faker.person.fullName()}`),
        vitalSigns: {
          bloodPressure: `${faker.number.int({ min: 110, max: 140 })}/${faker.number.int({ min: 70, max: 90 })}`,
          heartRate: faker.number.int({ min: 60, max: 100 }),
          temperature: parseFloat(faker.number.float({ min: 97, max: 99.5, fractionDigits: 1 }).toFixed(1)),
          weight: faker.number.int({ min: 45, max: 120 }),
          height: faker.number.int({ min: 150, max: 200 }),
          bmi: parseFloat(faker.number.float({ min: 18, max: 32, fractionDigits: 1 }).toFixed(1))
        }
      };
      patients.push(patient);
    }

    this.cache.set(cacheKey, patients);
    return patients;
  }

  // Generate Appointments
  generateAppointments(count: number = 100): MockAppointment[] {
    const cacheKey = `appointments_${count}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const appointments: MockAppointment[] = [];
    const patients = this.generatePatients(50);
    const doctors = this.generateDoctors(20);
    const types: MockAppointment['type'][] = ['consultation', 'follow-up', 'emergency', 'surgery', 'test'];
    const statuses: MockAppointment['status'][] = ['scheduled', 'confirmed', 'in-progress', 'completed', 'cancelled'];
    const reasons = [
      'Regular checkup', 'Follow-up visit', 'Chest pain', 'Fever and cough',
      'Injury assessment', 'Surgery consultation', 'Lab results review',
      'Vaccination', 'Chronic condition management', 'Emergency care'
    ];

    for (let i = 0; i < count; i++) {
      const patient = faker.helpers.arrayElement(patients);
      const doctor = faker.helpers.arrayElement(doctors);
      const appointmentDate = faker.date.between({ from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), to: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) });
      
      const appointment: MockAppointment = {
        id: faker.string.uuid(),
        patientId: patient.id,
        patientName: `${patient.firstName} ${patient.lastName}`,
        doctorId: doctor.id,
        doctorName: doctor.name,
        department: doctor.department,
        date: appointmentDate,
        time: faker.helpers.arrayElement(['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00']),
        duration: faker.helpers.arrayElement([15, 30, 45, 60]),
        type: faker.helpers.arrayElement(types),
        status: appointmentDate < new Date() ? faker.helpers.arrayElement(['completed', 'cancelled']) : faker.helpers.arrayElement(['scheduled', 'confirmed']),
        reason: faker.helpers.arrayElement(reasons),
        notes: faker.helpers.maybe(() => faker.lorem.sentence()),
        room: faker.helpers.maybe(() => `Room ${faker.number.int({ min: 101, max: 505 })}`)
      };
      appointments.push(appointment);
    }

    this.cache.set(cacheKey, appointments);
    return appointments;
  }

  // Generate Doctors
  generateDoctors(count: number = 20): MockDoctor[] {
    const cacheKey = `doctors_${count}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const doctors: MockDoctor[] = [];
    const specializations = [
      { name: 'Cardiologist', dept: 'Cardiology' },
      { name: 'Neurologist', dept: 'Neurology' },
      { name: 'Orthopedic Surgeon', dept: 'Orthopedics' },
      { name: 'Pediatrician', dept: 'Pediatrics' },
      { name: 'Emergency Medicine', dept: 'Emergency' },
      { name: 'Intensivist', dept: 'ICU' },
      { name: 'General Physician', dept: 'General Medicine' },
      { name: 'Surgeon', dept: 'Surgery' },
      { name: 'Anesthesiologist', dept: 'Anesthesiology' },
      { name: 'Radiologist', dept: 'Radiology' }
    ];
    const qualifications = ['MBBS', 'MD', 'MS', 'MCh', 'DM', 'DNB', 'FRCS', 'MRCP'];
    const _statuses: MockDoctor['status'][] = ['available', 'busy', 'on-leave'];

    for (let i = 0; i < count; i++) {
      const spec = faker.helpers.arrayElement(specializations);
      const doctor: MockDoctor = {
        id: faker.string.uuid(),
        name: `Dr. ${faker.person.fullName()}`,
        specialization: spec.name,
        department: spec.dept,
        qualification: faker.helpers.arrayElements(qualifications, { min: 1, max: 3 }).join(', '),
        experience: faker.number.int({ min: 2, max: 30 }),
        email: faker.internet.email(),
        phone: faker.phone.number(),
        availability: faker.helpers.arrayElements(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], { min: 4, max: 6 }),
        rating: parseFloat(faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }).toFixed(1)),
        patientsToday: faker.number.int({ min: 5, max: 25 }),
        nextAvailable: faker.date.soon({ days: 7 }),
        status: faker.helpers.weightedArrayElement([
          { value: 'available' as const, weight: 5 },
          { value: 'busy' as const, weight: 3 },
          { value: 'on-leave' as const, weight: 1 }
        ])
      };
      doctors.push(doctor);
    }

    this.cache.set(cacheKey, doctors);
    return doctors;
  }

  // Generate Departments
  generateDepartments(): MockDepartment[] {
    const cacheKey = 'departments';
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const departments: MockDepartment[] = [
      {
        id: faker.string.uuid(),
        name: 'Emergency',
        head: 'Dr. Sarah Johnson',
        bedCount: 20,
        occupiedBeds: faker.number.int({ min: 10, max: 18 }),
        staffCount: 25,
        activePatients: faker.number.int({ min: 8, max: 15 }),
        waitingPatients: faker.number.int({ min: 2, max: 8 }),
        equipment: ['Defibrillator', 'Ventilator', 'ECG Machine', 'X-Ray', 'Ultrasound'],
        services: ['Trauma Care', 'Critical Care', 'Emergency Surgery', 'Triage']
      },
      {
        id: faker.string.uuid(),
        name: 'ICU',
        head: 'Dr. Michael Chen',
        bedCount: 15,
        occupiedBeds: faker.number.int({ min: 10, max: 14 }),
        staffCount: 30,
        activePatients: faker.number.int({ min: 10, max: 14 }),
        waitingPatients: faker.number.int({ min: 0, max: 3 }),
        equipment: ['Ventilator', 'Multi-parameter Monitor', 'Infusion Pump', 'Dialysis Machine'],
        services: ['Critical Care', 'Post-operative Care', 'Life Support', 'Monitoring']
      },
      {
        id: faker.string.uuid(),
        name: 'Cardiology',
        head: 'Dr. Robert Williams',
        bedCount: 30,
        occupiedBeds: faker.number.int({ min: 15, max: 25 }),
        staffCount: 20,
        activePatients: faker.number.int({ min: 20, max: 28 }),
        waitingPatients: faker.number.int({ min: 3, max: 10 }),
        equipment: ['ECG', 'Echocardiogram', 'Angiography', 'Stress Test Equipment'],
        services: ['Cardiac Surgery', 'Angioplasty', 'Pacemaker Implantation', 'Heart Failure Management']
      },
      {
        id: faker.string.uuid(),
        name: 'Pediatrics',
        head: 'Dr. Emily Davis',
        bedCount: 25,
        occupiedBeds: faker.number.int({ min: 10, max: 20 }),
        staffCount: 18,
        activePatients: faker.number.int({ min: 15, max: 22 }),
        waitingPatients: faker.number.int({ min: 5, max: 12 }),
        equipment: ['Incubator', 'Phototherapy Unit', 'Pediatric Ventilator', 'Growth Charts'],
        services: ['Neonatal Care', 'Vaccination', 'Growth Monitoring', 'Pediatric Surgery']
      },
      {
        id: faker.string.uuid(),
        name: 'Surgery',
        head: 'Dr. James Anderson',
        bedCount: 40,
        occupiedBeds: faker.number.int({ min: 25, max: 35 }),
        staffCount: 35,
        activePatients: faker.number.int({ min: 20, max: 30 }),
        waitingPatients: faker.number.int({ min: 10, max: 20 }),
        equipment: ['Operating Tables', 'Surgical Lights', 'Anesthesia Machine', 'Surgical Instruments'],
        services: ['General Surgery', 'Laparoscopic Surgery', 'Trauma Surgery', 'Plastic Surgery']
      }
    ];

    this.cache.set(cacheKey, departments);
    return departments;
  }

  // Generate Prescriptions
  generatePrescriptions(count: number = 75): MockPrescription[] {
    const cacheKey = `prescriptions_${count}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const prescriptions: MockPrescription[] = [];
    const patients = this.generatePatients(50);
    const doctors = this.generateDoctors(20);
    const medications = [
      { name: 'Amoxicillin', dosage: '500mg', frequency: 'Twice daily', duration: '7 days' },
      { name: 'Paracetamol', dosage: '650mg', frequency: 'As needed', duration: '5 days' },
      { name: 'Omeprazole', dosage: '20mg', frequency: 'Once daily', duration: '14 days' },
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', duration: '30 days' },
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily', duration: '30 days' },
      { name: 'Atorvastatin', dosage: '10mg', frequency: 'Once daily', duration: '30 days' }
    ];
    const diagnoses = [
      'Upper Respiratory Infection', 'Hypertension', 'Type 2 Diabetes',
      'Gastroesophageal Reflux', 'Migraine', 'Osteoarthritis',
      'Anxiety Disorder', 'Allergic Rhinitis', 'Urinary Tract Infection'
    ];

    for (let i = 0; i < count; i++) {
      const prescription: MockPrescription = {
        id: faker.string.uuid(),
        patientId: faker.helpers.arrayElement(patients).id,
        doctorId: faker.helpers.arrayElement(doctors).id,
        date: faker.date.recent({ days: 60 }),
        medications: faker.helpers.arrayElements(medications, { min: 1, max: 4 }),
        diagnosis: faker.helpers.arrayElement(diagnoses),
        followUpDate: faker.helpers.maybe(() => faker.date.soon({ days: 30 })),
        status: faker.helpers.weightedArrayElement([
          { value: 'active', weight: 3 },
          { value: 'completed', weight: 5 },
          { value: 'cancelled', weight: 1 }
        ])
      };
      prescriptions.push(prescription);
    }

    this.cache.set(cacheKey, prescriptions);
    return prescriptions;
  }

  // Generate Lab Tests
  generateLabTests(count: number = 60): MockLabTest[] {
    const cacheKey = `labtests_${count}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const labTests: MockLabTest[] = [];
    const patients = this.generatePatients(50);
    const doctors = this.generateDoctors(20);
    const tests = [
      { name: 'Complete Blood Count', category: 'Hematology' },
      { name: 'Lipid Profile', category: 'Biochemistry' },
      { name: 'Liver Function Test', category: 'Biochemistry' },
      { name: 'Kidney Function Test', category: 'Biochemistry' },
      { name: 'Thyroid Profile', category: 'Endocrinology' },
      { name: 'HbA1c', category: 'Diabetology' },
      { name: 'Urine Analysis', category: 'Pathology' },
      { name: 'X-Ray Chest', category: 'Radiology' },
      { name: 'MRI Brain', category: 'Radiology' },
      { name: 'ECG', category: 'Cardiology' }
    ];

    for (let i = 0; i < count; i++) {
      const test = faker.helpers.arrayElement(tests);
      const testDate = faker.date.recent({ days: 30 });
      const isCompleted = testDate < new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const labTest: MockLabTest = {
        id: faker.string.uuid(),
        patientId: faker.helpers.arrayElement(patients).id,
        doctorId: faker.helpers.arrayElement(doctors).id,
        testName: test.name,
        category: test.category,
        date: testDate,
        status: isCompleted ? 'completed' : faker.helpers.arrayElement(['pending', 'in-progress']),
        results: isCompleted ? { value: faker.number.float({ min: 0, max: 100, fractionDigits: 2 }), unit: 'mg/dL', reference: '70-100' } : undefined,
        criticalValues: faker.helpers.maybe(() => true, { probability: 0.1 }),
        reportUrl: isCompleted ? `/reports/lab/${faker.string.uuid()}.pdf` : undefined
      };
      labTests.push(labTest);
    }

    this.cache.set(cacheKey, labTests);
    return labTests;
  }

  // Generate Billing Records
  generateBillingRecords(count: number = 40): MockBilling[] {
    const cacheKey = `billing_${count}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const billingRecords: MockBilling[] = [];
    const patients = this.generatePatients(50);
    const billItems = [
      { description: 'Consultation Fee', unitPrice: 500 },
      { description: 'Lab Tests', unitPrice: 1200 },
      { description: 'X-Ray', unitPrice: 800 },
      { description: 'Medication', unitPrice: 350 },
      { description: 'Room Charges', unitPrice: 2000 },
      { description: 'Surgery Fee', unitPrice: 15000 },
      { description: 'Anesthesia', unitPrice: 3000 },
      { description: 'Nursing Care', unitPrice: 500 }
    ];

    for (let i = 0; i < count; i++) {
      const items = faker.helpers.arrayElements(billItems, { min: 2, max: 5 }).map(item => ({
        description: item.description,
        quantity: faker.number.int({ min: 1, max: 5 }),
        unitPrice: item.unitPrice,
        total: item.unitPrice * faker.number.int({ min: 1, max: 5 })
      }));
      
      const subtotal = items.reduce((sum, item) => sum + item.total, 0);
      const tax = subtotal * 0.08;
      const discount = faker.helpers.maybe(() => subtotal * faker.number.float({ min: 0.05, max: 0.15, fractionDigits: 2 })) || 0;
      const total = subtotal + tax - discount;

      const billing: MockBilling = {
        id: faker.string.uuid(),
        patientId: faker.helpers.arrayElement(patients).id,
        date: faker.date.recent({ days: 90 }),
        items,
        subtotal,
        tax,
        discount,
        total,
        status: faker.helpers.weightedArrayElement([
          { value: 'paid', weight: 5 },
          { value: 'pending', weight: 3 },
          { value: 'partial', weight: 1 },
          { value: 'overdue', weight: 1 }
        ]),
        paymentMethod: faker.helpers.maybe(() => faker.helpers.arrayElement(['Cash', 'Credit Card', 'Insurance', 'UPI'])),
        insuranceClaimed: faker.helpers.maybe(() => total * faker.number.float({ min: 0.5, max: 0.8, fractionDigits: 2 }))
      };
      billingRecords.push(billing);
    }

    this.cache.set(cacheKey, billingRecords);
    return billingRecords;
  }

  // Get Dashboard Statistics
  getDashboardStats() {
    const patients = this.generatePatients(50);
    const appointments = this.generateAppointments(100);
    const departments = this.generateDepartments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return {
      totalPatients: patients.length,
      activePatients: patients.filter(p => p.status === 'active').length,
      criticalPatients: patients.filter(p => p.status === 'critical').length,
      todayAppointments: appointments.filter(a => {
        const appointmentDate = new Date(a.date);
        appointmentDate.setHours(0, 0, 0, 0);
        return appointmentDate.getTime() === today.getTime();
      }).length,
      pendingAppointments: appointments.filter(a => a.status === 'scheduled' || a.status === 'confirmed').length,
      totalBeds: departments.reduce((sum, dept) => sum + dept.bedCount, 0),
      occupiedBeds: departments.reduce((sum, dept) => sum + dept.occupiedBeds, 0),
      emergencyWaitTime: faker.number.int({ min: 10, max: 45 }),
      staffOnDuty: faker.number.int({ min: 80, max: 120 }),
      revenueToday: faker.number.int({ min: 50000, max: 200000 }),
      pendingBills: faker.number.int({ min: 5, max: 25 })
    };
  }

  // Clear cache
  clearCache() {
    this.cache.clear();
  }

  // Search patients
  searchPatients(query: string): MockPatient[] {
    const patients = this.generatePatients(50);
    const lowercaseQuery = query.toLowerCase();
    return patients.filter(patient => 
      patient.firstName.toLowerCase().includes(lowercaseQuery) ||
      patient.lastName.toLowerCase().includes(lowercaseQuery) ||
      patient.registrationNumber.toLowerCase().includes(lowercaseQuery) ||
      patient.email.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get patient by ID
  getPatientById(id: string): MockPatient | undefined {
    const patients = this.generatePatients(50);
    return patients.find(p => p.id === id);
  }

  // Get appointments by patient
  getAppointmentsByPatient(patientId: string): MockAppointment[] {
    const appointments = this.generateAppointments(100);
    return appointments.filter(a => a.patientId === patientId);
  }

  // Get appointments by doctor
  getAppointmentsByDoctor(doctorId: string): MockAppointment[] {
    const appointments = this.generateAppointments(100);
    return appointments.filter(a => a.doctorId === doctorId);
  }

  // Get today's appointments
  getTodayAppointments(): MockAppointment[] {
    const appointments = this.generateAppointments(100);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointments.filter(a => {
      const appointmentDate = new Date(a.date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate.getTime() === today.getTime();
    });
  }
}

// Export singleton instance
export const mockDataProvider = new MockDataProvider();

// Export mock user for demo auth
export const DEMO_USER = {
  id: 'demo-user-001',
  email: 'admin@demo.hospital.com',
  name: 'Dr. Demo Admin',
  role: 'Administrator',
  department: 'Administration',
  permissions: ['all'],
  avatar: '/images/demo-avatar.png'
};