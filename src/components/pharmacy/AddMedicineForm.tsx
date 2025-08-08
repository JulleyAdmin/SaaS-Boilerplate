'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Package,
  Calendar,
  AlertTriangle,
  Save,
  ArrowLeft,
  Pill,
  Building,
  Hash,
  IndianRupee,
  Thermometer,
  Shield,
  Clock
} from 'lucide-react';
import Link from 'next/link';

interface MedicineFormData {
  medicineCode: string;
  medicineName: string;
  genericName: string;
  manufacturer: string;
  category: string;
  form: string;
  strength: string;
  packaging: string;
  batchNumber: string;
  manufactureDate: string;
  expiryDate: string;
  supplierName: string;
  unitPrice: string;
  sellingPrice: string;
  quantity: string;
  reorderLevel: string;
  storageCondition: string;
  prescriptionRequired: boolean;
  controlledSubstance: boolean;
  description: string;
  sideEffects: string;
  contraindications: string;
  interactions: string;
}

export default function AddMedicineForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<MedicineFormData>({
    medicineCode: '',
    medicineName: '',
    genericName: '',
    manufacturer: '',
    category: '',
    form: '',
    strength: '',
    packaging: '',
    batchNumber: '',
    manufactureDate: '',
    expiryDate: '',
    supplierName: '',
    unitPrice: '',
    sellingPrice: '',
    quantity: '',
    reorderLevel: '',
    storageCondition: '',
    prescriptionRequired: false,
    controlledSubstance: false,
    description: '',
    sideEffects: '',
    contraindications: '',
    interactions: ''
  });

  const handleInputChange = (field: keyof MedicineFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.medicineName || !formData.genericName || !formData.manufacturer) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Medicine Added",
      description: `${formData.medicineName} has been successfully added to inventory`,
    });

    // Reset form
    setFormData({
      medicineCode: '',
      medicineName: '',
      genericName: '',
      manufacturer: '',
      category: '',
      form: '',
      strength: '',
      packaging: '',
      batchNumber: '',
      manufactureDate: '',
      expiryDate: '',
      supplierName: '',
      unitPrice: '',
      sellingPrice: '',
      quantity: '',
      reorderLevel: '',
      storageCondition: '',
      prescriptionRequired: false,
      controlledSubstance: false,
      description: '',
      sideEffects: '',
      contraindications: '',
      interactions: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/pharmacy">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Pill className="h-5 w-5" />
              Basic Medicine Information
            </CardTitle>
            <CardDescription>Enter the basic details of the medicine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="medicineCode">Medicine Code</Label>
                <Input
                  id="medicineCode"
                  placeholder="MED-001"
                  value={formData.medicineCode}
                  onChange={(e) => handleInputChange('medicineCode', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicineName">Medicine Name *</Label>
                <Input
                  id="medicineName"
                  placeholder="Paracetamol 500mg"
                  value={formData.medicineName}
                  onChange={(e) => handleInputChange('medicineName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genericName">Generic Name *</Label>
                <Input
                  id="genericName"
                  placeholder="Paracetamol"
                  value={formData.genericName}
                  onChange={(e) => handleInputChange('genericName', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer *</Label>
                <Input
                  id="manufacturer"
                  placeholder="Cipla Ltd"
                  value={formData.manufacturer}
                  onChange={(e) => handleInputChange('manufacturer', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="analgesic">Analgesic</SelectItem>
                    <SelectItem value="antibiotic">Antibiotic</SelectItem>
                    <SelectItem value="antihypertensive">Antihypertensive</SelectItem>
                    <SelectItem value="antidiabetic">Antidiabetic</SelectItem>
                    <SelectItem value="vitamin">Vitamin/Supplement</SelectItem>
                    <SelectItem value="cardiac">Cardiac</SelectItem>
                    <SelectItem value="respiratory">Respiratory</SelectItem>
                    <SelectItem value="gastrointestinal">Gastrointestinal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="form">Medicine Form</Label>
                <Select value={formData.form} onValueChange={(value) => handleInputChange('form', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select form" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tablet">Tablet</SelectItem>
                    <SelectItem value="capsule">Capsule</SelectItem>
                    <SelectItem value="syrup">Syrup</SelectItem>
                    <SelectItem value="injection">Injection</SelectItem>
                    <SelectItem value="cream">Cream</SelectItem>
                    <SelectItem value="ointment">Ointment</SelectItem>
                    <SelectItem value="drops">Drops</SelectItem>
                    <SelectItem value="inhaler">Inhaler</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="strength">Strength/Dosage</Label>
                <Input
                  id="strength"
                  placeholder="500mg"
                  value={formData.strength}
                  onChange={(e) => handleInputChange('strength', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="packaging">Packaging</Label>
                <Input
                  id="packaging"
                  placeholder="10 tablets/strip"
                  value={formData.packaging}
                  onChange={(e) => handleInputChange('packaging', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Batch & Expiry Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Batch & Expiry Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="batchNumber">Batch Number</Label>
                <Input
                  id="batchNumber"
                  placeholder="BT001234"
                  value={formData.batchNumber}
                  onChange={(e) => handleInputChange('batchNumber', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="manufactureDate">Manufacture Date</Label>
                <Input
                  id="manufactureDate"
                  type="date"
                  value={formData.manufactureDate}
                  onChange={(e) => handleInputChange('manufactureDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Stock */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5" />
              Pricing & Stock Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplierName">Supplier Name</Label>
                <Input
                  id="supplierName"
                  placeholder="MedSupply Pharma"
                  value={formData.supplierName}
                  onChange={(e) => handleInputChange('supplierName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price (₹)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  placeholder="25.00"
                  step="0.01"
                  value={formData.unitPrice}
                  onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sellingPrice">Selling Price (₹)</Label>
                <Input
                  id="sellingPrice"
                  type="number"
                  placeholder="30.00"
                  step="0.01"
                  value={formData.sellingPrice}
                  onChange={(e) => handleInputChange('sellingPrice', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Initial Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  placeholder="100"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reorderLevel">Reorder Level</Label>
                <Input
                  id="reorderLevel"
                  type="number"
                  placeholder="20"
                  value={formData.reorderLevel}
                  onChange={(e) => handleInputChange('reorderLevel', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storageCondition">Storage Condition</Label>
                <Select value={formData.storageCondition} onValueChange={(value) => handleInputChange('storageCondition', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select storage condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="room_temperature">Room Temperature (15-25°C)</SelectItem>
                    <SelectItem value="cold">Cold Storage (2-8°C)</SelectItem>
                    <SelectItem value="frozen">Frozen (-10°C or below)</SelectItem>
                    <SelectItem value="dry_place">Store in Dry Place</SelectItem>
                    <SelectItem value="dark_place">Store in Dark Place</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Medicine Properties */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Medicine Properties
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="prescriptionRequired"
                  checked={formData.prescriptionRequired}
                  onCheckedChange={(checked) => handleInputChange('prescriptionRequired', checked as boolean)}
                />
                <Label htmlFor="prescriptionRequired">Prescription Required</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="controlledSubstance"
                  checked={formData.controlledSubstance}
                  onCheckedChange={(checked) => handleInputChange('controlledSubstance', checked as boolean)}
                />
                <Label htmlFor="controlledSubstance">Controlled Substance</Label>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Medicine description and usage instructions..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sideEffects">Side Effects</Label>
                  <Textarea
                    id="sideEffects"
                    placeholder="Known side effects..."
                    value={formData.sideEffects}
                    onChange={(e) => handleInputChange('sideEffects', e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contraindications">Contraindications</Label>
                  <Textarea
                    id="contraindications"
                    placeholder="When not to use this medicine..."
                    value={formData.contraindications}
                    onChange={(e) => handleInputChange('contraindications', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="interactions">Drug Interactions</Label>
                <Textarea
                  id="interactions"
                  placeholder="Known drug interactions..."
                  value={formData.interactions}
                  onChange={(e) => handleInputChange('interactions', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <Button type="submit" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Add Medicine
          </Button>
          <Button type="button" variant="outline">
            Save as Draft
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/dashboard/pharmacy">
              Cancel
            </Link>
          </Button>
        </div>
      </form>
    </div>
  );
}