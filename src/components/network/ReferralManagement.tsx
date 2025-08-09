'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/components/ui/use-toast';
import { 
  ArrowRightLeft, 
  Plus, 
  Search, 
  Filter, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle,
  User,
  Calendar,
  FileText,
  ChevronRight,
  Download,
  Eye,
  MessageSquare,
  Loader2,
  Building
} from 'lucide-react';
import { 
  mockReferrals, 
  mockDoctors, 
  mockHospitals,
  mockPatients,
  getTimeAgo 
} from '@/data/mock-network-collaboration';

interface Referral {
  referralId: string;
  patient: {
    patientId: string;
    firstName: string;
    lastName: string;
    abhaNumber?: string;
  };
  referringDoctor: {
    name: string;
    email: string;
  };
  referringClinic: {
    clinicName: string;
  };
  referral: {
    referralType: string;
    referralPriority: string;
    referralStatus: string;
    referralReason: string;
    clinicalNotes?: string;
    provisionalDiagnosis?: string[];
    initiatedAt: string;
    appointmentDate?: string;
  };
}

export default function ReferralManagement() {
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('incoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState<Referral | null>(null);

  // Form states for new referral
  const [newReferral, setNewReferral] = useState({
    patientId: '',
    referredToDoctorId: '',
    referredToClinicId: '',
    referredToDepartment: '',
    referralType: 'External',
    referralPriority: 'Normal',
    referralReason: '',
    clinicalNotes: '',
    provisionalDiagnosis: [],
    supportingDocuments: []
  });

  useEffect(() => {
    fetchReferrals();
  }, [activeTab, filterStatus, filterPriority]);

  const fetchReferrals = async () => {
    try {
      setLoading(true);
      
      // Use mock data directly
      let filteredData = mockReferrals.map(ref => ({
        referralId: ref.referralId,
        patient: {
          patientId: ref.patient.patientId,
          firstName: ref.patient.firstName,
          lastName: ref.patient.lastName,
          abhaNumber: ref.patient.abhaNumber
        },
        referringDoctor: {
          name: ref.referringDoctor.name,
          email: ref.referringDoctor.email
        },
        referringClinic: {
          clinicName: ref.referringClinic.clinicName
        },
        referral: {
          referralType: ref.referralType,
          referralPriority: ref.referralPriority,
          referralStatus: ref.referralStatus,
          referralReason: ref.referralReason,
          clinicalNotes: ref.clinicalNotes,
          provisionalDiagnosis: ref.provisionalDiagnosis,
          initiatedAt: ref.initiatedAt.toISOString(),
          appointmentDate: ref.appointmentDate?.toISOString()
        }
      }));

      // Filter by tab type
      if (activeTab === 'incoming') {
        // Simulate incoming referrals (received by current hospital)
        filteredData = filteredData.filter(r => 
          r.referral.referralStatus === 'Sent' || 
          r.referral.referralStatus === 'Accepted'
        );
      } else if (activeTab === 'outgoing') {
        // Simulate outgoing referrals (sent from current hospital)
        filteredData = filteredData.filter(r => 
          r.referral.referralStatus === 'Initiated' || 
          r.referral.referralStatus === 'In-Progress'
        );
      }

      // Apply status filter
      if (filterStatus !== 'all') {
        filteredData = filteredData.filter(r => 
          r.referral.referralStatus.toLowerCase() === filterStatus.toLowerCase()
        );
      }

      // Apply priority filter
      if (filterPriority !== 'all') {
        filteredData = filteredData.filter(r => 
          r.referral.referralPriority.toLowerCase() === filterPriority.toLowerCase()
        );
      }

      setReferrals(filteredData);
      
    } catch (error) {
      console.error('Error fetching referrals:', error);
      toast({
        title: 'Error',
        description: 'Failed to load referrals',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReferral = async () => {
    try {
      const response = await fetch('/api/network/referrals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReferral),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Referral created successfully',
        });
        setShowCreateDialog(false);
        fetchReferrals();
      } else {
        throw new Error('Failed to create referral');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create referral',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStatus = async (referralId: string, status: string) => {
    try {
      const response = await fetch(`/api/network/referrals?id=${referralId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ referralStatus: status }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Referral status updated',
        });
        fetchReferrals();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update referral',
        variant: 'destructive',
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'urgent': return 'destructive';
      case 'high': return 'warning';
      case 'normal': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'in-progress':
      case 'sent':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const filteredReferrals = referrals.filter(referral => {
    const searchMatch = searchTerm === '' || 
      referral.patient?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.patient?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      referral.patient?.abhaNumber?.includes(searchTerm);
    
    return searchMatch;
  });

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
          <h1 className="text-3xl font-bold tracking-tight">Referral Management</h1>
          <p className="text-muted-foreground">
            Manage patient referrals across the hospital network
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              New Referral
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Referral</DialogTitle>
              <DialogDescription>
                Refer a patient to another doctor or hospital
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Patient ID</Label>
                  <Input 
                    placeholder="Enter patient ID"
                    value={newReferral.patientId}
                    onChange={(e) => setNewReferral({...newReferral, patientId: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Referral Type</Label>
                  <Select 
                    value={newReferral.referralType}
                    onValueChange={(value) => setNewReferral({...newReferral, referralType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Internal">Internal</SelectItem>
                      <SelectItem value="External">External</SelectItem>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Second-Opinion">Second Opinion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Priority</Label>
                  <Select 
                    value={newReferral.referralPriority}
                    onValueChange={(value) => setNewReferral({...newReferral, referralPriority: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Urgent">Urgent</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Normal">Normal</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Department</Label>
                  <Input 
                    placeholder="Cardiology, Neurology, etc."
                    value={newReferral.referredToDepartment}
                    onChange={(e) => setNewReferral({...newReferral, referredToDepartment: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label>Referral Reason</Label>
                <Textarea 
                  placeholder="Reason for referral..."
                  value={newReferral.referralReason}
                  onChange={(e) => setNewReferral({...newReferral, referralReason: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label>Clinical Notes</Label>
                <Textarea 
                  placeholder="Additional clinical information..."
                  value={newReferral.clinicalNotes}
                  onChange={(e) => setNewReferral({...newReferral, clinicalNotes: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateReferral}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Referral
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name or ABHA number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="w-48">
              <Label>Status Filter</Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Initiated">Initiated</SelectItem>
                  <SelectItem value="Sent">Sent</SelectItem>
                  <SelectItem value="Accepted">Accepted</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-48">
              <Label>Priority Filter</Label>
              <Select value={filterPriority} onValueChange={setFilterPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referrals Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="incoming">Incoming Referrals</TabsTrigger>
          <TabsTrigger value="outgoing">Outgoing Referrals</TabsTrigger>
          <TabsTrigger value="all">All Referrals</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredReferrals.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <ArrowRightLeft className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No referrals found</p>
                <p className="text-sm text-muted-foreground">
                  {activeTab === 'incoming' ? 'No incoming referrals at this time' : 
                   activeTab === 'outgoing' ? 'No outgoing referrals at this time' :
                   'No referrals match your filters'}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredReferrals.map((referral) => (
                <Card key={referral.referralId} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 space-y-4">
                        {/* Patient Info */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {referral.patient?.firstName} {referral.patient?.lastName}
                              </h3>
                              {referral.patient?.abhaNumber && (
                                <p className="text-sm text-muted-foreground">
                                  ABHA: {referral.patient.abhaNumber}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(referral.referral?.referralStatus)}
                            <Badge variant={getPriorityColor(referral.referral?.referralPriority)}>
                              {referral.referral?.referralPriority}
                            </Badge>
                            <Badge variant="outline">
                              {referral.referral?.referralType}
                            </Badge>
                          </div>
                        </div>

                        {/* Referral Details */}
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">From</p>
                            <p className="font-medium">{referral.referringDoctor?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {referral.referringClinic?.clinicName}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Status</p>
                            <p className="font-medium">{referral.referral?.referralStatus}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(referral.referral?.initiatedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* Reason and Notes */}
                        <div className="space-y-2">
                          <div>
                            <p className="text-sm text-muted-foreground">Reason for Referral</p>
                            <p className="text-sm">{referral.referral?.referralReason}</p>
                          </div>
                          {referral.referral?.clinicalNotes && (
                            <div>
                              <p className="text-sm text-muted-foreground">Clinical Notes</p>
                              <p className="text-sm">{referral.referral.clinicalNotes}</p>
                            </div>
                          )}
                        </div>

                        {/* Diagnosis */}
                        {referral.referral?.provisionalDiagnosis && referral.referral.provisionalDiagnosis.length > 0 && (
                          <div>
                            <p className="text-sm text-muted-foreground">Provisional Diagnosis</p>
                            <div className="flex gap-2 flex-wrap mt-1">
                              {referral.referral.provisionalDiagnosis.map((diagnosis, index) => (
                                <Badge key={index} variant="secondary">
                                  {diagnosis}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedReferral(referral)}
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            View Details
                          </Button>
                          {referral.referral?.referralStatus === 'Initiated' && activeTab === 'incoming' && (
                            <>
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => handleUpdateStatus(referral.referralId, 'Accepted')}
                              >
                                <CheckCircle className="mr-1 h-4 w-4" />
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive"
                                onClick={() => handleUpdateStatus(referral.referralId, 'Rejected')}
                              >
                                <XCircle className="mr-1 h-4 w-4" />
                                Reject
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="ghost">
                            <MessageSquare className="mr-1 h-4 w-4" />
                            Message
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Download className="mr-1 h-4 w-4" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}