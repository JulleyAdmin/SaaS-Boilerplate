// Mock data for Patient Engagement features

export const mockHealthGoals = [
  {
    goalId: 'hg-001',
    patientId: 'patient-001',
    goalName: 'Weight Loss Journey',
    goalType: 'weight_loss',
    description: 'Lose 10kg in 6 months through diet and exercise',
    targetValue: { value: 70, unit: 'kg' },
    currentValue: { value: 78, unit: 'kg' },
    progressPercentage: 65,
    status: 'active',
    targetDate: new Date('2024-12-31'),
    startDate: new Date('2024-06-01'),
    assignedCoach: {
      coachId: 'coach-001',
      firstName: 'Dr. Priya',
      lastName: 'Sharma',
      specialization: 'Nutrition'
    },
    milestones: [
      { date: new Date('2024-07-01'), value: 83, unit: 'kg', notes: 'Good start!' },
      { date: new Date('2024-08-01'), value: 80, unit: 'kg', notes: 'Keep going!' },
      { date: new Date('2024-09-01'), value: 78, unit: 'kg', notes: 'Great progress!' },
    ],
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-09-15'),
  },
  {
    goalId: 'hg-002', 
    patientId: 'patient-001',
    goalName: 'Blood Pressure Control',
    goalType: 'bp_control',
    description: 'Maintain blood pressure below 130/80',
    targetValue: { value: 130, unit: 'mmHg' },
    currentValue: { value: 125, unit: 'mmHg' },
    progressPercentage: 85,
    status: 'active',
    targetDate: new Date('2024-11-30'),
    startDate: new Date('2024-07-01'),
    assignedCoach: {
      coachId: 'coach-002',
      firstName: 'Dr. Rajesh',
      lastName: 'Kumar',
      specialization: 'Cardiology'
    },
    milestones: [
      { date: new Date('2024-08-01'), value: 140, unit: 'mmHg', notes: 'Starting point' },
      { date: new Date('2024-09-01'), value: 135, unit: 'mmHg', notes: 'Improving' },
      { date: new Date('2024-10-01'), value: 125, unit: 'mmHg', notes: 'Target achieved!' },
    ],
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-10-15'),
  },
  {
    goalId: 'hg-003',
    patientId: 'patient-002', 
    goalName: 'Diabetes Management',
    goalType: 'diabetes_management',
    description: 'Keep HbA1c levels under 7%',
    targetValue: { value: 7, unit: '%' },
    currentValue: { value: 6.8, unit: '%' },
    progressPercentage: 90,
    status: 'achieved',
    targetDate: new Date('2024-10-31'),
    startDate: new Date('2024-05-01'),
    achievedDate: new Date('2024-10-01'),
    assignedCoach: {
      coachId: 'coach-003',
      firstName: 'Dr. Meera',
      lastName: 'Patel',
      specialization: 'Endocrinology'
    },
    milestones: [
      { date: new Date('2024-06-01'), value: 8.2, unit: '%', notes: 'Starting treatment' },
      { date: new Date('2024-08-01'), value: 7.5, unit: '%', notes: 'Good progress' },
      { date: new Date('2024-10-01'), value: 6.8, unit: '%', notes: 'Goal achieved!' },
    ],
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-10-01'),
  },
];

export const mockPatientFeedback = [
  {
    feedbackId: 'fb-001',
    patientId: 'patient-001',
    feedbackType: 'consultation',
    referenceId: 'consult-001',
    departmentId: 'dept-cardiology',
    overallRating: 5,
    staffRating: 5,
    facilityRating: 4,
    waitTimeRating: 3,
    treatmentRating: 5,
    npsScore: 9,
    wouldRecommend: true,
    feedbackText: 'Excellent consultation with Dr. Kumar. Very thorough examination and clear explanation of my condition.',
    improvementSuggestions: 'The waiting time could be reduced. Maybe implement a better appointment scheduling system.',
    platform: 'web',
    anonymous: false,
    followUpRequired: false,
    createdAt: new Date('2024-10-15'),
    updatedAt: new Date('2024-10-15'),
  },
  {
    feedbackId: 'fb-002', 
    patientId: 'patient-002',
    feedbackType: 'facility',
    overallRating: 4,
    staffRating: 4,
    facilityRating: 5,
    waitTimeRating: 4,
    npsScore: 8,
    wouldRecommend: true,
    feedbackText: 'Very clean and modern facilities. Staff was helpful and courteous.',
    improvementSuggestions: 'More parking spaces would be helpful.',
    platform: 'mobile',
    anonymous: true,
    followUpRequired: false,
    createdAt: new Date('2024-10-10'),
    updatedAt: new Date('2024-10-10'),
  },
  {
    feedbackId: 'fb-003',
    patientId: 'patient-003',
    feedbackType: 'service',
    referenceId: 'service-001',
    overallRating: 2,
    staffRating: 2,
    facilityRating: 3,
    waitTimeRating: 1,
    npsScore: 4,
    wouldRecommend: false,
    feedbackText: 'Very long waiting time and staff seemed rushed. Not a pleasant experience.',
    improvementSuggestions: 'Improve staff training and reduce waiting times. Better communication about delays.',
    platform: 'web',
    anonymous: false,
    followUpRequired: true,
    createdAt: new Date('2024-10-05'),
    updatedAt: new Date('2024-10-05'),
  },
];

export const mockPatientPreferences = [
  {
    preferenceId: 'pref-001',
    patientId: 'patient-001',
    communicationPreferences: {
      preferredMethod: 'whatsapp',
      languages: ['Hindi', 'English'],
      timePreference: 'morning',
      frequency: 'weekly'
    },
    privacySettings: {
      shareDataForResearch: true,
      allowMarketing: false,
      publicProfile: false
    },
    healthGoalPreferences: {
      reminderFrequency: 'daily',
      coachingStyle: 'supportive',
      trackingMethods: ['manual', 'device']
    },
    appointmentPreferences: {
      preferredTime: 'morning',
      reminderAdvance: 24,
      allowRescheduling: true
    },
    consentGiven: true,
    consentDate: new Date('2024-06-01'),
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-09-15'),
  },
];

// Analytics mock data
export const mockFeedbackAnalytics = {
  overview: {
    totalFeedback: 156,
    averageRating: 4.2,
    npsScore: 42,
    responseRate: 68,
    followUpRequired: 12,
  },
  ratingDistribution: {
    5: 45,
    4: 38,
    3: 28,
    2: 15,
    1: 8,
  },
  departmentBreakdown: [
    { department: 'Cardiology', avgRating: 4.5, feedbackCount: 32 },
    { department: 'Orthopedics', avgRating: 4.1, feedbackCount: 28 },
    { department: 'General Medicine', avgRating: 4.3, feedbackCount: 45 },
    { department: 'Pediatrics', avgRating: 4.6, feedbackCount: 25 },
    { department: 'Emergency', avgRating: 3.8, feedbackCount: 26 },
  ],
  monthlyTrend: [
    { month: 'Jun 2024', rating: 4.1, count: 42 },
    { month: 'Jul 2024', rating: 4.0, count: 38 },
    { month: 'Aug 2024', rating: 4.3, count: 45 },
    { month: 'Sep 2024', rating: 4.4, count: 52 },
    { month: 'Oct 2024', rating: 4.2, count: 48 },
  ],
};