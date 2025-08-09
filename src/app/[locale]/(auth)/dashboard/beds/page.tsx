'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bed, User, Clock, Search, AlertCircle, CheckCircle, UserPlus, Activity } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

// Mock bed data
const bedData = [
  { 
    id: 'B001', 
    wardName: 'General Ward A', 
    bedNumber: '101', 
    status: 'occupied', 
    patientName: 'Rajesh Kumar', 
    patientId: 'P001',
    admissionDate: '2024-01-10',
    condition: 'Stable',
    nurseAssigned: 'Sister Mary',
    lastCheckup: '2 hours ago',
    roomType: 'General',
    floor: '1st Floor'
  },
  { 
    id: 'B002', 
    wardName: 'General Ward A', 
    bedNumber: '102', 
    status: 'available', 
    patientName: null, 
    patientId: null,
    admissionDate: null,
    condition: null,
    nurseAssigned: 'Sister Mary',
    lastCheckup: null,
    roomType: 'General',
    floor: '1st Floor'
  },
  { 
    id: 'B003', 
    wardName: 'ICU', 
    bedNumber: '201', 
    status: 'occupied', 
    patientName: 'Sunita Devi', 
    patientId: 'P003',
    admissionDate: '2024-01-12',
    condition: 'Critical',
    nurseAssigned: 'Sister Jane',
    lastCheckup: '30 minutes ago',
    roomType: 'ICU',
    floor: '2nd Floor'
  },
  { 
    id: 'B004', 
    wardName: 'Pediatric Ward', 
    bedNumber: '301', 
    status: 'occupied', 
    patientName: 'Baby Sharma', 
    patientId: 'P004',
    admissionDate: '2024-01-13',
    condition: 'Improving',
    nurseAssigned: 'Sister Priya',
    lastCheckup: '1 hour ago',
    roomType: 'Pediatric',
    floor: '3rd Floor'
  },
  { 
    id: 'B005', 
    wardName: 'General Ward B', 
    bedNumber: '103', 
    status: 'maintenance', 
    patientName: null, 
    patientId: null,
    admissionDate: null,
    condition: null,
    nurseAssigned: 'Sister Mary',
    lastCheckup: null,
    roomType: 'General',
    floor: '1st Floor'
  },
  { 
    id: 'B006', 
    wardName: 'Private Room', 
    bedNumber: '401', 
    status: 'occupied', 
    patientName: 'Amit Patel', 
    patientId: 'P006',
    admissionDate: '2024-01-11',
    condition: 'Stable',
    nurseAssigned: 'Sister Rita',
    lastCheckup: '45 minutes ago',
    roomType: 'Private',
    floor: '4th Floor'
  }
];

const wardSummary = {
  totalBeds: 45,
  occupied: 28,
  available: 12,
  maintenance: 5,
  occupancyRate: 75
};

