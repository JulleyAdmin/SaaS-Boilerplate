// Comprehensive mock data for patient engagement demo with realistic Indian healthcare context

export const mockPatientDatabase = {
  // Realistic Indian patient profiles
  patients: [
    {
      id: 'PAT001',
      name: 'Rajesh Kumar Sharma',
      age: 52,
      gender: 'Male',
      abhaNumber: '91-1234-5678-9012',
      phone: '+91 98765 43210',
      email: 'rajesh.sharma@gmail.com',
      address: 'B-42, Sector 62, Noida, UP 201301',
      bloodGroup: 'B+',
      emergencyContact: '+91 98765 43211',
      
      // Medical profile
      chronicConditions: ['Type 2 Diabetes', 'Hypertension'],
      allergies: ['Penicillin'],
      currentMedications: [
        { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
        { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily' },
      ],
      
      // Engagement metrics
      engagementScore: 78,
      journeyStage: 'active',
      lastVisit: '2025-01-05',
      totalVisits: 24,
      appointmentCompliance: 88,
      medicationAdherence: 82,
      
      // Insurance
      insurance: {
        provider: 'Star Health Insurance',
        policyNumber: 'P/123456/2024',
        coverage: 500000,
        governmentScheme: 'Ayushman Bharat PM-JAY',
        schemeId: 'PMJAY-UP-123456',
      },
      
      // Family
      familyMembers: [
        { name: 'Sunita Sharma', relation: 'Wife', age: 48 },
        { name: 'Arjun Sharma', relation: 'Son', age: 22 },
        { name: 'Priya Sharma', relation: 'Daughter', age: 19 },
      ],
    },
    {
      id: 'PAT002',
      name: 'Priya Patel',
      age: 28,
      gender: 'Female',
      abhaNumber: '91-2345-6789-0123',
      phone: '+91 99887 76655',
      email: 'priya.patel@yahoo.com',
      address: '204, Sunshine Apartments, Andheri West, Mumbai 400053',
      bloodGroup: 'O+',
      emergencyContact: '+91 99887 76656',
      
      // Maternity profile
      pregnancyStatus: 'Pregnant - 28 weeks',
      expectedDelivery: '2025-04-15',
      obgynDoctor: 'Dr. Kavita Mehta',
      
      engagementScore: 92,
      journeyStage: 'loyal',
      lastVisit: '2025-01-08',
      totalVisits: 18,
      appointmentCompliance: 95,
      
      insurance: {
        provider: 'Corporate Insurance - TCS',
        policyNumber: 'TCS/2024/45678',
        coverage: 1000000,
        governmentScheme: 'Janani Suraksha Yojana',
        schemeId: 'JSY-MH-789012',
      },
    },
    {
      id: 'PAT003',
      name: 'Mohammed Rashid',
      age: 67,
      gender: 'Male',
      abhaNumber: '91-3456-7890-1234',
      phone: '+91 94567 89012',
      address: '15, Old City Road, Charminar, Hyderabad 500002',
      bloodGroup: 'A+',
      
      chronicConditions: ['Diabetes', 'Heart Disease', 'Arthritis'],
      currentMedications: [
        { name: 'Insulin', dosage: '10 units', frequency: 'Before meals' },
        { name: 'Aspirin', dosage: '75mg', frequency: 'Once daily' },
        { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily' },
      ],
      
      engagementScore: 65,
      journeyStage: 'at_risk',
      lastVisit: '2024-11-20',
      totalVisits: 45,
      appointmentCompliance: 70,
      medicationAdherence: 75,
      
      insurance: {
        governmentScheme: 'CGHS',
        schemeId: 'CGHS-2024-345678',
        coverage: 'Unlimited',
      },
    },
    {
      id: 'PAT004',
      name: 'Ananya Krishnan',
      age: 8,
      gender: 'Female',
      abhaNumber: '91-4567-8901-2345',
      phone: '+91 88776 65544', // Parent's phone
      address: 'C-301, Green Valley, Whitefield, Bangalore 560066',
      bloodGroup: 'AB+',
      guardian: 'Krishnan Iyer (Father)',
      
      vaccinations: {
        completed: ['BCG', 'Polio', 'DPT', 'Hepatitis B', 'MMR'],
        pending: ['HPV', 'Typhoid Booster'],
        nextDue: '2025-02-15',
      },
      
      engagementScore: 88,
      journeyStage: 'active',
      lastVisit: '2024-12-20',
      totalVisits: 15,
      
      insurance: {
        provider: 'Parent Corporate - Infosys',
        policyNumber: 'INF/2024/67890',
        coverage: 500000,
      },
    },
    {
      id: 'PAT005',
      name: 'Suresh Reddy',
      age: 45,
      gender: 'Male',
      abhaNumber: '91-5678-9012-3456',
      phone: '+91 77889 90011',
      email: 'suresh.reddy@gmail.com',
      address: '78, Jubilee Hills, Hyderabad 500033',
      bloodGroup: 'B-',
      
      chronicConditions: ['Obesity', 'Sleep Apnea'],
      lifestyle: {
        smoking: 'Former smoker - quit 2 years ago',
        alcohol: 'Occasional',
        exercise: '2-3 times/week',
        diet: 'Non-vegetarian',
      },
      
      engagementScore: 72,
      journeyStage: 'consideration',
      lastVisit: '2025-01-02',
      totalVisits: 12,
      
      healthGoals: [
        { goal: 'Weight Loss', target: '85kg', current: '92kg', progress: 65 },
        { goal: 'Blood Pressure', target: '120/80', current: '135/85', progress: 70 },
      ],
    },
  ],
  
  // Upcoming appointments with context
  appointments: [
    {
      id: 'APT001',
      patientId: 'PAT001',
      patientName: 'Rajesh Kumar Sharma',
      doctorName: 'Dr. Amit Gupta',
      specialty: 'Diabetologist',
      date: '2025-01-15',
      time: '10:30 AM',
      type: 'Follow-up',
      mode: 'In-Person',
      department: 'Endocrinology',
      reason: 'Quarterly diabetes review',
      preparations: 'Fasting blood sugar test required',
    },
    {
      id: 'APT002',
      patientId: 'PAT002',
      patientName: 'Priya Patel',
      doctorName: 'Dr. Kavita Mehta',
      specialty: 'Obstetrician',
      date: '2025-01-18',
      time: '11:00 AM',
      type: 'Prenatal Checkup',
      mode: 'In-Person',
      department: 'Obstetrics',
      reason: '28-week prenatal visit',
      preparations: 'Glucose tolerance test',
    },
    {
      id: 'APT003',
      patientId: 'PAT003',
      patientName: 'Mohammed Rashid',
      doctorName: 'Dr. Rajesh Khanna',
      specialty: 'Cardiologist',
      date: '2025-01-20',
      time: '3:00 PM',
      type: 'Consultation',
      mode: 'Video',
      department: 'Cardiology',
      reason: 'Heart medication review',
      preparations: 'Recent BP readings log',
    },
  ],
  
  // Health campaigns with Indian context
  campaigns: [
    {
      id: 'CAMP001',
      name: 'Diabetes Control Abhiyan',
      type: 'Disease Management',
      status: 'active',
      startDate: '2025-01-01',
      endDate: '2025-03-31',
      targetSegment: 'Diabetic Patients',
      channels: ['WhatsApp', 'SMS', 'Voice Call'],
      
      content: {
        whatsapp: {
          template: 'diabetes_management_tips',
          message: 'नमस्ते {name} जी, आपका HbA1c टेस्ट करवाने का समय आ गया है। अपॉइंटमेंट बुक करने के लिए reply करें।',
        },
        sms: 'Dear {name}, Time for your quarterly diabetes checkup. Book now: bit.ly/diabetescheck',
      },
      
      metrics: {
        sent: 3456,
        delivered: 3200,
        opened: 2100,
        responded: 456,
        appointments: 234,
        roi: 3.5,
      },
      
      segments: ['chronic_care', 'diabetes_patients'],
      automationRules: [
        'Send reminder if HbA1c not done in 3 months',
        'Weekly diet tips on WhatsApp',
        'Monthly doctor consultation reminder',
      ],
    },
    {
      id: 'CAMP002',
      name: 'Mission Indradhanush - Vaccination Drive',
      type: 'Preventive Care',
      status: 'active',
      startDate: '2025-01-10',
      endDate: '2025-02-10',
      targetSegment: 'Children 0-5 years',
      governmentScheme: true,
      
      locations: [
        'Noida Sector 62 PHC',
        'Sector 50 Community Center',
        'District Hospital Noida',
      ],
      
      vaccines: ['Polio', 'DPT', 'Measles', 'Hepatitis B'],
      
      metrics: {
        targetChildren: 5000,
        vaccinated: 3200,
        coverage: 64,
        pendingFollowUp: 234,
      },
    },
    {
      id: 'CAMP003',
      name: 'Senior Citizen Wellness Check',
      type: 'Geriatric Care',
      status: 'upcoming',
      startDate: '2025-02-01',
      endDate: '2025-02-07',
      targetSegment: '60+ Age Group',
      
      services: [
        'Free health screening',
        'Eye checkup',
        'Dental examination',
        'Physiotherapy consultation',
        'Medicine review',
      ],
      
      partners: ['Rotary Club', 'HelpAge India'],
      expectedParticipants: 500,
    },
  ],
  
  // Preventive care schedules
  preventiveCare: [
    {
      patientId: 'PAT001',
      schedules: [
        {
          type: 'HbA1c Test',
          frequency: 'Every 3 months',
          lastDone: '2024-10-15',
          nextDue: '2025-01-15',
          status: 'due',
          priority: 'high',
        },
        {
          type: 'Eye Examination',
          frequency: 'Annual',
          lastDone: '2024-03-20',
          nextDue: '2025-03-20',
          status: 'upcoming',
          priority: 'medium',
        },
        {
          type: 'Lipid Profile',
          frequency: 'Every 6 months',
          lastDone: '2024-08-10',
          nextDue: '2025-02-10',
          status: 'upcoming',
          priority: 'medium',
        },
      ],
    },
    {
      patientId: 'PAT002',
      schedules: [
        {
          type: 'Prenatal Ultrasound',
          frequency: 'As per trimester',
          lastDone: '2024-12-20',
          nextDue: '2025-01-25',
          status: 'scheduled',
          priority: 'high',
        },
        {
          type: 'Iron & Folic Acid',
          frequency: 'Daily',
          compliance: 95,
          status: 'ongoing',
          priority: 'high',
        },
      ],
    },
  ],
  
  // Health goals with progress
  healthGoals: [
    {
      patientId: 'PAT001',
      goals: [
        {
          id: 'GOAL001',
          type: 'Blood Sugar Control',
          target: 'HbA1c < 7%',
          current: '7.8%',
          startValue: '9.2%',
          progress: 65,
          timeline: '6 months',
          
          milestones: [
            { date: '2024-10-01', value: '9.2%', achieved: true },
            { date: '2024-11-01', value: '8.5%', achieved: true },
            { date: '2024-12-01', value: '8.0%', achieved: true },
            { date: '2025-01-01', value: '7.8%', achieved: true },
            { date: '2025-02-01', value: '7.5%', achieved: false },
            { date: '2025-03-01', value: '7.0%', achieved: false },
          ],
          
          recommendations: [
            'Reduce rice intake to 1 cup per meal',
            'Walk 30 minutes after dinner',
            'Check blood sugar twice daily',
            'Take medicines on time',
          ],
          
          providerNotes: 'Good progress. Continue current medication. Focus on diet control.',
        },
        {
          id: 'GOAL002',
          type: 'Weight Management',
          target: '75 kg',
          current: '82 kg',
          startValue: '88 kg',
          progress: 70,
          timeline: '4 months',
        },
      ],
    },
    {
      patientId: 'PAT005',
      goals: [
        {
          id: 'GOAL003',
          type: 'Fitness Improvement',
          target: '10,000 steps/day',
          current: '7,500 steps/day',
          startValue: '3,000 steps/day',
          progress: 75,
          
          weeklyProgress: [
            { week: 'Week 1', average: 3000, target: 5000 },
            { week: 'Week 2', average: 4500, target: 5000 },
            { week: 'Week 3', average: 6000, target: 7500 },
            { week: 'Week 4', average: 7500, target: 10000 },
          ],
          
          achievements: [
            { badge: '7-Day Streak', date: '2025-01-05', icon: '🔥' },
            { badge: '5K Steps', date: '2024-12-20', icon: '👟' },
            { badge: 'Morning Walker', date: '2024-12-15', icon: '🌅' },
          ],
        },
      ],
    },
  ],
  
  // Community programs
  communityPrograms: [
    {
      id: 'PROG001',
      name: 'Swasth Bharat Health Camp - Noida',
      date: '2025-01-25',
      time: '9:00 AM - 5:00 PM',
      location: 'Community Center, Sector 62, Noida',
      type: 'Free Health Screening',
      
      services: [
        'Blood Sugar Testing',
        'Blood Pressure Check',
        'BMI Assessment',
        'Eye Examination',
        'Dental Checkup',
        'ECG (for 40+ age)',
        'Doctor Consultation',
        'Free Medicines',
      ],
      
      registrations: 324,
      capacity: 500,
      
      sponsors: ['Rotary Club Noida', 'Lions Club', 'Local MLA Fund'],
      volunteers: 25,
      doctors: 8,
      
      targetAudience: 'All age groups',
      specialFocus: 'Senior citizens and underprivileged',
    },
    {
      id: 'PROG002',
      name: 'Diabetes Awareness Week',
      date: '2025-02-01 to 2025-02-07',
      type: 'Education & Screening',
      
      activities: [
        'Free HbA1c testing',
        'Diet counseling sessions',
        'Yoga for diabetes',
        'Cooking demonstrations',
        'Doctor talks',
      ],
      
      expectedParticipants: 1000,
      registeredParticipants: 456,
    },
  ],
  
  // Engagement analytics data
  analytics: {
    overallMetrics: {
      totalPatients: 12456,
      activePatients: 8934,
      engagementRate: 72,
      avgEngagementScore: 75,
      monthlyGrowth: 12,
    },
    
    journeyDistribution: {
      awareness: 15,
      consideration: 25,
      active: 45,
      loyal: 10,
      atRisk: 5,
    },
    
    channelPerformance: {
      whatsapp: { sent: 5000, delivered: 4800, read: 4200, responded: 1200 },
      sms: { sent: 3000, delivered: 2900, read: 2500, responded: 500 },
      email: { sent: 2000, delivered: 1950, opened: 800, clicked: 200 },
      voice: { sent: 500, connected: 450, completed: 400 },
    },
    
    segmentPerformance: [
      { segment: 'Chronic Care', patients: 3456, engagement: 78, growth: 8 },
      { segment: 'Senior Citizens', patients: 2345, engagement: 65, growth: 5 },
      { segment: 'Maternity', patients: 890, engagement: 92, growth: 15 },
      { segment: 'Pediatric', patients: 1234, engagement: 85, growth: 12 },
      { segment: 'Corporate', patients: 4567, engagement: 70, growth: 10 },
    ],
    
    healthOutcomes: {
      readmissionRate: { current: 12, previous: 18, improvement: 33 },
      medicationAdherence: { current: 82, previous: 65, improvement: 26 },
      preventiveCareCompliance: { current: 75, previous: 45, improvement: 67 },
      patientSatisfaction: { current: 88, previous: 72, improvement: 22 },
    },
  },
};

// Helper functions for data generation
export const generatePatientJourney = (patientId: string) => {
  const patient = mockPatientDatabase.patients.find(p => p.id === patientId);
  if (!patient) return null;
  
  return {
    patientId,
    patientName: patient.name,
    currentStage: patient.journeyStage,
    engagementScore: patient.engagementScore,
    
    touchpoints: [
      {
        date: '2025-01-08',
        type: 'appointment',
        channel: 'whatsapp',
        action: 'Appointment reminder sent',
        response: 'Confirmed',
        impact: +5,
      },
      {
        date: '2025-01-05',
        type: 'campaign',
        channel: 'whatsapp',
        action: 'Diabetes tips shared',
        response: 'Read',
        impact: +3,
      },
      {
        date: '2025-01-02',
        type: 'feedback',
        channel: 'sms',
        action: 'Satisfaction survey',
        response: 'Completed (4/5 stars)',
        impact: +8,
      },
      {
        date: '2024-12-28',
        type: 'health_content',
        channel: 'email',
        action: 'New Year health tips',
        response: 'Opened',
        impact: +2,
      },
      {
        date: '2024-12-20',
        type: 'visit',
        channel: 'in-person',
        action: 'Consultation completed',
        response: 'Satisfied',
        impact: +10,
      },
    ],
    
    predictions: {
      churnRisk: patient.journeyStage === 'at_risk' ? 0.65 : 0.15,
      nextVisitProbability: patient.appointmentCompliance / 100,
      lifetimeValue: patient.totalVisits * 5000,
      recommendedActions: [
        'Send personalized health tips',
        'Schedule preventive checkup',
        'Enroll in loyalty program',
        'Offer telemedicine option',
      ],
    },
  };
};

export const getUpcomingAppointments = (patientId?: string) => {
  if (patientId) {
    return mockPatientDatabase.appointments.filter(apt => apt.patientId === patientId);
  }
  return mockPatientDatabase.appointments;
};

export const getPatientGoals = (patientId: string) => {
  const goals = mockPatientDatabase.healthGoals.find(g => g.patientId === patientId);
  return goals?.goals || [];
};

export const getPreventiveCareSchedule = (patientId: string) => {
  const schedule = mockPatientDatabase.preventiveCare.find(p => p.patientId === patientId);
  return schedule?.schedules || [];
};

export const getCommunityPrograms = () => {
  return mockPatientDatabase.communityPrograms;
};

export const getEngagementAnalytics = () => {
  return mockPatientDatabase.analytics;
};

export const getActiveCampaigns = () => {
  return mockPatientDatabase.campaigns.filter(c => c.status === 'active');
};

export const getPatientSegments = () => {
  return [
    {
      id: 'SEG001',
      name: 'Chronic Care Patients',
      criteria: 'Patients with 1+ chronic conditions',
      patientCount: 3456,
      avgEngagement: 78,
      topConditions: ['Diabetes', 'Hypertension', 'Heart Disease'],
      recommendations: [
        'Regular monitoring programs',
        'Medicine adherence reminders',
        'Lifestyle counseling',
      ],
    },
    {
      id: 'SEG002',
      name: 'Senior Citizens (60+)',
      criteria: 'Age >= 60 years',
      patientCount: 2345,
      avgEngagement: 65,
      topConcerns: ['Arthritis', 'Vision', 'Hearing'],
      recommendations: [
        'Home visit services',
        'Large print materials',
        'Family notifications',
      ],
    },
    {
      id: 'SEG003',
      name: 'Maternity & Pediatric',
      criteria: 'Pregnant women and children < 12',
      patientCount: 890,
      avgEngagement: 92,
      focus: ['Prenatal care', 'Vaccinations', 'Growth monitoring'],
      recommendations: [
        'Vaccination reminders',
        'Nutrition guidance',
        'Development milestones',
      ],
    },
  ];
};