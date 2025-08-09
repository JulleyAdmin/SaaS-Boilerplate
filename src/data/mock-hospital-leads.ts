// Realistic hospital leads data for Indian healthcare context
// This represents a typical month's lead flow for a mid-size hospital

// Helper to generate dates in the last 30 days
const generateRecentDate = (daysAgo: number) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

// Realistic lead sources distribution for Indian hospitals
const leadSources = {
  google_search: 22,     // 22% from Google/SEO
  patient_referral: 18,  // 18% from existing patients
  doctor_referral: 15,   // 15% from external doctors
  walk_in: 12,          // 12% walk-ins
  practo: 10,           // 10% from Practo/1mg
  facebook_ad: 8,       // 8% from Facebook ads
  corporate_tieup: 6,   // 6% from corporate tie-ups
  health_camp: 5,       // 5% from health camps
  insurance_tpa: 4,     // 4% from insurance TPAs
};

// Common insurance types in India
const insuranceTypes = [
  'Corporate - TCS Health Plan',
  'Corporate - Infosys Health Cover',
  'Corporate - Wipro Healthcare',
  'Corporate - Amazon Health Insurance',
  'Star Health Insurance',
  'ICICI Lombard',
  'HDFC ERGO',
  'New India Assurance',
  'Ayushman Bharat (PM-JAY)',
  'CGHS',
  'ESI',
  'Self-pay',
];

// Service combinations commonly requested
const servicePackages = [
  {
    category: 'Cardiology',
    services: ['Cardiology Consultation', '2D Echo', 'TMT', 'ECG', 'Holter Monitoring'],
    concerns: ['Chest pain', 'Breathlessness', 'High BP', 'Palpitations', 'Family history'],
  },
  {
    category: 'Maternity',
    services: ['Gynecology Consultation', 'Pregnancy Care Package', 'Delivery Package', 'Prenatal Tests'],
    concerns: ['Pregnancy', 'First trimester', 'High-risk pregnancy', 'Previous C-section'],
  },
  {
    category: 'Orthopedics',
    services: ['Orthopedic Consultation', 'X-Ray', 'MRI', 'Physiotherapy', 'Joint Replacement'],
    concerns: ['Knee pain', 'Back pain', 'Arthritis', 'Sports injury', 'Fracture'],
  },
  {
    category: 'Diabetes',
    services: ['Endocrinology Consultation', 'HbA1c', 'Diabetes Package', 'Dietitian Consultation'],
    concerns: ['Uncontrolled diabetes', 'New diagnosis', 'Complications', 'Weight management'],
  },
  {
    category: 'Preventive',
    services: ['Master Health Checkup', 'Executive Package', 'Cardiac Risk Assessment', 'Cancer Screening'],
    concerns: ['Annual checkup', 'Corporate requirement', 'Age 40+ screening', 'Family history'],
  },
];

