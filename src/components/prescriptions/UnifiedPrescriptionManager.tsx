'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
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
  Clock,
  CheckCircle,
  AlertCircle,
  Printer,
  Send,
  Download,
  Plus,
  Edit,
  Eye,
  Shield,
  Activity,
  Users,
  Calendar,
  Building,
  CreditCard,
  Video,
  Phone,
  MessageSquare,
  Stethoscope,
  Lock,
  Unlock,
  Smartphone,
  QrCode,
  Key,
  ShieldCheck,
  AlertTriangle,
  Info,
  TrendingUp,
  Hash,
  User,
  MapPin,
  Heart,
  Timer,
  RefreshCw,
  Zap,
  Wifi,
  WifiOff,
  Monitor,
  Tablet,
  CheckSquare,
  XCircle,
} from 'lucide-react';

interface Prescription {
  prescriptionId: string;
  patientName: string;
  patientId: string;
  abhaNumber?: string;
  doctorName: string;
  doctorId: string;
  department: string;
  consultationType: 'in-person' | 'video' | 'audio' | 'chat' | 'phone';
  sessionId?: string; // For telemedicine
  prescriptionDate: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    quantity: number;
    refills?: number;
  }[];
  diagnosis: string;
  digitalSignature?: {
    signed: boolean;
    signatureType: 'e-sign' | 'digital-certificate' | 'otp' | 'biometric';
    timestamp?: string;
    verificationCode?: string;
    mciRegistration?: string;
  };
  status: 'draft' | 'pending' | 'signed' | 'dispensed' | 'completed' | 'expired';
  dispensingStatus?: 'pending' | 'partial' | 'complete';
  validUntil: string;
  followUpDate?: string;
  isControlled: boolean;
  requiresApproval?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  qrCode?: string; // For digital verification
  syncStatus?: 'synced' | 'pending' | 'offline';
}

