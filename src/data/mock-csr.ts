// Mock data for CSR (Corporate Social Responsibility) features

export const mockCSRPrograms = [
  {
    programId: 'csr-001',
    clinicId: 'clinic-001',
    programName: 'Rural Health Camp Initiative',
    programType: 'health_camp' as const,
    description: 'Free medical checkups and basic treatments for rural communities in Maharashtra',
    objectives: [
      'Provide free medical checkups to 500+ rural residents',
      'Distribute essential medicines',
      'Conduct health awareness sessions',
      'Screen for common diseases like diabetes and hypertension'
    ],
    status: 'active' as const,
    startDate: new Date('2024-09-01'),
    endDate: new Date('2024-11-30'),
    targetCount: 500,
    actualBeneficiaries: 342,
    budget: 250000,
    budgetSpent: 165000,
    venueName: 'Shirpur Village Community Center',
    venueAddress: 'Shirpur, Dhule District, Maharashtra',
    coordinatorName: 'Dr. Amrita Desai',
    coordinatorContact: '+91 98765 43210',
    partnerOrganizations: ['Shirpur Gram Panchayat', 'Maharashtra Health Department'],
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-10-15'),
    stats: {
      eventCount: 6,
      totalRegistrations: 420,
      totalAttendance: 342,
      attendanceRate: 81,
      volunteerCount: 24,
      donationReceived: 45000,
    },
    feedbackScore: 4.7,
    impactMetrics: {
      healthScreenings: 342,
      medicinesDistributed: 1250,
      referralsGiven: 28,
      followUpRequired: 15,
      criticalCasesIdentified: 8
    }
  },
  {
    programId: 'csr-002',
    clinicId: 'clinic-001',
    programName: 'School Health & Nutrition Program',
    programType: 'health_education' as const,
    description: 'Comprehensive health education and nutrition program for government schools',
    objectives: [
      'Health education for 1000+ school children',
      'Nutritional assessment and counseling',
      'Basic health checkups and vaccinations',
      'Teacher training on health awareness'
    ],
    status: 'active' as const,
    startDate: new Date('2024-10-01'),
    endDate: new Date('2024-12-31'),
    targetCount: 1000,
    actualBeneficiaries: 450,
    budget: 180000,
    budgetSpent: 75000,
    venueName: 'Multiple Government Schools',
    venueAddress: 'Mumbai, Maharashtra',
    coordinatorName: 'Dr. Ravi Kulkarni',
    coordinatorContact: '+91 87654 32109',
    partnerOrganizations: ['Mumbai Municipal Corporation', 'Education Department'],
    createdAt: new Date('2024-09-15'),
    updatedAt: new Date('2024-10-15'),
    stats: {
      eventCount: 12,
      totalRegistrations: 580,
      totalAttendance: 450,
      attendanceRate: 78,
      volunteerCount: 18,
      donationReceived: 25000,
    },
    feedbackScore: 4.5,
    impactMetrics: {
      healthScreenings: 450,
      nutritionalAssessments: 450,
      vaccinationsGiven: 85,
      teachersTrained: 32,
      awarenessSessionsConducted: 24
    }
  },
  {
    programId: 'csr-003',
    clinicId: 'clinic-001',
    programName: 'Senior Citizens Care Initiative',
    programType: 'health_camp' as const,
    description: 'Specialized healthcare services for senior citizens in underprivileged communities',
    objectives: [
      'Free health checkups for senior citizens',
      'Physiotherapy sessions',
      'Mental health support and counseling',
      'Distribution of mobility aids'
    ],
    status: 'completed' as const,
    startDate: new Date('2024-07-01'),
    endDate: new Date('2024-09-30'),
    targetCount: 200,
    actualBeneficiaries: 185,
    budget: 120000,
    budgetSpent: 115000,
    venueName: 'Community Health Centers',
    venueAddress: 'Various locations in Pune',
    coordinatorName: 'Dr. Sunita Patil',
    coordinatorContact: '+91 76543 21098',
    partnerOrganizations: ['HelpAge India', 'Pune Municipal Corporation'],
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-10-01'),
    completionDate: new Date('2024-09-30'),
    stats: {
      eventCount: 8,
      totalRegistrations: 195,
      totalAttendance: 185,
      attendanceRate: 95,
      volunteerCount: 15,
      donationReceived: 18000,
    },
    feedbackScore: 4.8,
    impactMetrics: {
      healthCheckupsConducted: 185,
      physiotherapySessions: 124,
      mentalHealthSessions: 65,
      mobilityAidsDistributed: 45,
      followUpAppointments: 28
    }
  },
  {
    programId: 'csr-004',
    clinicId: 'clinic-001',
    programName: 'Mental Health Awareness Campaign',
    programType: 'mental_health_awareness' as const,
    description: 'Community-wide mental health awareness and support program',
    objectives: [
      'Reduce mental health stigma in the community',
      'Provide free counseling sessions',
      'Train community volunteers in mental health first aid',
      'Establish support groups'
    ],
    status: 'planned' as const,
    startDate: new Date('2024-11-01'),
    endDate: new Date('2025-01-31'),
    targetCount: 800,
    actualBeneficiaries: 0,
    budget: 200000,
    budgetSpent: 15000,
    venueName: 'Community Centers & Online',
    venueAddress: 'Multiple locations across Mumbai',
    coordinatorName: 'Dr. Kavita Nair',
    coordinatorContact: '+91 65432 10987',
    partnerOrganizations: ['NIMHANS', 'Mumbai Mental Health Alliance'],
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-10-15'),
    stats: {
      eventCount: 0,
      totalRegistrations: 0,
      totalAttendance: 0,
      attendanceRate: 0,
      volunteerCount: 0,
      donationReceived: 0,
    },
    impactMetrics: {
      awarenessSessionsPlanned: 20,
      counselingSessionsPlanned: 200,
      volunteerTrainingPlanned: 50,
      supportGroupsPlanned: 8
    }
  }
];

