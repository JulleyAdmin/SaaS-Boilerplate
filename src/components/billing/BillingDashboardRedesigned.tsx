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
} from 'lucide-react';

const BillingDashboardRedesigned: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterScheme, setFilterScheme] = useState('all');

  // Mock billing statistics (in INR)
  const stats = {
    todayRevenue: 245600,
    pendingBills: 42,
    pendingAmount: 892300,
    completedBills: 156,
    insuranceClaims: 23,
    governmentSchemes: 18,
    averageBillAmount: 5430,
    collectionRate: 87,
  };

  // Mock pending bills
  const pendingBills = [
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
    },
  ];

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
    },
    {
      id: 'CLM-2024-002',
      patientName: 'Meera Patel',
      insuranceProvider: 'ICICI Lombard',
      claimAmount: 67000,
      status: 'pending',
      submittedDate: '2024-12-20',
      approvalDate: null,
    },
    {
      id: 'CLM-2024-003',
      patientName: 'Amit Verma',
      insuranceProvider: 'HDFC ERGO',
      claimAmount: 34500,
      status: 'rejected',
      submittedDate: '2024-12-18',
      approvalDate: null,
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
    },
    {
      name: 'CGHS',
      activePatients: 28,
      claimedAmount: 1560000,
      pendingClaims: 8,
      approvedClaims: 20,
    },
    {
      name: 'ESI',
      activePatients: 15,
      claimedAmount: 890000,
      pendingClaims: 5,
      approvedClaims: 10,
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
  ];

  const tabs = [
    { id: 'pending', label: 'Pending Bills', badge: stats.pendingBills, icon: Clock },
    { id: 'insurance', label: 'Insurance Claims', badge: stats.insuranceClaims, icon: Shield },
    { id: 'schemes', label: 'Govt Schemes', badge: stats.governmentSchemes, icon: Building },
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

  return (
    <DashboardLayout
      title="Billing & Insurance"
      subtitle="Manage hospital billing, insurance claims, and government schemes"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Billing' },
      ]}
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
      {/* Revenue Metrics */}
      <DashboardSection fullWidth>
        <MetricsRow columns={4}>
          <StandardMetricCard
            label="Today's Revenue"
            value={`₹${(stats.todayRevenue / 1000).toFixed(1)}K`}
            icon={IndianRupee}
            color="success"
            trend={{ value: 15, direction: 'up' }}
            subtitle="12% above average"
          />
          <StandardMetricCard
            label="Pending Bills"
            value={stats.pendingBills}
            icon={Clock}
            color="warning"
            subtitle={`₹${(stats.pendingAmount / 1000).toFixed(0)}K pending`}
          />
          <StandardMetricCard
            label="Collection Rate"
            value={`${stats.collectionRate}%`}
            icon={TrendingUp}
            color="primary"
            trend={{ value: 3, direction: 'up' }}
          />
          <StandardMetricCard
            label="Avg Bill Amount"
            value={`₹${stats.averageBillAmount}`}
            icon={Calculator}
            color="secondary"
            subtitle="Per patient"
          />
        </MetricsRow>
      </DashboardSection>

      {/* Insurance & Schemes Metrics */}
      <DashboardSection fullWidth>
        <MetricsRow columns={4}>
          <StandardMetricCard
            label="Insurance Claims"
            value={stats.insuranceClaims}
            icon={Shield}
            color="info"
            subtitle="Active claims"
          />
          <StandardMetricCard
            label="Govt Schemes"
            value={stats.governmentSchemes}
            icon={Building}
            color="secondary"
            subtitle="Active beneficiaries"
          />
          <StandardMetricCard
            label="Completed Today"
            value={stats.completedBills}
            icon={CheckCircle}
            color="success"
            subtitle="Bills processed"
          />
          <StandardMetricCard
            label="Overdue Bills"
            value={12}
            icon={AlertCircle}
            color="error"
            subtitle=">30 days"
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
              icon={Wallet}
              actions={quickActions}
            />

            {/* System Alerts */}
            <AlertCard title="Billing Alerts" items={systemAlerts} />

            {/* Collection Stats */}
            <StatsCard
              title="Today's Collection"
              value={156}
              total={198}
              unit="bills collected"
              icon={DollarSign}
              color="success"
            />
          </div>
        }
      >
        {/* Billing Card */}
        <div className="card-base">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Billing Management</h2>
                <p className="text-sm text-gray-600">Process payments and manage claims</p>
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
                  { value: 'all', label: 'All Payment Types' },
                  { value: 'cash', label: 'Cash' },
                  { value: 'insurance', label: 'Insurance' },
                  { value: 'government', label: 'Govt Scheme' },
                  { value: 'upi', label: 'UPI/Card' },
                ]}
                value={filterStatus}
                onChange={setFilterStatus}
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
                {pendingBills.map((bill) => (
                  <div key={bill.id} className="relative">
                    {bill.daysOverdue > 3 && (
                      <div className="absolute -left-1 top-0 bottom-0 w-1 bg-red-500 rounded-full" />
                    )}
                    <QueueCard
                      id={bill.id}
                      patientName={`${bill.patientName} (${bill.patientId})`}
                      doctorName={bill.department}
                      details={bill.services}
                      time={`Bill Date: ${bill.date} • ₹${bill.amount.toLocaleString('en-IN')}`}
                      status={bill.daysOverdue > 0 ? 'urgent' : 'pending'}
                      badge={
                        <div className="flex gap-2">
                          {bill.daysOverdue > 0 && (
                            <StandardBadge variant="danger" size="sm">
                              {bill.daysOverdue} days overdue
                            </StandardBadge>
                          )}
                          {getPaymentTypeBadge(bill.paymentType, bill.schemeApplicable)}
                          {bill.insuranceStatus === 'pending_approval' && (
                            <StandardBadge variant="warning" size="sm">
                              Insurance Pending
                            </StandardBadge>
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
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'insurance' && (
              <div className="space-y-4">
                {insuranceClaims.map((claim) => (
                  <QueueCard
                    key={claim.id}
                    id={claim.id}
                    patientName={claim.patientName}
                    doctorName={claim.insuranceProvider}
                    details={`Claim Amount: ₹${claim.claimAmount.toLocaleString('en-IN')}`}
                    time={`Submitted: ${claim.submittedDate}${claim.approvalDate ? ` • Approved: ${claim.approvalDate}` : ''}`}
                    status={claim.status === 'approved' ? 'completed' : claim.status === 'rejected' ? 'urgent' : 'pending'}
                    badge={getClaimStatusBadge(claim.status)}
                    actions={[
                      claim.status === 'pending' ? {
                        label: 'Follow Up',
                        onClick: () => console.log('Follow up', claim.id),
                        variant: 'primary',
                      } : {
                        label: 'View Details',
                        onClick: () => console.log('View', claim.id),
                        variant: 'secondary',
                      },
                      {
                        label: 'Download Docs',
                        onClick: () => console.log('Download', claim.id),
                        variant: 'secondary',
                      },
                    ]}
                  />
                ))}
              </div>
            )}

            {activeTab === 'schemes' && (
              <div className="grid gap-4 md:grid-cols-3">
                {governmentSchemes.map((scheme) => (
                  <div key={scheme.name} className="card-base p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-lg">{scheme.name}</h4>
                      <Building className="w-5 h-5 text-gray-400" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Active Patients</span>
                        <span className="font-semibold">{scheme.activePatients}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Claimed</span>
                        <span className="font-semibold">
                          ₹{(scheme.claimedAmount / 100000).toFixed(1)}L
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Pending</span>
                        <StandardBadge variant="warning" size="sm">
                          {scheme.pendingClaims}
                        </StandardBadge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Approved</span>
                        <StandardBadge variant="success" size="sm">
                          {scheme.approvedClaims}
                        </StandardBadge>
                      </div>
                    </div>
                    <div className="mt-4">
                      <StandardButton size="sm" variant="secondary" className="w-full">
                        View Details
                      </StandardButton>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'completed' && (
              <EmptyState
                icon={CheckCircle}
                title="Completed Bills"
                description="View and download completed billing records"
                action={{
                  label: 'Generate Report',
                  onClick: () => console.log('Generate report'),
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