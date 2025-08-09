# HMS Hospital Collaboration & Network Enhancement Plan

## Executive Summary

This document outlines the comprehensive plan to enhance hospital collaboration, doctor referral management, and network hospital modeling in the Hospital Management System (HMS). The current database schema has basic network infrastructure but lacks critical inter-hospital collaboration features.

## Current State Analysis

### Existing Infrastructure

#### ✅ **What's Already Implemented**

1. **Hospital Networks Table** (`hospitalNetworks`)
   - Multi-hospital network configuration
   - Network-level settings (shared records, inventory, billing)
   - Contact management and network metrics

2. **Network-Enabled Clinics** (`clinics`)
   - Hospitals can belong to networks via `networkId`
   - Government scheme registrations per hospital
   - Indian healthcare compliance fields

3. **Basic Referral System** (`consultations`)
   - Doctor-to-doctor referrals within hospital
   - Referral reason documentation
   - Follow-up instructions

4. **Department Structure** (`departments`)
   - Department-based organization
   - HOD (Head of Department) tracking
   - Service and equipment tracking

#### ❌ **Critical Gaps Identified**

1. **No Inter-Hospital Patient Transfers**
   - Cannot transfer patients between network hospitals
   - No transfer documentation or acceptance workflow
   - No bed availability checking across network

2. **Limited Referral Management**
   - Only intra-hospital referrals supported
   - No referral status tracking
   - No external hospital referrals
   - No referral outcomes or feedback

3. **No Multi-Hospital Doctor Support**
   - Doctors tied to single clinics only
   - No visiting consultant support
   - No cross-hospital scheduling

4. **Missing Collaboration Infrastructure**
   - No service agreements between hospitals
   - No resource sharing mechanisms
   - No cross-hospital billing/settlements
   - No shared service management

## Development Plan

### Phase 1: Core Collaboration Tables (Week 1)

