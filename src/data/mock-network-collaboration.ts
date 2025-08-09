// Mock data for Hospital Network Collaboration

export const mockHospitals = [
  {
    clinicId: 'clinic-1',
    clinicName: 'Apollo Hospital - Sarita Vihar',
    clinicType: 'Multi-Specialty',
    address: 'Sarita Vihar, New Delhi',
    phone: '+91-11-29955555',
    email: 'info@apollodelhi.com',
    networkId: 'network-1',
    beds: {
      general: 250,
      icu: 30,
      emergency: 15,
      private: 50
    },
    specialties: ['Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics'],
    governmentSchemes: ['PM-JAY', 'CGHS', 'ESI']
  },
  {
    clinicId: 'clinic-2',
    clinicName: 'Max Super Specialty - Patparganj',
    clinicType: 'Super-Specialty',
    address: 'Patparganj, Delhi',
    phone: '+91-11-43033333',
    email: 'contact@maxhealthcare.in',
    networkId: 'network-1',
    beds: {
      general: 180,
      icu: 25,
      emergency: 10,
      private: 40
    },
    specialties: ['Cardiac Surgery', 'Neurosurgery', 'Kidney Transplant', 'Liver Transplant'],
    governmentSchemes: ['PM-JAY', 'CGHS']
  },
  {
    clinicId: 'clinic-3',
    clinicName: 'Fortis Hospital - Vasant Kunj',
    clinicType: 'Multi-Specialty',
    address: 'Vasant Kunj, New Delhi',
    phone: '+91-11-42776222',
    email: 'enquiries@fortishealthcare.com',
    networkId: 'network-1',
    beds: {
      general: 200,
      icu: 35,
      emergency: 12,
      private: 45
    },
    specialties: ['Cardiology', 'Gastroenterology', 'Nephrology', 'Pulmonology'],
    governmentSchemes: ['CGHS', 'ESI']
  },
  {
    clinicId: 'clinic-4',
    clinicName: 'AIIMS - New Delhi',
    clinicType: 'Government Super-Specialty',
    address: 'Ansari Nagar, New Delhi',
    phone: '+91-11-26588500',
    email: 'director@aiims.edu',
    networkId: 'network-1',
    beds: {
      general: 500,
      icu: 60,
      emergency: 30,
      private: 20
    },
    specialties: ['All Specialties', 'Research', 'Medical Education'],
    governmentSchemes: ['PM-JAY', 'CGHS', 'ESI', 'Free Treatment']
  },
  {
    clinicId: 'clinic-5',
    clinicName: 'Safdarjung Hospital',
    clinicType: 'Government General',
    address: 'Safdarjung, New Delhi',
    phone: '+91-11-26730000',
    email: 'ms@vmmc-sjh.nic.in',
    networkId: 'network-1',
    beds: {
      general: 350,
      icu: 20,
      emergency: 25,
      private: 10
    },
    specialties: ['General Medicine', 'Surgery', 'Pediatrics', 'Gynecology'],
    governmentSchemes: ['PM-JAY', 'Free Treatment']
  }
];

