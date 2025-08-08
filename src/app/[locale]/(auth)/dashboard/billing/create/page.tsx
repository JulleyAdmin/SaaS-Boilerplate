'use client';

import { ArrowLeft, Calculator, CreditCard, FileText, Plus, Printer, Save, Search, Trash2, User } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useState } from 'react';

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
import { useCreateInvoice } from '@/hooks/api/useBilling';
import { formatCurrency } from '@/utils/format';

// Mock services data
const mockServices = [
  { id: 'SRV001', name: 'General Consultation', price: 500, category: 'consultation' },
  { id: 'SRV002', name: 'Pediatric Consultation', price: 600, category: 'consultation' },
  { id: 'SRV003', name: 'Cardiology Consultation', price: 800, category: 'consultation' },
  { id: 'SRV004', name: 'Complete Blood Count', price: 300, category: 'lab' },
  { id: 'SRV005', name: 'Blood Sugar Fasting', price: 150, category: 'lab' },
  { id: 'SRV006', name: 'Lipid Profile', price: 450, category: 'lab' },
  { id: 'SRV007', name: 'X-Ray Chest', price: 400, category: 'imaging' },
  { id: 'SRV008', name: 'ECG', price: 200, category: 'diagnostic' },
  { id: 'SRV009', name: 'Paracetamol 500mg', price: 20, category: 'medicine' },
  { id: 'SRV010', name: 'Amoxicillin 250mg', price: 45, category: 'medicine' },
];

// Mock patients data
const mockPatients = [
  { id: 'P001', name: 'Rajesh Kumar', phone: '+91 9876543210', age: 45, gender: 'Male' },
  { id: 'P002', name: 'Sunita Devi', phone: '+91 9876543211', age: 38, gender: 'Female' },
  { id: 'P003', name: 'Amit Singh', phone: '+91 9876543212', age: 29, gender: 'Male' },
  { id: 'P004', name: 'Priya Sharma', phone: '+91 9876543213', age: 52, gender: 'Female' },
];

interface InvoiceItem {
  serviceId: string;
  serviceName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  category: string;
}

interface PatientInfo {
  id: string;
  name: string;
  phone: string;
  age: number;
  gender: string;
}