export const mockCSREvents = [
  {
    eventId: 'event-001',
    programId: 'csr-001',
    eventName: 'Shirpur Village Health Camp - Phase 1',
    eventType: 'health_screening' as const,
    description: 'First phase of rural health camp focusing on general checkups and diabetes screening',
    eventDate: new Date('2024-09-15'),
    startTime: '09:00',
    endTime: '17:00',
    venue: 'Shirpur Village Community Hall',
    maxCapacity: 100,
    registeredCount: 95,
    attendedCount: 82,
    servicesOffered: ['General Checkup', 'Blood Sugar Test', 'BP Check', 'Eye Examination'],
    staffAssigned: ['Dr. Amrita Desai', 'Nurse Priya Sharma', 'Lab Tech Rahul Kumar'],
    volunteersRequired: 8,
    volunteersAssigned: 6,
    status: 'completed' as const,
    feedback: {
      averageRating: 4.6,
      totalResponses: 45,
      positiveComments: ['Very helpful doctors', 'Free medicines were great', 'Well organized event']
    },
    createdAt: new Date('2024-09-01'),
    updatedAt: new Date('2024-09-16'),
  },
  {
    eventId: 'event-002',
    programId: 'csr-002',
    eventName: 'Bal Bharti School Health Drive',
    eventType: 'health_education' as const,
    description: 'Health education and screening for primary school students',
    eventDate: new Date('2024-10-20'),
    startTime: '10:00',
    endTime: '15:00',
    venue: 'Bal Bharti Government Primary School',
    maxCapacity: 150,
    registeredCount: 120,
    attendedCount: 0, // Future event
    servicesOffered: ['Health Education', 'Height/Weight Check', 'Vision Screening', 'Dental Checkup'],
    staffAssigned: ['Dr. Ravi Kulkarni', 'Pediatric Nurse Meera'],
    volunteersRequired: 5,
    volunteersAssigned: 4,
    status: 'scheduled' as const,
    createdAt: new Date('2024-10-05'),
    updatedAt: new Date('2024-10-15'),
  },
];