export const mockPatients = [
  {
    patientId: 'pat-001',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    age: 45,
    gender: 'Male',
    abhaNumber: 'ABHA-2024-1234-5678',
    phone: '+91-9876543210',
    bloodGroup: 'B+',
    currentClinic: 'clinic-5',
    medicalHistory: ['Diabetes Type 2', 'Hypertension'],
    currentMedications: ['Metformin 500mg', 'Amlodipine 5mg']
  },
  {
    patientId: 'pat-002',
    firstName: 'Priya',
    lastName: 'Sharma',
    age: 32,
    gender: 'Female',
    abhaNumber: 'ABHA-2024-2345-6789',
    phone: '+91-9876543211',
    bloodGroup: 'O+',
    currentClinic: 'clinic-1',
    medicalHistory: ['Pregnancy - 7 months'],
    currentMedications: ['Folic Acid', 'Iron Supplements']
  },
  {
    patientId: 'pat-003',
    firstName: 'Mohammed',
    lastName: 'Ali',
    age: 68,
    gender: 'Male',
    abhaNumber: 'ABHA-2024-3456-7890',
    phone: '+91-9876543212',
    bloodGroup: 'A+',
    currentClinic: 'clinic-2',
    medicalHistory: ['Coronary Artery Disease', 'Previous MI', 'Diabetes'],
    currentMedications: ['Aspirin 75mg', 'Atorvastatin 40mg', 'Metoprolol 50mg']
  },
  {
    patientId: 'pat-004',
    firstName: 'Sunita',
    lastName: 'Devi',
    age: 55,
    gender: 'Female',
    abhaNumber: 'ABHA-2024-4567-8901',
    phone: '+91-9876543213',
    bloodGroup: 'AB+',
    currentClinic: 'clinic-3',
    medicalHistory: ['Breast Cancer - Stage 2', 'Post Chemotherapy'],
    currentMedications: ['Tamoxifen', 'Calcium supplements']
  },
  {
    patientId: 'pat-005',
    firstName: 'Arjun',
    lastName: 'Singh',
    age: 28,
    gender: 'Male',
    abhaNumber: 'ABHA-2024-5678-9012',
    phone: '+91-9876543214',
    bloodGroup: 'O-',
    currentClinic: 'clinic-4',
    medicalHistory: ['Road Traffic Accident', 'Multiple fractures'],
    currentMedications: ['Tramadol', 'Diclofenac']
  }
];

export const mockDoctors = [
  {
    doctorId: 'doc-001',
    name: 'Dr. Rajeev Gupta',
    email: 'rajeev.gupta@apollo.com',
    phone: '+91-9811111111',
    designation: 'Senior Cardiologist',
    qualification: 'MD, DM (Cardiology)',
    specialization: 'Interventional Cardiology',
    yearsOfExperience: 18,
    primaryClinic: 'clinic-1',
    practicingClinics: ['clinic-1', 'clinic-2', 'clinic-3'],
    consultationModes: ['In-Person', 'Video', 'Phone'],
    acceptsReferrals: true,
    maxReferralsPerWeek: 20,
    averageResponseTime: '2 hours',
    patientSatisfactionScore: 4.8
  },
  {
    doctorId: 'doc-002',
    name: 'Dr. Meera Patel',
    email: 'meera.patel@max.com',
    phone: '+91-9822222222',
    designation: 'Neurologist',
    qualification: 'MD, DM (Neurology)',
    specialization: 'Stroke & Epilepsy',
    yearsOfExperience: 12,
    primaryClinic: 'clinic-2',
    practicingClinics: ['clinic-2', 'clinic-4'],
    consultationModes: ['In-Person', 'Video'],
    acceptsReferrals: true,
    maxReferralsPerWeek: 15,
    averageResponseTime: '3 hours',
    patientSatisfactionScore: 4.7
  },
  {
    doctorId: 'doc-003',
    name: 'Dr. Amit Verma',
    email: 'amit.verma@aiims.edu',
    phone: '+91-9833333333',
    designation: 'Professor & HOD - Oncology',
    qualification: 'MS, MCh (Surgical Oncology)',
    specialization: 'Surgical Oncology',
    yearsOfExperience: 22,
    primaryClinic: 'clinic-4',
    practicingClinics: ['clinic-4'],
    consultationModes: ['In-Person'],
    acceptsReferrals: true,
    maxReferralsPerWeek: 10,
    averageResponseTime: '4 hours',
    patientSatisfactionScore: 4.9
  },
  {
    doctorId: 'doc-004',
    name: 'Dr. Priyanka Singh',
    email: 'priyanka.singh@fortis.com',
    phone: '+91-9844444444',
    designation: 'Nephrologist',
    qualification: 'MD, DM (Nephrology)',
    specialization: 'Kidney Transplant',
    yearsOfExperience: 10,
    primaryClinic: 'clinic-3',
    practicingClinics: ['clinic-3', 'clinic-1'],
    consultationModes: ['In-Person', 'Video'],
    acceptsReferrals: true,
    maxReferralsPerWeek: 12,
    averageResponseTime: '2.5 hours',
    patientSatisfactionScore: 4.6
  },
  {
    doctorId: 'doc-005',
    name: 'Dr. Sanjay Malhotra',
    email: 'sanjay.malhotra@safdarjung.gov',
    phone: '+91-9855555555',
    designation: 'General Physician',
    qualification: 'MBBS, MD (Medicine)',
    specialization: 'Internal Medicine',
    yearsOfExperience: 8,
    primaryClinic: 'clinic-5',
    practicingClinics: ['clinic-5'],
    consultationModes: ['In-Person'],
    acceptsReferrals: false,
    maxReferralsPerWeek: 0,
    averageResponseTime: 'N/A',
    patientSatisfactionScore: 4.5
  }
];

