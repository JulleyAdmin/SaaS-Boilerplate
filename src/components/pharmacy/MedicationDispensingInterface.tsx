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
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Pill,
  User,
  Clock,
  AlertTriangle,
  CheckCircle,
  Package,
  Search,
  Printer,
  QrCode,
  ScanLine,
  Zap,
  ShoppingCart,
  AlertCircle,
  Calendar,
  Stethoscope,
  DollarSign,
  Tag,
  RefreshCw,
  FileText,
  CreditCard,
  Receipt,
  MapPin,
  Activity,
  Timer,
  Scale
} from 'lucide-react';
import { format } from 'date-fns';

interface Medication {
  id: string;
  name: string;
  genericName: string;
  strength: string;
  form: string;
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
  dispensed?: boolean;
  dispensedQuantity?: number;
  substitution?: {
    originalMedicine: string;
    substitute: string;
    reason: string;
  };
}

interface Prescription {
  id: string;
  prescriptionNumber: string;
  patientId: string;
  patientName: string;
  age: number;
  gender: string;
  phone: string;
  address?: string;
  doctorName: string;
  doctorId: string;
  department: string;
  consultationDate: string;
  prescriptionDate: string;
  urgency: 'routine' | 'urgent' | 'stat';
  status: 'pending' | 'processing' | 'partially-dispensed' | 'dispensed' | 'rejected' | 'cancelled';
  medications: Medication[];
  totalAmount: number;
  discountAmount?: number;
  finalAmount: number;
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

interface DispensingRecord {
  id: string;
  prescriptionId: string;
  medicationId: string;
  dispensedQuantity: number;
  batchNumber: string;
  expiryDate: string;
  dispensedAt: string;
  dispensedBy: string;
  patientSignature?: boolean;
  labelPrinted: boolean;
  receiptPrinted: boolean;
}

export default function MedicationDispensingInterface({ prescriptionId }: { prescriptionId?: string }) {
  const { toast } = useToast();
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [dispensingRecords, setDispensingRecords] = useState<DispensingRecord[]>([]);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showLabelPrint, setShowLabelPrint] = useState(false);
  const [showReceipt, setShowReceiptModal] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [showSubstitutionModal, setShowSubstitutionModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [scanningMode, setScanningMode] = useState<'prescription' | 'medication'>('prescription');
  const [scannedCode, setScannedCode] = useState('');
  const [dispensingNotes, setDispensingNotes] = useState('');
  const [currentDispensing, setCurrentDispensing] = useState<Medication | null>(null);
  const [selectedMedicationForSubstitution, setSelectedMedicationForSubstitution] = useState<Medication | null>(null);
  const [substitutionReason, setSubstitutionReason] = useState('');
  const [selectedSubstitute, setSelectedSubstitute] = useState('');

  // Mock prescription data
  const [prescription] = useState<Prescription>({
    id: 'RX001',
    prescriptionNumber: 'RX20240807001',
    patientId: 'P001',
    patientName: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    phone: '9876543210',
    address: '123 MG Road, Bangalore, Karnataka 560001',
    doctorName: 'Dr. Amit Sharma',
    doctorId: 'DR001',
    department: 'General Medicine',
    consultationDate: '2024-08-07T10:00:00',
    prescriptionDate: '2024-08-07T10:30:00',
    urgency: 'stat',
    status: 'processing',
    queueNumber: 1,
    totalAmount: 285,
    discountAmount: 25,
    finalAmount: 260,
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
        manufacturer: 'PharmaCorp',
        dispensed: false
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
        manufacturer: 'BioMed Inc',
        dispensed: false
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
        stockQuantity: 0,
        dispensed: false,
        substitution: {
          originalMedicine: 'Omeprazole 20mg',
          substitute: 'Pantoprazole 20mg',
          reason: 'Out of stock - therapeutic equivalent'
        }
      }
    ]
  });

  useEffect(() => {
    if (prescriptionId) {
      // In production, load prescription by ID
      setSelectedPrescription(prescription);
    }
  }, [prescriptionId]);

  const handleBarcodeScann = (code: string) => {
    if (scanningMode === 'prescription') {
      // Load prescription by barcode
      setSelectedPrescription(prescription);
      toast({
        title: "Prescription loaded",
        description: `Prescription ${code} loaded successfully`,
      });
    } else {
      // Verify medication barcode
      const medication = prescription.medications.find(m => m.batchNumber === code);
      if (medication) {
        setCurrentDispensing(medication);
        toast({
          title: "Medication verified",
          description: `${medication.name} batch ${code} verified`,
        });
      } else {
        toast({
          title: "Medication not found",
          description: `Batch ${code} not found in this prescription`,
          variant: "destructive"
        });
      }
    }
    setShowBarcodeScanner(false);
    setScannedCode('');
  };

  const handleDispenseMedication = (medication: Medication) => {
    const record: DispensingRecord = {
      id: `DR${Date.now()}`,
      prescriptionId: prescription.id,
      medicationId: medication.id,
      dispensedQuantity: medication.quantity,
      batchNumber: medication.batchNumber || '',
      expiryDate: medication.expiryDate || '',
      dispensedAt: new Date().toISOString(),
      dispensedBy: 'Pharmacist A',
      labelPrinted: false,
      receiptPrinted: false
    };

    setDispensingRecords(prev => [...prev, record]);
    
    // Update medication as dispensed
    setSelectedPrescription(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        medications: prev.medications.map(m =>
          m.id === medication.id
            ? { ...m, dispensed: true, dispensedQuantity: medication.quantity }
            : m
        )
      };
    });

    toast({
      title: "Medication dispensed",
      description: `${medication.name} dispensed successfully`,
    });
  };

  const printMedicationLabel = (medication: Medication) => {
    // Mock label printing
    setShowLabelPrint(true);
    setTimeout(() => {
      setShowLabelPrint(false);
      toast({
        title: "Label printed",
        description: `Medication label for ${medication.name} printed successfully`,
      });
    }, 2000);
  };

  const calculateDispensingProgress = () => {
    const totalMeds = prescription.medications.length;
    const dispensedMeds = prescription.medications.filter(m => m.dispensed).length;
    return { dispensed: dispensedMeds, total: totalMeds, percentage: (dispensedMeds / totalMeds) * 100 };
  };

  const generateReceipt = () => {
    const dispensedMeds = prescription.medications.filter(m => m.dispensed);
    const receiptData = {
      prescriptionNumber: prescription.prescriptionNumber,
      patientName: prescription.patientName,
      date: format(new Date(), 'dd/MM/yyyy HH:mm'),
      items: dispensedMeds,
      total: dispensedMeds.reduce((sum, med) => sum + med.totalPrice, 0),
      discount: prescription.discountAmount || 0,
      finalAmount: prescription.finalAmount
    };
    
    setShowReceiptModal(true);
    return receiptData;
  };

  const handleSubstituteMedication = () => {
    if (!selectedMedicationForSubstitution || !selectedSubstitute) return;
    
    // Update medication with substitution
    setSelectedPrescription(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        medications: prev.medications.map(m =>
          m.id === selectedMedicationForSubstitution.id
            ? { 
                ...m, 
                substitution: {
                  originalMedicine: m.name,
                  substitute: selectedSubstitute,
                  reason: substitutionReason
                },
                name: selectedSubstitute, // Replace with substitute name
                genericName: 'Generic ' + selectedSubstitute // Update generic name
              }
            : m
        )
      };
    });
    
    toast({
      title: "Medication substituted",
      description: `${selectedMedicationForSubstitution.name} substituted with ${selectedSubstitute}`,
    });
    
    setShowSubstitutionModal(false);
    setSelectedMedicationForSubstitution(null);
    setSubstitutionReason('');
    setSelectedSubstitute('');
  };

  const handleCompleteDispensing = () => {
    // Check if all medications are dispensed
    const allDispensed = prescription.medications.every(m => m.dispensed);
    
    if (!allDispensed) {
      toast({
        title: "Incomplete dispensing",
        description: "Please dispense all medications before completing",
        variant: "destructive"
      });
      return;
    }
    
    // Update prescription status
    setSelectedPrescription(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        status: 'dispensed',
        dispensedBy: 'Pharmacist A',
        dispensedAt: new Date().toISOString(),
        pharmacistNotes: dispensingNotes
      };
    });
    
    toast({
      title: "Dispensing completed",
      description: `Prescription ${prescription.prescriptionNumber} has been fully dispensed`,
    });
    
    setShowCompleteModal(false);
    
    // Reset after a delay to show completion
    setTimeout(() => {
      setSelectedPrescription(null);
      setDispensingRecords([]);
      setDispensingNotes('');
    }, 2000);
  };

  const progress = calculateDispensingProgress();

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Medication Dispensing</h1>
          <p className="text-muted-foreground">Professional medication dispensing interface</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              setScanningMode('prescription');
              setShowBarcodeScanner(true);
            }}
          >
            <QrCode className="h-4 w-4 mr-2" />
            Scan Prescription
          </Button>
          <Button variant="outline" size="sm">
            <Activity className="h-4 w-4 mr-2" />
            Dispensing Analytics
          </Button>
        </div>
      </div>

      {!selectedPrescription ? (
        /* Prescription Scanner */
        <Card className="h-96">
          <CardContent className="flex items-center justify-center h-full">
            <div className="text-center space-y-4">
              <QrCode className="h-16 w-16 mx-auto text-muted-foreground" />
              <h3 className="text-xl font-semibold">Scan Prescription Barcode</h3>
              <p className="text-muted-foreground">Scan the QR code on the prescription to begin dispensing</p>
              <Button onClick={() => setShowBarcodeScanner(true)} size="lg">
                <ScanLine className="h-4 w-4 mr-2" />
                Open Scanner
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Prescription Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Patient Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{selectedPrescription.patientName}</span>
                </div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>{selectedPrescription.age}Y / {selectedPrescription.gender}</p>
                  <p>📞 {selectedPrescription.phone}</p>
                  {selectedPrescription.address && (
                    <p className="flex items-start gap-2">
                      <MapPin className="h-3 w-3 mt-1 flex-shrink-0" />
                      <span className="text-xs">{selectedPrescription.address}</span>
                    </p>
                  )}
                </div>
                {selectedPrescription.allergies && selectedPrescription.allergies.length > 0 && (
                  <Alert className="mt-3 border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertTitle className="text-red-700 text-sm">Allergies</AlertTitle>
                    <AlertDescription className="text-red-600 text-xs">
                      {selectedPrescription.allergies.join(', ')}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Prescription Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <p className="text-sm"><strong>Number:</strong> {selectedPrescription.prescriptionNumber}</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Stethoscope className="h-3 w-3" />
                    <span>{selectedPrescription.doctorName}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{selectedPrescription.department}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(selectedPrescription.prescriptionDate), 'dd MMM yyyy HH:mm')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={selectedPrescription.urgency === 'stat' ? 'destructive' : 
                               selectedPrescription.urgency === 'urgent' ? 'default' : 'secondary'}
                    >
                      {selectedPrescription.urgency.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Dispensing Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress.dispensed}/{progress.total} medications</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progress.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span>₹{selectedPrescription.totalAmount}</span>
                  </div>
                  {selectedPrescription.discountAmount && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-₹{selectedPrescription.discountAmount}</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Final Amount:</span>
                    <span>₹{selectedPrescription.finalAmount}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Medication Dispensing */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Medication Dispensing
              </CardTitle>
              <CardDescription>
                Scan barcodes, dispense medications, and print labels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {selectedPrescription.medications.map((medication, index) => (
                    <Card key={medication.id} className={`transition-all duration-300 ${
                      medication.dispensed 
                        ? 'border-green-200 bg-green-50' 
                        : medication.available 
                          ? 'border-blue-200 bg-blue-50' 
                          : 'border-amber-200 bg-amber-50'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 font-semibold text-primary text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-semibold text-lg">{medication.name}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {medication.genericName} • {medication.strength} • {medication.form}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                {medication.dispensed && (
                                  <Badge variant="default" className="bg-green-100 text-green-800">
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                    Dispensed
                                  </Badge>
                                )}
                                {!medication.available && (
                                  <Badge variant="destructive">
                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                    Out of Stock
                                  </Badge>
                                )}
                                {medication.substitution && (
                                  <Badge variant="default" className="bg-blue-100 text-blue-800">
                                    <RefreshCw className="h-3 w-3 mr-1" />
                                    Substituted
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Substitution Notice */}
                            {medication.substitution && (
                              <Alert className="border-blue-200 bg-blue-50">
                                <RefreshCw className="h-4 w-4 text-blue-500" />
                                <AlertTitle className="text-blue-700">Substitution Required</AlertTitle>
                                <AlertDescription className="text-blue-600">
                                  <strong>Original:</strong> {medication.substitution.originalMedicine}<br/>
                                  <strong>Substitute:</strong> {medication.substitution.substitute}<br/>
                                  <strong>Reason:</strong> {medication.substitution.reason}
                                </AlertDescription>
                              </Alert>
                            )}

                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="font-medium text-muted-foreground">Quantity</p>
                                <p className="font-semibold">{medication.quantity} {medication.form}s</p>
                              </div>
                              <div>
                                <p className="font-medium text-muted-foreground">Dosage</p>
                                <p className="font-semibold">{medication.dosage} {medication.frequency}</p>
                              </div>
                              <div>
                                <p className="font-medium text-muted-foreground">Duration</p>
                                <p className="font-semibold">{medication.duration} {medication.durationUnit}</p>
                              </div>
                              <div>
                                <p className="font-medium text-muted-foreground">Price</p>
                                <p className="font-semibold">₹{medication.totalPrice}</p>
                              </div>
                            </div>

                            {medication.instructions && (
                              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                                <p className="text-sm text-blue-700">
                                  <strong>Instructions:</strong> {medication.instructions}
                                </p>
                              </div>
                            )}

                            {medication.available && (
                              <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground bg-gray-50 p-3 rounded-lg">
                                <p><strong>Stock:</strong> {medication.stockQuantity} units</p>
                                <p><strong>Batch:</strong> {medication.batchNumber}</p>
                                <p><strong>Expiry:</strong> {medication.expiryDate && format(new Date(medication.expiryDate), 'MMM yyyy')}</p>
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-col gap-2 ml-4">
                            {!medication.dispensed && medication.available && (
                              <>
                                <Button 
                                  size="sm"
                                  onClick={() => {
                                    setScanningMode('medication');
                                    setCurrentDispensing(medication);
                                    setShowBarcodeScanner(true);
                                  }}
                                  variant="outline"
                                >
                                  <ScanLine className="h-4 w-4 mr-2" />
                                  Scan
                                </Button>
                                <Button 
                                  size="sm"
                                  onClick={() => handleDispenseMedication(medication)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Package className="h-4 w-4 mr-2" />
                                  Dispense
                                </Button>
                              </>
                            )}
                            
                            {medication.dispensed && (
                              <>
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  onClick={() => printMedicationLabel(medication)}
                                >
                                  <Printer className="h-4 w-4 mr-2" />
                                  Print Label
                                </Button>
                                <Button 
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-200"
                                  disabled
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Complete
                                </Button>
                              </>
                            )}
                            
                            {!medication.available && (
                              <Button 
                                size="sm"
                                variant="outline"
                                className="border-orange-200 text-orange-600"
                                onClick={() => {
                                  setSelectedMedicationForSubstitution(medication);
                                  setShowSubstitutionModal(true);
                                }}
                              >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Find Substitute
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>

              {/* Dispensing Actions */}
              <div className="mt-6 flex justify-between items-center">
                <div className="space-y-2">
                  <Label htmlFor="notes">Pharmacist Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Add any notes about the dispensing process..."
                    value={dispensingNotes}
                    onChange={(e) => setDispensingNotes(e.target.value)}
                    rows={2}
                    className="w-96"
                  />
                </div>
                
                <div className="flex gap-2">
                  {progress.percentage === 100 ? (
                    <>
                      <Button variant="outline" onClick={() => setShowPayment(true)}>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Process Payment
                      </Button>
                      <Button onClick={generateReceipt}>
                        <Receipt className="h-4 w-4 mr-2" />
                        Generate Receipt
                      </Button>
                      <Button 
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => setShowCompleteModal(true)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Complete Dispensing
                      </Button>
                    </>
                  ) : (
                    <Button variant="outline" disabled>
                      <Timer className="h-4 w-4 mr-2" />
                      Dispensing in Progress ({progress.dispensed}/{progress.total})
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Barcode Scanner Modal */}
      <Dialog open={showBarcodeScanner} onOpenChange={setShowBarcodeScanner}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Scan {scanningMode === 'prescription' ? 'Prescription' : 'Medication'} Barcode
            </DialogTitle>
            <DialogDescription>
              {scanningMode === 'prescription' 
                ? 'Scan the QR code on the prescription' 
                : `Scan the barcode on ${currentDispensing?.name || 'medication'} package`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-center h-48 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="text-center space-y-2">
                <ScanLine className="h-16 w-16 mx-auto text-gray-400" />
                <p className="text-gray-500">Camera scanner would appear here</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Manual Entry</Label>
              <Input
                placeholder="Enter barcode manually..."
                value={scannedCode}
                onChange={(e) => setScannedCode(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && scannedCode) {
                    handleBarcodeScann(scannedCode);
                  }
                }}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBarcodeScanner(false)}>
              Cancel
            </Button>
            <Button onClick={() => scannedCode && handleBarcodeScann(scannedCode)} disabled={!scannedCode}>
              Process Scan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Label Printing Modal */}
      <Dialog open={showLabelPrint} onOpenChange={setShowLabelPrint}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Printing Medication Label</DialogTitle>
            <DialogDescription>
              Generating and printing medication label...
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center h-32">
            <div className="text-center space-y-2">
              <Printer className="h-12 w-12 mx-auto text-blue-500 animate-pulse" />
              <p className="text-sm text-muted-foreground">Printing label...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Receipt Modal */}
      <Dialog open={showReceipt} onOpenChange={setShowReceiptModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Prescription Receipt</DialogTitle>
            <DialogDescription>
              Medication dispensing completed successfully
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div className="text-center border-b pb-2">
              <h3 className="font-bold">City General Hospital</h3>
              <p className="text-xs text-muted-foreground">Pharmacy Department</p>
            </div>
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Receipt #:</span>
                <span>RCP{Date.now()}</span>
              </div>
              <div className="flex justify-between">
                <span>Patient:</span>
                <span>{selectedPrescription?.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{format(new Date(), 'dd/MM/yyyy HH:mm')}</span>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              {selectedPrescription?.medications.filter(m => m.dispensed).map((med, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span>{med.name} x{med.quantity}</span>
                  <span>₹{med.totalPrice}</span>
                </div>
              ))}
            </div>
            
            <Separator />
            
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{selectedPrescription?.totalAmount}</span>
              </div>
              {selectedPrescription?.discountAmount && (
                <div className="flex justify-between text-green-600">
                  <span>Discount:</span>
                  <span>-₹{selectedPrescription.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold">
                <span>Total Paid:</span>
                <span>₹{selectedPrescription?.finalAmount}</span>
              </div>
            </div>
            
            <div className="text-center text-xs text-muted-foreground border-t pt-2">
              <p>Thank you for choosing our pharmacy!</p>
              <p>Keep this receipt for your records</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReceiptModal(false)}>
              Close
            </Button>
            <Button>
              <Printer className="h-4 w-4 mr-2" />
              Print Receipt
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Medication Substitution Modal */}
      <Dialog open={showSubstitutionModal} onOpenChange={setShowSubstitutionModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Find Substitute Medication</DialogTitle>
            <DialogDescription>
              Find an alternative medication for {selectedMedicationForSubstitution?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Original Medication</AlertTitle>
              <AlertDescription>
                <p><strong>{selectedMedicationForSubstitution?.name}</strong></p>
                <p className="text-sm">{selectedMedicationForSubstitution?.genericName} - {selectedMedicationForSubstitution?.strength}</p>
                <p className="text-sm text-muted-foreground">Form: {selectedMedicationForSubstitution?.form}</p>
              </AlertDescription>
            </Alert>
            
            <div>
              <Label>Select Substitute</Label>
              <Select value={selectedSubstitute} onValueChange={setSelectedSubstitute}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a substitute medication" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Paracetamol 650mg">Paracetamol 650mg (Generic Alternative)</SelectItem>
                  <SelectItem value="Ibuprofen 400mg">Ibuprofen 400mg (Alternative NSAID)</SelectItem>
                  <SelectItem value="Diclofenac 50mg">Diclofenac 50mg (Alternative NSAID)</SelectItem>
                  <SelectItem value="Aspirin 300mg">Aspirin 300mg (Alternative Analgesic)</SelectItem>
                  <SelectItem value="Naproxen 250mg">Naproxen 250mg (Alternative NSAID)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Reason for Substitution</Label>
              <Select value={substitutionReason} onValueChange={setSubstitutionReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select reason" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="out_of_stock">Out of Stock</SelectItem>
                  <SelectItem value="patient_request">Patient Request</SelectItem>
                  <SelectItem value="cost_effectiveness">Cost Effectiveness</SelectItem>
                  <SelectItem value="doctor_recommendation">Doctor Recommendation</SelectItem>
                  <SelectItem value="allergy_alternative">Allergy Alternative</SelectItem>
                  <SelectItem value="insurance_preference">Insurance Preference</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Additional Notes</Label>
              <Textarea
                placeholder="Enter any additional notes about the substitution..."
                value={dispensingNotes}
                onChange={(e) => setDispensingNotes(e.target.value)}
                rows={3}
              />
            </div>
            
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-700">Important</AlertTitle>
              <AlertDescription className="text-amber-600">
                Please ensure the substitute medication is therapeutically equivalent and the patient is informed about the change.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowSubstitutionModal(false);
              setSelectedMedicationForSubstitution(null);
              setSubstitutionReason('');
              setSelectedSubstitute('');
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubstituteMedication} 
              disabled={!selectedSubstitute || !substitutionReason}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Apply Substitution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Complete Dispensing Modal */}
      <Dialog open={showCompleteModal} onOpenChange={setShowCompleteModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Dispensing</DialogTitle>
            <DialogDescription>
              Finalize the dispensing process for prescription {prescription?.prescriptionNumber}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-700">Ready to Complete</AlertTitle>
              <AlertDescription className="text-green-600">
                <p>All {progress.total} medications have been dispensed successfully.</p>
                <p className="mt-2">Patient: <strong>{prescription?.patientName}</strong></p>
              </AlertDescription>
            </Alert>
            
            <div>
              <Label>Pharmacist Notes (Optional)</Label>
              <Textarea
                placeholder="Enter any final notes or special instructions..."
                value={dispensingNotes}
                onChange={(e) => setDispensingNotes(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Verification Checklist</Label>
              <div className="space-y-2 p-3 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Patient identity verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Prescription validity checked</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Dosage instructions provided</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Side effects explained</span>
                </div>
              </div>
            </div>
            
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Final Confirmation</AlertTitle>
              <AlertDescription>
                By completing this dispensing, you confirm that all medications have been properly verified, 
                labeled, and provided to the patient with appropriate counseling.
              </AlertDescription>
            </Alert>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCompleteModal(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={handleCompleteDispensing}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Confirm & Complete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}