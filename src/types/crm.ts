// CRM (Customer Relationship Management) Types

export interface Lead {
  leadId: string;
  clinicId: string;
  
  // Lead information
  firstName?: string;
  lastName?: string;
  phone: string;
  email?: string;
  
  // Demographics
  ageRange?: string;
  gender?: 'Male' | 'Female' | 'Other';
  location?: string;
  
  // Lead source
  source: 'website' | 'referral' | 'event' | 'campaign' | 'walk_in' | 'social_media' | 'phone_inquiry';
  sourceDetails?: Record<string, any>;
  referringPatientId?: string;
  campaignId?: string;
  campaign?: {
    campaignId: string;
    campaignName: string;
    campaignType: string;
  };
  
  // Interest
  interestedServices: string[];
  healthConcerns: string[];
  preferredContactMethod?: string;
  
  // Lead scoring
  leadScore: number; // 0-100
  scoreFactors?: Record<string, number>;
  qualificationStatus?: string; // unqualified, qualified, nurturing, converted
  
  // Engagement
  lastContactDate?: Date;
  contactAttempts: number;
  engagementLevel?: 'cold' | 'warm' | 'hot' | 'active' | 'loyal';
  
  // Conversion
  converted: boolean;
  conversionDate?: Date;
  patientId?: string;
  firstAppointmentId?: string;
  
  // Assignment
  assignedTo?: string;
  assignedUser?: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  
  // Status
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  lostReason?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface CRMCampaign {
  campaignId: string;
  clinicId: string;
  
  // Campaign details
  campaignName: string;
  campaignType: 'awareness' | 'acquisition' | 'retention' | 'reactivation';
  objective?: string;
  
  // Target audience
  targetSegments: string[];
  targetCriteria?: Record<string, any>; // SQL-like conditions
  estimatedReach?: number;
  
  // Content
  messageTemplates: Array<{
    channel: string;
    templateId?: string;
    content: string;
  }>;
  creativeAssets: string[]; // URLs to images/videos
  
  // Schedule
  startDate: Date;
  endDate?: Date;
  scheduleType?: string; // immediate, scheduled, recurring
  recurrencePattern?: Record<string, any>;
  
  // Budget
  budgetAllocated?: number;
  budgetSpent: number;
  costPerAcquisition?: number;
  
  // Performance metrics
  sentCount: number;
  deliveredCount: number;
  openedCount: number;
  clickedCount: number;
  convertedCount: number;
  
  // Status
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  approvalStatus?: string;
  
  createdAt: Date;
  createdBy?: string;
  createdByUser?: {
    userId: string;
    firstName: string;
    lastName: string;
  };
  
  // Calculated metrics
  deliveryRate?: number;
  openRate?: number;
  clickRate?: number;
  conversionRate?: number;
  roi?: number;
}

export interface AutomationRule {
  ruleId: string;
  clinicId: string;
  
  // Rule definition
  ruleName: string;
  ruleType?: string; // trigger, condition, action
  description?: string;
  
  // Trigger configuration
  triggerEvent?: 'patient_registered' | 'appointment_booked' | 'consultation_completed' | 
                'prescription_issued' | 'bill_generated' | 'payment_received' | 'feedback_submitted';
  triggerConditions?: Record<string, any>;
  
  // Action configuration
  actionType?: string; // send_message, update_field, create_task
  actionConfig?: Record<string, any>;
  delayMinutes: number;
  
  // Execution
  isActive: boolean;
  priority: number;
  maxExecutionsPerPatient?: number;
  
  // Performance
  totalExecutions: number;
  successCount: number;
  lastExecutedAt?: Date;
  
  createdAt: Date;
  createdBy?: string;
}

export interface PatientSegment {
  segmentId: string;
  clinicId: string;
  
  // Segment definition
  segmentName: string;
  description?: string;
  
  // Criteria
  criteriaType?: 'static' | 'dynamic';
  criteriaDefinition?: Record<string, any>; // SQL-like conditions
  
  // Members
  memberCount: number;
  lastCalculatedAt?: Date;
  
  // Usage
  usedInCampaigns: number;
  
  // Status
  isActive: boolean;
  
