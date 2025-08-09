'use client';

import React, { useState } from 'react';
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
  CreditCard,
  DollarSign,
  Receipt,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Plus,
  Download,
  Upload,
  Send,
  Eye,
  Edit,
  Printer,
  RefreshCcw,
  Calendar,
  User,
  Users,
  Building,
  Shield,
  Phone,
  Video,
  MessageSquare,
  Activity,
  PieChart,
  BarChart3,
  Filter,
  Settings,
  IndianRupee,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Hash,
  Globe,
  MapPin,
  Info,
  Star,
  Zap,
  Bell,
} from 'lucide-react';

interface TelemedicineBill {
  billId: string;
  patientName: string;
  patientId: string;
  abhaNumber?: string;
  consultationType: 'video' | 'audio' | 'chat' | 'phone';
  sessionId: string;
  doctorName: string;
  doctorSpecialty: string;
  consultationDate: string;
  consultationDuration: number; // in minutes
  billingCategory: 'consultation' | 'follow-up' | 'emergency' | 'specialist';
  charges: {
    consultationFee: number;
    platformFee: number;
    gst: number;
    discount: number;
    total: number;
  };
  paymentStatus: 'pending' | 'paid' | 'partial' | 'failed' | 'refunded';
  paymentMethod?: 'upi' | 'card' | 'netbanking' | 'wallet' | 'insurance' | 'government-scheme';
  insuranceProvider?: string;
  insuranceClaim?: {
    claimId: string;
    status: 'pending' | 'approved' | 'rejected' | 'processing';
    amount: number;
  };
  governmentScheme?: 'pm-jay' | 'cghs' | 'esis' | 'state-scheme';
  schemeDetails?: {
    schemeId: string;
    coverage: number;
    copay: number;
  };
  invoiceGenerated: boolean;
  invoiceNumber?: string;
  receiptUrl?: string;
  notes?: string;
}

