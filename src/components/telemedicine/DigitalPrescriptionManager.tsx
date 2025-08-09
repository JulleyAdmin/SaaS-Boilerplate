'use client';

import React, { useState, useEffect } from 'react';
import {
  DashboardLayout,
  MetricsRow,
  ContentGrid,
  DashboardSection,
} from '@/components/dashboard/DashboardLayout';
import {
  StandardMetricCard,
  ActionCard,
  AlertCard,
  QueueCard,
  StatsCard,
} from '@/components/dashboard/StandardCards';
import {
  StandardButton,
  ButtonGroup,
  StandardTabs,
  StandardBadge,
  EmptyState,
  StandardSearch,
  StandardSelect,
} from '@/components/dashboard/StandardUI';
import {
  Pill,
  FileText,
  Calendar,
  Clock,
  User,
  Plus,
  Edit,
  Eye,
  Download,
  Send,
  Signature,
  Shield,
  CheckCircle,
  AlertCircle,
  XCircle,
  Search,
  Filter,
  Printer,
  Share,
  History,
  Stethoscope,
  Phone,
  Video,
  Mail,
  Globe,
  Building,
  MapPin,
  Hash,
  Users,
  Activity,
  CreditCard,
  Package,
  Tablet,
  Smartphone,
  Monitor,
  QrCode,
  Lock,
  Unlock,
  RefreshCcw,
  Star,
  Bookmark,
} from 'lucide-react';

interface DigitalPrescription {
  prescriptionId: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientId: string;
  abhaNumber?: string;
  doctorName: string;
  doctorRegNo: string;
  mciNumber: string;
  specialty: string;
  consultationType: 'Video' | 'Audio' | 'Chat' | 'Phone' | 'In-Person';
  sessionId?: string;
  prescriptionDate: string;
  validUntil: string;
  medications: Medication[];
  diagnosis: string;
  symptoms: string;
  instructions: string;
  followUpDate?: string;
  status: 'draft' | 'issued' | 'dispensed' | 'partially-dispensed' | 'cancelled';
  digitalSignature: {
    signed: boolean;
    signedAt?: string;
    signatureMethod: 'esign' | 'digital-certificate' | 'otp' | 'biometric';
    verificationStatus: 'verified' | 'pending' | 'failed';
  };
  pharmacyDispensing: {
    pharmacyName?: string;
    pharmacistName?: string;
    dispensedAt?: string;
    dispensedItems: number;
    totalItems: number;
  };
  compliance: {
    mciCompliant: boolean;
    telePrescriptionValid: boolean;
    controlledSubstances: boolean;
    requiresPhysicalConsultation: boolean;
  };
  communicationMethod: 'sms' | 'email' | 'whatsapp' | 'patient-portal' | 'printed';
  qrCode: string;
  prescriptionHash: string;
}

interface Medication {
  id: string;
  name: string;
  genericName?: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  quantity: number;
  unit: string;
  category: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'ointment' | 'drops' | 'inhaler';
  brandPreference: 'any' | 'specific' | 'generic-only';
  priceRange: {
    min: number;
    max: number;
  };
  controlledSubstance: boolean;
  substituteAllowed: boolean;
  criticalMedication: boolean;
  dispensed: number;
  pharmacyNotes?: string;
}

const DigitalPrescriptionManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState<DigitalPrescription | null>(null);
  const [showNewPrescription, setShowNewPrescription] = useState(false);

  // Mock prescription statistics
  const stats = {
    totalPrescriptions: 342,
    todayPrescriptions: 28,
    pendingSignature: 5,
    awaitingDispensing: 12,
    digitalSignedToday: 25,
    complianceRate: 98.2,
    averageProcessingTime: 4.5,
    patientSatisfaction: 4.7,
  };

  // Mock active prescriptions
  const activePrescriptions: DigitalPrescription[] = [
    {
      prescriptionId: 'RX-TEL-2024-001',
      patientName: 'Rajesh Kumar',
      patientAge: 45,
      patientGender: 'Male',
      patientId: 'PAT-001',
      abhaNumber: '14-1234-5678-9012',
      doctorName: 'Dr. Priya Sharma',
      doctorRegNo: 'KAR/2015/45678',
      mciNumber: 'MCI-12345',
      specialty: 'Cardiology',
      consultationType: 'Video',
      sessionId: 'VID-2024-001',
      prescriptionDate: '2024-01-15',
      validUntil: '2024-02-15',
      diagnosis: 'Hypertension, Grade II',
      symptoms: 'Chest discomfort, headache, occasional dizziness',
      instructions: 'Monitor BP twice daily. Avoid excessive salt. Light exercise recommended.',
      followUpDate: '2024-01-30',
      status: 'issued',
      medications: [
        {
          id: 'MED-001',
          name: 'Amlodipine',
          genericName: 'Amlodipine Besylate',
          dosage: '5mg',
          frequency: 'Once daily',
          duration: '30 days',
          instructions: 'Take in the morning after breakfast',
          quantity: 30,
          unit: 'tablet',
          category: 'tablet',
          brandPreference: 'any',
          priceRange: { min: 45, max: 80 },
          controlledSubstance: false,
          substituteAllowed: true,
          criticalMedication: true,
          dispensed: 0,
        },
        {
          id: 'MED-002',
          name: 'Atorvastatin',
          genericName: 'Atorvastatin Calcium',
          dosage: '20mg',
          frequency: 'Once daily at bedtime',
          duration: '30 days',
          instructions: 'Take after dinner',
          quantity: 30,
          unit: 'tablet',
          category: 'tablet',
          brandPreference: 'generic-only',
          priceRange: { min: 120, max: 180 },
          controlledSubstance: false,
          substituteAllowed: true,
          criticalMedication: false,
          dispensed: 0,
        },
      ],
      digitalSignature: {
        signed: true,
        signedAt: '2024-01-15T14:35:00',
        signatureMethod: 'esign',
        verificationStatus: 'verified',
      },
      pharmacyDispensing: {
        dispensedItems: 0,
        totalItems: 2,
      },
      compliance: {
        mciCompliant: true,
        telePrescriptionValid: true,
        controlledSubstances: false,
        requiresPhysicalConsultation: false,
      },
      communicationMethod: 'whatsapp',
      qrCode: 'QR-RX-TEL-2024-001',
      prescriptionHash: 'SHA256-HASH-EXAMPLE',
    },
    {
      prescriptionId: 'RX-TEL-2024-002',
      patientName: 'Sunita Devi',
      patientAge: 62,
      patientGender: 'Female',
      patientId: 'PAT-002',
      abhaNumber: '14-2345-6789-0123',
      doctorName: 'Dr. Amit Verma',
      doctorRegNo: 'KAR/2018/67890',
      mciNumber: 'MCI-23456',
      specialty: 'General Medicine',
      consultationType: 'Video',
      sessionId: 'VID-2024-002',
      prescriptionDate: '2024-01-15',
      validUntil: '2024-02-15',
      diagnosis: 'Type 2 Diabetes Mellitus, well controlled',
      symptoms: 'Routine diabetes management follow-up',
      instructions: 'Continue current medication regimen. Monitor blood sugar levels.',
      status: 'draft',
      medications: [
        {
          id: 'MED-003',
          name: 'Metformin',
          genericName: 'Metformin Hydrochloride',
          dosage: '500mg',
          frequency: 'Twice daily',
          duration: '30 days',
          instructions: 'Take with meals to reduce GI upset',
          quantity: 60,
          unit: 'tablet',
          category: 'tablet',
          brandPreference: 'any',
          priceRange: { min: 25, max: 45 },
          controlledSubstance: false,
          substituteAllowed: true,
          criticalMedication: true,
          dispensed: 0,
        },
      ],
      digitalSignature: {
        signed: false,
        signatureMethod: 'esign',
        verificationStatus: 'pending',
      },
      pharmacyDispensing: {
        dispensedItems: 0,
        totalItems: 1,
      },
      compliance: {
        mciCompliant: true,
        telePrescriptionValid: true,
        controlledSubstances: false,
        requiresPhysicalConsultation: false,
      },
      communicationMethod: 'sms',
      qrCode: 'QR-RX-TEL-2024-002',
      prescriptionHash: 'SHA256-HASH-EXAMPLE-2',
    },
  ];

  const tabs = [
    { id: 'active', label: 'Active Prescriptions', badge: stats.todayPrescriptions, icon: FileText },
    { id: 'pending', label: 'Pending Signature', badge: stats.pendingSignature, icon: Signature },
    { id: 'dispensing', label: 'For Dispensing', badge: stats.awaitingDispensing, icon: Package },
    { id: 'history', label: 'History', icon: History },
    { id: 'analytics', label: 'Analytics', icon: Activity },
  ];

  const quickActions = [
    {
      label: 'New Prescription',
      icon: Plus,
      onClick: () => setShowNewPrescription(true),
      variant: 'primary' as const,
    },
    {
      label: 'Quick Refill',
      icon: RefreshCcw,
      onClick: () => console.log('Quick refill'),
      variant: 'secondary' as const,
    },
    {
      label: 'Bulk Sign',
      icon: Signature,
      onClick: () => console.log('Bulk sign'),
      variant: 'secondary' as const,
    },
    {
      label: 'Compliance Report',
      icon: Shield,
      onClick: () => console.log('Compliance report'),
      variant: 'secondary' as const,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'issued':
        return <StandardBadge variant="success">Issued</StandardBadge>;
      case 'draft':
        return <StandardBadge variant="warning">Draft</StandardBadge>;
      case 'dispensed':
        return <StandardBadge variant="info">Dispensed</StandardBadge>;
      case 'partially-dispensed':
        return <StandardBadge variant="secondary">Partial</StandardBadge>;
      case 'cancelled':
        return <StandardBadge variant="danger">Cancelled</StandardBadge>;
      default:
        return <StandardBadge variant="secondary">{status}</StandardBadge>;
    }
  };

  const getSignatureStatusIcon = (signature: DigitalPrescription['digitalSignature']) => {
    if (signature.signed && signature.verificationStatus === 'verified') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    } else if (signature.verificationStatus === 'pending') {
      return <Clock className="w-4 h-4 text-orange-500" />;
    } else if (signature.verificationStatus === 'failed') {
      return <XCircle className="w-4 h-4 text-red-500" />;
    }
    return <AlertCircle className="w-4 h-4 text-gray-500" />;
  };

  const getConsultationTypeIcon = (type: string) => {
    switch (type) {
      case 'Video':
        return <Video className="w-4 h-4" />;
      case 'Audio':
        return <Phone className="w-4 h-4" />;
      case 'Chat':
        return <FileText className="w-4 h-4" />;
      case 'Phone':
        return <Phone className="w-4 h-4" />;
      default:
        return <Stethoscope className="w-4 h-4" />;
    }
  };

  return (
    <DashboardLayout
      title="Digital Prescription Management"
      subtitle="Manage telemedicine prescriptions with digital signatures and compliance tracking"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Telemedicine', href: '/dashboard/telemedicine' },
        { label: 'Digital Prescriptions' },
      ]}
      actions={
        <ButtonGroup>
          <StandardButton
            variant="secondary"
            icon={Download}
            onClick={() => console.log('Export report')}
          >
            Export Report
          </StandardButton>
          <StandardButton
            variant="primary"
            icon={Plus}
            onClick={() => setShowNewPrescription(true)}
          >
            New Prescription
          </StandardButton>
        </ButtonGroup>
      }
    >
      {/* Key Metrics */}
      <DashboardSection fullWidth>
        <MetricsRow columns={4}>
          <StandardMetricCard
            label="Total Prescriptions"
            value={stats.totalPrescriptions}
            icon={FileText}
            color="primary"
            trend={{ value: 12, direction: 'up' }}
            subtitle="This month"
          />
          <StandardMetricCard
            label="Today's Prescriptions"
            value={stats.todayPrescriptions}
            icon={Plus}
            color="success"
            subtitle="New prescriptions"
          />
          <StandardMetricCard
            label="Digital Signed"
            value={stats.digitalSignedToday}
            icon={Signature}
            color="info"
            subtitle="Today's signatures"
          />
          <StandardMetricCard
            label="Compliance Rate"
            value={`${stats.complianceRate}%`}
            icon={Shield}
            color="secondary"
            trend={{ value: 0.5, direction: 'up' }}
          />
        </MetricsRow>
      </DashboardSection>

      {/* Processing Metrics */}
      <DashboardSection fullWidth>
        <MetricsRow columns={4}>
          <StandardMetricCard
            label="Pending Signature"
            value={stats.pendingSignature}
            icon={Clock}
            color="warning"
            subtitle="Awaiting doctor signature"
          />
          <StandardMetricCard
            label="Awaiting Dispensing"
            value={stats.awaitingDispensing}
            icon={Package}
            color="info"
            subtitle="Ready for pharmacy"
          />
          <StandardMetricCard
            label="Avg Processing Time"
            value={`${stats.averageProcessingTime}min`}
            icon={Activity}
            color="secondary"
            subtitle="From draft to issued"
          />
          <StandardMetricCard
            label="Patient Satisfaction"
            value={stats.patientSatisfaction}
            icon={Star}
            color="success"
            subtitle="Out of 5.0"
          />
        </MetricsRow>
      </DashboardSection>

      {/* Main Content */}
      <ContentGrid
        sidebar={
          <div className="space-y-6">
            {/* Quick Actions */}
            <ActionCard
              title="Prescription Actions"
              icon={Pill}
              actions={quickActions}
            />

            {/* Compliance Status */}
            <StatsCard
              title="MCI Compliance"
              value={98.2}
              total={100}
              unit="% compliant"
              icon={Shield}
              color="success"
            />

            {/* Today's Activity */}
            <div className="card-base p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Today's Activity
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Video Prescriptions</span>
                  <span className="font-medium">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Audio Prescriptions</span>
                  <span className="font-medium">10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Digital Signatures</span>
                  <span className="font-medium">25</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Pharmacy Notifications</span>
                  <span className="font-medium text-blue-600">12</span>
                </div>
              </div>
            </div>

            {/* Communication Methods */}
            <div className="card-base p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Send className="w-5 h-5 text-green-600" />
                Communication Channels
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">WhatsApp</span>
                  <span className="font-medium text-green-600">65%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">SMS</span>
                  <span className="font-medium text-blue-600">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Email</span>
                  <span className="font-medium text-purple-600">8%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Patient Portal</span>
                  <span className="font-medium text-gray-600">2%</span>
                </div>
              </div>
            </div>
          </div>
        }
      >
        {/* Prescription Management Card */}
        <div className="card-base">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Digital Prescriptions</h2>
                <p className="text-sm text-gray-600">Manage prescriptions with digital signatures and compliance</p>
              </div>
              <StandardButton variant="primary" icon={Plus} size="sm">
                New Prescription
              </StandardButton>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <StandardSearch
                placeholder="Search patient name, prescription ID, or medication..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="flex-1"
              />
              <StandardSelect
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'draft', label: 'Draft' },
                  { value: 'issued', label: 'Issued' },
                  { value: 'dispensed', label: 'Dispensed' },
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
                value={filterStatus}
                onChange={setFilterStatus}
                placeholder="Filter Status"
              />
            </div>
          </div>

          {/* Tabs */}
          <StandardTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'active' && (
              <div className="space-y-4">
                {activePrescriptions.map((prescription) => (
                  <div key={prescription.prescriptionId} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">
                            {prescription.prescriptionId}
                          </span>
                          {getStatusBadge(prescription.status)}
                          {getSignatureStatusIcon(prescription.digitalSignature)}
                          {getConsultationTypeIcon(prescription.consultationType)}
                          {prescription.compliance.mciCompliant && (
                            <StandardBadge variant="success" size="sm">
                              MCI Compliant
                            </StandardBadge>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {prescription.patientName} ({prescription.patientAge}y, {prescription.patientGender})
                            </div>
                            {prescription.abhaNumber && (
                              <div className="text-xs text-gray-600">ABHA: {prescription.abhaNumber}</div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{prescription.doctorName}</div>
                            <div className="text-xs text-gray-600">{prescription.specialty} • {prescription.doctorRegNo}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {prescription.prescriptionDate}
                            </div>
                            <div className="text-xs text-gray-600">
                              Valid until: {prescription.validUntil}
                            </div>
                          </div>
                        </div>

                        <div className="mb-3">
                          <div className="text-sm font-medium text-gray-900 mb-1">Diagnosis</div>
                          <div className="text-sm text-gray-600">{prescription.diagnosis}</div>
                        </div>

                        <div className="mb-3">
                          <div className="text-sm font-medium text-gray-900 mb-2">
                            Medications ({prescription.medications.length})
                          </div>
                          <div className="space-y-2">
                            {prescription.medications.map((medication) => (
                              <div key={medication.id} className="bg-gray-50 rounded p-3">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="font-medium text-sm">{medication.name}</div>
                                  <div className="flex items-center gap-2">
                                    {medication.criticalMedication && (
                                      <AlertCircle className="w-4 h-4 text-red-500" />
                                    )}
                                    {medication.substituteAllowed && (
                                      <StandardBadge variant="info" size="sm">Substitutable</StandardBadge>
                                    )}
                                  </div>
                                </div>
                                <div className="text-xs text-gray-600">
                                  {medication.dosage} • {medication.frequency} • {medication.duration} • Qty: {medication.quantity}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {medication.instructions}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  Price Range: ₹{medication.priceRange.min} - ₹{medication.priceRange.max}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <QrCode className="w-3 h-3" />
                            <span>QR: {prescription.qrCode}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            <span>Hash: {prescription.prescriptionHash.substring(0, 16)}...</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Send className="w-3 h-3" />
                            <span className="capitalize">{prescription.communicationMethod}</span>
                          </div>
                        </div>
                      </div>

                      <div className="ml-4 flex flex-col gap-2">
                        <StandardButton
                          variant="primary"
                          size="sm"
                          icon={Eye}
                          onClick={() => setSelectedPrescription(prescription)}
                        >
                          View
                        </StandardButton>
                        {prescription.status === 'draft' && (
                          <StandardButton
                            variant="secondary"
                            size="sm"
                            icon={Signature}
                            onClick={() => console.log('Sign prescription')}
                          >
                            Sign
                          </StandardButton>
                        )}
                        <StandardButton
                          variant="secondary"
                          size="sm"
                          icon={Download}
                          onClick={() => console.log('Download prescription')}
                        >
                          Download
                        </StandardButton>
                        <StandardButton
                          variant="secondary"
                          size="sm"
                          icon={Share}
                          onClick={() => console.log('Send to patient')}
                        >
                          Send
                        </StandardButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'pending' && (
              <EmptyState
                icon={Signature}
                title="Prescriptions Awaiting Signature"
                description="Digital prescriptions pending doctor's electronic signature"
                action={{
                  label: 'Sign Pending',
                  onClick: () => console.log('Sign pending prescriptions'),
                }}
              />
            )}

            {activeTab === 'dispensing' && (
              <EmptyState
                icon={Package}
                title="Prescriptions for Dispensing"
                description="Signed prescriptions ready for pharmacy dispensing"
                action={{
                  label: 'Notify Pharmacies',
                  onClick: () => console.log('Notify pharmacies'),
                }}
              />
            )}

            {activeTab === 'history' && (
              <EmptyState
                icon={History}
                title="Prescription History"
                description="View past prescriptions and dispensing records"
                action={{
                  label: 'View All History',
                  onClick: () => console.log('View history'),
                }}
              />
            )}

            {activeTab === 'analytics' && (
              <EmptyState
                icon={Activity}
                title="Prescription Analytics"
                description="Analyze prescription patterns, compliance, and performance metrics"
                action={{
                  label: 'View Analytics',
                  onClick: () => console.log('View analytics'),
                }}
              />
            )}
          </div>
        </div>
      </ContentGrid>
    </DashboardLayout>
  );
};

export default DigitalPrescriptionManager;