'use client';

import { ArrowLeft, Calculator, CreditCard, FileText, Plus, Printer, Save, Search, Trash2, User, Building, Calendar } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState, useMemo } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/utils/format';
import { 
  useCreatePatientBill, 
  useGovernmentSchemes, 
  type BillType, 
  type PaymentMethod,
  type CreateBillRequest 
} from '@/hooks/api/useHospitalBilling';

// Mock services data aligned with hospital departments
const mockServices = [
  // Consultation Services
  { id: 'SRV001', name: 'General Medicine Consultation', price: 500, category: 'consultation', department: 'General Medicine', serviceCode: 'CONS001' },
  { id: 'SRV002', name: 'Pediatric Consultation', price: 600, category: 'consultation', department: 'Pediatrics', serviceCode: 'CONS002' },
  { id: 'SRV003', name: 'Cardiology Consultation', price: 800, category: 'consultation', department: 'Cardiology', serviceCode: 'CONS003' },
  { id: 'SRV004', name: 'Emergency Consultation', price: 1000, category: 'consultation', department: 'Emergency', serviceCode: 'CONS004' },
  
  // Laboratory Services
  { id: 'LAB001', name: 'Complete Blood Count (CBC)', price: 300, category: 'lab', department: 'Pathology', serviceCode: 'LAB001' },
  { id: 'LAB002', name: 'Blood Sugar Fasting', price: 150, category: 'lab', department: 'Pathology', serviceCode: 'LAB002' },
  { id: 'LAB003', name: 'Lipid Profile', price: 450, category: 'lab', department: 'Pathology', serviceCode: 'LAB003' },
  { id: 'LAB004', name: 'Liver Function Test', price: 600, category: 'lab', department: 'Pathology', serviceCode: 'LAB004' },
  { id: 'LAB005', name: 'Thyroid Function Test', price: 800, category: 'lab', department: 'Pathology', serviceCode: 'LAB005' },
  
  // Imaging Services
  { id: 'RAD001', name: 'X-Ray Chest PA View', price: 400, category: 'imaging', department: 'Radiology', serviceCode: 'RAD001' },
  { id: 'RAD002', name: 'ECG 12-Lead', price: 200, category: 'imaging', department: 'Cardiology', serviceCode: 'RAD002' },
  { id: 'RAD003', name: 'Ultrasound Abdomen', price: 800, category: 'imaging', department: 'Radiology', serviceCode: 'RAD003' },
  { id: 'RAD004', name: 'CT Scan Head', price: 3000, category: 'imaging', department: 'Radiology', serviceCode: 'RAD004' },
  
  // Procedure Services
  { id: 'PROC001', name: 'Wound Suturing', price: 500, category: 'procedure', department: 'General Surgery', serviceCode: 'PROC001' },
  { id: 'PROC002', name: 'Dressing Change', price: 200, category: 'procedure', department: 'General Surgery', serviceCode: 'PROC002' },
  { id: 'PROC003', name: 'Injection IM/IV', price: 100, category: 'procedure', department: 'General Medicine', serviceCode: 'PROC003' },
  
  // Pharmacy Services
  { id: 'MED001', name: 'Paracetamol 500mg Tab', price: 20, category: 'pharmacy', department: 'Pharmacy', serviceCode: 'MED001' },
  { id: 'MED002', name: 'Amoxicillin 250mg Cap', price: 45, category: 'pharmacy', department: 'Pharmacy', serviceCode: 'MED002' },
  { id: 'MED003', name: 'Insulin Injection', price: 350, category: 'pharmacy', department: 'Pharmacy', serviceCode: 'MED003' },
];