export const mockVolunteers = [
  {
    volunteerId: 'vol-001',
    clinicId: 'clinic-001',
    firstName: 'Arjun',
    lastName: 'Menon',
    email: 'arjun.menon@email.com',
    phone: '+91 98765 12345',
    age: 28,
    occupation: 'Software Engineer',
    skills: ['First Aid', 'Data Entry', 'Translation (Hindi/English)', 'Event Management'],
    availability: ['weekends', 'evenings'],
    preferredActivities: ['health_camps', 'education_programs'],
    emergencyContact: {
      name: 'Priya Menon',
      relationship: 'Spouse',
      phone: '+91 87654 23456'
    },
    medicalClearance: true,
    backgroundVerified: true,
    trainingCompleted: ['Basic Medical Training', 'Community Outreach'],
    totalHoursVolunteered: 156,
    programsParticipated: ['csr-001', 'csr-002'],
    lastVolunteered: new Date('2024-10-12'),
    recognitionAwards: ['Outstanding Volunteer 2024'],
    status: 'active' as const,
    joinedDate: new Date('2024-01-15'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-10-12'),
  },
  {
    volunteerId: 'vol-002', 
    clinicId: 'clinic-001',
    firstName: 'Sneha',
    lastName: 'Iyer',
    email: 'sneha.iyer@email.com',
    phone: '+91 76543 98765',
    age: 35,
    occupation: 'Teacher',
    skills: ['Child Psychology', 'Health Education', 'Event Coordination', 'Counseling'],
    availability: ['weekends', 'school_holidays'],
    preferredActivities: ['education_programs', 'child_health'],
    medicalClearance: true,
    backgroundVerified: true,
    trainingCompleted: ['Child Health Training', 'Educational Methods'],
    totalHoursVolunteered: 89,
    programsParticipated: ['csr-002'],
    lastVolunteered: new Date('2024-10-08'),
    status: 'active' as const,
    joinedDate: new Date('2024-03-01'),
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-10-08'),
  },
];

export const mockCSRAnalytics = {
  overview: {
    totalPrograms: 4,
    activePrograms: 2,
    completedPrograms: 1,
    totalBeneficiaries: 977,
    totalBudget: 750000,
    budgetUtilized: 370000,
    volunteersEngaged: 67,
    partnerOrganizations: 8,
    impactScore: 8.2
  },
  programsByType: [
    { type: 'health_camp', count: 2, beneficiaries: 527 },
    { type: 'health_education', count: 1, beneficiaries: 450 },
    { type: 'mental_health_awareness', count: 1, beneficiaries: 0 }
  ],
  monthlyImpact: [
    { month: 'Jul 2024', beneficiaries: 62, programs: 1, budget: 25000 },
    { month: 'Aug 2024', beneficiaries: 95, programs: 1, budget: 45000 },
    { month: 'Sep 2024', beneficiaries: 185, programs: 2, budget: 85000 },
    { month: 'Oct 2024', beneficiaries: 148, programs: 2, budget: 65000 },
  ],
  impactCategories: {
    health: {
      screeningsConducted: 977,
      medicinesDistributed: 1250,
      vaccinationsGiven: 85,
      referralsMade: 28
    },
    education: {
      awarenessSessionsConducted: 24,
      peopleEducated: 450,
      materialsDistributed: 800,
      teachersTrained: 32
    },
    community: {
      volunteersEngaged: 67,
      partnershipFormed: 8,
      followUpAppointments: 43,
      supportGroupsFormed: 0
    }
  },
  volunteerStats: {
    totalVolunteers: 67,
    activeVolunteers: 45,
    totalHours: 2340,
    averageHoursPerVolunteer: 52,
    retentionRate: 78,
    recognitionAwards: 12
  }
};