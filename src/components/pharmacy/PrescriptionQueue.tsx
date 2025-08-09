'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  Pill,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  Package,
  Search,
  Filter,
  FileText,
  Printer,
  Eye,
  ShoppingCart,
  AlertCircle,
  Calendar,
  Stethoscope,
  Phone,
  Mail,
  QrCode,
  ScanLine,
  Zap,
  RefreshCw,
  BarChart3,
  Timer,
  DollarSign,
  Activity
} from 'lucide-react';
import { format } from 'date-fns';

interface Medication {
  id: string;
  name: string;
  genericName: string;
  strength: string;
  form: string; // tablet, capsule, syrup, injection
  quantity: number;
  dosage: string;
  frequency: string;
  duration: string;
  durationUnit: string;
  timing: string;
  instructions?: string;
  substitutable: boolean;
  unitPrice: number;
  totalPrice: number;
  available: boolean;
  stockQuantity: number;
  expiryDate?: string;
  batchNumber?: string;
  manufacturer?: string;
}

interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  doctorName: string;
  doctorId: string;
  department: string;
  consultationDate: string;
  prescriptionDate: string;
  urgency: 'routine' | 'urgent' | 'stat';
  status: 'pending' | 'processing' | 'partially-dispensed' | 'dispensed' | 'rejected' | 'cancelled';
  medications: Medication[];
  totalAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  paymentMode?: 'cash' | 'card' | 'insurance' | 'online';
  insuranceDetails?: {
    provider: string;
    policyNumber: string;
    approvalNumber?: string;
  };
  allergies?: string[];
  specialInstructions?: string;
  pharmacistNotes?: string;
  dispensedBy?: string;
  dispensedAt?: string;
  queueNumber?: number;
}