#### 1.1 Patient Transfers Table
```sql
-- Table: network.patient_transfers
CREATE TABLE network.patient_transfers (
  transfer_id UUID PRIMARY KEY,
  patient_id UUID NOT NULL,
  
  -- Transfer hospitals
  source_clinic_id UUID NOT NULL,
  destination_clinic_id UUID NOT NULL,
  
  -- Transfer details
  transfer_type VARCHAR(50), -- Emergency, Planned, Specialist
  transfer_reason TEXT,
  clinical_summary TEXT,
  
  -- Medical information
  diagnosis_at_transfer TEXT[],
  vital_signs_at_transfer JSONB,
  medications_on_transfer JSONB,
  
  -- Status workflow
  transfer_status VARCHAR(50), -- Initiated, Accepted, In-Transit, Completed, Cancelled
  initiated_by UUID,
  initiated_at TIMESTAMP,
  accepted_by UUID,
  accepted_at TIMESTAMP,
  completed_at TIMESTAMP,
  
  -- Transportation
  transport_mode VARCHAR(50), -- Ambulance, Air, Private
  transport_provider VARCHAR(200),
  estimated_arrival TIMESTAMP,
  actual_arrival TIMESTAMP,
  
  -- Documentation
  transfer_documents JSONB, -- Array of document URLs/IDs
  handover_notes TEXT,
  receiving_doctor_id UUID,
  
  -- Bed allocation
  requested_department VARCHAR(100),
  allocated_bed_id UUID,
  
  -- Billing
  transfer_charges DECIMAL(10,2),
  billing_status VARCHAR(50),
  
  -- Standard fields
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 1.2 Referral Management Table
```sql
-- Table: network.referral_management
CREATE TABLE network.referral_management (
  referral_id UUID PRIMARY KEY,
  patient_id UUID NOT NULL,
  consultation_id UUID,
  
  -- Referral parties
  referring_doctor_id UUID NOT NULL,
  referring_clinic_id UUID NOT NULL,
  referred_to_doctor_id UUID,
  referred_to_clinic_id UUID,
  referred_to_department VARCHAR(100),
  
  -- Referral details
  referral_type VARCHAR(50), -- Internal, External, Emergency, Second-Opinion
  referral_priority VARCHAR(20), -- Urgent, High, Normal, Low
  referral_reason TEXT NOT NULL,
  clinical_notes TEXT,
  
  -- Medical information
  provisional_diagnosis TEXT[],
  icd10_codes VARCHAR(10)[],
  investigations_done JSONB,
  investigations_pending JSONB,
  current_medications JSONB,
  
  -- Status workflow
  referral_status VARCHAR(50), -- Initiated, Sent, Acknowledged, Accepted, Rejected, Completed, Expired
  status_reason TEXT,
  
  -- Timeline
  initiated_at TIMESTAMP DEFAULT NOW(),
  sent_at TIMESTAMP,
  acknowledged_at TIMESTAMP,
  accepted_at TIMESTAMP,
  appointment_date DATE,
  completed_at TIMESTAMP,
  expiry_date DATE,
  
  -- Response
  response_notes TEXT,
  treatment_provided TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_with VARCHAR(50), -- Referring, Referred, Both
  
  -- Documentation
  referral_letter_url TEXT,
  supporting_documents JSONB,
  response_letter_url TEXT,
  
  -- Billing
  referral_fee DECIMAL(10,2),
  fee_split_percentage DECIMAL(5,2),
  billing_status VARCHAR(50),
  
  -- Quality metrics
  patient_feedback_score INTEGER,
  outcome_status VARCHAR(50), -- Improved, Stable, Deteriorated
  
  -- Standard fields
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by UUID,
  updated_by UUID
);
```

#### 1.3 Network Doctors Table
```sql
-- Table: network.network_doctors
CREATE TABLE network.network_doctors (
  network_doctor_id UUID PRIMARY KEY,
  doctor_id UUID NOT NULL, -- References users table
  
  -- Network affiliations
  primary_clinic_id UUID NOT NULL,
  network_id UUID,
  
  -- Multi-hospital practice
  practicing_clinics UUID[], -- Array of clinic IDs
  visiting_consultant_at UUID[], -- Clinics where visiting
  
  -- Availability
  availability_schedule JSONB, -- Per clinic schedule
  consultation_modes VARCHAR(50)[], -- In-Person, Video, Phone
  
  -- Specialization across network
  network_role VARCHAR(100), -- Network Specialist, Visiting Consultant, Locum
  specialized_services TEXT[],
  
  -- Referral preferences
  accepts_referrals BOOLEAN DEFAULT true,
  referral_specialties TEXT[],
  preferred_referral_types VARCHAR(50)[],
  max_referrals_per_week INTEGER,
  
  -- Network credentials
  network_registration_number VARCHAR(100),
  network_privileges TEXT[],
  
  -- Performance metrics
  total_network_consultations INTEGER DEFAULT 0,
  total_referrals_received INTEGER DEFAULT 0,
  total_referrals_completed INTEGER DEFAULT 0,
  average_response_time_hours DECIMAL(5,2),
  patient_satisfaction_score DECIMAL(3,2),
  
  -- Standard fields
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Phase 2: Collaboration Features (Week 2)

#### 2.1 Collaboration Agreements Table
```sql
-- Table: collaboration.collaboration_agreements
CREATE TABLE collaboration.collaboration_agreements (
  agreement_id UUID PRIMARY KEY,
  
  -- Agreement parties
  clinic_a_id UUID NOT NULL,
  clinic_b_id UUID NOT NULL,
  network_id UUID,
  
  -- Agreement details
  agreement_type VARCHAR(100), -- Service-Sharing, Resource-Sharing, Referral, Training
  agreement_name VARCHAR(200),
  agreement_code VARCHAR(50) UNIQUE,
  
  -- Terms
  effective_from DATE NOT NULL,
  effective_to DATE,
  auto_renewal BOOLEAN DEFAULT false,
  renewal_period_months INTEGER,
  
  -- Services covered
  covered_services TEXT[],
  covered_departments VARCHAR(100)[],
  covered_procedures TEXT[],
  
  -- Financial terms
  payment_terms VARCHAR(100), -- Per-Service, Monthly, Quarterly, Revenue-Share
  revenue_share_percentage DECIMAL(5,2),
  minimum_guaranteed_amount DECIMAL(12,2),
  billing_cycle_days INTEGER DEFAULT 30,
  
  -- Service levels
  sla_response_time_hours INTEGER,
  sla_bed_allocation_priority VARCHAR(50),
  sla_report_sharing BOOLEAN DEFAULT true,
  
  -- Resource sharing
  shared_resources JSONB, -- Equipment, facilities, staff
  resource_booking_allowed BOOLEAN DEFAULT false,
  advance_booking_days INTEGER,
  
  -- Compliance
  regulatory_approvals JSONB,
  insurance_coverage JSONB,
  liability_terms TEXT,
  
  -- Performance tracking
  total_services_utilized INTEGER DEFAULT 0,
  total_revenue_generated DECIMAL(12,2) DEFAULT 0,
  last_settlement_date DATE,
  
  -- Status
  agreement_status VARCHAR(50), -- Draft, Active, Suspended, Expired, Terminated
  
  -- Standard fields
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  approved_by UUID,
  approved_at TIMESTAMP
);
```

#### 2.2 Shared Services Table
```sql
-- Table: collaboration.shared_services
CREATE TABLE collaboration.shared_services (
  shared_service_id UUID PRIMARY KEY,
  network_id UUID,
  
  -- Service details
  service_name VARCHAR(200) NOT NULL,
  service_type VARCHAR(100), -- Diagnostic, Specialist, Equipment, Facility
  service_category VARCHAR(100), -- Radiology, Pathology, Cardiology, etc.
  
  -- Location
  host_clinic_id UUID NOT NULL,
  department_id UUID,
  location_details TEXT,
  
  -- Availability
  available_to_clinics UUID[], -- Array of clinic IDs
  availability_schedule JSONB,
  advance_booking_required BOOLEAN DEFAULT true,
  min_advance_booking_hours INTEGER DEFAULT 24,
  
  -- Capacity
  daily_capacity INTEGER,
  current_utilization_percent DECIMAL(5,2),
  
  -- Specialists (if applicable)
  specialist_ids UUID[], -- Array of doctor IDs
  specialist_availability JSONB,
  
  -- Equipment (if applicable)
  equipment_details JSONB,
  maintenance_schedule JSONB,
  
  -- Pricing
  pricing_model VARCHAR(50), -- Fixed, Variable, Package
  base_price DECIMAL(10,2),
  network_discount_percent DECIMAL(5,2),
  external_price DECIMAL(10,2),
  
  -- Booking management
  booking_system VARCHAR(50), -- Centralized, Host-Managed, First-Come
  max_bookings_per_clinic_per_day INTEGER,
  
  -- Quality metrics
  average_wait_time_days DECIMAL(5,2),
  service_satisfaction_score DECIMAL(3,2),
  total_services_provided INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  -- Standard fields
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 2.3 Network Resources Table
```sql
-- Table: collaboration.network_resources
CREATE TABLE collaboration.network_resources (
  resource_id UUID PRIMARY KEY,
  network_id UUID,
  
  -- Resource identification
  resource_name VARCHAR(200) NOT NULL,
  resource_type VARCHAR(100), -- Equipment, Ambulance, BloodBank, ICU-Bed
  resource_category VARCHAR(100),
  resource_code VARCHAR(50) UNIQUE,
  
  -- Ownership
  owner_clinic_id UUID NOT NULL,
  managing_department_id UUID,
  
  -- Specifications
  specifications JSONB,
  capacity_details JSONB,
  
  -- Sharing configuration
  sharing_enabled BOOLEAN DEFAULT true,
  sharing_priority VARCHAR(50), -- Network-First, Owner-First, Equal
  available_to_clinics UUID[],
  
  -- Availability tracking
  current_status VARCHAR(50), -- Available, In-Use, Maintenance, Reserved
  current_user_clinic_id UUID,
  current_user_details JSONB,
  
  -- Booking system
  requires_booking BOOLEAN DEFAULT true,
  booking_lead_time_hours INTEGER DEFAULT 2,
  max_booking_duration_hours INTEGER,
  current_bookings JSONB,
  
  -- Usage tracking
  total_usage_hours DECIMAL(10,2) DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  utilization_rate_percent DECIMAL(5,2),
  
  -- Maintenance
  last_maintenance_date DATE,
  next_maintenance_date DATE,
  maintenance_provider VARCHAR(200),
  
  -- Cost sharing
  hourly_rate DECIMAL(10,2),
  maintenance_cost_sharing JSONB,
  
  -- Standard fields
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Phase 3: UI Implementation (Week 3-4)

#### 3.1 Network Dashboard Components

##### Network Overview Page
```typescript
// src/app/[locale]/(auth)/dashboard/network/page.tsx
- Hospital network map visualization
- Network statistics and metrics
- Active collaborations summary
- Resource utilization charts
- Referral flow visualization
- Financial performance across network
```

##### Key Features:
- **Network Map**: Interactive map showing all network hospitals
- **Collaboration Matrix**: Grid showing active agreements between hospitals
- **Resource Pool**: Available shared resources across network
- **Performance Metrics**: KPIs for network efficiency

#### 3.2 Referral Management Interface

##### Referral Dashboard
```typescript
// src/app/[locale]/(auth)/dashboard/referrals/page.tsx
- Incoming referrals queue
- Outgoing referrals tracking
- Referral status management
- Quick referral creation
```

##### Referral Workflow:
1. **Create Referral**: Search network doctors/hospitals, fill clinical details
2. **Send Referral**: Attach documents, set priority, send notification
3. **Track Status**: Real-time status updates, response tracking
4. **Complete Referral**: Outcome documentation, feedback collection

#### 3.3 Patient Transfer System

##### Transfer Management
```typescript
// src/app/[locale]/(auth)/dashboard/transfers/page.tsx
- Active transfers monitoring
- Transfer request creation
- Bed availability across network
- Transfer documentation
```

##### Transfer Workflow:
1. **Initiate Transfer**: Select destination, provide clinical summary
2. **Acceptance Process**: Destination reviews and accepts/rejects
3. **Transportation**: Arrange transport, track in transit
4. **Handover**: Complete documentation, bed allocation

### Phase 4: Advanced Features (Week 5-6)

#### 4.1 Collaborative Care Pathways

##### Features:
- **Multi-Hospital Treatment Plans**: Coordinated care across facilities
- **Shared Protocols**: Network-wide clinical protocols
- **Cross-Facility Follow-ups**: Seamless continuation of care
- **Integrated Medical Records**: Unified patient view across network

##### Implementation:
```typescript
// src/app/[locale]/(auth)/dashboard/care-pathways/page.tsx
- Create collaborative treatment plans
- Assign roles to different hospitals
- Track progress across facilities
- Coordinate appointments and procedures
```

#### 4.2 Network Analytics

##### Analytics Dashboard:
```typescript
// src/app/[locale]/(auth)/dashboard/network-analytics/page.tsx
- Referral pattern analysis
- Resource optimization suggestions
- Network performance scorecard
- Financial analytics
```

##### Key Metrics:
- **Referral Analytics**: Volume, acceptance rate, completion rate
- **Resource Utilization**: Equipment usage, specialist availability
- **Financial Performance**: Revenue sharing, cost optimization
- **Quality Metrics**: Patient outcomes, satisfaction scores

#### 4.3 Revenue Sharing System

##### Billing Integration:
```typescript
// src/app/[locale]/(auth)/dashboard/network-billing/page.tsx
- Cross-hospital service billing
- Revenue share calculations
- Settlement processing
- Financial reconciliation
```

##### Features:
- **Automated Billing**: Generate inter-hospital invoices
- **Revenue Distribution**: Calculate and distribute shared revenue
- **Settlement Tracking**: Monitor pending and completed settlements
- **Financial Reports**: Network-wide financial statements

## Implementation Timeline

### Week 1: Database Foundation
- [ ] Create network schema
- [ ] Implement patient_transfers table
- [ ] Implement referral_management table
- [ ] Implement network_doctors table
- [ ] Create migration scripts
- [ ] Test database relationships

### Week 2: Collaboration Infrastructure
- [ ] Create collaboration schema
- [ ] Implement collaboration_agreements table
- [ ] Implement shared_services table
- [ ] Implement network_resources table
- [ ] Set up indexes and constraints
- [ ] Create seed data for testing

### Week 3: Core UI Components
- [ ] Build Network Dashboard
- [ ] Create Referral Management interface
- [ ] Implement Patient Transfer system
- [ ] Add navigation menu items
- [ ] Create form components

### Week 4: Workflow Implementation
- [ ] Implement referral workflow
- [ ] Build transfer acceptance process
- [ ] Create notification system
- [ ] Add status tracking
- [ ] Implement document management

### Week 5: Advanced Features
- [ ] Build collaborative care pathways
- [ ] Create network analytics dashboard
- [ ] Implement resource booking system
- [ ] Add performance metrics
- [ ] Create reporting tools

### Week 6: Integration & Testing
- [ ] Integrate with existing billing system
- [ ] Implement revenue sharing calculations
- [ ] Create comprehensive test suite
- [ ] Performance optimization
- [ ] User acceptance testing

## Technical Considerations

### 1. Security & Privacy
- **Data Access Control**: Role-based access to network data
- **Patient Consent**: Track consent for data sharing
- **Audit Logging**: Comprehensive audit trail for all network operations
- **Encryption**: Encrypt sensitive data in transit and at rest

### 2. Performance Optimization
- **Database Indexes**: Create indexes on frequently queried fields
- **Caching Strategy**: Cache network configuration and agreements
- **Query Optimization**: Use materialized views for analytics
- **Async Processing**: Queue long-running operations

### 3. Integration Points
- **Existing Systems**: Integrate with current billing, appointments, EMR
- **External APIs**: Support for external hospital systems
- **Notification Services**: SMS, email, push notifications
- **Document Storage**: Integration with document management system

### 4. Compliance Requirements
- **Healthcare Regulations**: HIPAA, local healthcare laws
- **Data Residency**: Ensure data stays within required boundaries
- **Consent Management**: Track and manage patient consent
- **Audit Requirements**: Meet regulatory audit requirements

## Success Metrics

### Key Performance Indicators (KPIs)

1. **Collaboration Metrics**
   - Number of active inter-hospital referrals
   - Average referral acceptance rate (>80%)
   - Patient transfer success rate (>95%)
   - Network resource utilization (>70%)

2. **Operational Efficiency**
   - Reduction in referral processing time (50%)
   - Decrease in patient wait time for specialist care (30%)
   - Improvement in bed utilization across network (20%)

3. **Financial Performance**
   - Revenue from network collaborations
   - Cost savings from resource sharing (25%)
   - Settlement processing time (<7 days)

4. **Quality Outcomes**
   - Patient satisfaction with network services (>4.5/5)
   - Clinical outcome improvements
   - Reduction in readmission rates (15%)

## Risk Mitigation

### Identified Risks & Mitigation Strategies

1. **Data Security Risk**
   - **Mitigation**: Implement end-to-end encryption, regular security audits

2. **Integration Complexity**
   - **Mitigation**: Phased rollout, comprehensive testing, fallback mechanisms

3. **User Adoption**
   - **Mitigation**: Training programs, intuitive UI, change management

4. **Performance Impact**
   - **Mitigation**: Database optimization, caching, load balancing

5. **Regulatory Compliance**
   - **Mitigation**: Legal review, compliance checks, audit trails

## Conclusion

This comprehensive plan addresses the current gaps in hospital collaboration and network modeling within the HMS. By implementing these enhancements in a phased approach, the system will support sophisticated multi-hospital networks with seamless patient care coordination, resource sharing, and financial management.

The proposed architecture provides:
- **Scalability**: Support for large hospital networks
- **Flexibility**: Configurable collaboration agreements
- **Efficiency**: Streamlined workflows and automation
- **Compliance**: Built-in regulatory compliance features
- **Analytics**: Data-driven insights for network optimization

## Next Steps

1. **Review and Approval**: Stakeholder review of this plan
2. **Technical Design**: Detailed technical specifications
3. **Resource Allocation**: Team assignment and timeline confirmation
4. **Development Kickoff**: Begin Phase 1 implementation
5. **Regular Reviews**: Weekly progress reviews and adjustments

## Appendix

### A. Database Schema Diagrams
[To be added: ERD diagrams showing relationships]

### B. UI Mockups
[To be added: Wireframes and design mockups]

### C. API Specifications
[To be added: REST API endpoints for network operations]

### D. Sample Data Structures
[To be added: JSON examples for complex fields]

### E. Compliance Checklist
[To be added: Regulatory requirements checklist]

---

**Document Version**: 1.0
**Last Updated**: August 8, 2025
**Author**: HMS Development Team
**Status**: Draft - Pending Review