export const mockReferrals = [
  {
    referralId: 'ref-001',
    patient: mockPatients[0],
    referringDoctor: mockDoctors[4],
    referringClinic: mockHospitals[4],
    referredToDoctor: mockDoctors[0],
    referredToClinic: mockHospitals[0],
    referralType: 'External',
    referralPriority: 'High',
    referralStatus: 'Accepted',
    referralReason: 'Patient with uncontrolled diabetes and chest pain. Needs cardiac evaluation.',
    clinicalNotes: 'ECG shows ST-T changes. Troponin negative. BP: 150/90',
    provisionalDiagnosis: ['Unstable Angina', 'Diabetes Mellitus Type 2'],
    icd10Codes: ['I20.0', 'E11.9'],
    initiatedAt: new Date('2024-08-08T10:00:00'),
    acceptedAt: new Date('2024-08-08T10:30:00'),
    appointmentDate: new Date('2024-08-09T14:00:00'),
    investigationsDone: {
      ECG: 'ST-T changes in V2-V4',
      Troponin: 'Negative',
      'Blood Sugar': 'FBS: 180 mg/dL'
    }
  },
  {
    referralId: 'ref-002',
    patient: mockPatients[1],
    referringDoctor: mockDoctors[0],
    referredToDoctor: mockDoctors[2],
    referringClinic: mockHospitals[0],
    referredToClinic: mockHospitals[3],
    referralType: 'Second-Opinion',
    referralPriority: 'Normal',
    referralStatus: 'Initiated',
    referralReason: 'Pregnant patient with suspected fetal anomaly on ultrasound',
    clinicalNotes: 'Level 2 ultrasound shows possible cardiac anomaly. Needs fetal echo.',
    provisionalDiagnosis: ['Pregnancy with fetal anomaly'],
    icd10Codes: ['O35.8'],
    initiatedAt: new Date('2024-08-08T14:00:00'),
    investigationsDone: {
      'Ultrasound': 'Anomaly scan completed',
      'Blood tests': 'All parameters normal'
    }
  },
  {
    referralId: 'ref-003',
    patient: mockPatients[2],
    referringDoctor: mockDoctors[0],
    referredToDoctor: mockDoctors[1],
    referringClinic: mockHospitals[1],
    referredToClinic: mockHospitals[1],
    referralType: 'Internal',
    referralPriority: 'Urgent',
    referralStatus: 'Completed',
    referralReason: 'Post-CABG patient with new onset weakness in left arm',
    clinicalNotes: 'Sudden onset left arm weakness. Power 3/5. Suspected CVA.',
    provisionalDiagnosis: ['Cerebrovascular Accident', 'Post-CABG status'],
    icd10Codes: ['I63.9', 'Z95.1'],
    initiatedAt: new Date('2024-08-07T16:00:00'),
    acceptedAt: new Date('2024-08-07T16:15:00'),
    completedAt: new Date('2024-08-07T18:00:00'),
    treatmentProvided: 'MRI Brain done - small infarct in right MCA territory. Started on antiplatelet therapy.',
    outcomeStatus: 'Improved',
    patientFeedbackScore: 5
  },
  {
    referralId: 'ref-004',
    patient: mockPatients[3],
    referringDoctor: mockDoctors[3],
    referredToDoctor: mockDoctors[2],
    referringClinic: mockHospitals[2],
    referredToClinic: mockHospitals[3],
    referralType: 'External',
    referralPriority: 'High',
    referralStatus: 'Sent',
    referralReason: 'Post-chemotherapy patient needs oncology follow-up',
    clinicalNotes: 'Completed 6 cycles of chemotherapy. Due for PET scan and review.',
    provisionalDiagnosis: ['Breast Cancer - Stage 2A', 'Post-chemotherapy status'],
    icd10Codes: ['C50.9', 'Z51.11'],
    initiatedAt: new Date('2024-08-08T11:00:00'),
    sentAt: new Date('2024-08-08T11:30:00')
  },
  {
    referralId: 'ref-005',
    patient: mockPatients[4],
    referringDoctor: mockDoctors[2],
    referredToDoctor: mockDoctors[0],
    referringClinic: mockHospitals[3],
    referredToClinic: mockHospitals[0],
    referralType: 'Emergency',
    referralPriority: 'Urgent',
    referralStatus: 'In-Progress',
    referralReason: 'Trauma patient developing cardiac complications',
    clinicalNotes: 'Post-trauma day 3. Developing tachycardia and hypotension. ECG changes noted.',
    provisionalDiagnosis: ['Cardiac Contusion', 'Multiple Trauma'],
    icd10Codes: ['S26.0', 'T07'],
    initiatedAt: new Date('2024-08-08T15:00:00'),
    acceptedAt: new Date('2024-08-08T15:10:00')
  }
];