export const realisticHospitalLeads = [
  // Today's Fresh Inquiries (12-15 typical daily inquiries)
  {
    leadId: 'INQ-2024-10-15-001',
    clinicId: 'clinic-001',
    firstName: 'Arjun',
    lastName: 'Mehta',
    phone: '+91 98765 43210',
    email: 'arjun.mehta@gmail.com',
    age: 42,
    gender: 'Male' as const,
    location: 'Andheri West, Mumbai',
    pincode: '400058',
    source: 'google_search' as const,
    sourceDetails: { 
      keyword: 'chest pain specialist mumbai',
      landing_page: '/cardiology',
      utm_campaign: 'cardiology-services'
    },
    interestedServices: ['Cardiology Consultation', '2D Echo', 'TMT'],
    healthConcerns: ['Chest discomfort during exercise', 'Family history - father had heart attack at 55'],
    preferredContactMethod: 'whatsapp',
    leadScore: 82,
    scoreBreakdown: {
      urgency: 25,      // Chest pain = high urgency
      serviceValue: 20, // Multiple cardiac tests
      insurance: 15,    // Corporate insurance
      distance: 10,     // Within 5km
      timing: 12,       // Immediate need
    },
    insuranceType: 'Corporate - Infosys Health Plan',
    insuranceCoverage: 500000,
    preferredTimeSlot: 'Evening (5-8 PM)',
    preferredDoctors: ['Dr. Rajesh Khanna - Cardiologist'],
    estimatedRevenue: 15000,
    followUpRequired: true,
    status: 'inquiry' as const,
    createdAt: generateRecentDate(0),
    updatedAt: generateRecentDate(0),
  },
  {
    leadId: 'INQ-2024-10-15-002',
    clinicId: 'clinic-001',
    firstName: 'Priya',
    lastName: 'Sharma',
    phone: '+91 87654 32109',
    email: 'priya.s@outlook.com',
    age: 32,
    gender: 'Female' as const,
    location: 'Koramangala, Bangalore',
    pincode: '560034',
    source: 'practo' as const,
    sourceDetails: { 
      profile_views: 45,
      doctor_profile: 'Dr. Sunita Verma',
      inquiry_type: 'consultation'
    },
    interestedServices: ['Gynecology Consultation', 'First Trimester Package', 'NT Scan'],
    healthConcerns: ['8 weeks pregnant', 'Previous miscarriage at 10 weeks', 'Thyroid patient'],
    preferredContactMethod: 'phone',
    leadScore: 95,
    scoreBreakdown: {
      urgency: 30,      // Pregnancy with complications
      serviceValue: 25, // Long-term patient (9 months)
      insurance: 15,    // Good insurance
      distance: 10,     // Local
      timing: 15,       // Immediate need
    },
    insuranceType: 'Corporate - Amazon Health Insurance',
    insuranceCoverage: 800000,
    preferredTimeSlot: 'Morning (9-12 PM)',
    preferredDoctors: ['Dr. Sunita Verma - Gynecologist'],
    estimatedRevenue: 75000, // Full pregnancy package
    followUpRequired: true,
    urgencyLevel: 'high',
    status: 'inquiry' as const,
    createdAt: generateRecentDate(0),
    updatedAt: generateRecentDate(0),
  },
  {
    leadId: 'INQ-2024-10-15-003',
    clinicId: 'clinic-001',
    firstName: 'Ramesh',
    lastName: 'Rao',
    phone: '+91 76543 21098',
    age: 65,
    gender: 'Male' as const,
    location: 'T. Nagar, Chennai',
    pincode: '600017',
    source: 'walk_in' as const,
    sourceDetails: { 
      reception_desk: 'Main',
      walk_in_time: '11:30 AM',
      accompanied_by: 'Son'
    },
    interestedServices: ['Nephrology Consultation', 'Dialysis Information', 'Kidney Function Tests'],
    healthConcerns: ['Diabetic for 15 years', 'Creatinine 2.8', 'Swelling in feet', 'Reduced urine output'],
    leadScore: 88,
    scoreBreakdown: {
      urgency: 30,      // High creatinine
      serviceValue: 23, // Potential dialysis patient
      insurance: 10,    // Senior citizen plan
      distance: 15,     // Local
      timing: 10,       // Needs immediate attention
    },
    insuranceType: 'Star Health Senior Citizen',
    insuranceCoverage: 300000,
    preferredTimeSlot: 'Morning (9-12 PM)',
    transportationNeeded: true,
    estimatedRevenue: 50000,
    followUpRequired: true,
    urgencyLevel: 'high',
    status: 'inquiry' as const,
    createdAt: generateRecentDate(0),
    updatedAt: generateRecentDate(0),
  },
  {
    leadId: 'INQ-2024-10-15-004',
    clinicId: 'clinic-001',
    firstName: 'Sneha',
    lastName: 'Patel',
    phone: '+91 95432 10987',
    email: 'sneha.patel@tcs.com',
    age: 28,
    gender: 'Female' as const,
    location: 'Whitefield, Bangalore',
    pincode: '560066',
    source: 'corporate_tieup' as const,
    sourceDetails: { 
      company: 'TCS',
      hr_referral: true,
      employee_id: 'TCS-4567890'
    },
    interestedServices: ['Master Health Checkup', 'Gynecology Checkup', 'Dental Checkup'],
    healthConcerns: ['Annual health checkup', 'Irregular periods', 'Planning pregnancy next year'],
    preferredContactMethod: 'email',
    leadScore: 68,
    scoreBreakdown: {
      urgency: 10,      // Preventive care
      serviceValue: 18, // Package deal
      insurance: 20,    // Corporate coverage
      distance: 10,     // Local
      timing: 10,       // Flexible timing
    },
    insuranceType: 'Corporate - TCS Health Plan',
    insuranceCoverage: 500000,
    preferredTimeSlot: 'Weekend',
    estimatedRevenue: 8500,
    bulkBooking: true, // Potential for more TCS employees
    status: 'inquiry' as const,
    createdAt: generateRecentDate(0),
    updatedAt: generateRecentDate(0),
  },
  
  // Yesterday's Leads - Being Contacted (8-10 leads)
  {
    leadId: 'INQ-2024-10-14-001',
    clinicId: 'clinic-001',
    firstName: 'Mohammed',
    lastName: 'Khan',
    phone: '+91 88765 43210',
    age: 58,
    gender: 'Male' as const,
    location: 'Old City, Hyderabad',
    pincode: '500002',
    source: 'doctor_referral' as const,
    sourceDetails: { 
      referring_doctor: 'Dr. Ahmed - City Clinic',
      referral_note: 'Needs CABG evaluation'
    },
    interestedServices: ['Cardiac Surgery Consultation', 'Angiography', 'CABG Package'],
    healthConcerns: ['3 vessel disease', 'Diabetic', 'Had minor heart attack 2 weeks ago'],
    leadScore: 92,
    scoreBreakdown: {
      urgency: 30,      // Post-MI patient
      serviceValue: 27, // High-value surgery
      insurance: 15,    // Ayushman coverage
      distance: 10,     // Within city
      timing: 10,       // Urgent need
    },
    insuranceType: 'Ayushman Bharat (PM-JAY)',
    ayushmanCardNumber: 'PM-JAY-TS-2024-98765',
    insuranceCoverage: 500000,
    preferredTimeSlot: 'Morning (9-12 PM)',
    estimatedRevenue: 350000,
    lastContactDate: generateRecentDate(0),
    contactAttempts: 1,
    nextFollowUp: generateRecentDate(-1),
    assignedTo: 'coordinator-001',
    status: 'contacted' as const,
    createdAt: generateRecentDate(1),
    updatedAt: generateRecentDate(0),
  },
  {
    leadId: 'INQ-2024-10-14-002',
    clinicId: 'clinic-001',
    firstName: 'Kavita',
    lastName: 'Agarwal',
    phone: '+91 92345 67890',
    email: 'kavita.ag@gmail.com',
    age: 45,
    gender: 'Female' as const,
    location: 'Vile Parle, Mumbai',
    pincode: '400056',
    source: 'facebook_ad' as const,
    sourceDetails: { 
      campaign: 'breast-cancer-awareness',
      ad_set: 'women-40-plus-mumbai'
    },
    interestedServices: ['Mammography', 'Breast Surgeon Consultation', 'Oncology Opinion'],
    healthConcerns: ['Found lump during self-exam', 'Mother had breast cancer', 'Worried'],
    preferredContactMethod: 'whatsapp',
    leadScore: 85,
    scoreBreakdown: {
      urgency: 28,      // Potential cancer
      serviceValue: 22, // Diagnostic + potential treatment
      insurance: 15,    // Good coverage
      distance: 10,     // Local
      timing: 10,       // Immediate need
    },
    insuranceType: 'ICICI Lombard',
    insuranceCoverage: 1000000,
    preferredTimeSlot: 'Afternoon (2-5 PM)',
    estimatedRevenue: 25000,
    emotionalSupport: true, // Needs counseling
    lastContactDate: generateRecentDate(0),
    contactAttempts: 2,
    appointmentOffered: generateRecentDate(-1),
    status: 'contacted' as const,
    createdAt: generateRecentDate(1),
    updatedAt: generateRecentDate(0),
  },
  
  // Week-old Leads - Appointments Scheduled (15-20 leads)
  {
    leadId: 'INQ-2024-10-08-001',
    clinicId: 'clinic-001',
    firstName: 'Rajesh',
    lastName: 'Khanna',
    phone: '+91 94567 23456',
    age: 52,
    gender: 'Male' as const,
    location: 'Bandra, Mumbai',
    pincode: '400050',
    source: 'patient_referral' as const,
    sourceDetails: { 
      referring_patient: 'Mr. Suresh Kumar',
      relationship: 'Colleague'
    },
    interestedServices: ['Knee Replacement Surgery', 'Pre-surgery Tests', 'Physiotherapy Package'],
    healthConcerns: ['Severe arthritis both knees', 'Unable to climb stairs', 'Pain score 8/10'],
    leadScore: 90,
    scoreBreakdown: {
      urgency: 25,      // Severe pain
      serviceValue: 30, // High-value surgery
      insurance: 15,    // Good coverage
      distance: 10,     // Local
      timing: 10,       // Scheduled
    },
    insuranceType: 'HDFC ERGO',
    insuranceCoverage: 750000,
    preferredTimeSlot: 'Morning (9-12 PM)',
    estimatedRevenue: 400000, // Bilateral knee replacement
    surgeryPlanned: true,
    lastContactDate: generateRecentDate(2),
    contactAttempts: 3,
    status: 'appointment_scheduled' as const,
    appointmentDate: generateRecentDate(-2),
    appointmentType: 'Surgery Consultation',
    assignedDoctor: 'Dr. Amit Shah - Sr. Orthopedic Surgeon',
    preOpInstructions: 'Stop blood thinners, bring all reports',
    createdAt: generateRecentDate(7),
    updatedAt: generateRecentDate(2),
  },
  {
    leadId: 'INQ-2024-10-08-002',
    clinicId: 'clinic-001',
    firstName: 'Neha',
    lastName: 'Reddy',
    phone: '+91 98123 45678',
    email: 'neha.r@microsoft.com',
    age: 35,
    gender: 'Female' as const,
    location: 'Gurgaon, Haryana',
    pincode: '122001',
    source: 'google_search' as const,
    sourceDetails: { 
      keyword: 'ivf specialist gurgaon',
      landing_page: '/fertility-center'
    },
    interestedServices: ['IVF Consultation', 'Fertility Tests Package', 'IVF Procedure'],
    healthConcerns: ['Trying for 3 years', 'PCOS', '2 failed IUIs', 'Age factor concern'],
    preferredContactMethod: 'email',
    leadScore: 88,
    scoreBreakdown: {
      urgency: 20,      // Age factor
      serviceValue: 28, // High-value treatment
      insurance: 10,    // Limited coverage for IVF
      distance: 15,     // Willing to travel
      timing: 15,       // Ready to start
    },
    insuranceType: 'Self-pay + Partial Corporate Coverage',
    insuranceCoverage: 100000,
    preferredTimeSlot: 'Morning (9-12 PM)',
    estimatedRevenue: 250000, // IVF cycle
    treatmentCycles: 1, // Potential for multiple
    lastContactDate: generateRecentDate(3),
    contactAttempts: 4,
    status: 'appointment_scheduled' as const,
    appointmentDate: generateRecentDate(-1),
    appointmentType: 'IVF Consultation',
    assignedDoctor: 'Dr. Priya Malhotra - IVF Specialist',
    partnerInvolved: true,
    createdAt: generateRecentDate(7),
    updatedAt: generateRecentDate(3),
  },
  
  // Consultation Done - Awaiting Decision (10-12 leads)
  {
    leadId: 'INQ-2024-10-05-001',
    clinicId: 'clinic-001',
    firstName: 'Meera',
    lastName: 'Nair',
    phone: '+91 87656 78901',
    email: 'meera.nair@wipro.com',
    age: 38,
    gender: 'Female' as const,
    location: 'Electronic City, Bangalore',
    pincode: '560100',
    source: 'health_camp' as const,
    sourceDetails: { 
      camp_name: 'Wipro Campus Health Camp',
      screening_result: 'BMI 38, Pre-diabetic'
    },
    interestedServices: ['Bariatric Surgery Evaluation', 'Nutritionist Consultation', 'Weight Loss Program'],
    healthConcerns: ['BMI 38', 'Pre-diabetes', 'PCOD', 'Joint pain', 'Sleep apnea'],
    leadScore: 75,
    scoreBreakdown: {
      urgency: 20,      // Health risks
      serviceValue: 20, // Potential surgery
      insurance: 15,    // Corporate coverage
      distance: 10,     // Local
      timing: 10,       // Considering options
    },
    insuranceType: 'Corporate - Wipro Health Cover',
    insuranceCoverage: 500000,
    lastContactDate: generateRecentDate(5),
    contactAttempts: 5,
    status: 'consultation_done' as const,
    consultationDate: generateRecentDate(3),
    consultationNotes: 'Good candidate for sleeve gastrectomy, BMI 38, motivated',
    treatmentPlanProposed: 'Gastric Sleeve Surgery + 1 year follow-up',
    estimatedRevenue: 280000,
    decisionPending: 'Insurance approval',
    assignedDoctor: 'Dr. Rakesh Jain - Bariatric Surgeon',
    assignedNutritionist: 'Ms. Deepa - Clinical Nutritionist',
    createdAt: generateRecentDate(10),
    updatedAt: generateRecentDate(3),
  },
  
  // Recently Admitted (3-5 leads)
  {
    leadId: 'INQ-2024-10-01-001',
    clinicId: 'clinic-001',
    firstName: 'Suresh',
    lastName: 'Gupta',
    phone: '+91 90876 54321',
    age: 62,
    gender: 'Male' as const,
    location: 'Malad, Mumbai',
    pincode: '400064',
    source: 'emergency' as const,
    sourceDetails: { 
      arrival_mode: 'Ambulance',
      emergency_type: 'Chest pain',
      golden_hour: true
    },
    interestedServices: ['Emergency Care', 'Angioplasty', 'CCU Admission'],
    healthConcerns: ['Acute MI', 'Severe chest pain', 'Emergency admission'],
    leadScore: 100,
    scoreBreakdown: {
      urgency: 30,      // Emergency
      serviceValue: 30, // High-value emergency care
      insurance: 20,    // Good coverage
      distance: 10,     // Local
      timing: 10,       // Immediate
    },
    insuranceType: 'New India Assurance',
    insuranceCoverage: 500000,
    status: 'admitted' as const,
    admissionDate: generateRecentDate(2),
    admissionType: 'Emergency',
    wardType: 'CCU',
    bedNumber: 'CCU-003',
    primaryDoctor: 'Dr. Rajesh Khanna - Interventional Cardiologist',
    treatmentProvided: 'Primary Angioplasty - LAD stenting',
    currentCondition: 'Stable, recovering',
    estimatedLOS: 4, // Length of stay in days
    estimatedRevenue: 450000,
    actualRevenue: 380000, // After insurance
    createdAt: generateRecentDate(2),
    updatedAt: generateRecentDate(0),
  },
  
  // Add varied status leads for realistic distribution
  ...Array.from({length: 20}, (_, i) => ({
    leadId: `INQ-2024-10-${String(15-Math.floor(i/3)).padStart(2, '0')}-${String(100+i).padStart(3, '0')}`,
    clinicId: 'clinic-001',
    firstName: ['Amit', 'Pooja', 'Ravi', 'Sita', 'Vijay', 'Anita', 'Kiran', 'Deepak', 'Rashmi', 'Arun'][i % 10],
    lastName: ['Singh', 'Sharma', 'Patel', 'Kumar', 'Reddy', 'Nair', 'Desai', 'Joshi', 'Verma', 'Gupta'][i % 10],
    phone: `+91 ${90000 + Math.floor(Math.random() * 9999)}${Math.floor(Math.random() * 99999)}`,
    age: 25 + Math.floor(Math.random() * 45),
    gender: i % 2 === 0 ? 'Male' as const : 'Female' as const,
    location: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune', 'Hyderabad', 'Kolkata', 'Ahmedabad'][i % 8],
    source: Object.keys(leadSources)[i % Object.keys(leadSources).length] as any,
    interestedServices: servicePackages[i % servicePackages.length].services.slice(0, 2 + Math.floor(Math.random() * 2)),
    healthConcerns: servicePackages[i % servicePackages.length].concerns.slice(0, 1 + Math.floor(Math.random() * 2)),
    leadScore: 45 + Math.floor(Math.random() * 45),
    insuranceType: insuranceTypes[i % insuranceTypes.length],
    preferredTimeSlot: ['Morning (9-12 PM)', 'Afternoon (2-5 PM)', 'Evening (5-8 PM)', 'Weekend'][i % 4],
    status: ['inquiry', 'contacted', 'appointment_scheduled', 'consultation_done', 'admitted', 'lost'][
      i < 5 ? 0 : i < 10 ? 1 : i < 15 ? 2 : i < 18 ? 3 : i < 19 ? 4 : 5
    ] as any,
    estimatedRevenue: Math.floor(Math.random() * 50000) + 5000,
    createdAt: generateRecentDate(Math.floor(i/2)),
    updatedAt: generateRecentDate(Math.max(0, Math.floor(i/2) - 1)),
  }))
];

// Summary statistics for dashboard
export const leadStatistics = {
  daily: {
    average: 12,
    today: 15,
    yesterday: 10,
    trend: '+20%',
  },
  weekly: {
    total: 78,
    converted: 8,
    conversionRate: '10.3%',
    avgLeadScore: 72,
  },
  monthly: {
    total: 312,
    bySource: leadSources,
    topServices: [
      'Cardiology Consultation',
      'Master Health Checkup',
      'Gynecology Consultation',
      'Orthopedic Consultation',
      'Emergency Care',
    ],
    averageRevenue: 45000,
  },
  funnel: {
    inquiry: 35,        // 35% are fresh inquiries
    contacted: 25,      // 25% have been contacted
    scheduled: 20,      // 20% have appointments
    consulted: 12,      // 12% completed consultation
    admitted: 8,        // 8% got admitted/started treatment
  },
};