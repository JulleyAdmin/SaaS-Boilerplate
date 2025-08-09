// CSR (Corporate Social Responsibility) Types

export interface CSRProgram {
  programId: string;
  clinicId: string;
  
  // Program details
  programName: string;
  programType: 'health_camp' | 'vaccination_drive' | 'screening_program' | 'health_education' |
               'blood_donation' | 'mental_health_awareness' | 'nutrition_program' | 'fitness_program';
  description?: string;
  objectives: string[];
  
  // Target audience
  targetDemographic?: string;
  targetCount?: number;
  eligibilityCriteria?: Record<string, any>;
  
  // Timeline
  startDate: Date;
  endDate?: Date;
  registrationDeadline?: Date;
  
  // Location
  venueType?: 'hospital' | 'community_center' | 'school' | 'mobile_van' | 'outdoor';
  venueName?: string;
  venueAddress?: string;
  
  // Resources
  budget?: number;
  requiredStaff?: number;
  requiredVolunteers?: number;
  equipmentNeeded: string[];
  
  // Partners
  partnerOrganizations: string[];
  sponsors: string[];
  governmentSchemeId?: string;
  
  // Status
  status: 'planned' | 'approved' | 'active' | 'completed' | 'cancelled';
  approvalStatus: string;
  approvedBy?: string;
  
  // Impact metrics
  actualBeneficiaries: number;
  servicesProvided?: Record<string, number>;
  feedbackScore?: number;
  
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string;
  createdByUser?: {
    userId: string;
    firstName: string;
    lastName: string;
  };
  
  // Stats (if included)
  stats?: {
    eventCount: number;
    totalRegistrations: number;
    totalAttendance: number;
    attendanceRate: number;
  };
}

export interface CSREvent {
  eventId: string;
  programId: string;
  
  // Event details
  eventName: string;
  eventDate: Date;
  startTime: string;
  endTime: string;
  
  // Capacity
  maxParticipants?: number;
  registeredCount: number;
  attendedCount: number;
  
  // Activities
  activities: Array<{
    name: string;
    duration: number;
    facilitator?: string;
    materials?: string[];
  }>;
  
  // Team assignment
  coordinatorId?: string;
  coordinator?: {
    userId: string;
    firstName: string;
    lastName: string;
  };
  teamMembers: string[];
  volunteers: string[];
  
  // Status
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  
  createdAt: Date;
}

export interface CSREventRegistration {
  registrationId: string;
  eventId: string;
  
  // Participant details
  participantName: string;
  age?: number;
  gender?: 'Male' | 'Female' | 'Other';
  phone?: string;
  email?: string;
  address?: string;
  
  // Medical info (for health camps)
  bloodGroup?: string;
  knownConditions: string[];
  currentMedications: string[];
  
  // Registration details
  registrationDate: Date;
  registrationNumber?: string;
  qrCode?: string;
  
  // Attendance
  checkedIn: boolean;
  checkInTime?: Date;
  servicesAvailed: Array<{
    service: string;
    provider: string;
    time: Date;
    notes?: string;
  }>;
  
  // Follow-up
  requiresFollowup: boolean;
  followupDate?: Date;
  followupNotes?: string;
  convertedToPatient: boolean;
  patientId?: string;
  
  // Source
  source?: string; // walk-in, online, phone, referral
  referredBy?: string;
}

export interface Volunteer {
  volunteerId: string;
  
  // Personal information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  
  // Professional background
  occupation?: string;
  organization?: string;
  skills: string[];
  languages: string[];
  
  // Availability
  availableDays: number[]; // 0=Sunday, 6=Saturday
  availableHours?: Record<string, { start: string; end: string }>;
  
  // Verification
  idVerified: boolean;
  backgroundCheckCompleted: boolean;
  trainingCompleted: boolean;
  
  // Activity tracking
  totalHours: number;
  eventsParticipated: number;
  rating?: number;
  badges: string[];
  
  // Status
  status: 'active' | 'inactive' | 'training' | 'suspended';
  
  joinedDate: Date;
  lastActiveDate?: Date;
}

// Form data types
export interface CSRProgramFormData {
  programName: string;
  programType: string;
  description?: string;
  objectives: string[];
  targetDemographic?: string;
  targetCount?: number;
  eligibilityCriteria?: Record<string, any>;
  startDate: string;
  endDate?: string;
  registrationDeadline?: string;
  venueType?: string;
  venueName?: string;
  venueAddress?: string;
  budget?: number;
  requiredStaff?: number;
  requiredVolunteers?: number;
  equipmentNeeded: string[];
  partnerOrganizations: string[];
  sponsors: string[];
  governmentSchemeId?: string;
}

export interface CSREventFormData {
  programId: string;
  eventName: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  maxParticipants?: number;
  activities: Array<{
    name: string;
    duration: number;
    facilitator?: string;
    materials?: string[];
  }>;
  coordinatorId?: string;
  teamMembers: string[];
  volunteers: string[];
}

export interface EventRegistrationFormData {
  eventId: string;
  participantName: string;
  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  bloodGroup?: string;
  knownConditions: string[];
  currentMedications: string[];
  source?: string;
  referredBy?: string;
}

export interface VolunteerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  occupation?: string;
  organization?: string;
  skills: string[];
  languages: string[];
  availableDays: number[];
  availableHours?: Record<string, { start: string; end: string }>;
}

// Analytics and reporting types
export interface CSRAnalytics {
  overview: {
    totalPrograms: number;
    activePrograms: number;
    completedPrograms: number;
    totalBeneficiaries: number;
    totalVolunteerHours: number;
    averageFeedbackScore: number;
  };
  programTypeDistribution: Array<{
    programType: string;
    count: number;
    beneficiaries: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    programsCompleted: number;
    beneficiariesReached: number;
    volunteerHours: number;
  }>;
  topPrograms: Array<{
    programId: string;
    programName: string;
    beneficiaries: number;
    feedbackScore: number;
    impact: string;
  }>;
  volunteerStats: {
    totalVolunteers: number;
    activeVolunteers: number;
    averageHoursPerVolunteer: number;
    retentionRate: number;
  };
}

export interface ImpactMetrics {
  programId: string;
  quantitative: {
    beneficiariesReached: number;
    servicesDelivered: Record<string, number>;
    costPerBeneficiary: number;
    geographicReach: number;
  };
  health: {
    conditionsDetected: Record<string, number>;
    referralsMade: number;
    emergencyCases: number;
    preventiveCareProvided: number;
  };
  social: {
    communityAwareness: number;
    behaviorChange: number;
    volunteerHours: number;
    partnershipsFormed: number;
  };
  economic: {
    valueOfServicesProvided: number;
    costSavingsToCommuity: number;
    employmentGenerated: number;
  };
}

// Event management types
export interface EventCheckIn {
  registrationId: string;
  checkInTime: Date;
  servicesAvailed: Array<{
    service: string;
    provider: string;
    notes?: string;
  }>;
}

export interface EventDashboard {
  eventId: string;
  eventName: string;
  eventDate: Date;
  status: string;
  registeredCount: number;
  checkedInCount: number;
  servicesProvided: Record<string, number>;
  realTimeMetrics: {
    currentAttendees: number;
    servicesInProgress: number;
    completedServices: number;
    averageServiceTime: number;
  };
}