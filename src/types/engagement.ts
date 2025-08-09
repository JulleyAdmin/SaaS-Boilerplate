// Patient Engagement Types

export interface PatientPreferences {
  preferenceId: string;
  patientId: string;
  clinicId: string;
  
  // Communication preferences
  preferredLanguage: string;
  preferredChannel: 'sms' | 'whatsapp' | 'email' | 'voice_call' | 'push_notification';
  communicationFrequency: string;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  
  // Engagement preferences
  interestedPrograms: string[];
  healthGoals: string[];
  preferredDoctorId?: string;
  allowFamilyAccess: boolean;
  
  // Consent management
  marketingConsent: boolean;
  researchConsent: boolean;
  dataSharingConsent: boolean;
  consentUpdatedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientJourney {
  journeyId: string;
  patientId: string;
  clinicId: string;
  
  // Journey details
  stage: 'awareness' | 'consideration' | 'active' | 'loyal' | 'at_risk' | 'churned';
  subStage?: string;
  entryDate: Date;
  expectedTransitionDate?: Date;
  
  // Engagement metrics
  engagementScore: number; // 0-100
  lastInteractionDate?: Date;
  interactionCount: number;
  responseRate?: number;
  
  // Predictive analytics
  churnRiskScore?: number; // 0-100
  lifetimeValue?: number;
  nextBestAction?: string;
  
  // Segmentation
  segments: string[];
  personas: string[];
  
  createdAt: Date;
  updatedAt: Date;
}

export interface HealthGoal {
  goalId: string;
  patientId: string;
  clinicId: string;
  
  // Goal definition
  goalType: 'weight_loss' | 'weight_gain' | 'bp_control' | 'diabetes_management' | 
           'cholesterol_control' | 'fitness_improvement' | 'quit_smoking' | 'mental_health';
  goalName: string;
  targetValue: {
    metric: string;
    value: number;
    unit: string;
  };
  currentValue?: {
    metric: string;
    value: number;
    unit: string;
  };
  
  // Timeline
  startDate: Date;
  targetDate: Date;
  achievedDate?: Date;
  
  // Progress tracking
  progressPercentage: number;
  milestones: Array<{
    date: Date;
    value: number;
    note?: string;
  }>;
  
  // Support system
  assignedCoachId?: string;
  assignedCoach?: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  supportGroupId?: string;
  
  // Status
  status: 'active' | 'paused' | 'achieved' | 'abandoned';
  
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
}

export interface PatientFeedback {
  feedbackId: string;
  patientId: string;
  clinicId: string;
  
  // Context
  feedbackType: 'consultation' | 'service' | 'facility' | 'staff' | 'overall';
  referenceId?: string; // consultation_id, appointment_id, etc.
  departmentId?: string;
  department?: {
    departmentId: string;
    departmentName: string;
  };
  
  // Ratings (1-5)
  overallRating?: number;
  waitTimeRating?: number;
  staffRating?: number;
  facilityRating?: number;
  treatmentRating?: number;
  
  // Feedback text
  feedbackText?: string;
  improvementSuggestions?: string;
  
  // NPS score
  npsScore?: number; // 0-10
  wouldRecommend?: boolean;
  
  // Follow-up
  requiresFollowup: boolean;
  followupCompleted: boolean;
  followupNotes?: string;
  
  // Metadata
  platform: 'web' | 'mobile' | 'kiosk' | 'sms' | 'phone';
  anonymous: boolean;
  submittedAt: Date;
  
  // Patient info (if not anonymous)
  patient?: {
    firstName: string;
    lastName: string;
    patientCode: string;
  };
}

export interface FeedbackAnalytics {
  overview: {
    totalFeedbacks: number;
    avgOverallRating: string;
    avgWaitTimeRating: string;
    avgStaffRating: string;
    avgFacilityRating: string;
    avgTreatmentRating: string;
    avgNpsScore: string;
    calculatedNpsScore: number;
  };
  npsBreakdown: {
    promoters: number;
    passives: number;
    detractors: number;
    npsScore: number;
  };
  ratingDistribution: Array<{
    rating: number;
    count: number;
    percentage: number;
  }>;
  departmentBreakdown: Array<{
    departmentId?: string;
    departmentName: string;
    feedbackCount: number;
    avgOverallRating: string;
    avgStaffRating: string;
    avgNpsScore: string;
  }>;
  feedbackTypeDistribution: Array<{
    feedbackType: string;
    count: number;
    avgRating: number;
  }>;
  platformDistribution: Array<{
    platform: string;
    count: number;
    avgRating: number;
  }>;
  followupMetrics: {
    requiresFollowup: number;
    followupCompleted: number;
    pendingFollowup: number;
  };
  monthlyTrend: Array<{
    month: string;
    feedbackCount: number;
    avgOverallRating: string;
    avgNpsScore: string;
  }>;
  topImprovementSuggestions: Array<{
    suggestion: string;
    count: number;
    avgRating: number;
  }>;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

// Form types for UI components
export interface PreferencesFormData {
  preferredLanguage: string;
  preferredChannel: string;
  communicationFrequency: string;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  interestedPrograms: string[];
  healthGoals: string[];
  preferredDoctorId?: string;
  allowFamilyAccess: boolean;
  marketingConsent: boolean;
  researchConsent: boolean;
  dataSharingConsent: boolean;
}

export interface HealthGoalFormData {
  goalType: string;
  goalName: string;
  targetValue: {
    metric: string;
    value: number;
    unit: string;
  };
  currentValue?: {
    metric: string;
    value: number;
    unit: string;
  };
  startDate: string;
  targetDate: string;
  assignedCoachId?: string;
  supportGroupId?: string;
}

export interface FeedbackFormData {
  feedbackType: string;
  referenceId?: string;
  departmentId?: string;
  overallRating?: number;
  waitTimeRating?: number;
  staffRating?: number;
  facilityRating?: number;
  treatmentRating?: number;
  feedbackText?: string;
  improvementSuggestions?: string;
  npsScore?: number;
  wouldRecommend?: boolean;
  platform?: string;
  anonymous?: boolean;
}