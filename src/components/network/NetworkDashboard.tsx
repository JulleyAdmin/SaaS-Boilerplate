'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building2, 
  Users, 
  ArrowRightLeft, 
  UserPlus, 
  AlertCircle,
  Activity,
  TrendingUp,
  Clock,
  MapPin,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  Send,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { 
  mockReferrals, 
  mockTransfers, 
  mockDoctors, 
  mockHospitals,
  mockSharedResources,
  getTimeAgo 
} from '@/data/mock-network-collaboration';

interface NetworkStats {
  totalHospitals: number;
  activeReferrals: number;
  pendingTransfers: number;
  networkDoctors: number;
  sharedResources: number;
  monthlyReferrals: number;
  successRate: number;
  averageResponseTime: string;
}

interface Referral {
  referralId: string;
  patientName: string;
  referralType: string;
  referralPriority: string;
  referralStatus: string;
  referringDoctor: string;
  referredTo: string;
  initiatedAt: string;
  clinicalNotes: string;
}

interface Transfer {
  transferId: string;
  patientName: string;
  transferType: string;
  transferStatus: string;
  sourceClinic: string;
  destinationClinic: string;
  transportMode: string;
  estimatedArrival: string;
}

interface NetworkDoctor {
  doctorId: string;
  name: string;
  specialization: string;
  primaryClinic: string;
  practicingClinics: string[];
  acceptsReferrals: boolean;
  consultationModes: string[];
  patientSatisfactionScore: number;
}