  createdAt: Date;
  createdBy?: string;
}

// Form data types
export interface LeadFormData {
  firstName?: string;
  lastName?: string;
  phone: string;
  email?: string;
  ageRange?: string;
  gender?: string;
  location?: string;
  source: string;
  sourceDetails?: Record<string, any>;
  referringPatientId?: string;
  campaignId?: string;
  interestedServices: string[];
  healthConcerns: string[];
  preferredContactMethod?: string;
  assignedTo?: string;
}

export interface CampaignFormData {
  campaignName: string;
  campaignType: string;
  objective?: string;
  targetSegments: string[];
  targetCriteria?: Record<string, any>;
  estimatedReach?: number;
  messageTemplates: Array<{
    channel: string;
    templateId?: string;
    content: string;
  }>;
  creativeAssets: string[];
  startDate: string;
  endDate?: string;
  scheduleType?: string;
  recurrencePattern?: Record<string, any>;
  budgetAllocated?: number;
}

export interface AutomationRuleFormData {
  ruleName: string;
  ruleType?: string;
  description?: string;
  triggerEvent?: string;
  triggerConditions?: Record<string, any>;
  actionType?: string;
  actionConfig?: Record<string, any>;
  delayMinutes: number;
  isActive: boolean;
  priority: number;
  maxExecutionsPerPatient?: number;
}

export interface SegmentFormData {
  segmentName: string;
  description?: string;
  criteriaType?: 'static' | 'dynamic';
  criteriaDefinition?: Record<string, any>;
  isActive: boolean;
}

// Analytics types
export interface CRMAnalytics {
  overview: {
    totalLeads: number;
    qualifiedLeads: number;
    convertedLeads: number;
    conversionRate: number;
    averageLeadScore: number;
    totalCampaigns: number;
    activeCampaigns: number;
    totalROI: number;
  };
  leadsBySource: Array<{
    source: string;
    count: number;
    conversionRate: number;
    averageScore: number;
  }>;
  leadsByStatus: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  campaignPerformance: Array<{
    campaignId: string;
    campaignName: string;
    type: string;
    sentCount: number;
    deliveryRate: number;
    openRate: number;
    clickRate: number;
    conversionRate: number;
    roi: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    leadsGenerated: number;
    leadsConverted: number;
    campaignsLaunched: number;
    totalSpent: number;
    totalRevenue: number;
  }>;
  segmentPerformance: Array<{
    segmentId: string;
    segmentName: string;
    memberCount: number;
    campaignsUsed: number;
    averageEngagement: number;
  }>;
}

export interface LeadScoringFactors {
  demographic: {
    ageMatch: number;        // 0-20 points
    locationProximity: number; // 0-15 points
    insuranceCoverage: number; // 0-10 points
  };
  behavioral: {
    websiteEngagement: number; // 0-15 points
    contentConsumption: number; // 0-10 points
    responseRate: number;      // 0-10 points
  };
  intent: {
    servicesInquired: number;  // 0-10 points
    urgency: number;          // 0-5 points
    budgetIndication: number; // 0-5 points
  };
}

// Campaign workflow types
export interface CampaignWorkflow {
  workflowId: string;
  campaignId: string;
  name: string;
  trigger: string;
  steps: Array<{
    stepId: string;
    action: string;
    delay: number; // in minutes
    channel: string;
    template?: string;
    condition?: Record<string, any>;
  }>;
  isActive: boolean;
}

// Marketing automation workflow examples
export interface AutomationWorkflow {
  workflowId: string;
  name: string;
  trigger: {
    event: string;
    conditions?: Record<string, any>;
  };
  steps: Array<{
    action: 'send_message' | 'update_field' | 'create_task' | 'assign_user' | 'wait';
    delay?: number;
    channel?: string;
    template?: string;
    condition?: Record<string, any>;
    repeat?: {
      duration: string;
      interval: number;
    };
  }>;
}

// Lead nurturing types
export interface NurturingSequence {
  sequenceId: string;
  name: string;
  description?: string;
  targetSegment?: string;
  messages: Array<{
    messageId: string;
    dayFromStart: number;
    channel: 'whatsapp' | 'email' | 'sms';
    template: string;
    subject?: string;
    content: string;
    isActive: boolean;
  }>;
  isActive: boolean;
  performance: {
    enrollments: number;
    completions: number;
    conversions: number;
    completionRate: number;
    conversionRate: number;
  };
}

// Integration types for external systems
export interface LeadIntegration {
  integrationId: string;
  name: string;
  type: 'website_form' | 'facebook_ads' | 'google_ads' | 'whatsapp_business';
  config: Record<string, any>;
  isActive: boolean;
  lastSync?: Date;
  totalLeadsImported: number;
}

export interface CRMDashboardMetrics {
  today: {
    newLeads: number;
    qualifiedLeads: number;
    conversions: number;
    campaignsSent: number;
  };
  thisWeek: {
    leadsGenerated: number;
    conversionRate: number;
    averageLeadScore: number;
    topPerformingCampaign?: string;
  };
  thisMonth: {
    totalRevenue: number;
    costPerLead: number;
    leadToCustomerRate: number;
    roi: number;
  };
}

// Export types for TypeScript compatibility