const TelemedicineBilling: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('today');
  const [selectedBill, setSelectedBill] = useState<TelemedicineBill | null>(null);

  // Mock billing statistics
  const stats = {
    totalRevenue: 284500,
    todayRevenue: 18750,
    pendingPayments: 32450,
    totalConsultations: 156,
    averageConsultationFee: 750,
    insuranceClaims: 45,
    governmentSchemePatients: 28,
    collectionRate: 92.5,
  };

  // Mock billing data
  const bills: TelemedicineBill[] = [
    {
      billId: 'TBILL-2024-001',
      patientName: 'Rajesh Kumar',
      patientId: 'PAT-001',
      abhaNumber: '14-1234-5678-9012',
      consultationType: 'video',
      sessionId: 'VID-2024-001',
      doctorName: 'Dr. Priya Sharma',
      doctorSpecialty: 'Cardiology',
      consultationDate: '2024-01-15',
      consultationDuration: 25,
      billingCategory: 'consultation',
      charges: {
        consultationFee: 800,
        platformFee: 50,
        gst: 153,
        discount: 0,
        total: 1003,
      },
      paymentStatus: 'paid',
      paymentMethod: 'upi',
      invoiceGenerated: true,
      invoiceNumber: 'INV-TEL-2024-001',
      receiptUrl: '/receipts/TBILL-2024-001.pdf',
    },
    {
      billId: 'TBILL-2024-002',
      patientName: 'Sunita Devi',
      patientId: 'PAT-002',
      abhaNumber: '14-2345-6789-0123',
      consultationType: 'video',
      sessionId: 'VID-2024-002',
      doctorName: 'Dr. Amit Verma',
      doctorSpecialty: 'General Medicine',
      consultationDate: '2024-01-15',
      consultationDuration: 15,
      billingCategory: 'follow-up',
      charges: {
        consultationFee: 500,
        platformFee: 30,
        gst: 95.4,
        discount: 100,
        total: 525.4,
      },
      paymentStatus: 'pending',
      insuranceProvider: 'Star Health Insurance',
      insuranceClaim: {
        claimId: 'CLM-2024-045',
        status: 'processing',
        amount: 525.4,
      },
      invoiceGenerated: false,
    },
    {
      billId: 'TBILL-2024-003',
      patientName: 'Mohammad Ali',
      patientId: 'PAT-003',
      consultationType: 'audio',
      sessionId: 'AUD-2024-003',
      doctorName: 'Dr. Meera Patel',
      doctorSpecialty: 'Psychiatry',
      consultationDate: '2024-01-15',
      consultationDuration: 45,
      billingCategory: 'specialist',
      charges: {
        consultationFee: 1200,
        platformFee: 75,
        gst: 229.5,
        discount: 0,
        total: 1504.5,
      },
      paymentStatus: 'partial',
      paymentMethod: 'government-scheme',
      governmentScheme: 'pm-jay',
      schemeDetails: {
        schemeId: 'PMJAY-KA-2024-123',
        coverage: 1000,
        copay: 504.5,
      },
      invoiceGenerated: true,
      invoiceNumber: 'INV-TEL-2024-003',
      notes: 'Partial payment through PM-JAY, copay pending',
    },
  ];

  const tabs = [
    { id: 'pending', label: 'Pending Payments', badge: 12, icon: Clock },
    { id: 'paid', label: 'Paid', badge: 45, icon: CheckCircle },
    { id: 'insurance', label: 'Insurance Claims', badge: 8, icon: Shield },
    { id: 'government', label: 'Government Schemes', badge: 5, icon: Building },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const quickActions = [
    {
      label: 'Generate Invoice',
      icon: FileText,
      onClick: () => console.log('Generate invoice'),
      variant: 'primary' as const,
    },
    {
      label: 'Process Refund',
      icon: RefreshCcw,
      onClick: () => console.log('Process refund'),
      variant: 'secondary' as const,
    },
    {
      label: 'Export Report',
      icon: Download,
      onClick: () => console.log('Export report'),
      variant: 'secondary' as const,
    },
    {
      label: 'Settings',
      icon: Settings,
      onClick: () => console.log('Billing settings'),
      variant: 'secondary' as const,
    },
  ];

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <StandardBadge variant="success">Paid</StandardBadge>;
      case 'pending':
        return <StandardBadge variant="warning">Pending</StandardBadge>;
      case 'partial':
        return <StandardBadge variant="secondary">Partial</StandardBadge>;
      case 'failed':
        return <StandardBadge variant="danger">Failed</StandardBadge>;
      case 'refunded':
        return <StandardBadge variant="info">Refunded</StandardBadge>;
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
      default:
        return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <DashboardLayout
      title="Telemedicine Billing"
      subtitle="Manage billing, payments, and insurance claims for telemedicine consultations"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Telemedicine', href: '/dashboard/telemedicine' },
        { label: 'Billing' },
      ]}
      actions={
        <ButtonGroup>
          <StandardButton
            variant="secondary"
            icon={Download}
            onClick={() => console.log('Export billing report')}
          >
            Export Report
          </StandardButton>
          <StandardButton
            variant="primary"
            icon={Plus}
            onClick={() => console.log('Create bill')}
          >
            Create Bill
          </StandardButton>
        </ButtonGroup>
      }
    >
      {/* Revenue Metrics */}
      <DashboardSection fullWidth>
        <MetricsRow columns={4}>
          <StandardMetricCard
            label="Total Revenue"
            value={`₹${stats.totalRevenue.toLocaleString()}`}
            icon={IndianRupee}
            color="primary"
            trend={{ value: 12, direction: 'up' }}
            subtitle="This month"
          />
          <StandardMetricCard
            label="Today's Revenue"
            value={`₹${stats.todayRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="success"
            subtitle="From 28 consultations"
          />
          <StandardMetricCard
            label="Pending Payments"
            value={`₹${stats.pendingPayments.toLocaleString()}`}
            icon={Clock}
            color="warning"
            subtitle="12 invoices pending"
          />
          <StandardMetricCard
            label="Collection Rate"
            value={`${stats.collectionRate}%`}
            icon={TrendingUp}
            color="info"
            trend={{ value: 3.5, direction: 'up' }}
          />
        </MetricsRow>
      </DashboardSection>

      {/* Consultation Metrics */}
      <DashboardSection fullWidth>
        <MetricsRow columns={4}>
          <StandardMetricCard
            label="Total Consultations"
            value={stats.totalConsultations}
            icon={Users}
            color="secondary"
            subtitle="This month"
          />
          <StandardMetricCard
            label="Avg Consultation Fee"
            value={`₹${stats.averageConsultationFee}`}
            icon={Receipt}
            color="info"
            subtitle="Per session"
          />
          <StandardMetricCard
            label="Insurance Claims"
            value={stats.insuranceClaims}
            icon={Shield}
            color="secondary"
            subtitle="Being processed"
          />
          <StandardMetricCard
            label="Govt Scheme Patients"
            value={stats.governmentSchemePatients}
            icon={Building}
            color="success"
            subtitle="PM-JAY, CGHS, ESI"
          />
        </MetricsRow>
      </DashboardSection>

      {/* Main Content */}
      <ContentGrid
        sidebar={
          <div className="space-y-6">
            {/* Quick Actions */}
            <ActionCard
              title="Billing Actions"
              icon={CreditCard}
              actions={quickActions}
            />

            {/* Payment Methods */}
            <div className="card-base p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-600" />
                Payment Methods
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">UPI</span>
                  <span className="font-medium">45%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Cards</span>
                  <span className="font-medium">25%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Net Banking</span>
                  <span className="font-medium">15%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Insurance</span>
                  <span className="font-medium">10%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Govt Schemes</span>
                  <span className="font-medium">5%</span>
                </div>
              </div>
            </div>

            {/* Today's Summary */}
            <div className="card-base p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                Today's Summary
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Video Consultations</span>
                  <span className="font-medium">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Audio Consultations</span>
                  <span className="font-medium">10</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Invoices Generated</span>
                  <span className="font-medium">25</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Payments Received</span>
                  <span className="font-medium text-green-600">22</span>
                </div>
              </div>
            </div>

            {/* Collection Status */}
            <StatsCard
              title="Collection Status"
              value={92.5}
              total={100}
              unit="% collected"
              icon={TrendingUp}
              color="success"
            />
          </div>
        }
      >
        {/* Billing Management Card */}
        <div className="card-base">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Telemedicine Billing Management</h2>
                <p className="text-sm text-gray-600">Track and manage consultation billing and payments</p>
              </div>
              <StandardButton variant="primary" icon={Plus} size="sm">
                Generate Invoice
              </StandardButton>
            </div>

            {/* Filters */}
            <div className="flex gap-3">
              <StandardSearch
                placeholder="Search patient name, bill ID, or session..."
                value={searchQuery}
                onChange={setSearchQuery}
                className="flex-1"
              />
              <StandardSelect
                options={[
                  { value: 'all', label: 'All Status' },
                  { value: 'paid', label: 'Paid' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'partial', label: 'Partial' },
                  { value: 'failed', label: 'Failed' },
                ]}
                value={filterStatus}
                onChange={setFilterStatus}
                placeholder="Payment Status"
              />
              <StandardSelect
                options={[
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'This Week' },
                  { value: 'month', label: 'This Month' },
                  { value: 'custom', label: 'Custom Range' },
                ]}
                value={filterPeriod}
                onChange={setFilterPeriod}
                placeholder="Period"
              />
            </div>
          </div>

          {/* Tabs */}
          <StandardTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'pending' && (
              <div className="space-y-4">
                {bills.filter(b => b.paymentStatus === 'pending' || b.paymentStatus === 'partial').map((bill) => (
                  <div key={bill.billId} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{bill.billId}</span>
                          {getPaymentStatusBadge(bill.paymentStatus)}
                          {getConsultationTypeIcon(bill.consultationType)}
                          {bill.governmentScheme && (
                            <StandardBadge variant="info" size="sm">
                              {bill.governmentScheme.toUpperCase()}
                            </StandardBadge>
                          )}
                          {bill.insuranceProvider && (
                            <StandardBadge variant="secondary" size="sm">
                              Insurance
                            </StandardBadge>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{bill.patientName}</div>
                            <div className="text-xs text-gray-600">Patient ID: {bill.patientId}</div>
                            {bill.abhaNumber && (
                              <div className="text-xs text-gray-600">ABHA: {bill.abhaNumber}</div>
                            )}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{bill.doctorName}</div>
                            <div className="text-xs text-gray-600">{bill.doctorSpecialty}</div>
                            <div className="text-xs text-gray-500">Session: {bill.sessionId}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              ₹{bill.charges.total.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-600">
                              Consultation: ₹{bill.charges.consultationFee}
                            </div>
                            <div className="text-xs text-gray-500">
                              Duration: {bill.consultationDuration} min
                            </div>
                          </div>
                        </div>

                        {bill.insuranceClaim && (
                          <div className="bg-blue-50 rounded p-2 mb-2">
                            <div className="text-sm">
                              <span className="font-medium text-blue-900">Insurance Claim: </span>
                              <span className="text-blue-700">{bill.insuranceClaim.claimId}</span>
                              <StandardBadge variant="info" size="sm" className="ml-2">
                                {bill.insuranceClaim.status}
                              </StandardBadge>
                            </div>
                          </div>
                        )}

                        {bill.schemeDetails && (
                          <div className="bg-green-50 rounded p-2 mb-2">
                            <div className="text-sm text-green-900">
                              Coverage: ₹{bill.schemeDetails.coverage} | Copay: ₹{bill.schemeDetails.copay}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>{bill.consultationDate}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{bill.consultationDuration} minutes</span>
                          </div>
                          {bill.invoiceNumber && (
                            <div className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              <span>{bill.invoiceNumber}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="ml-4 flex flex-col gap-2">
                        <StandardButton
                          variant="primary"
                          size="sm"
                          icon={Eye}
                          onClick={() => setSelectedBill(bill)}
                        >
                          View
                        </StandardButton>
                        {!bill.invoiceGenerated && (
                          <StandardButton
                            variant="secondary"
                            size="sm"
                            icon={FileText}
                            onClick={() => console.log('Generate invoice')}
                          >
                            Invoice
                          </StandardButton>
                        )}
                        <StandardButton
                          variant="secondary"
                          size="sm"
                          icon={Send}
                          onClick={() => console.log('Send reminder')}
                        >
                          Remind
                        </StandardButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'paid' && (
              <div className="space-y-4">
                {bills.filter(b => b.paymentStatus === 'paid').map((bill) => (
                  <div key={bill.billId} className="border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-900">{bill.billId}</span>
                          {getPaymentStatusBadge(bill.paymentStatus)}
                          {getConsultationTypeIcon(bill.consultationType)}
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <div className="text-sm">{bill.patientName}</div>
                            <div className="text-xs text-gray-600">{bill.consultationDate}</div>
                          </div>
                          <div>
                            <div className="text-sm">{bill.doctorName}</div>
                            <div className="text-xs text-gray-600">{bill.doctorSpecialty}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium">₹{bill.charges.total}</div>
                            <div className="text-xs text-gray-600">{bill.paymentMethod}</div>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 flex gap-2">
                        <StandardButton
                          variant="secondary"
                          size="sm"
                          icon={Download}
                          onClick={() => console.log('Download receipt')}
                        >
                          Receipt
                        </StandardButton>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'insurance' && (
              <EmptyState
                icon={Shield}
                title="Insurance Claims Management"
                description="Track and manage insurance claims for telemedicine consultations"
                action={{
                  label: 'View All Claims',
                  onClick: () => console.log('View insurance claims'),
                }}
              />
            )}

            {activeTab === 'government' && (
              <EmptyState
                icon={Building}
                title="Government Scheme Billing"
                description="Manage billing for PM-JAY, CGHS, ESI, and state schemes"
                action={{
                  label: 'View Scheme Patients',
                  onClick: () => console.log('View government scheme patients'),
                }}
              />
            )}

            {activeTab === 'reports' && (
              <EmptyState
                icon={BarChart3}
                title="Billing Reports & Analytics"
                description="Generate detailed reports and analyze billing trends"
                action={{
                  label: 'Generate Report',
                  onClick: () => console.log('Generate billing report'),
                }}
              />
            )}
          </div>
        </div>
      </ContentGrid>
    </DashboardLayout>
  );
};

export default TelemedicineBilling;