export default function NetworkDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<NetworkStats>({
    totalHospitals: 5,
    activeReferrals: 12,
    pendingTransfers: 3,
    networkDoctors: 48,
    sharedResources: 15,
    monthlyReferrals: 156,
    successRate: 94.5,
    averageResponseTime: '2.5 hrs',
  });

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [networkDoctors, setNetworkDoctors] = useState<NetworkDoctor[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Use mock data directly
      const formattedReferrals = mockReferrals.slice(0, 5).map(ref => ({
        referralId: ref.referralId,
        patientName: `${ref.patient.firstName} ${ref.patient.lastName}`,
        referralType: ref.referralType,
        referralPriority: ref.referralPriority,
        referralStatus: ref.referralStatus,
        referringDoctor: ref.referringDoctor.name,
        referredTo: ref.referredToDoctor.name,
        initiatedAt: ref.initiatedAt.toISOString(),
        clinicalNotes: ref.clinicalNotes
      }));
      setReferrals(formattedReferrals);

      // Use mock transfers
      const formattedTransfers = mockTransfers.slice(0, 5).map(trans => ({
        transferId: trans.transferId,
        patientName: `${trans.patient.firstName} ${trans.patient.lastName}`,
        transferStatus: trans.transferStatus,
        sourceClinic: trans.sourceClinic.clinicName,
        destinationClinic: trans.destinationClinic.clinicName,
        transportMode: trans.transportMode,
        estimatedArrival: trans.estimatedArrival ? trans.estimatedArrival.toISOString() : ''
      }));
      setTransfers(formattedTransfers);

      // Use mock doctors
      const formattedDoctors = mockDoctors.filter(doc => doc.acceptsReferrals).slice(0, 5).map(doc => ({
        doctorId: doc.doctorId,
        name: doc.name,
        specialization: doc.specialization,
        primaryClinic: doc.primaryClinic,
        practicingClinics: doc.practicingClinics,
        acceptsReferrals: doc.acceptsReferrals,
        consultationModes: doc.consultationModes,
        patientSatisfactionScore: doc.patientSatisfactionScore
      }));
      setNetworkDoctors(formattedDoctors);

      // Update stats based on mock data
      setStats({
        totalHospitals: mockHospitals.length,
        activeReferrals: mockReferrals.filter(r => r.referralStatus !== 'Completed').length,
        pendingTransfers: mockTransfers.filter(t => t.transferStatus === 'In-Transit' || t.transferStatus === 'Initiated').length,
        networkDoctors: mockDoctors.length,
        sharedResources: mockSharedResources.length,
        monthlyReferrals: 156,
        successRate: 94.5,
        averageResponseTime: '2.5 hrs',
      });

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'warning';
      case 'normal':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'accepted':
        return 'success';
      case 'in-transit':
      case 'in-progress':
        return 'warning';
      case 'rejected':
      case 'cancelled':
        return 'destructive';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hospital Network Dashboard</h1>
          <p className="text-muted-foreground">
            Manage referrals, transfers, and network collaboration
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Schedule
          </Button>
          <Button>
            <Send className="mr-2 h-4 w-4" />
            New Referral
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Hospitals</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHospitals}</div>
            <p className="text-xs text-muted-foreground">
              Connected facilities
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Referrals</CardTitle>
            <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeReferrals}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.monthlyReferrals} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successRate}%</div>
            <p className="text-xs text-muted-foreground">
              Referral completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageResponseTime}</div>
            <p className="text-xs text-muted-foreground">
              Average response
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="transfers">Transfers</TabsTrigger>
          <TabsTrigger value="doctors">Network Doctors</TabsTrigger>
          <TabsTrigger value="resources">Shared Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Recent Referrals */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Referrals</CardTitle>
                <CardDescription>
                  Latest referral requests in the network
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {referrals.slice(0, 3).map((referral) => (
                    <div key={referral.referralId} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {referral.patientName || 'Patient'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {referral.referringDoctor} → {referral.referredTo}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getPriorityColor(referral.referralPriority)}>
                          {referral.referralPriority}
                        </Badge>
                        <Badge variant={getStatusColor(referral.referralStatus)}>
                          {referral.referralStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {referrals.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No recent referrals
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Active Transfers */}
            <Card>
              <CardHeader>
                <CardTitle>Active Transfers</CardTitle>
                <CardDescription>
                  Patients currently being transferred
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transfers.slice(0, 3).map((transfer) => (
                    <div key={transfer.transferId} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          {transfer.patientName || 'Patient'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {transfer.sourceClinic} → {transfer.destinationClinic}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {transfer.transportMode}
                        </Badge>
                        <Badge variant={getStatusColor(transfer.transferStatus)}>
                          {transfer.transferStatus}
                        </Badge>
                      </div>
                    </div>
                  ))}
                  {transfers.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No active transfers
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Network Map Placeholder */}
          <Card>
            <CardHeader>
              <CardTitle>Network Map</CardTitle>
              <CardDescription>
                Hospital locations and connections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Interactive network map will be displayed here
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Referral Management</CardTitle>
              <CardDescription>
                Track and manage all network referrals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <div key={referral.referralId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{referral.patientName || 'Patient'}</h4>
                          <Badge variant={getPriorityColor(referral.referralPriority)}>
                            {referral.referralPriority}
                          </Badge>
                          <Badge variant={getStatusColor(referral.referralStatus)}>
                            {referral.referralStatus}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Type: {referral.referralType}
                        </p>
                        <p className="text-sm">
                          From: {referral.referringDoctor} → To: {referral.referredTo}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {referral.clinicalNotes}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transfers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Patient Transfers</CardTitle>
              <CardDescription>
                Monitor inter-hospital patient transfers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transfers.map((transfer) => (
                  <div key={transfer.transferId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{transfer.patientName || 'Patient'}</h4>
                          <Badge variant={transfer.transferType === 'Emergency' ? 'destructive' : 'default'}>
                            {transfer.transferType}
                          </Badge>
                          <Badge variant={getStatusColor(transfer.transferStatus)}>
                            {transfer.transferStatus}
                          </Badge>
                        </div>
                        <p className="text-sm">
                          {transfer.sourceClinic} → {transfer.destinationClinic}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Transport: {transfer.transportMode} | ETA: {transfer.estimatedArrival}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Track Transfer
                        <Activity className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="doctors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Doctors</CardTitle>
              <CardDescription>
                Specialists available across the network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {networkDoctors.map((doctor) => (
                  <div key={doctor.doctorId} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{doctor.name}</h4>
                          {doctor.acceptsReferrals && (
                            <Badge variant="success">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Accepts Referrals
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {doctor.specialization} | {doctor.primaryClinic}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          {doctor.consultationModes.map((mode) => (
                            <Badge key={mode} variant="outline" className="text-xs">
                              {mode}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm">
                          Patient Satisfaction: {doctor.patientSatisfactionScore}/5
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        <UserPlus className="mr-1 h-4 w-4" />
                        Refer Patient
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shared Resources</CardTitle>
              <CardDescription>
                Equipment and facilities available across the network
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Shared resources management coming soon
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}