export default function CreateBillingPage() {
  const t = useTranslations('billing');
  
  const [selectedPatient, setSelectedPatient] = useState<PatientInfo | null>(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [serviceSearch, setServiceSearch] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [serviceQuantity, setServiceQuantity] = useState(1);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [invoiceType, setInvoiceType] = useState('consultation');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [notes, setNotes] = useState('');
  const [isPatientSearchOpen, setIsPatientSearchOpen] = useState(false);
  
  const { mutate: createInvoice, isLoading } = useCreateInvoice();

  // Filter patients based on search
  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(patientSearch.toLowerCase()) ||
    patient.phone.includes(patientSearch)
  );

  // Filter services based on search
  const filteredServices = mockServices.filter(service =>
    service.name.toLowerCase().includes(serviceSearch.toLowerCase()) ||
    service.id.toLowerCase().includes(serviceSearch.toLowerCase())
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

    const existingItem = invoiceItems.find(item => item.serviceId === selectedService);
    if (existingItem) {
      // Update existing item
      setInvoiceItems(items =>
        items.map(item =>
          item.serviceId === selectedService
            ? { ...item, quantity: item.quantity + serviceQuantity, total: (item.quantity + serviceQuantity) * item.unitPrice }
            : item
        )
      );
    } else {
      // Add new item
      const newItem: InvoiceItem = {
        serviceId: service.id,
        serviceName: service.name,
        quantity: serviceQuantity,
        unitPrice: service.price,
        total: service.price * serviceQuantity,
        category: service.category
      };
      setInvoiceItems([...invoiceItems, newItem]);
    }

    setSelectedService('');
    setServiceQuantity(1);
    setServiceSearch('');
  };

  const handleRemoveItem = (serviceId: string) => {
    setInvoiceItems(items => items.filter(item => item.serviceId !== serviceId));
  };

  const updateItemQuantity = (serviceId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(serviceId);
      return;
    }

    setInvoiceItems(items =>
      items.map(item =>
        item.serviceId === serviceId
          ? { ...item, quantity: newQuantity, total: newQuantity * item.unitPrice }
          : item
      )
    );
  };

  // Calculate totals
  const subtotal = invoiceItems.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (subtotal * discountPercentage) / 100;
  const taxAmount = ((subtotal - discountAmount) * 18) / 100; // 18% GST
  const totalAmount = subtotal - discountAmount + taxAmount;

  const handleSaveInvoice = async () => {
    if (!selectedPatient || invoiceItems.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select a patient and add at least one service",
        variant: "destructive"
      });
      return;
    }

    try {
      const invoiceData = {
        patientId: selectedPatient.id,
        patientName: selectedPatient.name,
        invoiceType,
        items: invoiceItems,
        subtotal,
        discountAmount,
        taxAmount,
        totalAmount,
        paymentMethod,
        notes,
        invoiceDate: new Date().toISOString(),
      };

      await createInvoice(invoiceData);
      
      toast({
        title: "Success",
        description: "Invoice created successfully",
      });

      // Reset form
      setSelectedPatient(null);
      setPatientSearch('');
      setInvoiceItems([]);
      setDiscountPercentage(0);
      setNotes('');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create invoice",
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
            <h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
            <p className="text-muted-foreground">Generate a new billing invoice</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={invoiceItems.length === 0}>
            <Printer className="mr-2 size-4" />
            Print Preview
          </Button>
          <Button onClick={handleSaveInvoice} disabled={isLoading || !selectedPatient || invoiceItems.length === 0}>
            <Save className="mr-2 size-4" />
            {isLoading ? 'Creating...' : 'Save Invoice'}
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
                <Label htmlFor="patient-search">Search Patient</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    id="patient-search"
                    placeholder="Search by name or phone number..."
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
                            className="w-full rounded-sm p-2 text-left text-sm hover:bg-accent"
                          >
                            <div className="font-medium">{patient.name}</div>
                            <div className="text-muted-foreground">
                              {patient.phone} • {patient.age} yrs • {patient.gender}
                            </div>
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
                    </div>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Add Services */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="size-5" />
                Add Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="service-search">Search Services</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                    <Input
                      id="service-search"
                      placeholder="Search services..."
                      value={serviceSearch}
                      onChange={(e) => setServiceSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="w-80">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredServices.map(service => (
                        <SelectItem key={service.id} value={service.id}>
                          <div className="flex justify-between w-full">
                            <span>{service.name}</span>
                            <span className="text-muted-foreground ml-2">
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
            </CardContent>
          </Card>

          {/* Invoice Items */}
          {invoiceItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="size-5" />
                  Invoice Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Service</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead className="w-20">Qty</TableHead>
                      <TableHead className="text-right">Unit Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="w-10"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoiceItems.map(item => (
                      <TableRow key={item.serviceId}>
                        <TableCell className="font-medium">{item.serviceName}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.category}</Badge>
                        </TableCell>
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
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.total)}
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

        {/* Invoice Summary Sidebar */}
        <div className="space-y-6">
          {/* Invoice Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="invoice-type">Invoice Type</Label>
                <Select value={invoiceType} onValueChange={setInvoiceType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="lab">Laboratory</SelectItem>
                    <SelectItem value="pharmacy">Pharmacy</SelectItem>
                    <SelectItem value="procedure">Procedure</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment-method">Payment Method</Label>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="upi">UPI</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="netbanking">Net Banking</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discount">Discount (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={discountPercentage}
                  onChange={(e) => setDiscountPercentage(Number(e.target.value))}
                  min="0"
                  max="100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes or instructions..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Invoice Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="size-5" />
                Invoice Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>

              {discountPercentage > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount ({discountPercentage}%)</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Tax (18% GST)</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total Amount</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>

              {selectedPatient && invoiceItems.length > 0 && (
                <Button className="w-full" onClick={handleSaveInvoice} disabled={isLoading}>
                  <CreditCard className="mr-2 size-4" />
                  {isLoading ? 'Processing...' : 'Generate Invoice'}
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}