// Mock patients data
const mockPatients = [
  { id: 'P001', name: 'Rajesh Kumar', phone: '+91 9876543210', age: 45, gender: 'Male', abhaId: '12-3456-7890-1234' },
  { id: 'P002', name: 'Sunita Devi', phone: '+91 9876543211', age: 38, gender: 'Female', abhaId: '12-3456-7890-1235' },
  { id: 'P003', name: 'Amit Singh', phone: '+91 9876543212', age: 29, gender: 'Male', abhaId: '12-3456-7890-1236' },
  { id: 'P004', name: 'Priya Sharma', phone: '+91 9876543213', age: 52, gender: 'Female', abhaId: '12-3456-7890-1237' },
  { id: 'P005', name: 'Mohammed Ali', phone: '+91 9876543214', age: 34, gender: 'Male', abhaId: '12-3456-7890-1238' },
];

interface BillItem {
  serviceId: string;
  serviceName: string;
  serviceCode: string;
  quantity: number;
  unitPrice: number;
  discountPercentage: number;
  discountAmount: number;
  taxPercentage: number;
  taxAmount: number;
  lineTotal: number;
  category: string;
  department: string;
  prescribedBy?: string;
  serviceDate?: string;
}

interface PatientInfo {
  id: string;
  name: string;
  phone: string;
  age: number;
  gender: string;
  abhaId?: string;
}