export default function BedManagementPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [wardFilter, setWardFilter] = useState('all');
  const [beds, setBeds] = useState(bedData);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showTransferDialog, setShowTransferDialog] = useState(false);
  const [showAddBedDialog, setShowAddBedDialog] = useState(false);
  const [showPatientDetailsDialog, setShowPatientDetailsDialog] = useState(false);
  const [selectedBed, setSelectedBed] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patientDetails, setPatientDetails] = useState({
    name: '',
    age: '',
    gender: '',
    condition: 'Stable',
    admissionReason: ''
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'occupied':
        return <Badge className="bg-red-500">Occupied</Badge>;
      case 'available':
        return <Badge className="bg-green-500">Available</Badge>;
      case 'maintenance':
        return <Badge variant="outline">Maintenance</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'Critical':
        return 'text-red-600 font-semibold';
      case 'Stable':
        return 'text-green-600';
      case 'Improving':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };

  const filteredBeds = beds.filter(bed => {
    const matchesSearch = 
      bed.bedNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bed.wardName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (bed.patientName && bed.patientName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || bed.status === statusFilter;
    const matchesWard = wardFilter === 'all' || bed.wardName === wardFilter;
    
    return matchesSearch && matchesStatus && matchesWard;
  });

  const wardNames = Array.from(new Set(beds.map(bed => bed.wardName)));

  const handleAssignPatient = (bedId: string) => {
    const bed = beds.find(b => b.id === bedId);
    setSelectedBed(bed);
    setShowAssignDialog(true);
  };

  const handleTransferPatient = (bedId: string) => {
    const bed = beds.find(b => b.id === bedId);
    setSelectedBed(bed);
    setShowTransferDialog(true);
  };

  const confirmAssignment = () => {
    if (!patientDetails.name || !patientDetails.age) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setBeds(prevBeds => prevBeds.map(bed => 
      bed.id === selectedBed.id 
        ? {
            ...bed,
            status: 'occupied',
            patientName: patientDetails.name,
            patientId: `P${Date.now().toString().slice(-6)}`,
            admissionDate: new Date().toISOString().split('T')[0],
            condition: patientDetails.condition,
            lastCheckup: 'Just now'
          }
        : bed
    ));

    toast({
      title: "Success",
      description: `Patient ${patientDetails.name} assigned to Bed ${selectedBed.bedNumber}`,
    });

    setShowAssignDialog(false);
    setSelectedBed(null);
    setPatientDetails({
      name: '',
      age: '',
      gender: '',
      condition: 'Stable',
      admissionReason: ''
    });
  };

  const confirmTransfer = (targetBedId: string) => {
    const targetBed = beds.find(b => b.id === targetBedId);
    
    setBeds(prevBeds => prevBeds.map(bed => {
      if (bed.id === selectedBed.id) {
        return { ...bed, status: 'available', patientName: null, patientId: null, admissionDate: null, condition: null, lastCheckup: null };
      }
      if (bed.id === targetBedId) {
        return {
          ...bed,
          status: 'occupied',
          patientName: selectedBed.patientName,
          patientId: selectedBed.patientId,
          admissionDate: selectedBed.admissionDate,
          condition: selectedBed.condition,
          lastCheckup: 'Just transferred'
        };
      }
      return bed;
    }));

    toast({
      title: "Transfer Complete",
      description: `Patient ${selectedBed.patientName} transferred to Bed ${targetBed?.bedNumber}`,
    });

    setShowTransferDialog(false);
    setSelectedBed(null);
  };

  const handleAddBed = (bedDetails: any) => {
    const newBed = {
      id: `B${Date.now().toString().slice(-6)}`,
      wardName: bedDetails.ward,
      bedNumber: bedDetails.number,
      status: 'available',
      patientName: null,
      patientId: null,
      admissionDate: null,
      condition: null,
      nurseAssigned: bedDetails.nurse,
      lastCheckup: null,
      roomType: bedDetails.roomType,
      floor: bedDetails.floor
    };

    setBeds(prevBeds => [...prevBeds, newBed]);
    
    toast({
      title: "Bed Added",
      description: `Bed ${bedDetails.number} added to ${bedDetails.ward}`,
    });

    setShowAddBedDialog(false);
  };

  const handleViewPatient = (bedId: string) => {
    const bed = beds.find(b => b.id === bedId);
    if (bed) {
      setSelectedPatient(bed);
      setShowPatientDetailsDialog(true);
    }
  };

  const handleScheduleMaintenance = (bedId: string) => {
    setBeds(prevBeds => prevBeds.map(bed => 
      bed.id === bedId 
        ? { ...bed, status: 'maintenance' }
        : bed
    ));
    
    toast({
      title: "Maintenance Scheduled",
      description: "Bed marked for maintenance",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bed Management</h1>
          <p className="text-muted-foreground">Monitor and manage hospital bed occupancy and patient assignments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAssignDialog(true)}>
            <UserPlus className="mr-2 size-4" />
            Assign Patient
          </Button>
          <Button onClick={() => setShowAddBedDialog(true)}>
            <Bed className="mr-2 size-4" />
            Add New Bed
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Beds</CardTitle>
            <Bed className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wardSummary.totalBeds}</div>
            <p className="text-xs text-muted-foreground">Across all wards</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied</CardTitle>
            <User className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{wardSummary.occupied}</div>
            <p className="text-xs text-muted-foreground">Currently occupied</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available</CardTitle>
            <CheckCircle className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{wardSummary.available}</div>
            <p className="text-xs text-muted-foreground">Ready for assignment</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
            <AlertCircle className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{wardSummary.maintenance}</div>
            <p className="text-xs text-muted-foreground">Under maintenance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupancy Rate</CardTitle>
            <Activity className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{wardSummary.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">Current utilization</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by bed number, ward, or patient name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
            <Select value={wardFilter} onValueChange={setWardFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by ward" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Wards</SelectItem>
                {wardNames.map(ward => (
                  <SelectItem key={ward} value={ward}>{ward}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bed Management */}
      <Tabs defaultValue="grid" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>

        <TabsContent value="grid">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBeds.map(bed => (
              <Card key={bed.id} className={`${bed.status === 'occupied' && bed.condition === 'Critical' ? 'border-red-500' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{bed.wardName}</CardTitle>
                      <CardDescription>Bed {bed.bedNumber} • {bed.roomType} • {bed.floor}</CardDescription>
                    </div>
                    {getStatusBadge(bed.status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bed.patientName ? (
                    <>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarFallback>
                            {bed.patientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{bed.patientName}</p>
                          <p className="text-sm text-muted-foreground">ID: {bed.patientId}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Condition:</span>
                          <span className={getConditionColor(bed.condition!)}>{bed.condition}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Admitted:</span>
                          <span>{bed.admissionDate}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nurse Assigned:</span>
                          <span>{bed.nurseAssigned}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Last Checkup:</span>
                          <span>{bed.lastCheckup}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleViewPatient(bed.id)}>
                          <User className="size-4 mr-1" />
                          View Patient
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1" onClick={() => handleTransferPatient(bed.id)}>
                          <Clock className="size-4 mr-1" />
                          Transfer
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-4">
                      <div className="space-y-2">
                        <Bed className="size-12 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {bed.status === 'available' ? 'Bed available for assignment' : 'Under maintenance'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Nurse: {bed.nurseAssigned}
                        </p>
                      </div>
                      {bed.status === 'available' && (
                        <Button size="sm" className="mt-3" onClick={() => handleAssignPatient(bed.id)}>
                          <UserPlus className="size-4 mr-1" />
                          Assign Patient
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="list">
          <Card>
            <CardHeader>
              <CardTitle>Bed Inventory</CardTitle>
              <CardDescription>Complete list of all hospital beds and their current status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredBeds.map(bed => (
                  <div key={bed.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Bed className="size-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">{bed.wardName} - Bed {bed.bedNumber}</h4>
                          {getStatusBadge(bed.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {bed.patientName ? (
                            `${bed.patientName} • ${bed.condition} • Nurse: ${bed.nurseAssigned}`
                          ) : (
                            `${bed.roomType} Room • {bed.floor} • Nurse: ${bed.nurseAssigned}`
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {bed.patientName ? (
                        <>
                          <Button size="sm" variant="outline" onClick={() => handleViewPatient(bed.id)}>View Patient</Button>
                          <Button size="sm" variant="outline" onClick={() => handleTransferPatient(bed.id)}>Transfer</Button>
                        </>
                      ) : bed.status === 'available' ? (
                        <Button size="sm" onClick={() => handleAssignPatient(bed.id)}>Assign Patient</Button>
                      ) : (
                        <Button size="sm" variant="outline" onClick={() => handleScheduleMaintenance(bed.id)}>Schedule Maintenance</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assign Patient Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Patient to Bed</DialogTitle>
            <DialogDescription>
              {selectedBed && `Assigning patient to ${selectedBed.wardName} - Bed ${selectedBed.bedNumber}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="patientName">Patient Name *</Label>
              <Input
                id="patientName"
                value={patientDetails.name}
                onChange={(e) => setPatientDetails({...patientDetails, name: e.target.value})}
                placeholder="Enter patient name"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age *</Label>
                <Input
                  id="age"
                  type="number"
                  value={patientDetails.age}
                  onChange={(e) => setPatientDetails({...patientDetails, age: e.target.value})}
                  placeholder="Age"
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={patientDetails.gender} 
                  onValueChange={(value) => setPatientDetails({...patientDetails, gender: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="condition">Patient Condition</Label>
              <Select 
                value={patientDetails.condition} 
                onValueChange={(value) => setPatientDetails({...patientDetails, condition: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Stable">Stable</SelectItem>
                  <SelectItem value="Improving">Improving</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="reason">Admission Reason</Label>
              <Textarea
                id="reason"
                value={patientDetails.admissionReason}
                onChange={(e) => setPatientDetails({...patientDetails, admissionReason: e.target.value})}
                placeholder="Brief description of admission reason..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignDialog(false)}>Cancel</Button>
            <Button onClick={confirmAssignment}>Assign Patient</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Transfer Patient Dialog */}
      <Dialog open={showTransferDialog} onOpenChange={setShowTransferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Patient</DialogTitle>
            <DialogDescription>
              {selectedBed && `Transfer ${selectedBed.patientName} from Bed ${selectedBed.bedNumber}`}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Select Target Bed</Label>
              <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                {beds.filter(b => b.status === 'available' && b.id !== selectedBed?.id).map(bed => (
                  <Button
                    key={bed.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => confirmTransfer(bed.id)}
                  >
                    <Bed className="size-4 mr-2" />
                    {bed.wardName} - Bed {bed.bedNumber} ({bed.roomType})
                  </Button>
                ))}
              </div>
              {beds.filter(b => b.status === 'available').length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No available beds for transfer</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTransferDialog(false)}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Bed Dialog */}
      <Dialog open={showAddBedDialog} onOpenChange={setShowAddBedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Bed</DialogTitle>
            <DialogDescription>Add a new bed to the hospital inventory</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="bedNumber">Bed Number *</Label>
              <Input id="bedNumber" placeholder="e.g., 501" />
            </div>
            <div>
              <Label htmlFor="ward">Ward *</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select ward" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General Ward A">General Ward A</SelectItem>
                  <SelectItem value="General Ward B">General Ward B</SelectItem>
                  <SelectItem value="ICU">ICU</SelectItem>
                  <SelectItem value="Pediatric Ward">Pediatric Ward</SelectItem>
                  <SelectItem value="Private Room">Private Room</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="roomType">Room Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select room type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="General">General</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="ICU">ICU</SelectItem>
                  <SelectItem value="Pediatric">Pediatric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="floor">Floor</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st Floor">1st Floor</SelectItem>
                  <SelectItem value="2nd Floor">2nd Floor</SelectItem>
                  <SelectItem value="3rd Floor">3rd Floor</SelectItem>
                  <SelectItem value="4th Floor">4th Floor</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="nurse">Assigned Nurse</Label>
              <Input id="nurse" placeholder="e.g., Sister Mary" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddBedDialog(false)}>Cancel</Button>
            <Button onClick={() => {
              // In production, this would collect form data properly
              handleAddBed({
                number: '501',
                ward: 'General Ward A',
                roomType: 'General',
                floor: '1st Floor',
                nurse: 'Sister Mary'
              });
            }}>Add Bed</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Patient Details Dialog */}
      <Dialog open={showPatientDetailsDialog} onOpenChange={setShowPatientDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Patient Details</DialogTitle>
            <DialogDescription>
              Complete information for {selectedPatient?.patientName}
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Patient Name</Label>
                  <p className="text-sm">{selectedPatient.patientName}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Patient ID</Label>
                  <p className="text-sm">{selectedPatient.patientId}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Ward & Bed</Label>
                  <p className="text-sm">{selectedPatient.wardName} - Bed {selectedPatient.bedNumber}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Room Type</Label>
                  <p className="text-sm">{selectedPatient.roomType} • {selectedPatient.floor}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Admission Date</Label>
                  <p className="text-sm">{selectedPatient.admissionDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Current Condition</Label>
                  <p className={`text-sm font-medium ${getConditionColor(selectedPatient.condition)}`}>
                    {selectedPatient.condition}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Assigned Nurse</Label>
                  <p className="text-sm">{selectedPatient.nurseAssigned}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Last Checkup</Label>
                  <p className="text-sm">{selectedPatient.lastCheckup}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="text-sm font-semibold">Medical History</Label>
                <div className="mt-2 space-y-2">
                  <p className="text-sm text-muted-foreground">Previous Admissions: 2 times in last year</p>
                  <p className="text-sm text-muted-foreground">Allergies: None reported</p>
                  <p className="text-sm text-muted-foreground">Chronic Conditions: Hypertension, Type 2 Diabetes</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="text-sm font-semibold">Current Medications</Label>
                <ul className="mt-2 space-y-1">
                  <li className="text-sm">• Metformin 500mg - Twice daily</li>
                  <li className="text-sm">• Amlodipine 5mg - Once daily</li>
                  <li className="text-sm">• Paracetamol 650mg - As needed for pain</li>
                </ul>
              </div>

              <div className="border-t pt-4">
                <Label className="text-sm font-semibold">Emergency Contact</Label>
                <p className="text-sm mt-1">
                  Contact Name: Family Member<br />
                  Phone: +91 98765 43210<br />
                  Relationship: Spouse
                </p>
              </div>

              <div className="border-t pt-4">
                <Label className="text-sm font-semibold">Treatment Notes</Label>
                <p className="text-sm text-muted-foreground mt-1">
                  Patient responding well to treatment. Vital signs stable. 
                  Continue current medication regimen. Monitor blood sugar levels regularly.
                  Plan for discharge review in 2 days if condition remains stable.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPatientDetailsDialog(false)}>Close</Button>
            <Button onClick={() => {
              handleTransferPatient(selectedPatient.id);
              setShowPatientDetailsDialog(false);
            }}>
              Transfer Patient
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}