export const mockTransfers = [
  {
    transferId: 'trans-001',
    patient: mockPatients[0],
    sourceClinic: mockHospitals[4],
    destinationClinic: mockHospitals[0],
    transferType: 'Emergency',
    transferStatus: 'In-Transit',
    transferReason: 'Acute MI - needs emergency angioplasty',
    clinicalSummary: 'Patient presented with severe chest pain. ECG shows STEMI. Thrombolysis given.',
    transportMode: 'Ambulance',
    transportProvider: '108 Emergency Services',
    estimatedArrival: new Date('2024-08-08T16:30:00'),
    initiatedAt: new Date('2024-08-08T16:00:00'),
    initiatedBy: mockDoctors[4].doctorId,
    acceptedAt: new Date('2024-08-08T16:05:00'),
    acceptedBy: mockDoctors[0].doctorId,
    vitalSignsAtTransfer: {
      bloodPressure: '140/90',
      heartRate: 110,
      temperature: 98.6,
      spO2: 94,
      respiratoryRate: 22
    },
    medicationsOnTransfer: [
      { name: 'Aspirin', dosage: '325mg', frequency: 'Stat' },
      { name: 'Clopidogrel', dosage: '600mg', frequency: 'Stat' },
      { name: 'Atorvastatin', dosage: '80mg', frequency: 'OD' }
    ]
  },
  {
    transferId: 'trans-002',
    patient: mockPatients[2],
    sourceClinic: mockHospitals[1],
    destinationClinic: mockHospitals[3],
    transferType: 'Planned',
    transferStatus: 'Accepted',
    transferReason: 'Scheduled for advanced cardiac surgery at AIIMS',
    clinicalSummary: 'Triple vessel disease. Planned for CABG. All pre-op workup complete.',
    transportMode: 'Private',
    estimatedArrival: new Date('2024-08-09T08:00:00'),
    initiatedAt: new Date('2024-08-08T14:00:00'),
    initiatedBy: mockDoctors[0].doctorId,
    acceptedAt: new Date('2024-08-08T14:30:00'),
    acceptedBy: mockDoctors[2].doctorId,
    vitalSignsAtTransfer: {
      bloodPressure: '130/80',
      heartRate: 72,
      temperature: 98.4,
      spO2: 98,
      respiratoryRate: 16
    }
  },
  {
    transferId: 'trans-003',
    patient: mockPatients[4],
    sourceClinic: mockHospitals[3],
    destinationClinic: mockHospitals[0],
    transferType: 'Specialist',
    transferStatus: 'Initiated',
    transferReason: 'Needs specialized orthopedic surgery',
    clinicalSummary: 'Complex fracture requiring specialized fixation. CT scans attached.',
    transportMode: 'Ambulance',
    requestedDepartment: 'Orthopedics',
    initiatedAt: new Date('2024-08-08T15:30:00'),
    initiatedBy: mockDoctors[2].doctorId,
    vitalSignsAtTransfer: {
      bloodPressure: '120/80',
      heartRate: 88,
      temperature: 99.0,
      spO2: 96,
      respiratoryRate: 18
    }
  },
  {
    transferId: 'trans-004',
    patient: mockPatients[3],
    sourceClinic: mockHospitals[2],
    destinationClinic: mockHospitals[3],
    transferType: 'Emergency',
    transferStatus: 'Completed',
    transferReason: 'Oncology emergency - tumor lysis syndrome',
    clinicalSummary: 'Post-chemo patient with electrolyte imbalance. Needs ICU care.',
    transportMode: 'Ambulance',
    transportProvider: 'Hospital Ambulance Service',
    initiatedAt: new Date('2024-08-07T22:00:00'),
    completedAt: new Date('2024-08-07T23:30:00'),
    actualArrival: new Date('2024-08-07T23:00:00'),
    transferCharges: 5000,
    billingStatus: 'Settled'
  }
];