export default function CreateHospitalBillingPage() {
  const t = useTranslations('billing');
  
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [serviceQuantity, setServiceQuantity] = useState(1);
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [billType, setBillType] = useState<BillType>('consultation');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [selectedScheme, setSelectedScheme] = useState<string>('');
  const [globalDiscountPercentage, setGlobalDiscountPercentage] = useState(0);
  const [billNotes, setBillNotes] = useState('');
  const [isPatientSearchOpen, setIsPatientSearchOpen] = useState(false);
  
  const { mutate: createBill, isLoading } = useCreatePatientBill();
  const { data: governmentSchemes = [] } = useGovernmentSchemes();

  // Filter patients based on search
  const filteredPatients = useMemo(() => 
    mockPatients.filter(patient =>
      patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
      patient.phone.includes(patientSearch) ||
      (patient.abhaId && patient.abhaId.includes(patientSearch))
    ), [patientSearch]
  );

  // Filter services based on search and bill type
  const filteredServices = useMemo(() => 
    mockServices.filter(service =>
      (service.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
       service.serviceCode.toLowerCase().includes(serviceSearch.toLowerCase())) &&
      (billType === 'consultation' ? service.category === 'consultation' :
       billType === 'lab' ? service.category === 'lab' :
       billType === 'imaging' ? service.category === 'imaging' :
       billType === 'procedure' ? service.category === 'procedure' :
       billType === 'pharmacy' ? service.category === 'pharmacy' :
       true) // For emergency and admission, show all services
    ), [serviceSearch, billType]
  );

  const handlePatientSelect = (patient: PatientInfo) => {
    setSelectedPatient(patient);
    setPatientSearch(patient.name);
    setIsPatientSearchOpen(false);
  };

  const handleAddService = () => {
    if (!selectedService || serviceQuantity <= 0) {
      toast({
        title: "Validation Error",
        description: "Please select a service and enter valid quantity",
        variant: "destructive"
      });
      return;
    }

    const service = mockServices.find(s => s.id === selectedService);
    if (!service) return;

    const existingItemIndex = billItems.findIndex(item => item.serviceId === selectedService);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...billItems];
      const existingItem = updatedItems[existingItemIndex];
      existingItem.quantity += serviceQuantity;
      
      // Recalculate amounts
      const subtotal = existingItem.quantity * existingItem.unitPrice;
      existingItem.discountAmount = (subtotal * existingItem.discountPercentage) / 100;
      const afterDiscount = subtotal - existingItem.discountAmount;
      existingItem.taxAmount = (afterDiscount * existingItem.taxPercentage) / 100;
      existingItem.lineTotal = afterDiscount + existingItem.taxAmount;
      
      setBillItems(updatedItems);
    } else {
      // Add new item
      const subtotal = service.price * serviceQuantity;
      const discountPercentage = globalDiscountPercentage;
      const discountAmount = (subtotal * discountPercentage) / 100;
      const afterDiscount = subtotal - discountAmount;
      const taxPercentage = service.category === 'pharmacy' ? 5 : 18; // Different tax rates
      const taxAmount = (afterDiscount * taxPercentage) / 100;
      const lineTotal = afterDiscount + taxAmount;

      const newItem: BillItem = {
        serviceId: service.id,
        serviceName: service.name,
        serviceCode: service.serviceCode,
        quantity: serviceQuantity,
        unitPrice: service.price,
        discountPercentage,
        discountAmount,
        taxPercentage,
        taxAmount,
        lineTotal,
        category: service.category,
        department: service.department,
        serviceDate: new Date().toISOString().split('T')[0],
      };
      setBillItems([...billItems, newItem]);
    }

    setSelectedService('');
    setServiceQuantity(1);
    setServiceSearch('');
  };

  const handleRemoveItem = (serviceId: string) => {
    setBillItems(items => items.filter(item => item.serviceId !== serviceId));
  };

  const updateItemQuantity = (serviceId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(serviceId);
      return;
    }

    setBillItems(items =>
      items.map(item => {
        if (item.serviceId === serviceId) {
          const subtotal = newQuantity * item.unitPrice;
          const discountAmount = (subtotal * item.discountPercentage) / 100;
          const afterDiscount = subtotal - discountAmount;
          const taxAmount = (afterDiscount * item.taxPercentage) / 100;
          const lineTotal = afterDiscount + taxAmount;
          
          return {
            ...item,
            quantity: newQuantity,
            discountAmount,
            taxAmount,
            lineTotal
          };
        }
        return item;
      })
    );
  };

  // Calculate totals with government scheme consideration
  const grossAmount = billItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const totalDiscountAmount = billItems.reduce((sum, item) => sum + item.discountAmount, 0);
  const totalTaxAmount = billItems.reduce((sum, item) => sum + item.taxAmount, 0);
  const netAmount = grossAmount - totalDiscountAmount + totalTaxAmount;

  // Government scheme calculations
  const selectedSchemeData = governmentSchemes.find(scheme => scheme.schemeId === selectedScheme);
  let schemeCoverageAmount = 0;
  let patientAmount = netAmount;

  if (selectedSchemeData && selectedScheme !== 'none') {
    // Simple coverage calculation - in real implementation, this would be more complex
    const coveragePercentage = selectedSchemeData.schemeName.includes('Ayushman') ? 80 : 
                              selectedSchemeData.schemeName.includes('CGHS') ? 70 :
                              selectedSchemeData.schemeName.includes('ESIC') ? 60 : 50;
    
    schemeCoverageAmount = Math.min(
      (netAmount * coveragePercentage) / 100,
      selectedSchemeData.maxCoverageAmount || netAmount
    );
    patientAmount = netAmount - schemeCoverageAmount;
  }

  const handleSaveBill = async () => {
    if (!selectedPatient || billItems.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select a patient and add at least one service",
        variant: "destructive"
      });
      return;
    }

    try {
      const billData: CreateBillRequest = {
        patientId: selectedPatient.id,
        billType,
        billItems: billItems.map(item => ({
          serviceId: item.serviceId,
          itemDescription: item.serviceName,
          itemCategory: item.category,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          discountPercentage: item.discountPercentage,
          taxPercentage: item.taxPercentage,
          serviceDate: item.serviceDate,
        })),
        governmentSchemeId: selectedScheme || undefined,
        discountAmount: totalDiscountAmount,
        billNotes: billNotes || undefined,
      };

      await createBill(billData);
      
      toast({
        title: "Success",
        description: "Hospital bill created successfully",
      });

      // Reset form
      setSelectedPatient(null);
      setPatientSearch('');
      setBillItems([]);
      setSelectedScheme('');
      setGlobalDiscountPercentage(0);
      setBillNotes('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create hospital bill",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/dashboard/billing">
              <ArrowLeft className="size-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create Hospital Bill</h1>
            <p className="text-muted-foreground">Generate a comprehensive hospital bill with government scheme support</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={billItems.length === 0}>
            <Printer className="mr-2 size-4" />
            Print Preview
          </Button>
          <Button onClick={handleSaveBill} disabled={isLoading || !selectedPatient || billItems.length === 0}>
            <Save className="mr-2 size-4" />
            {isLoading ? 'Creating...' : 'Save Bill'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Patient Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient-search">Search Patient (Name, Phone, ABHA ID)</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    id="patient-search"
                    placeholder="Search by name, phone number, or ABHA ID..."
                    value={patientSearch}
                    onChange={(e) => {
                      setPatientSearch(e.target.value);
                      setIsPatientSearchOpen(true);
                    }}
                    className="pl-9"
                  />
                  {isPatientSearchOpen && patientSearch && (
                    <div className="absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-md">
                      <div className="max-h-60 overflow-auto p-1">
                        {filteredPatients.map(patient => (
                          <button
                            key={patient.id}
                            onClick={() => handlePatientSelect(patient)}
                            className="w-full rounded-sm p-3 text-left text-sm hover:bg-accent"
                          >
                            <div className="font-medium">{patient.name}</div>
                            <div className="text-muted-foreground">
                              {patient.phone} • {patient.age} yrs • {patient.gender}
                            </div>
                            {patient.abhaId && (
                              <div className="text-xs text-blue-600">ABHA: {patient.abhaId}</div>
                            )}
                          </button>
                        ))}
                        {filteredPatients.length === 0 && (
                          <p className="p-2 text-sm text-muted-foreground">No patients found</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {selectedPatient && (
                <Alert>
                  <User className="size-4" />
                  <AlertDescription>
                    <div className="font-medium">{selectedPatient.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {selectedPatient.phone} • {selectedPatient.age} years • {selectedPatient.gender}
                      {selectedPatient.abhaId && <span className="ml-2 text-blue-600">ABHA: {selectedPatient.abhaId}</span>}
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Bill Type & Government Scheme */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="size-5" />
                Bill Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bill-type">Bill Type</Label>
                <Select value={billType} onValueChange={(value: BillType) => setBillType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="lab">Laboratory</SelectItem>
                    <SelectItem value="imaging">Imaging/Radiology</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="procedure">Procedure</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                    <SelectItem value="admission">Admission</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="government-scheme">Government Scheme (Optional)</Label>
                <Select value={selectedScheme} onValueChange={setSelectedScheme}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scheme..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Scheme</SelectItem>
                    {governmentSchemes.map(scheme => (
                      <SelectItem key={scheme.schemeId} value={scheme.schemeId}>
                        {scheme.schemeName} ({scheme.schemeCode})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedSchemeData && (
                  <div className="text-xs text-muted-foreground">
                    Max Coverage: {formatCurrency(selectedSchemeData.maxCoverageAmount || 0)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Add Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="size-5" />
                Add Services & Items
              </CardTitle>
              <CardDescription>
                {billType === 'consultation' && 'Add consultation and related services'}
                {billType === 'lab' && 'Add laboratory tests and investigations'}
                {billType === 'imaging' && 'Add radiology and imaging services'}
                {billType === 'pharmacy' && 'Add medicines and pharmaceutical items'}
                {billType === 'procedure' && 'Add medical procedures and interventions'}
                {(billType === 'emergency' || billType === 'admission') && 'Add all applicable services'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service-search">Search Services</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      id="service-search"
                      placeholder={`Search ${billType} services...`}
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="w-96">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredServices.map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          <div className="flex justify-between w-full">
                            <div className="flex flex-col">
                              <span className="font-medium">{service.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {service.serviceCode} • {service.department}
                              </span>
                            </div>
                            <span className="text-muted-foreground ml-4">
                              {formatCurrency(service.price)}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Qty"
                    value={serviceQuantity}
                    onChange={(e) => setServiceQuantity(Number(e.target.value))}
                    className="w-20"
                    min="1"
                  />
                  <Button onClick={handleAddService}>
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Global Discount */}
              <div className="space-y-2">
                <Label htmlFor="global-discount">Global Discount (%)</Label>
                <Input
                  id="global-discount"
                  type="number"
                  value={globalDiscountPercentage}
                  onChange={(e) => setGlobalDiscountPercentage(Number(e.target.value))}
                  min="0"
                  max="100"
                  className="w-32"
                />
              </div>
            </CardContent>
          </Card>

          {/* Bill Items */}
          {billItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="size-5" />
                  Bill Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead className="w-16">Qty</TableHead>
                      <TableHead className="text-right">Rate</TableHead>
                      <TableHead className="text-right">Discount</TableHead>
                      <TableHead className="text-right">Tax</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {billItems.map(item => (
                      <TableRow key={item.serviceId}>
                        <TableCell>
                          <div className="font-medium">{item.serviceName}</div>
                          <div className="text-xs text-muted-foreground">
                            {item.serviceCode} • <Badge variant="outline">{item.category}</Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{item.department}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItemQuantity(item.serviceId, Number(e.target.value))}
                            className="w-16"
                            min="1"
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          -{formatCurrency(item.discountAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                          +{formatCurrency(item.taxAmount)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.lineTotal)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.serviceId)}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Bill Summary Sidebar */}
        <div className="space-y-6">
          {/* Payment Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Payment & Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="payment-method">Expected Payment Method</Label>
                <Select value={paymentMethod} onValueChange={(value: PaymentMethod) => setPaymentMethod(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Net-Banking">Net Banking</SelectItem>
                    <SelectItem value="Insurance">Insurance</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bill-notes">Bill Notes</Label>
                <Textarea
                  id="bill-notes"
                  placeholder="Additional notes, special instructions..."
                  value={billNotes}
                  onChange={(e) => setBillNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bill Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="size-5" />
                Bill Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Gross Amount</span>
                <span>{formatCurrency(grossAmount)}</span>
              </div>

              {totalDiscountAmount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Total Discount</span>
                  <span>-{formatCurrency(totalDiscountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Tax Amount</span>
                <span>{formatCurrency(totalTaxAmount)}</span>
              </div>

              <div className="flex justify-between font-medium">
                <span>Net Amount</span>
                <span>{formatCurrency(netAmount)}</span>
              </div>

              {selectedSchemeData && schemeCoverageAmount > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-blue-600">Government Scheme Coverage</div>
                    <div className="flex justify-between text-sm">
                      <span>Scheme: {selectedSchemeData.schemeName}</span>
                    </div>
                    <div className="flex justify-between text-blue-600">
                      <span>Coverage Amount</span>
                      <span>-{formatCurrency(schemeCoverageAmount)}</span>
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Patient Amount</span>
                <span>{formatCurrency(patientAmount)}</span>
              </div>

              {selectedPatient && billItems.length > 0 && (
                <Button className="w-full" onClick={handleSaveBill} disabled={isLoading}>
                  <CreditCard className="mr-2 size-4" />
                  {isLoading ? 'Processing...' : 'Generate Hospital Bill'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Selected Scheme Info */}
          {selectedSchemeData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Scheme Details</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div><strong>Scheme:</strong> {selectedSchemeData.schemeName}</div>
                <div><strong>Code:</strong> {selectedSchemeData.schemeCode}</div>
                {selectedSchemeData.maxCoverageAmount && (
                  <div><strong>Max Coverage:</strong> {formatCurrency(selectedSchemeData.maxCoverageAmount)}</div>
                )}
                {selectedSchemeData.familySize && (
                  <div><strong>Family Size:</strong> {selectedSchemeData.familySize}</div>
                )}
                {selectedSchemeData.description && (
                  <div className="text-muted-foreground">{selectedSchemeData.description}</div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}