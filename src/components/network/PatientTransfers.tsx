'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';
import { 
  Send, 
  Plus, 
  Truck, 
  Activity, 
  MapPin, 
  Clock, 
  AlertCircle,
  CheckCircle,
  Loader2,
  Bed,
  User,
  Building,
  Phone,
  Navigation,
  FileText,
  Heart,
  Thermometer,
  Droplet
} from 'lucide-react';
import { 
  mockTransfers, 
  mockHospitals,
  mockPatients,
  mockDoctors,
  getTimeAgo,
  generateVitalSigns 
} from '@/data/mock-network-collaboration';

interface Transfer {
  transfer: {
    transferId: string;
    transferType: string;
    transferStatus: string;
    transferReason: string;
    clinicalSummary?: string;
    transportMode?: string;
    estimatedArrival?: string;
    actualArrival?: string;
    initiatedAt: string;
    vitalSignsAtTransfer?: any;
  };
  patient: {
    patientId: string;
    firstName: string;
    lastName: string;
    age?: number;
    gender?: string;
    abhaNumber?: string;
  };
  sourceClinic: {
    clinicName: string;
  };
  destinationClinic?: {
    clinicName: string;
  };
}

export default function PatientTransfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [bedAvailability, setBedAvailability] = useState<any>(null);

  // Form state for new transfer
  const [newTransfer, setNewTransfer] = useState({
    patientId: '',
    destinationClinicId: '',
    transferType: 'Planned',
    transferReason: '',
    clinicalSummary: '',
    transportMode: 'Ambulance',
    requestedDepartment: '',
    vitalSigns: {
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      spO2: '',
      respiratoryRate: ''
    }
  });

  useEffect(() => {
    fetchTransfers();
  }, [filterType, filterStatus]);

  const fetchTransfers = async () => {
    try {
      setLoading(true);
      
      // Use mock data directly
      let filteredData = mockTransfers.map(trans => ({
        transfer: {
          transferId: trans.transferId,
          transferType: trans.transferType,
          transferStatus: trans.transferStatus,
          transferReason: trans.transferReason,
          clinicalSummary: trans.clinicalSummary,
          transportMode: trans.transportMode,
          estimatedArrival: trans.estimatedArrival?.toISOString(),
          actualArrival: trans.actualArrival?.toISOString(),
          initiatedAt: trans.initiatedAt.toISOString(),
          vitalSignsAtTransfer: trans.vitalSignsAtTransfer
        },
        patient: {
          patientId: trans.patient.patientId,
          firstName: trans.patient.firstName,
          lastName: trans.patient.lastName,
          age: trans.patient.age,
          gender: trans.patient.gender,
          abhaNumber: trans.patient.abhaNumber
        },
        sourceClinic: {
          clinicName: trans.sourceClinic.clinicName
        },
        destinationClinic: {
          clinicName: trans.destinationClinic.clinicName
        }
      }));

      // Apply type filter
      if (filterType !== 'all') {
        filteredData = filteredData.filter(t => 
          t.transfer.transferType.toLowerCase() === filterType.toLowerCase()
        );
      }

      // Apply status filter
      if (filterStatus !== 'all') {
        filteredData = filteredData.filter(t => 
          t.transfer.transferStatus.toLowerCase() === filterStatus.toLowerCase()
        );
      }

      setTransfers(filteredData);
      
    } catch (error) {
      console.error('Error fetching transfers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load transfers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTransfer = async () => {
    try {
      const response = await fetch('/api/network/transfers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newTransfer,
          vitalSignsAtTransfer: newTransfer.vitalSigns
        }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Transfer initiated successfully',
        });
        setShowCreateDialog(false);
        fetchTransfers();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create transfer',
        variant: 'destructive',
      });
    }
  };

  const handleAcceptTransfer = async (transferId: string) => {
    try {
      const response = await fetch(`/api/network/transfers?id=${transferId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transferStatus: 'Accepted' }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Transfer accepted',
        });
        fetchTransfers();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to accept transfer',
        variant: 'destructive',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'success';
      case 'in-transit': return 'warning';
      case 'accepted': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTransferProgress = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'initiated': return 25;
      case 'accepted': return 50;
      case 'in-transit': return 75;
      case 'completed': return 100;
      default: return 0;
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
          <h1 className="text-3xl font-bold tracking-tight">Patient Transfers</h1>
          <p className="text-muted-foreground">
            Manage inter-hospital patient transfers and transport
          </p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Initiate Transfer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Initiate Patient Transfer</DialogTitle>
              <DialogDescription>
                Transfer a patient to another hospital in the network
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Patient ID</Label>
                  <Input 
                    placeholder="Enter patient ID"
                    value={newTransfer.patientId}
                    onChange={(e) => setNewTransfer({...newTransfer, patientId: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Transfer Type</Label>
                  <Select 
                    value={newTransfer.transferType}
                    onValueChange={(value) => setNewTransfer({...newTransfer, transferType: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Emergency">Emergency</SelectItem>
                      <SelectItem value="Planned">Planned</SelectItem>
                      <SelectItem value="Specialist">Specialist Care</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Destination Hospital</Label>
                  <Select 
                    value={newTransfer.destinationClinicId}
                    onValueChange={(value) => setNewTransfer({...newTransfer, destinationClinicId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select hospital" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="clinic-1">City General Hospital</SelectItem>
                      <SelectItem value="clinic-2">Regional Medical Center</SelectItem>
                      <SelectItem value="clinic-3">Specialty Care Hospital</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Transport Mode</Label>
                  <Select 
                    value={newTransfer.transportMode}
                    onValueChange={(value) => setNewTransfer({...newTransfer, transportMode: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ambulance">Ambulance</SelectItem>
                      <SelectItem value="Air">Air Ambulance</SelectItem>
                      <SelectItem value="Private">Private Vehicle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Vital Signs */}
              <div className="space-y-2">
                <Label>Vital Signs at Transfer</Label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <Label className="text-xs">Blood Pressure</Label>
                    <Input 
                      placeholder="120/80"
                      value={newTransfer.vitalSigns.bloodPressure}
                      onChange={(e) => setNewTransfer({
                        ...newTransfer,
                        vitalSigns: {...newTransfer.vitalSigns, bloodPressure: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Heart Rate</Label>
                    <Input 
                      placeholder="72"
                      value={newTransfer.vitalSigns.heartRate}
                      onChange={(e) => setNewTransfer({
                        ...newTransfer,
                        vitalSigns: {...newTransfer.vitalSigns, heartRate: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Temperature (°F)</Label>
                    <Input 
                      placeholder="98.6"
                      value={newTransfer.vitalSigns.temperature}
                      onChange={(e) => setNewTransfer({
                        ...newTransfer,
                        vitalSigns: {...newTransfer.vitalSigns, temperature: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">SpO2 (%)</Label>
                    <Input 
                      placeholder="98"
                      value={newTransfer.vitalSigns.spO2}
                      onChange={(e) => setNewTransfer({
                        ...newTransfer,
                        vitalSigns: {...newTransfer.vitalSigns, spO2: e.target.value}
                      })}
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Respiratory Rate</Label>
                    <Input 
                      placeholder="16"
                      value={newTransfer.vitalSigns.respiratoryRate}
                      onChange={(e) => setNewTransfer({
                        ...newTransfer,
                        vitalSigns: {...newTransfer.vitalSigns, respiratoryRate: e.target.value}
                      })}
                    />
                  </div>
                </div>
              </div>

              {/* Clinical Information */}
              <div>
                <Label>Transfer Reason</Label>
                <Textarea 
                  placeholder="Reason for transfer..."
                  value={newTransfer.transferReason}
                  onChange={(e) => setNewTransfer({...newTransfer, transferReason: e.target.value})}
                  rows={2}
                />
              </div>

              <div>
                <Label>Clinical Summary</Label>
                <Textarea 
                  placeholder="Patient condition and treatment summary..."
                  value={newTransfer.clinicalSummary}
                  onChange={(e) => setNewTransfer({...newTransfer, clinicalSummary: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTransfer}>
                  <Send className="mr-2 h-4 w-4" />
                  Initiate Transfer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Transfers</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transfers.filter(t => t.transfer.transferStatus === 'In-Transit').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently in transit</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Acceptance</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transfers.filter(t => t.transfer.transferStatus === 'Initiated').length}
            </div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transfers.filter(t => 
                t.transfer.transferStatus === 'Completed' &&
                new Date(t.transfer.initiatedAt).toDateString() === new Date().toDateString()
              ).length}
            </div>
            <p className="text-xs text-muted-foreground">Successfully transferred</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {transfers.filter(t => t.transfer.transferType === 'Emergency').length}
            </div>
            <p className="text-xs text-muted-foreground">Emergency transfers</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transfers</SelectItem>
                <SelectItem value="incoming">Incoming</SelectItem>
                <SelectItem value="outgoing">Outgoing</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Initiated">Initiated</SelectItem>
                <SelectItem value="Accepted">Accepted</SelectItem>
                <SelectItem value="In-Transit">In Transit</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transfers List */}
      <div className="grid gap-4">
        {transfers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Truck className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No transfers found</p>
              <p className="text-sm text-muted-foreground">
                No patient transfers match your filters
              </p>
            </CardContent>
          </Card>
        ) : (
          transfers.map((transfer) => (
            <Card key={transfer.transfer.transferId}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header with patient info and status */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {transfer.patient?.firstName} {transfer.patient?.lastName}
                        </h3>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          {transfer.patient?.age && <span>Age: {transfer.patient.age}</span>}
                          {transfer.patient?.gender && <span>{transfer.patient.gender}</span>}
                          {transfer.patient?.abhaNumber && <span>ABHA: {transfer.patient.abhaNumber}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {transfer.transfer.transferType === 'Emergency' && (
                        <Badge variant="destructive">
                          <AlertCircle className="mr-1 h-3 w-3" />
                          Emergency
                        </Badge>
                      )}
                      <Badge variant={getStatusColor(transfer.transfer.transferStatus)}>
                        {transfer.transfer.transferStatus}
                      </Badge>
                    </div>
                  </div>

                  {/* Transfer Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Transfer Progress</span>
                      <span>{getTransferProgress(transfer.transfer.transferStatus)}%</span>
                    </div>
                    <Progress value={getTransferProgress(transfer.transfer.transferStatus)} />
                  </div>

                  {/* Transfer Route */}
                  <div className="flex items-center justify-between bg-muted/50 rounded-lg p-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{transfer.sourceClinic?.clinicName}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Source Hospital</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Navigation className="h-4 w-4 text-primary" />
                        <div className="text-sm">
                          <p className="font-medium">{transfer.transfer.transportMode}</p>
                          {transfer.transfer.estimatedArrival && (
                            <p className="text-xs text-muted-foreground">
                              ETA: {new Date(transfer.transfer.estimatedArrival).toLocaleTimeString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Building className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{transfer.destinationClinic?.clinicName || 'Pending'}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Destination Hospital</p>
                      </div>
                    </div>
                  </div>

                  {/* Clinical Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Transfer Reason</p>
                      <p className="text-sm">{transfer.transfer.transferReason}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Initiated</p>
                      <p className="text-sm">
                        {new Date(transfer.transfer.initiatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {transfer.transfer.clinicalSummary && (
                    <div>
                      <p className="text-sm text-muted-foreground">Clinical Summary</p>
                      <p className="text-sm">{transfer.transfer.clinicalSummary}</p>
                    </div>
                  )}

                  {/* Vital Signs */}
                  {transfer.transfer.vitalSignsAtTransfer && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Vital Signs at Transfer</p>
                      <div className="flex gap-4 flex-wrap">
                        {transfer.transfer.vitalSignsAtTransfer.bloodPressure && (
                          <Badge variant="outline">
                            <Heart className="mr-1 h-3 w-3" />
                            BP: {transfer.transfer.vitalSignsAtTransfer.bloodPressure}
                          </Badge>
                        )}
                        {transfer.transfer.vitalSignsAtTransfer.heartRate && (
                          <Badge variant="outline">
                            <Activity className="mr-1 h-3 w-3" />
                            HR: {transfer.transfer.vitalSignsAtTransfer.heartRate}
                          </Badge>
                        )}
                        {transfer.transfer.vitalSignsAtTransfer.temperature && (
                          <Badge variant="outline">
                            <Thermometer className="mr-1 h-3 w-3" />
                            Temp: {transfer.transfer.vitalSignsAtTransfer.temperature}°F
                          </Badge>
                        )}
                        {transfer.transfer.vitalSignsAtTransfer.spO2 && (
                          <Badge variant="outline">
                            <Droplet className="mr-1 h-3 w-3" />
                            SpO2: {transfer.transfer.vitalSignsAtTransfer.spO2}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {transfer.transfer.transferStatus === 'Initiated' && filterType === 'incoming' && (
                      <Button 
                        variant="default"
                        onClick={() => handleAcceptTransfer(transfer.transfer.transferId)}
                      >
                        <CheckCircle className="mr-1 h-4 w-4" />
                        Accept Transfer
                      </Button>
                    )}
                    {transfer.transfer.transferStatus === 'In-Transit' && (
                      <Button variant="outline">
                        <MapPin className="mr-1 h-4 w-4" />
                        Track Transport
                      </Button>
                    )}
                    <Button variant="outline">
                      <Phone className="mr-1 h-4 w-4" />
                      Contact
                    </Button>
                    <Button variant="outline">
                      <FileText className="mr-1 h-4 w-4" />
                      Documents
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}