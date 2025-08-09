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
  StandardSearch,
  StandardSelect,
  EmptyState,
} from '@/components/dashboard/StandardUI';
import {
  Package,
  TrendingUp,
  AlertTriangle,
  Clock,
  DollarSign,
  ShoppingCart,
  FileText,
  Plus,
  Download,
  RefreshCw,
  Filter,
  Pill,
  Activity,
  Users,
} from 'lucide-react';

// Import the design system CSS
import '@/styles/design-system.css';

const PharmacyDashboardRedesigned: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Mock data for demonstration
  const metrics = {
    todayPrescriptions: 95,
    dispensed: 76,
    inventoryStatus: 1350,
    lowStock: 65,
    revenue: 72500,
    target: 80000,
    pendingDispense: 15,
    avgWaitTime: '15 min',
  };

  const prescriptionQueue = [
    {
      id: '996',
      patientName: 'Sarita Bhosale',
      doctorName: 'Abdul Pillai',
      details: '3 items',
      time: '10 min ago',
      status: 'urgent' as const,
    },
    {
      id: '708',
      patientName: 'Sandeep Kumar',
      doctorName: 'Abdul Pillai',
      details: '4 items',
      time: '25 min ago',
      status: 'pending' as const,
    },
    {
      id: '449',
      patientName: 'Krishna Saini',
      doctorName: 'Abdul Pillai',
      details: '5 items',
      time: '45 min ago',
      status: 'pending' as const,
    },
    {
      id: '635',
      patientName: 'Kali Pillai',
      doctorName: 'Abdul Pillai',
      details: '6 items',
      time: '1 hour ago',
      status: 'pending' as const,
    },
  ];

  const inventoryAlerts = [
    {
      id: '1',
      label: 'Out of Stock',
      description: 'Paracetamol 500mg, Amoxicillin 250mg',
      type: 'error' as const,
      action: () => console.log('Order now'),
      actionLabel: 'Order Now',
    },
    {
      id: '2',
      label: 'Low Stock Alert',
      description: '65 medicines below reorder level',
      type: 'warning' as const,
      action: () => console.log('View list'),
      actionLabel: 'View List',
    },
    {
      id: '3',
      label: 'Expiring Soon',
      description: '20 medicines expire within 30 days',
      type: 'warning' as const,
      action: () => console.log('View details'),
      actionLabel: 'View Details',
    },
  ];

  const tabs = [
    { id: 'pending', label: 'Pending', badge: 15 },
    { id: 'dispensed', label: 'Dispensed', badge: 76 },
    { id: 'cancelled', label: 'Cancelled', badge: 3 },
  ];

  const quickActions = [
    {
      label: 'Manage Inventory',
      icon: Package,
      onClick: () => console.log('Manage inventory'),
    },
    {
      label: 'Create Purchase Order',
      icon: ShoppingCart,
      onClick: () => console.log('Create order'),
    },
    {
      label: 'Add New Medicine',
      icon: Plus,
      onClick: () => console.log('Add medicine'),
    },
    {
      label: 'View Reports',
      icon: FileText,
      onClick: () => console.log('View reports'),
    },
  ];

  return (
    <>
      <DashboardLayout
        title="Pharmacy Dashboard"
        subtitle="Manage prescriptions, inventory, and dispensing"
        breadcrumbs={[
          { label: 'Dashboard', href: '/dashboard' },
          { label: 'Pharmacy' },
        ]}
        actions={
          <ButtonGroup>
            <StandardButton
              variant="secondary"
              icon={RefreshCw}
              onClick={() => window.location.reload()}
            >
              Refresh
            </StandardButton>
            <StandardButton
              variant="primary"
              icon={Download}
              onClick={() => console.log('Export')}
            >
              Export Report
            </StandardButton>
          </ButtonGroup>
        }
      >
        {/* Metrics Section */}
        <DashboardSection fullWidth>
          <MetricsRow columns={4}>
            <StandardMetricCard
              label="Today's Prescriptions"
              value={metrics.todayPrescriptions}
              icon={FileText}
              trend={{ value: 12, direction: 'up' }}
              subtitle={`${metrics.dispensed} dispensed`}
              color="primary"
            />
            <StandardMetricCard
              label="Inventory Status"
              value={metrics.inventoryStatus.toLocaleString()}
              icon={Package}
              trend={{ value: 5, direction: 'down' }}
              subtitle={`${metrics.lowStock} low stock`}
              color="warning"
            />
            <StandardMetricCard
              label="Revenue Today"
              value={`₹${(metrics.revenue / 1000).toFixed(1)}K`}
              icon={DollarSign}
              trend={{ value: 8, direction: 'up' }}
              subtitle={`Target: ₹${metrics.target / 1000}K`}
              color="success"
            />
            <StandardMetricCard
              label="Pending Dispense"
              value={metrics.pendingDispense}
              icon={Clock}
              subtitle={`Avg wait: ${metrics.avgWaitTime}`}
              color="error"
            />
          </MetricsRow>
        </DashboardSection>

        {/* Main Content with Sidebar */}
        <ContentGrid
          sidebar={
            <div className="space-y-6">
              {/* Quick Actions */}
              <ActionCard
                title="Quick Actions"
                description="Common pharmacy operations"
                icon={Activity}
                actions={quickActions}
              />

              {/* Inventory Alerts */}
              <AlertCard title="Inventory Alerts" items={inventoryAlerts} />

              {/* Stock Statistics */}
              <StatsCard
                title="Medicine Categories"
                value={850}
                total={1350}
                unit="in stock"
                icon={Pill}
                color="primary"
              />
            </div>
          }
        >
          {/* Prescription Queue */}
          <div className="card-base">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Prescription Queue</h2>
                  <p className="text-sm text-gray-600">Pending and recent prescriptions</p>
                </div>
                <StandardButton variant="primary" icon={Plus} size="sm">
                  New Prescription
                </StandardButton>
              </div>

              {/* Search and Filter Bar */}
              <div className="flex gap-3">
                <StandardSearch
                  placeholder="Search patient or prescription..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                  className="flex-1"
                />
                <StandardSelect
                  options={[
                    { value: 'all', label: 'All Status' },
                    { value: 'urgent', label: 'Urgent' },
                    { value: 'pending', label: 'Pending' },
                    { value: 'dispensed', label: 'Dispensed' },
                  ]}
                  value={filterStatus}
                  onChange={setFilterStatus}
                  placeholder="Filter by status"
                />
              </div>
            </div>

            {/* Tabs */}
            <StandardTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Queue Items */}
            <div className="p-6 space-y-4">
              {prescriptionQueue.length === 0 ? (
                <EmptyState
                  icon={Package}
                  title="No prescriptions in queue"
                  description="All prescriptions have been processed"
                  action={{
                    label: 'Add Prescription',
                    onClick: () => console.log('Add prescription'),
                  }}
                />
              ) : (
                prescriptionQueue.map((prescription) => (
                  <QueueCard
                    key={prescription.id}
                    id={prescription.id}
                    patientName={prescription.patientName}
                    doctorName={prescription.doctorName}
                    details={prescription.details}
                    time={prescription.time}
                    status={prescription.status}
                    badge={prescription.status === 'urgent' ? 'URGENT' : undefined}
                    actions={[
                      {
                        label: 'Dispense',
                        onClick: () => console.log('Dispense', prescription.id),
                        variant: 'primary',
                      },
                      {
                        label: 'View',
                        onClick: () => console.log('View', prescription.id),
                        variant: 'secondary',
                      },
                    ]}
                  />
                ))
              )}
            </div>
          </div>
        </ContentGrid>
      </DashboardLayout>
    </>
  );
};

export default PharmacyDashboardRedesigned;