export const mockSharedResources = [
  {
    resourceId: 'res-001',
    resourceName: 'MRI Scanner 3T',
    resourceType: 'Equipment',
    resourceCategory: 'Diagnostic Imaging',
    hostClinic: mockHospitals[3],
    availableToClinics: ['clinic-1', 'clinic-2', 'clinic-3', 'clinic-4', 'clinic-5'],
    dailyCapacity: 20,
    currentUtilization: 75,
    bookingRequired: true,
    advanceBookingDays: 3,
    basePrice: 8000,
    networkDiscountPercent: 20,
    currentStatus: 'Available',
    specifications: {
      brand: 'Siemens',
      model: 'MAGNETOM Vida',
      features: ['3 Tesla', 'BioMatrix Technology', 'Cardiac Imaging']
    }
  },
  {
    resourceId: 'res-002',
    resourceName: 'Linear Accelerator',
    resourceType: 'Equipment',
    resourceCategory: 'Radiation Therapy',
    hostClinic: mockHospitals[0],
    availableToClinics: ['clinic-2', 'clinic-3', 'clinic-4', 'clinic-5'],
    dailyCapacity: 30,
    currentUtilization: 90,
    bookingRequired: true,
    advanceBookingDays: 7,
    basePrice: 15000,
    networkDiscountPercent: 15,
    currentStatus: 'In-Use',
    specifications: {
      brand: 'Varian',
      model: 'TrueBeam',
      features: ['IMRT', 'IGRT', 'SRS/SBRT capable']
    }
  },
  {
    resourceId: 'res-003',
    resourceName: 'Dialysis Unit',
    resourceType: 'Facility',
    resourceCategory: 'Nephrology',
    hostClinic: mockHospitals[2],
    availableToClinics: ['clinic-1', 'clinic-4', 'clinic-5'],
    dailyCapacity: 50,
    currentUtilization: 60,
    bookingRequired: true,
    advanceBookingDays: 1,
    basePrice: 3000,
    networkDiscountPercent: 25,
    currentStatus: 'Available',
    specifications: {
      machines: 25,
      shifts: 3,
      features: ['Hemodialysis', 'Peritoneal Dialysis', 'CRRT']
    }
  },
  {
    resourceId: 'res-004',
    resourceName: 'Mobile Cardiac Cathlab',
    resourceType: 'Equipment',
    resourceCategory: 'Cardiology',
    hostClinic: mockHospitals[0],
    availableToClinics: ['clinic-5'],
    dailyCapacity: 10,
    currentUtilization: 40,
    bookingRequired: true,
    advanceBookingDays: 2,
    basePrice: 50000,
    networkDiscountPercent: 10,
    currentStatus: 'Available',
    specifications: {
      brand: 'GE Healthcare',
      model: 'Innova IGS 520',
      features: ['Mobile Unit', 'Emergency Ready', 'Advanced Imaging']
    }
  },
  {
    resourceId: 'res-005',
    resourceName: 'Blood Bank',
    resourceType: 'Facility',
    resourceCategory: 'Transfusion Services',
    hostClinic: mockHospitals[3],
    availableToClinics: ['clinic-1', 'clinic-2', 'clinic-3', 'clinic-4', 'clinic-5'],
    dailyCapacity: 200,
    currentUtilization: 50,
    bookingRequired: false,
    basePrice: 1500,
    networkDiscountPercent: 0,
    currentStatus: 'Available',
    specifications: {
      capacity: '1000 units',
      bloodTypes: 'All types available',
      services: ['Whole Blood', 'Packed RBC', 'Platelets', 'FFP', 'Cryoprecipitate']
    }
  }
];

