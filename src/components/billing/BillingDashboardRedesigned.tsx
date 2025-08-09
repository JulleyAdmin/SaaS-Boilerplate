'use client';

import React, { useState, lazy, Suspense, useEffect } from 'react';
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
  DollarSign,
  CreditCard,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Receipt,
  Shield,
  Download,
  Send,
  Calculator,
  IndianRupee,
  Wallet,
  Building,
  UserCheck,
  AlertTriangle,
  Network,
  Video,
  Phone,
  MessageSquare,
  Monitor,
  Stethoscope,
  Users,
  Activity,
} from 'lucide-react';

// Lazy load NetworkBillingDashboard for better performance
const NetworkBillingDashboard = lazy(() => import('./NetworkBillingDashboard'));

interface Bill {
  id: string;
  patientName: string;
  patientId: string;
  amount: number;
  services: string;
  department: string;
  date: string;
  daysOverdue: number;
  paymentType: string;
  insuranceStatus: string | null;
  schemeApplicable: string | null;
  consultationType?: 'in-person' | 'video' | 'audio' | 'chat' | 'phone';
  sessionId?: string;
  doctorName?: string;
  duration?: number;
  abhaNumber?: string;
}

const BillingDashboardRedesigned: React.FC = () => {
  const searchParams = useSearchParams();
  const billingType = searchParams.get('type'); // Get 'telemedicine' if coming from telemedicine billing link
  
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterScheme, setFilterScheme] = useState('all');
  const [filterConsultationType, setFilterConsultationType] = useState(billingType === 'telemedicine' ? 'telemedicine' : 'all');

  // Update filter when URL param changes
  useEffect(() => {
    if (billingType === 'telemedicine') {
      setFilterConsultationType('telemedicine');
    }
  }, [billingType]);

  // Mock billing statistics (in INR) - enhanced with telemedicine data
  const stats = {
    todayRevenue: 245600,
    pendingBills: 42,
    pendingAmount: 892300,
    completedBills: 156,
    insuranceClaims: 23,
    governmentSchemes: 18,
    averageBillAmount: 5430,
    collectionRate: 87,
    // Telemedicine specific stats
    telemedicineRevenue: 48500,
    videoConsultations: 28,
    audioConsultations: 15,
    digitalPrescriptions: 38,
  };

  // Mock pending bills - enhanced with telemedicine entries
  const pendingBills: Bill[] = [
    {
      id: 'BILL-2024-001',
      patientName: 'Rajesh Kumar',
      patientId: 'P-12345',
      amount: 15500,
      services: 'Consultation, Lab Tests, Medicines',
      department: 'Cardiology',
      date: '2024-12-25',
      daysOverdue: 0,
      paymentType: 'Cash',
      insuranceStatus: null,
      schemeApplicable: null,
      consultationType: 'in-person',
      doctorName: 'Dr. Sharma',
    },
    {
      id: 'BILL-2024-002',
      patientName: 'Priya Sharma',
      patientId: 'P-12346',
      amount: 8200,
      services: 'Emergency Treatment',
      department: 'Emergency',
      date: '2024-12-24',
      daysOverdue: 1,
      paymentType: 'Insurance',
      insuranceStatus: 'pending_approval',
      schemeApplicable: null,
      consultationType: 'in-person',
    },
    {
      id: 'BILL-TEL-2024-001',
      patientName: 'Anita Desai',
      patientId: 'P-12349',
      amount: 800,
      services: 'Video Consultation',
      department: 'General Medicine',
      date: '2024-12-25',
      daysOverdue: 0,
      paymentType: 'UPI',
      insuranceStatus: null,
      schemeApplicable: null,
      consultationType: 'video',
      sessionId: 'VID-2024-001',
      doctorName: 'Dr. Verma',
      duration: 25,
      abhaNumber: '14-1234-5678-9012',
    },
    {
      id: 'BILL-2024-003',
      patientName: 'Mohammed Ali',
      patientId: 'P-12347',
      amount: 45000,
      services: 'Surgery, 3-day admission',
      department: 'Orthopedics',
      date: '2024-12-20',
      daysOverdue: 5,
      paymentType: 'PM-JAY',
      insuranceStatus: null,
      schemeApplicable: 'PM-JAY',
      consultationType: 'in-person',
    },
    {
      id: 'BILL-TEL-2024-002',
      patientName: 'Vikram Singh',
      patientId: 'P-12350',
      amount: 1200,
      services: 'Video Consultation - Specialist',
      department: 'Psychiatry',
      date: '2024-12-25',
      daysOverdue: 0,
      paymentType: 'Card',
      insuranceStatus: null,
      schemeApplicable: null,
      consultationType: 'video',
      sessionId: 'VID-2024-002',
      doctorName: 'Dr. Patel',
      duration: 45,
    },
    {
      id: 'BILL-2024-004',
      patientName: 'Sunita Rao',
      patientId: 'P-12348',
      amount: 3200,
      services: 'Consultation, Prescription',
      department: 'General Medicine',
      date: '2024-12-25',
      daysOverdue: 0,
      paymentType: 'UPI',
      insuranceStatus: null,
      schemeApplicable: null,
      consultationType: 'in-person',
    },
    {
      id: 'BILL-TEL-2024-003',
      patientName: 'Geeta Iyer',
      patientId: 'P-12351',
      amount: 500,
      services: 'Audio Consultation',
      department: 'General Medicine',
      date: '2024-12-25',
      daysOverdue: 0,
      paymentType: 'UPI',
      insuranceStatus: null,
      schemeApplicable: null,
      consultationType: 'audio',
      sessionId: 'AUD-2024-001',
      doctorName: 'Dr. Khan',
      duration: 15,
    },
  ];

  // Filter bills based on consultation type
  const filteredBills = pendingBills.filter(bill => {
    if (filterConsultationType === 'all') return true;
    if (filterConsultationType === 'telemedicine') {
      return ['video', 'audio', 'chat', 'phone'].includes(bill.consultationType || '');
    }
    if (filterConsultationType === 'in-person') {
      return bill.consultationType === 'in-person';
    }
    return true;
  });

  // Mock insurance claims
  const insuranceClaims = [
    {
      id: 'CLM-2024-001',
      patientName: 'Vikram Singh',
      insuranceProvider: 'Star Health',
      claimAmount: 125000,
      status: 'approved',
      submittedDate: '2024-12-15',
      approvalDate: '2024-12-23',
      consultationType: 'in-person' as const,
    },
    {
      id: 'CLM-2024-002',
      patientName: 'Meera Patel',
      insuranceProvider: 'ICICI Lombard',
      claimAmount: 67000,
      status: 'pending',
      submittedDate: '2024-12-20',
      approvalDate: null,
      consultationType: 'in-person' as const,
    },
    {
      id: 'CLM-TEL-2024-001',
      patientName: 'Ravi Kumar',
      insuranceProvider: 'HDFC ERGO',
      claimAmount: 800,
      status: 'approved',
      submittedDate: '2024-12-22',
      approvalDate: '2024-12-24',
      consultationType: 'video' as const,
    },
    {
      id: 'CLM-2024-003',
      patientName: 'Amit Verma',
      insuranceProvider: 'HDFC ERGO',
      claimAmount: 34500,
      status: 'rejected',
      submittedDate: '2024-12-18',
      approvalDate: null,
      consultationType: 'in-person' as const,
    },
  ];

  // Mock government schemes
  const governmentSchemes = [
    {
      name: 'PM-JAY',
      activePatients: 45,
      claimedAmount: 2340000,
      pendingClaims: 12,
      approvedClaims: 33,
      telemedicinePatients: 8,
    },
    {
      name: 'CGHS',
      activePatients: 28,
      claimedAmount: 1560000,
      pendingClaims: 8,
      approvedClaims: 20,
      telemedicinePatients: 5,
    },
    {
      name: 'ESI',
      activePatients: 15,
      claimedAmount: 890000,
      pendingClaims: 5,
      approvedClaims: 10,
      telemedicinePatients: 2,
    },
  ];

  const systemAlerts = [
    {
      id: '1',
      label: 'Overdue Payments',
      description: '12 bills overdue by more than 30 days',
      type: 'error' as const,
      action: () => console.log('View overdue'),
      actionLabel: 'View Bills',
    },
    {
      id: '2',
      label: 'Insurance Approvals',
      description: '5 insurance claims approved today',
      type: 'success' as const,
      action: () => console.log('View claims'),
      actionLabel: 'Process',
    },
    {
      id: '3',
      label: 'PM-JAY Verification',
      description: '8 patients pending ABHA verification',
      type: 'warning' as const,
      action: () => console.log('Verify'),
      actionLabel: 'Verify Now',
    },
    {
      id: '4',
      label: 'Telemedicine Billing',
      description: '3 video consultation bills pending',
      type: 'info' as const,
      action: () => setFilterConsultationType('telemedicine'),
      actionLabel: 'View',
    },
  ];

  const tabs = [
    { id: 'pending', label: 'Pending Bills', badge: stats.pendingBills, icon: Clock },
    { id: 'insurance', label: 'Insurance Claims', badge: stats.insuranceClaims, icon: Shield },
    { id: 'schemes', label: 'Govt Schemes', badge: stats.governmentSchemes, icon: Building },
    { id: 'telemedicine', label: 'Telemedicine', badge: stats.videoConsultations + stats.audioConsultations, icon: Video },
    { id: 'network', label: 'Network Billing', badge: 7, icon: Network },
    { id: 'completed', label: 'Completed', icon: CheckCircle },
  ];

  const quickActions = [
    {
      label: 'Generate Bill',
      icon: Receipt,
      onClick: () => console.log('Generate bill'),
      variant: 'primary' as const,
    },
    {
      label: 'Process Payment',
      icon: CreditCard,
      onClick: () => console.log('Process payment'),
      variant: 'secondary' as const,
    },
    {
      label: 'Submit Claim',
      icon: Send,
      onClick: () => console.log('Submit claim'),
      variant: 'secondary' as const,
    },
    {
      label: 'Reports',
      icon: FileText,
      onClick: () => console.log('Reports'),
      variant: 'secondary' as const,
    },
  ];

  const getPaymentTypeBadge = (type: string, scheme: string | null) => {
    if (scheme) {
      return <StandardBadge variant="info" size="sm">{scheme}</StandardBadge>;
    }
    switch (type) {
      case 'Cash':
        return <StandardBadge variant="success" size="sm">Cash</StandardBadge>;
      case 'UPI':
        return <StandardBadge variant="success" size="sm">UPI</StandardBadge>;
      case 'Insurance':
        return <StandardBadge variant="warning" size="sm">Insurance</StandardBadge>;
      case 'Card':
        return <StandardBadge variant="secondary" size="sm">Card</StandardBadge>;
      default:
        return <StandardBadge variant="secondary" size="sm">{type}</StandardBadge>;
    }
  };

  const getClaimStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <StandardBadge variant="success">Approved</StandardBadge>;
      case 'pending':
        return <StandardBadge variant="warning">Pending</StandardBadge>;
      case 'rejected':
        return <StandardBadge variant="danger">Rejected</StandardBadge>;
      default:
        return <StandardBadge variant="secondary">{status}</StandardBadge>;
    }
  };

  const getConsultationTypeIcon = (type?: string) => {
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

  const getConsultationTypeBadge = (type?: string) => {
    if (!type) return null;
    
    const badges: Record<string, JSX.Element> = {
      'video': <StandardBadge variant="info" size="sm">Video</StandardBadge>,
      'audio': <StandardBadge variant="success" size="sm">Audio</StandardBadge>,
      'chat': <StandardBadge variant="secondary" size="sm">Chat</StandardBadge>,
      'phone': <StandardBadge variant="warning" size="sm">Phone</StandardBadge>,
      'in-person': <StandardBadge variant="secondary" size="sm">In-Person</StandardBadge>,
    };
    
    return badges[type] || null;
  };

  return (
    <DashboardLayout
      title={billingType === 'telemedicine' ? 'Telemedicine Billing' : 'Billing & Insurance'}
      subtitle={billingType === 'telemedicine' 
        ? 'Manage telemedicine consultation billing and payments'
        : 'Manage hospital billing, insurance claims, and government schemes'}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        billingType === 'telemedicine' && { label: 'Telemedicine', href: '/dashboard/telemedicine' },
        { label: 'Billing' },
      ].filter(Boolean)}
      actions={
        <ButtonGroup>
          <StandardButton
            variant="secondary"
            icon={Download}
            onClick={() => console.log('Export')}
          >
            Export Report
          </StandardButton>
          <StandardButton
            variant="primary"
            icon={Receipt}
            onClick={() => console.log('New bill')}
          >
            Generate Bill
          </StandardButton>
        </ButtonGroup>
      }
    >
      {/* Key Metrics */}
      <DashboardSection fullWidth>
        <MetricsRow columns={4}>
          <StandardMetricCard
            label="Today's Revenue"
            value={`₹${stats.todayRevenue.toLocaleString()}`}
            icon={IndianRupee}
            color="primary"
            trend={{ value: 12, direction: 'up' }}
            subtitle={billingType === 'telemedicine' ? 'All consultations' : 'All services'}
          />
          <StandardMetricCard
            label="Pending Bills"
            value={stats.pendingBills}
            icon={Clock}
            color="warning"
            subtitle={`₹${stats.pendingAmount.toLocaleString()}`}
          />
          <StandardMetricCard
            label={billingType === 'telemedicine' ? 'Video Consultations' : 'Insurance Claims'}
            value={billingType === 'telemedicine' ? stats.videoConsultations : stats.insuranceClaims}
            icon={billingType === 'telemedicine' ? Video : Shield}
            color="info"
            subtitle={billingType === 'telemedicine' ? 'Today' : 'Active claims'}
          />
          <StandardMetricCard
            label={billingType === 'telemedicine' ? 'Digital Prescriptions' : 'Collection Rate'}
            value={billingType === 'telemedicine' ? stats.digitalPrescriptions : `${stats.collectionRate}%`}
            icon={billingType === 'telemedicine' ? FileText : TrendingUp}
            color="success"
            trend={billingType !== 'telemedicine' ? { value: 3, direction: 'up' } : undefined}
          />
        </MetricsRow>
      </DashboardSection>

      {/* Secondary Metrics for Telemedicine */}
      {billingType === 'telemedicine' && (
        <DashboardSection fullWidth>
          <MetricsRow columns={4}>
            <StandardMetricCard
              label="Telemedicine Revenue"
              value={`₹${stats.telemedicineRevenue.toLocaleString()}`}
              icon={DollarSign}
              color="primary"
              subtitle="Today's earnings"
            />
            <StandardMetricCard
              label="Audio Consultations"
              value={stats.audioConsultations}
              icon={Phone}
              color="secondary"
              subtitle="Today"
            />
            <StandardMetricCard
              label="Average Bill"
              value={`₹${Math.round(stats.telemedicineRevenue / (stats.videoConsultations + stats.audioConsultations))}`}
              icon={Calculator}
              color="info"
              subtitle="Per consultation"
            />
            <StandardMetricCard
              label="Collection Rate"
              value={`${stats.collectionRate}%`}
              icon={TrendingUp}
              color="success"
              trend={{ value: 2, direction: 'up' }}
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
              icon={CreditCard}
              actions={quickActions}
            />

            {/* System Alerts */}
            <AlertCard title="System Alerts" items={systemAlerts} />

            {/* Stats Card */}
            <StatsCard
              title="Collection Status"
              value={stats.collectionRate}
              total={100}
              unit="% collected"
              icon={TrendingUp}
              color="success"
            />

            {/* Today's Summary */}
            <div className="card-base p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                Today's Activity
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed Bills</span>
                  <span className="font-medium">{stats.completedBills}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Video Consultations</span>
                  <span className="font-medium">{stats.videoConsultations}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Audio Consultations</span>
                  <span className="font-medium">{stats.audioConsultations}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Insurance Claims</span>
                  <span className="font-medium text-blue-600">{stats.insuranceClaims}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Govt Schemes</span>
                  <span className="font-medium text-green-600">{stats.governmentSchemes}</span>
                </div>
              </div>
            </div>
          </div>
        }
      >
        {/* Billing Management Card */}
        <div className="card-base">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Billing Management</h2>
                <p className="text-sm text-gray-600">
                  {billingType === 'telemedicine' 
                    ? 'Manage telemedicine consultation billing'
                    : 'Process bills, insurance claims, and government schemes'}
                </p>
              </div>
              <StandardButton variant="primary" icon={Receipt} size="sm">
                New Bill
              </StandardButton>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <StandardSearch
                placeholder="Search patient name, bill ID, or amount..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="flex-1"
              />
              <StandardSelect
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'in-person', label: 'In-Person' },
                  { value: 'telemedicine', label: 'Telemedicine' },
                ]}
                value={filterConsultationType}
                onChange={setFilterConsultationType}
                placeholder="Consultation Type"
              />
              <StandardSelect
                options={[
                  { value: 'all', label: 'All Schemes' },
                  { value: 'PM-JAY', label: 'PM-JAY' },
                  { value: 'CGHS', label: 'CGHS' },
                  { value: 'ESI', label: 'ESI' },
                  { value: 'insurance', label: 'Insurance' },
                ]}
                value={filterScheme}
                onChange={setFilterScheme}
                placeholder="Payment Type"
              />
            </div>
          </div>

          {/* Tabs */}
          <StandardTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'pending' && (
              <div className="space-y-4">
                {filteredBills.map((bill) => (
                  <QueueCard
                    key={bill.id}
                    id={bill.id}
                    patientName={bill.patientName}
                    doctorName={`${bill.department}${bill.doctorName ? ` • ${bill.doctorName}` : ''}`}
                    details={`${bill.services} • ₹${bill.amount.toLocaleString()}`}
                    time={`${bill.date}${bill.daysOverdue > 0 ? ` • ${bill.daysOverdue} days overdue` : ''}`}
                    status={bill.daysOverdue > 0 ? 'overdue' : 'pending'}
                    badge={
                      <div className="flex items-center gap-2">
                        {getConsultationTypeIcon(bill.consultationType)}
                        {getConsultationTypeBadge(bill.consultationType)}
                        {getPaymentTypeBadge(bill.paymentType, bill.schemeApplicable)}
                        {bill.insuranceStatus === 'pending_approval' && (
                          <StandardBadge variant="warning" size="sm">
                            <Shield className="w-3 h-3 mr-1" />
                            Insurance Pending
                          </StandardBadge>
                        )}
                        {bill.sessionId && (
                          <span className="text-xs text-gray-500">{bill.sessionId}</span>
                        )}
                        {bill.abhaNumber && (
                          <StandardBadge variant="info" size="sm">ABHA</StandardBadge>
                        )}
                      </div>
                    }
                    actions={[
                      {
                        label: 'Process Payment',
                        onClick: () => console.log('Process', bill.id),
                        variant: 'primary',
                      },
                      {
                        label: 'View Details',
                        onClick: () => console.log('View', bill.id),
                        variant: 'secondary',
                      },
                    ]}
                  />
                ))}
              </div>
            )}

            {activeTab === 'telemedicine' && (
              <div className="space-y-4">
                {pendingBills
                  .filter(bill => ['video', 'audio', 'chat', 'phone'].includes(bill.consultationType || ''))
                  .map((bill) => (
                    <QueueCard
                      key={bill.id}
                      id={bill.id}
                      patientName={`${bill.patientName} ${bill.abhaNumber ? '• ABHA' : ''}`}
                      doctorName={`${bill.doctorName} • ${bill.department}`}
                      details={`${bill.services} • ₹${bill.amount.toLocaleString()} • ${bill.duration} min`}
                      time={`${bill.date} • Session: ${bill.sessionId}`}
                      status="pending"
                      badge={
                        <div className="flex items-center gap-2">
                          {getConsultationTypeIcon(bill.consultationType)}
                          {getConsultationTypeBadge(bill.consultationType)}
                          {getPaymentTypeBadge(bill.paymentType, bill.schemeApplicable)}
                        </div>
                      }
                      actions={[
                        {
                          label: 'Process Payment',
                          onClick: () => console.log('Process', bill.id),
                          variant: 'primary',
                        },
                        {
                          label: 'Send Invoice',
                          onClick: () => console.log('Send invoice', bill.id),
                          variant: 'secondary',
                        },
                      ]}
                    />
                  ))}
              </div>
            )}

            {activeTab === 'insurance' && (
              <div className="space-y-4">
                {insuranceClaims.map((claim) => (
                  <div key={claim.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{claim.id}</span>
                          {getClaimStatusBadge(claim.status)}
                          {getConsultationTypeIcon(claim.consultationType)}
                        </div>
                        <div className="text-sm text-gray-600">
                          {claim.patientName} • {claim.insuranceProvider}
                        </div>
                        <div className="text-sm font-medium mt-1">
                          Claim Amount: ₹{claim.claimAmount.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Submitted: {claim.submittedDate}
                          {claim.approvalDate && ` • Approved: ${claim.approvalDate}`}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <StandardButton variant="secondary" size="sm">
                          View Details
                        </StandardButton>
                        {claim.status === 'pending' && (
                          <StandardButton variant="primary" size="sm">
                            Follow Up
                          </StandardButton>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'schemes' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {governmentSchemes.map((scheme) => (
                  <div key={scheme.name} className="card-base p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{scheme.name}</h3>
                      <Building className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Patients</span>
                        <span className="font-medium">{scheme.activePatients}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Telemedicine</span>
                        <span className="font-medium">{scheme.telemedicinePatients}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Claimed Amount</span>
                        <span className="font-medium">₹{(scheme.claimedAmount / 100000).toFixed(1)}L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pending Claims</span>
                        <span className="font-medium text-orange-600">{scheme.pendingClaims}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Approved</span>
                        <span className="font-medium text-green-600">{scheme.approvedClaims}</span>
                      </div>
                    </div>
                    <StandardButton variant="secondary" size="sm" className="w-full mt-3">
                      View Details
                    </StandardButton>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'network' && (
              <Suspense fallback={<div className="text-center py-8">Loading network billing...</div>}>
                <NetworkBillingDashboard />
              </Suspense>
            )}

            {activeTab === 'completed' && (
              <EmptyState
                icon={CheckCircle}
                title="Completed Bills"
                description="View all processed and completed billing transactions"
                action={{
                  label: 'View History',
                  onClick: () => console.log('View history'),
                }}
              />
            )}
          </div>
        </div>
      </ContentGrid>
    </DashboardLayout>
  );
};

export default BillingDashboardRedesigned;