export default function PrescriptionQueue() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showDispensingModal, setShowDispensingModal] = useState(false);
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock data for prescriptions
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    {
      id: 'RX001',
      prescriptionNumber: 'RX20240807001',
      patientId: 'P001',
      patientName: 'Rajesh Kumar',
      age: 45,
      gender: 'Male',
      phone: '9876543210',
      doctorName: 'Dr. Amit Sharma',
      doctorId: 'DR001',
      department: 'General Medicine',
      consultationDate: '2024-08-07T10:00:00',
      prescriptionDate: '2024-08-07T10:30:00',
      urgency: 'stat',
      status: 'pending',
      queueNumber: 1,
      totalAmount: 285,
      paymentStatus: 'pending',
      allergies: ['Penicillin'],
      medications: [
        {
          id: 'M001',
          name: 'Paracetamol',
          genericName: 'Acetaminophen',
          strength: '500mg',
          form: 'tablet',
          quantity: 20,
          dosage: '1 tablet',
          frequency: 'TID',
          duration: '3',
          durationUnit: 'days',
          timing: 'after_food',
          instructions: 'Take with plenty of water',
          substitutable: true,
          unitPrice: 2.50,
          totalPrice: 50,
          available: true,
          stockQuantity: 500,
          expiryDate: '2025-06-15',
          batchNumber: 'PCM2024001',
          manufacturer: 'PharmaCorp'
        },
        {
          id: 'M002',
          name: 'Amoxicillin',
          genericName: 'Amoxicillin Trihydrate',
          strength: '500mg',
          form: 'capsule',
          quantity: 15,
          dosage: '1 capsule',
          frequency: 'TID',
          duration: '5',
          durationUnit: 'days',
          timing: 'after_food',
          instructions: 'Complete the full course',
          substitutable: false,
          unitPrice: 15.00,
          totalPrice: 225,
          available: true,
          stockQuantity: 200,
          expiryDate: '2025-12-01',
          batchNumber: 'AMX2024005',
          manufacturer: 'BioMed Inc'
        },
        {
          id: 'M003',
          name: 'Omeprazole',
          genericName: 'Omeprazole',
          strength: '20mg',
          form: 'capsule',
          quantity: 7,
          dosage: '1 capsule',
          frequency: 'OD',
          duration: '7',
          durationUnit: 'days',
          timing: 'before_food',
          substitutable: true,
          unitPrice: 12.00,
          totalPrice: 84,
          available: false,
          stockQuantity: 0
        }
      ]
    },
    {
      id: 'RX002',
      prescriptionNumber: 'RX20240807002',
      patientId: 'P002',
      patientName: 'Priya Patel',
      age: 32,
      gender: 'Female',
      phone: '9876543211',
      doctorName: 'Dr. Priya Patel',
      doctorId: 'DR002',
      department: 'Cardiology',
      consultationDate: '2024-08-07T09:30:00',
      prescriptionDate: '2024-08-07T10:00:00',
      urgency: 'routine',
      status: 'processing',
      queueNumber: 2,
      totalAmount: 450,
      paymentStatus: 'paid',
      paymentMode: 'insurance',
      insuranceDetails: {
        provider: 'Star Health',
        policyNumber: 'SH123456789',
        approvalNumber: 'APP001'
      },
      medications: [
        {
          id: 'M004',
          name: 'Atorvastatin',
          genericName: 'Atorvastatin Calcium',
          strength: '20mg',
          form: 'tablet',
          quantity: 30,
          dosage: '1 tablet',
          frequency: 'OD',
          duration: '30',
          durationUnit: 'days',
          timing: 'after_dinner',
          substitutable: true,
          unitPrice: 15.00,
          totalPrice: 450,
          available: true,
          stockQuantity: 100,
          expiryDate: '2025-08-20',
          batchNumber: 'ATV2024012',
          manufacturer: 'StatinPharma'
        }
      ]
    }
  ]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // In production, this would fetch fresh data from API
        // Auto-refresh prescription queue data
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'processing': return 'default';
      case 'partially-dispensed': return 'default';
      case 'dispensed': return 'default';
      case 'rejected': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'secondary';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'stat': return 'destructive';
      case 'urgent': return 'default';
      case 'routine': return 'secondary';
      default: return 'secondary';
    }
  };

  // Removed unused getPaymentStatusColor function

  const filteredPrescriptions = prescriptions.filter(rx => {
    const matchesSearch = rx.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rx.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rx.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUrgency = filterUrgency === 'all' || rx.urgency === filterUrgency;
    
    return matchesSearch && matchesUrgency;
  });

  const getPrescriptionsByStatus = (status: string) => {
    if (status === 'all') return filteredPrescriptions;
    return filteredPrescriptions.filter(rx => {
      if (status === 'pending') return rx.status === 'pending';
      if (status === 'processing') return rx.status === 'processing';
      if (status === 'dispensed') return ['dispensed', 'partially-dispensed'].includes(rx.status);
      if (status === 'urgent') return rx.urgency === 'stat' || rx.urgency === 'urgent';
      return false;
    });
  };

  const handleStartDispensing = (prescription: Prescription) => {
    // Directly proceed to dispensing without drug interaction check
    setSelectedPrescription(prescription);
    setShowDispensingModal(true);
    
    // Update status to processing
    setPrescriptions(prev => prev.map(rx => 
      rx.id === prescription.id 
        ? { ...rx, status: 'processing' as const }
        : rx
    ));
  };

  const handleCompleteDispensing = () => {
    if (!selectedPrescription) return;
    
    setPrescriptions(prev => prev.map(rx => 
      rx.id === selectedPrescription.id 
        ? { 
            ...rx, 
            status: 'dispensed' as const, 
            dispensedBy: 'Pharmacist A',
            dispensedAt: new Date().toISOString()
          }
        : rx
    ));
    
    setShowDispensingModal(false);
    setSelectedPrescription(null);
    
    toast({
      title: "Prescription dispensed",
      description: `Prescription ${selectedPrescription.prescriptionNumber} completed successfully`,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Prescription Queue</h1>
          <p className="text-muted-foreground">Manage prescription dispensing workflow</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={autoRefresh ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Auto-Refresh: {autoRefresh ? 'ON' : 'OFF'}
          </Button>
          <Button variant="outline" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{getPrescriptionsByStatus('pending').length}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Processing</p>
                <p className="text-2xl font-bold">{getPrescriptionsByStatus('processing').length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500 animate-pulse" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Dispensed</p>
                <p className="text-2xl font-bold">{getPrescriptionsByStatus('dispensed').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgent</p>
                <p className="text-2xl font-bold text-red-600">{getPrescriptionsByStatus('urgent').length}</p>
              </div>
              <Zap className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Today's Revenue</p>
                <p className="text-2xl font-bold">₹12.5K</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, prescription number, or doctor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterUrgency} onValueChange={setFilterUrgency}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="stat">STAT</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Prescription Queue Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Prescription Queue</CardTitle>
          <CardDescription>Click on any prescription to view details and dispense medications</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                All ({filteredPrescriptions.length})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({getPrescriptionsByStatus('pending').length})
              </TabsTrigger>
              <TabsTrigger value="processing">
                Processing ({getPrescriptionsByStatus('processing').length})
              </TabsTrigger>
              <TabsTrigger value="dispensed">
                Dispensed ({getPrescriptionsByStatus('dispensed').length})
              </TabsTrigger>
              <TabsTrigger value="urgent">
                Urgent ({getPrescriptionsByStatus('urgent').length})
              </TabsTrigger>
            </TabsList>

            {['all', 'pending', 'processing', 'dispensed', 'urgent'].map(tab => (
              <TabsContent key={tab} value={tab} className="mt-4">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {getPrescriptionsByStatus(tab).map((prescription) => (
                      <Card 
                        key={prescription.id} 
                        className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                          prescription.urgency === 'stat' ? 'border-red-200 bg-red-50' : ''
                        }`}
                        onClick={() => setSelectedPrescription(prescription)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 font-semibold text-primary">
                                  {prescription.queueNumber || '#'}
                                </div>
                                <Badge variant={getStatusColor(prescription.status)}>
                                  {prescription.status.replace('-', ' ')}
                                </Badge>
                                <Badge variant={getUrgencyColor(prescription.urgency)} className="text-xs">
                                  {prescription.urgency.toUpperCase()}
                                </Badge>
                                {prescription.paymentStatus === 'paid' && (
                                  <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Paid
                                  </Badge>
                                )}
                              </div>
                              
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold">{prescription.patientName}</p>
                                  <span className="text-sm text-muted-foreground">
                                    ({prescription.age}Y/{prescription.gender})
                                  </span>
                                  <span className="text-sm text-muted-foreground">•</span>
                                  <span className="text-sm text-muted-foreground">
                                    {prescription.prescriptionNumber}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Stethoscope className="h-3 w-3" />
                                    {prescription.doctorName}
                                  </span>
                                  <span>•</span>
                                  <span>{prescription.department}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Pill className="h-3 w-3" />
                                    {prescription.medications.length} items
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    ₹{prescription.totalAmount}
                                  </span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {format(new Date(prescription.prescriptionDate), 'dd/MM HH:mm')}
                                  </span>
                                </div>
                                
                                {/* Quick medication preview */}
                                <div className="flex gap-2 mt-2">
                                  {prescription.medications.slice(0, 3).map((med, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {med.name} {med.strength}
                                      {!med.available && (
                                        <AlertTriangle className="h-3 w-3 ml-1 text-red-500" />
                                      )}
                                    </Badge>
                                  ))}
                                  {prescription.medications.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{prescription.medications.length - 3} more
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {prescription.insuranceDetails && (
                                <Badge variant="outline" className="text-xs">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {prescription.insuranceDetails.provider}
                                </Badge>
                              )}
                              
                              {prescription.allergies && prescription.allergies.length > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Allergies
                                </Badge>
                              )}
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPrescription(prescription);
                                }}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                              
                              {prescription.status === 'pending' && (
                                <Button 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStartDispensing(prescription);
                                  }}
                                  className={prescription.urgency === 'stat' ? 'bg-red-600 hover:bg-red-700' : ''}
                                >
                                  <Package className="h-4 w-4 mr-2" />
                                  Start Dispensing
                                </Button>
                              )}
                              
                              {prescription.status === 'processing' && (
                                <Button 
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedPrescription(prescription);
                                    setShowDispensingModal(true);
                                  }}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Complete
                                </Button>
                              )}
                              
                              {prescription.status === 'dispensed' && (
                                <Button size="sm" variant="outline">
                                  <Printer className="h-4 w-4 mr-2" />
                                  Print Receipt
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          {/* Special alerts */}
                          {prescription.allergies && prescription.allergies.length > 0 && (
                            <Alert className="mt-3 border-red-200 bg-red-50">
                              <AlertCircle className="h-4 w-4 text-red-500" />
                              <AlertTitle className="text-red-700">Allergy Alert</AlertTitle>
                              <AlertDescription className="text-red-600">
                                Patient allergic to: {prescription.allergies.join(', ')}
                              </AlertDescription>
                            </Alert>
                          )}
                          
                          {prescription.medications.some(m => !m.available) && (
                            <Alert className="mt-3 border-amber-200 bg-amber-50">
                              <AlertTriangle className="h-4 w-4 text-amber-500" />
                              <AlertTitle className="text-amber-700">Stock Alert</AlertTitle>
                              <AlertDescription className="text-amber-600">
                                Some medications are out of stock - substitutions may be required
                              </AlertDescription>
                            </Alert>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Dispensing Modal */}
      <Dialog open={showDispensingModal} onOpenChange={setShowDispensingModal}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Dispense Prescription</DialogTitle>
            <DialogDescription>
              {selectedPrescription?.prescriptionNumber} - {selectedPrescription?.patientName}
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[60vh] pr-4">
            {selectedPrescription && (
              <div className="space-y-4">
                {/* Patient and Prescription Info */}
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Patient Information</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                      <p><strong>Name:</strong> {selectedPrescription.patientName}</p>
                      <p><strong>Age/Gender:</strong> {selectedPrescription.age}Y / {selectedPrescription.gender}</p>
                      <p><strong>Phone:</strong> {selectedPrescription.phone}</p>
                      {selectedPrescription.allergies && (
                        <p><strong>Allergies:</strong> 
                          <span className="text-red-600"> {selectedPrescription.allergies.join(', ')}</span>
                        </p>
                      )}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Prescription Details</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-1">
                      <p><strong>Doctor:</strong> {selectedPrescription.doctorName}</p>
                      <p><strong>Department:</strong> {selectedPrescription.department}</p>
                      <p><strong>Date:</strong> {format(new Date(selectedPrescription.prescriptionDate), 'dd MMM yyyy HH:mm')}</p>
                      <p><strong>Total Amount:</strong> ₹{selectedPrescription.totalAmount}</p>
                    </CardContent>
                  </Card>
                </div>
                
                {/* Medications List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Medications to Dispense</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedPrescription.medications.map((medication, index) => (
                        <div key={medication.id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium">{medication.name}</h4>
                                <Badge variant="outline" className="text-xs">
                                  {medication.strength}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {medication.form}
                                </Badge>
                                {!medication.available && (
                                  <Badge variant="destructive" className="text-xs">
                                    Out of Stock
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="grid grid-cols-4 gap-4 mt-2 text-sm text-muted-foreground">
                                <div>
                                  <p className="font-medium">Dosage</p>
                                  <p>{medication.dosage} {medication.frequency}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Duration</p>
                                  <p>{medication.duration} {medication.durationUnit}</p>
                                </div>
                                <div>
                                  <p className="font-medium">Quantity</p>
                                  <p>{medication.quantity} {medication.form}s</p>
                                </div>
                                <div>
                                  <p className="font-medium">Price</p>
                                  <p>₹{medication.totalPrice}</p>
                                </div>
                              </div>
                              
                              {medication.instructions && (
                                <p className="text-sm text-blue-600 mt-2">
                                  <strong>Instructions:</strong> {medication.instructions}
                                </p>
                              )}
                              
                              {medication.available && (
                                <div className="grid grid-cols-3 gap-4 mt-2 text-xs text-muted-foreground">
                                  <p><strong>Stock:</strong> {medication.stockQuantity} units</p>
                                  <p><strong>Batch:</strong> {medication.batchNumber}</p>
                                  <p><strong>Expiry:</strong> {medication.expiryDate && format(new Date(medication.expiryDate), 'MMM yyyy')}</p>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Checkbox 
                                id={`med-${medication.id}`}
                                defaultChecked={medication.available}
                                disabled={!medication.available}
                              />
                              <Label htmlFor={`med-${medication.id}`} className="text-sm">
                                {medication.available ? 'Dispense' : 'Substitute'}
                              </Label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Pharmacist Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Pharmacist Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Add any notes about substitutions, patient counseling, or special instructions..."
                      rows={3}
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </ScrollArea>
          
          <DialogFooter className="flex justify-between">
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowDispensingModal(false)}>
                Cancel
              </Button>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                Partial Dispense
              </Button>
              <Button onClick={handleCompleteDispensing}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Dispensing
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}