export const mockCollaborationAgreements = [
  {
    agreementId: 'agr-001',
    clinicA: mockHospitals[0],
    clinicB: mockHospitals[4],
    agreementType: 'Referral',
    agreementName: 'Apollo-Safdarjung Referral Agreement',
    effectiveFrom: new Date('2024-01-01'),
    effectiveTo: new Date('2024-12-31'),
    coveredServices: ['Cardiology', 'Neurology', 'Oncology'],
    paymentTerms: 'Per-Service',
    revenueSharePercentage: 20,
    status: 'Active'
  },
  {
    agreementId: 'agr-002',
    clinicA: mockHospitals[1],
    clinicB: mockHospitals[2],
    agreementType: 'Resource-Sharing',
    agreementName: 'Max-Fortis Equipment Sharing',
    effectiveFrom: new Date('2024-03-01'),
    effectiveTo: new Date('2025-02-28'),
    coveredServices: ['MRI', 'CT Scan', 'PET Scan'],
    paymentTerms: 'Monthly',
    minimumGuaranteedAmount: 500000,
    status: 'Active'
  },
  {
    agreementId: 'agr-003',
    clinicA: mockHospitals[3],
    clinicB: mockHospitals[0],
    agreementType: 'Service-Sharing',
    agreementName: 'AIIMS-Apollo Specialist Exchange',
    effectiveFrom: new Date('2024-06-01'),
    effectiveTo: new Date('2025-05-31'),
    coveredServices: ['Visiting Consultants', 'Second Opinions', 'Complex Surgeries'],
    paymentTerms: 'Revenue-Share',
    revenueSharePercentage: 30,
    status: 'Active'
  }
];

// Helper functions to generate realistic data
export function getRandomReferralStatus() {
  const statuses = ['Initiated', 'Sent', 'Acknowledged', 'Accepted', 'Rejected', 'Completed'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

export function getRandomTransferStatus() {
  const statuses = ['Initiated', 'Accepted', 'In-Transit', 'Completed', 'Cancelled'];
  return statuses[Math.floor(Math.random() * statuses.length)];
}

export function getRandomPriority() {
  const priorities = ['Urgent', 'High', 'Normal', 'Low'];
  return priorities[Math.floor(Math.random() * priorities.length)];
}

export function generateVitalSigns() {
  return {
    bloodPressure: `${110 + Math.floor(Math.random() * 40)}/${70 + Math.floor(Math.random() * 20)}`,
    heartRate: 60 + Math.floor(Math.random() * 40),
    temperature: 97 + Math.random() * 3,
    spO2: 92 + Math.floor(Math.random() * 8),
    respiratoryRate: 12 + Math.floor(Math.random() * 10)
  };
}

export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}