const UnifiedPrescriptionManager: React.FC = () => {
  const searchParams = useSearchParams();
  const prescriptionType = searchParams.get('type'); // Get 'digital' if from telemedicine
  
  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState(prescriptionType === 'digital' ? 'digital' : 'all');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);

  // Update filter when URL param changes
  useEffect(() => {
    if (prescriptionType === 'digital') {
      setFilterType('digital');
    }
  }, [prescriptionType]);

  // Mock statistics
  const stats = {
    totalPrescriptions: 324,
    activePrescriptions: 156,
    pendingSignatures: 12,
    dispensedToday: 45,
    digitalPrescriptions: 89,
    inPersonPrescriptions: 235,
    controlledSubstances: 8,
    averageDispenseTime: 15, // minutes
    complianceRate: 94.5,
    eSignatureRate: 78,
  };

  // Mock prescriptions data
  const prescriptions: Prescription[] = [
    {
      prescriptionId: 'RX-2024-001',
      patientName: 'Rajesh Kumar',
      patientId: 'PAT-001',
      abhaNumber: '14-1234-5678-9012',
      doctorName: 'Dr. Priya Sharma',
      doctorId: 'DOC-001',
      department: 'Cardiology',
      consultationType: 'in-person',
      prescriptionDate: '2024-01-15',
      medications: [
        {
          name: 'Atorvastatin',
          dosage: '20mg',
          frequency: 'Once daily',
          duration: '30 days',
          instructions: 'Take at bedtime',
          quantity: 30,
          refills: 3,
        },
        {
          name: 'Aspirin',
          dosage: '75mg',
          frequency: 'Once daily',
          duration: '30 days',
          instructions: 'After breakfast',
          quantity: 30,
          refills: 3,
        },
      ],
      diagnosis: 'Hyperlipidemia',
      status: 'signed',
      dispensingStatus: 'pending',
      validUntil: '2024-02-15',
      followUpDate: '2024-02-10',
      isControlled: false,
    },
    {
      prescriptionId: 'RX-DIG-2024-001',
      patientName: 'Sunita Devi',
      patientId: 'PAT-002',
      abhaNumber: '14-2345-6789-0123',
      doctorName: 'Dr. Amit Verma',
      doctorId: 'DOC-002',
      department: 'General Medicine',
      consultationType: 'video',
      sessionId: 'VID-2024-001',
      prescriptionDate: '2024-01-15',
      medications: [
        {
          name: 'Paracetamol',
          dosage: '500mg',
          frequency: 'Three times daily',
          duration: '5 days',
          instructions: 'After meals',
          quantity: 15,
        },
        {
          name: 'Cetirizine',
          dosage: '10mg',
          frequency: 'Once daily',
          duration: '7 days',
          instructions: 'At night',
          quantity: 7,
        },
      ],
      diagnosis: 'Viral fever with allergic rhinitis',
      digitalSignature: {
        signed: true,
        signatureType: 'e-sign',
        timestamp: '2024-01-15T10:30:00',
        verificationCode: 'DIGI-VER-2024-001',
        mciRegistration: 'MCI-KA-12345',
      },
      status: 'signed',
      dispensingStatus: 'complete',
      validUntil: '2024-01-22',
      isControlled: false,
      qrCode: 'QR-RX-DIG-2024-001',
      syncStatus: 'synced',
    },
    {
      prescriptionId: 'RX-2024-002',
      patientName: 'Mohammed Ali',
      patientId: 'PAT-003',
      doctorName: 'Dr. Meera Patel',
      doctorId: 'DOC-003',
      department: 'Psychiatry',
      consultationType: 'in-person',
      prescriptionDate: '2024-01-15',
      medications: [
        {
          name: 'Alprazolam',
          dosage: '0.25mg',
          frequency: 'Twice daily',
          duration: '15 days',
          instructions: 'As directed',
          quantity: 30,
          refills: 0,
        },
      ],
      diagnosis: 'Anxiety disorder',
      status: 'pending',
      validUntil: '2024-01-30',
      isControlled: true,
      requiresApproval: true,
      approvalStatus: 'pending',
    },
    {
      prescriptionId: 'RX-DIG-2024-002',
      patientName: 'Geeta Iyer',
      patientId: 'PAT-004',
      doctorName: 'Dr. Ravi Kumar',
      doctorId: 'DOC-004',
      department: 'Dermatology',
      consultationType: 'video',
      sessionId: 'VID-2024-002',
      prescriptionDate: '2024-01-15',
      medications: [
        {
          name: 'Clotrimazole Cream',
          dosage: '1%',
          frequency: 'Twice daily',
          duration: '14 days',
          instructions: 'Apply to affected area',
          quantity: 1,
        },
      ],
      diagnosis: 'Fungal infection',
      digitalSignature: {
        signed: true,
        signatureType: 'digital-certificate',
        timestamp: '2024-01-15T14:00:00',
        verificationCode: 'DIGI-VER-2024-002',
        mciRegistration: 'MCI-KA-67890',
      },
      status: 'signed',
      dispensingStatus: 'pending',
      validUntil: '2024-01-29',
      isControlled: false,
      qrCode: 'QR-RX-DIG-2024-002',
      syncStatus: 'synced',
    },
    {
      prescriptionId: 'RX-DIG-2024-003',
      patientName: 'Vikram Singh',
      patientId: 'PAT-005',
      doctorName: 'Dr. Anjali Desai',
      doctorId: 'DOC-005',
      department: 'Pediatrics',
      consultationType: 'audio',
      sessionId: 'AUD-2024-001',
      prescriptionDate: '2024-01-15',
      medications: [
        {
          name: 'Amoxicillin Syrup',
          dosage: '250mg/5ml',
          frequency: 'Three times daily',
          duration: '7 days',
          instructions: 'Before meals',
          quantity: 1,
        },
      ],
      diagnosis: 'Upper respiratory tract infection',
      digitalSignature: {
        signed: false,
        signatureType: 'otp',
      },
      status: 'pending',
      validUntil: '2024-01-22',
      isControlled: false,
      syncStatus: 'pending',
    },
  ];

  // Filter prescriptions based on type
  const filteredPrescriptions = prescriptions.filter(rx => {
    if (filterType === 'all') return true;
    if (filterType === 'digital') {
      return ['video', 'audio', 'chat', 'phone'].includes(rx.consultationType);
    }
    if (filterType === 'in-person') {
      return rx.consultationType === 'in-person';
    }
    return true;
  });

  const tabs = [
    { id: 'active', label: 'Active', badge: stats.activePrescriptions, icon: Activity },
    { id: 'pending', label: 'Pending Signature', badge: stats.pendingSignatures, icon: Clock },
    { id: 'digital', label: 'Digital', badge: stats.digitalPrescriptions, icon: Monitor },
    { id: 'controlled', label: 'Controlled', badge: stats.controlledSubstances, icon: Lock },
    { id: 'dispensed', label: 'Dispensed Today', badge: stats.dispensedToday, icon: CheckCircle },
    { id: 'expired', label: 'Expired', icon: XCircle },
  ];

  const quickActions = [
    {
      label: 'New Prescription',
      icon: Plus,
      onClick: () => console.log('New prescription'),
      variant: 'primary' as const,
    },
    {
      label: 'E-Sign Pending',
      icon: Edit,
      onClick: () => console.log('Sign prescriptions'),
      variant: 'secondary' as const,
    },
    {
      label: 'Print Queue',
      icon: Printer,
      onClick: () => console.log('Print prescriptions'),
      variant: 'secondary' as const,
    },
    {
      label: 'Export',
      icon: Download,
      onClick: () => console.log('Export prescriptions'),
      variant: 'secondary' as const,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'signed':
        return <StandardBadge variant="success">Signed</StandardBadge>;
      case 'pending':
        return <StandardBadge variant="warning">Pending</StandardBadge>;
      case 'dispensed':
        return <StandardBadge variant="info">Dispensed</StandardBadge>;
      case 'completed':
        return <StandardBadge variant="secondary">Completed</StandardBadge>;
      case 'expired':
        return <StandardBadge variant="danger">Expired</StandardBadge>;
      default:
        return <StandardBadge variant="secondary">{status}</StandardBadge>;
    }
  };

  const getConsultationTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-blue-600" />;
      case 'audio':
        return <Phone className="w-4 h-4 text-green-600" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-gray-600" />;
      case 'in-person':
        return <Stethoscope className="w-4 h-4 text-gray-600" />;
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSignatureStatusIcon = (signature?: any) => {
    if (!signature) return null;
    if (signature.signed) {
      return <ShieldCheck className="w-4 h-4 text-green-600" />;
    }
    return <Shield className="w-4 h-4 text-orange-600" />;
  };

  return (
    <DashboardLayout
      title={prescriptionType === 'digital' ? 'Digital Prescriptions' : 'Prescription Management'}
      subtitle={prescriptionType === 'digital' 
        ? 'Manage digital prescriptions from telemedicine consultations'
        : 'Manage all prescriptions including digital and in-person'}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        prescriptionType === 'digital' && { label: 'Telemedicine', href: '/dashboard/telemedicine' },
        { label: 'Prescriptions' },
      ].filter(Boolean)}
      actions={
        <ButtonGroup>
          <StandardButton
            variant="secondary"
            icon={Printer}
            onClick={() => console.log('Print')}
          >
            Print Queue
          </StandardButton>
          <StandardButton
            variant="primary"
            icon={Plus}
            onClick={() => console.log('New prescription')}
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
            subtitle="This month"
          />
          <StandardMetricCard
            label={prescriptionType === 'digital' ? 'Digital Prescriptions' : 'Active Prescriptions'}
            value={prescriptionType === 'digital' ? stats.digitalPrescriptions : stats.activePrescriptions}
            icon={prescriptionType === 'digital' ? Monitor : Activity}
            color="success"
            subtitle={prescriptionType === 'digital' ? 'E-signed' : 'Valid prescriptions'}
          />
          <StandardMetricCard
            label="Pending Signatures"
            value={stats.pendingSignatures}
            icon={Clock}
            color="warning"
            subtitle="Awaiting e-sign"
          />
          <StandardMetricCard
            label={prescriptionType === 'digital' ? 'E-Signature Rate' : 'Compliance Rate'}
            value={`${prescriptionType === 'digital' ? stats.eSignatureRate : stats.complianceRate}%`}
            icon={prescriptionType === 'digital' ? Key : CheckCircle}
            color="info"
            trend={{ value: 2.5, direction: 'up' }}
          />
        </MetricsRow>
      </DashboardSection>

      {/* Secondary Metrics for Digital Prescriptions */}
      {prescriptionType === 'digital' && (
        <DashboardSection fullWidth>
          <MetricsRow columns={4}>
            <StandardMetricCard
              label="Video Consultations"
              value={45}
              icon={Video}
              color="secondary"
              subtitle="With prescriptions"
            />
            <StandardMetricCard
              label="QR Verified"
              value={67}
              icon={QrCode}
              color="success"
              subtitle="Secure verification"
            />
            <StandardMetricCard
              label="Digitally Secured"
              value={23}
              icon={Lock}
              color="info"
              subtitle="Encrypted & signed"
            />
            <StandardMetricCard
              label="Avg Processing"
              value="2.5 min"
              icon={Timer}
              color="primary"
              subtitle="E-prescription time"
            />
          </MetricsRow>
        </DashboardSection>
      )}

      {/* Main Content */}
      <ContentGrid
        sidebar={
          <div className="space-y-6">
            {/* Quick Actions */}
            <ActionCard
              title="Quick Actions"
              icon={Zap}
              actions={quickActions}
            />

            {/* Signature Status */}
            {prescriptionType === 'digital' && (
              <div className="card-base p-4">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-600" />
                  Digital Signatures
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">E-Sign</span>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Digital Certificate</span>
                    <span className="font-medium">30%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">OTP Verified</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Biometric</span>
                    <span className="font-medium">5%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Prescription Types */}
            <div className="card-base p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Pill className="w-5 h-5 text-green-600" />
                Prescription Types
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">In-Person</span>
                  <span className="font-medium">{stats.inPersonPrescriptions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Digital/Telemedicine</span>
                  <span className="font-medium">{stats.digitalPrescriptions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Controlled</span>
                  <span className="font-medium text-red-600">{stats.controlledSubstances}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Dispensed Today</span>
                  <span className="font-medium text-green-600">{stats.dispensedToday}</span>
                </div>
              </div>
            </div>

            {/* Compliance Status */}
            <StatsCard
              title="Compliance Rate"
              value={stats.complianceRate}
              total={100}
              unit="% compliant"
              icon={CheckCircle}
              color="success"
            />

            {/* System Alerts */}
            <AlertCard
              title="System Alerts"
              items={[
                {
                  id: '1',
                  label: 'Pending E-Signatures',
                  description: `${stats.pendingSignatures} prescriptions awaiting signature`,
                  type: 'warning',
                  action: () => setActiveTab('pending'),
                  actionLabel: 'Review',
                },
                {
                  id: '2',
                  label: 'Controlled Substances',
                  description: '2 prescriptions require approval',
                  type: 'error',
                  action: () => setActiveTab('controlled'),
                  actionLabel: 'Approve',
                },
                {
                  id: '3',
                  label: 'Digital Sync',
                  description: 'All digital prescriptions synced',
                  type: 'success',
                },
              ]}
            />
          </div>
        }
      >
        {/* Prescription Management Card */}
        <div className="card-base">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {prescriptionType === 'digital' ? 'Digital Prescriptions' : 'All Prescriptions'}
                </h2>
                <p className="text-sm text-gray-600">
                  {prescriptionType === 'digital' 
                    ? 'Manage e-prescriptions from telemedicine consultations'
                    : 'View and manage all prescription records'}
                </p>
              </div>
              <StandardButton variant="primary" icon={Plus} size="sm">
                New Prescription
              </StandardButton>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <StandardSearch
                placeholder="Search patient, doctor, medication..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="flex-1"
              />
              <StandardSelect
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'in-person', label: 'In-Person' },
                  { value: 'digital', label: 'Digital/Telemedicine' },
                ]}
                value={filterType}
                onChange={setFilterType}
                placeholder="Type"
              />
              <StandardSelect
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'signed', label: 'Signed' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'dispensed', label: 'Dispensed' },
                  { value: 'expired', label: 'Expired' },
                ]}
                value={filterStatus}
                onChange={setFilterStatus}
                placeholder="Status"
              />
            </div>
          </div>

          {/* Tabs */}
          <StandardTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          <div className="p-6">
            {(activeTab === 'active' || activeTab === 'pending' || activeTab === 'digital') && (
              <div className="space-y-4">
                {filteredPrescriptions
                  .filter(rx => {
                    if (activeTab === 'active') return rx.status === 'signed';
                    if (activeTab === 'pending') return rx.status === 'pending';
                    if (activeTab === 'digital') return rx.digitalSignature !== undefined;
                    return true;
                  })
                  .map((rx) => (
                    <QueueCard
                      key={rx.prescriptionId}
                      id={rx.prescriptionId}
                      patientName={rx.patientName}
                      doctorName={`${rx.doctorName} • ${rx.department}`}
                      details={`${rx.diagnosis} • ${rx.medications.length} medication(s)`}
                      time={`${rx.prescriptionDate} • Valid until ${rx.validUntil}`}
                      status={rx.status === 'signed' ? 'completed' : rx.status === 'pending' ? 'waiting' : 'cancelled'}
                      badge={
                        <div className="flex items-center gap-2">
                          {getConsultationTypeIcon(rx.consultationType)}
                          {getStatusBadge(rx.status)}
                          {rx.digitalSignature && getSignatureStatusIcon(rx.digitalSignature)}
                          {rx.isControlled && (
                            <StandardBadge variant="danger" size="sm">
                              <Lock className="w-3 h-3 mr-1" />
                              Controlled
                            </StandardBadge>
                          )}
                          {rx.qrCode && (
                            <QrCode className="w-4 h-4 text-blue-600" title="QR Verified" />
                          )}
                          {rx.syncStatus === 'synced' && (
                            <Wifi className="w-4 h-4 text-green-600" title="Synced" />
                          )}
                          {rx.syncStatus === 'offline' && (
                            <WifiOff className="w-4 h-4 text-red-600" title="Offline" />
                          )}
                        </div>
                      }
                      actions={[
                        {
                          label: 'View',
                          onClick: () => setSelectedPrescription(rx),
                          variant: 'primary',
                        },
                        rx.status === 'pending' && {
                          label: 'Sign',
                          onClick: () => console.log('Sign prescription'),
                          variant: 'secondary',
                        },
                        rx.status === 'signed' && {
                          label: 'Print',
                          onClick: () => console.log('Print prescription'),
                          variant: 'secondary',
                        },
                      ].filter(Boolean)}
                    />
                  ))}
              </div>
            )}

            {activeTab === 'controlled' && (
              <div className="space-y-4">
                {filteredPrescriptions
                  .filter(rx => rx.isControlled)
                  .map((rx) => (
                    <div key={rx.prescriptionId} className="border rounded-lg p-4 bg-red-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Lock className="w-4 h-4 text-red-600" />
                            <span className="font-semibold text-red-900">{rx.prescriptionId}</span>
                            {rx.requiresApproval && (
                              <StandardBadge variant="danger">Approval Required</StandardBadge>
                            )}
                          </div>
                          <div className="text-sm text-gray-700">
                            {rx.patientName} • {rx.doctorName}
                          </div>
                          <div className="text-sm font-medium mt-1">
                            {rx.medications[0]?.name} - {rx.medications[0]?.dosage}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {rx.approvalStatus === 'pending' && (
                            <>
                              <StandardButton variant="success" size="sm">
                                Approve
                              </StandardButton>
                              <StandardButton variant="danger" size="sm">
                                Reject
                              </StandardButton>
                            </>
                          )}
                          <StandardButton variant="secondary" size="sm">
                            View Details
                          </StandardButton>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}

            {activeTab === 'dispensed' && (
              <EmptyState
                icon={CheckCircle}
                title="Dispensed Prescriptions"
                description="View all prescriptions dispensed today"
                action={{
                  label: 'View Report',
                  onClick: () => console.log('View dispensing report'),
                }}
              />
            )}

            {activeTab === 'expired' && (
              <EmptyState
                icon={XCircle}
                title="Expired Prescriptions"
                description="View prescriptions that have passed their validity date"
                action={{
                  label: 'View All',
                  onClick: () => console.log('View expired prescriptions'),
                }}
              />
            )}
          </div>
        </div>
      </ContentGrid>
    </DashboardLayout>
  );
};

export default UnifiedPrescriptionManager;