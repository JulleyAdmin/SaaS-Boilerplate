'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { 
  Activity,
  AlertCircle,
  Building,
  Calendar as CalendarIcon,
  CheckCircle,
  Clock,
  CreditCard,
  FileText,
  Heart,
  Info,
  MapPin,
  Package,
  Phone,
  Search,
  Shield,
  Star,
  Tag,
  TrendingUp,
  Truck,
  Users,
  Zap,
  Share2,
  Settings,
  Wrench,
  HelpCircle,
  IndianRupee
} from 'lucide-react';
import { mockSharedResources, mockHospitals, mockCollaborationAgreements } from '@/data/mock-network-collaboration';
import { format } from 'date-fns';

interface SharedResource {
  resourceId: string;
  resourceName: string;
  resourceType: string;
  resourceCategory: string;
  hostClinic: any;
  availableToClinics: string[];
  dailyCapacity: number;
  currentUtilization: number;
  bookingRequired: boolean;
  advanceBookingDays: number;
  basePrice: number;
  networkDiscountPercent: number;
  currentStatus: string;
  specifications: any;
}

interface BookingSlot {
  time: string;
  available: boolean;
  booked?: boolean;
  price?: number;
}

export default function SharedResources() {
  const [resources, setResources] = useState<SharedResource[]>(mockSharedResources);
  const [agreements, setAgreements] = useState(mockCollaborationAgreements);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedResource, setSelectedResource] = useState<SharedResource | null>(null);
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [bookingDetails, setBookingDetails] = useState({
    patientName: '',
    patientId: '',
    referringDoctor: '',
    urgency: 'normal',
    notes: ''
  });

  const categories = [
    'All Categories',
    'Diagnostic Imaging',
    'Radiation Therapy',
    'Nephrology',
    'Cardiology',
    'Transfusion Services'
  ];

  const filteredResources = resources.filter(resource => {
    const searchMatch = searchTerm === '' || 
      resource.resourceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.resourceCategory.toLowerCase().includes(searchTerm.toLowerCase());
    
    const categoryMatch = filterCategory === 'all' || 
      resource.resourceCategory.toLowerCase().includes(filterCategory.toLowerCase());
    
    const statusMatch = filterStatus === 'all' || 
      resource.currentStatus.toLowerCase() === filterStatus.toLowerCase();
    
    return searchMatch && categoryMatch && statusMatch;
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return 'success';
      case 'in-use':
        return 'warning';
      case 'maintenance':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getUtilizationColor = (utilization: number) => {
    if (utilization < 50) return 'text-green-600';
    if (utilization < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const generateTimeSlots = (): BookingSlot[] => {
    const slots: BookingSlot[] = [];
    const startHour = 8;
    const endHour = 20;
    
    for (let hour = startHour; hour < endHour; hour++) {
      const utilization = Math.random() * 100;
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:00`,
        available: utilization < 80,
        booked: utilization > 60 && utilization < 80,
        price: selectedResource ? 
          Math.round(selectedResource.basePrice * (1 - selectedResource.networkDiscountPercent / 100)) : 
          0
      });
      
      slots.push({
        time: `${hour.toString().padStart(2, '0')}:30`,
        available: Math.random() > 0.3,
        booked: Math.random() > 0.7,
        price: selectedResource ? 
          Math.round(selectedResource.basePrice * (1 - selectedResource.networkDiscountPercent / 100)) : 
          0
      });
    }
    
    return slots;
  };

  const handleBookResource = (resource: SharedResource) => {
    setSelectedResource(resource);
    setShowBookingDialog(true);
  };

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedSlot || !bookingDetails.patientName) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive'
      });
      return;
    }

    toast({
      title: 'Resource Booked Successfully',
      description: `${selectedResource?.resourceName} booked for ${selectedDate?.toLocaleDateString()} at ${selectedSlot}`,
    });
    
    setShowBookingDialog(false);
    setSelectedResource(null);
    setSelectedSlot('');
    setBookingDetails({
      patientName: '',
      patientId: '',
      referringDoctor: '',
      urgency: 'normal',
      notes: ''
    });
  };

  const getClinicName = (clinicId: string) => {
    const clinic = mockHospitals.find(h => h.clinicId === clinicId);
    return clinic?.clinicName || clinicId;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Shared Resources</h1>
          <p className="text-muted-foreground">
            Book and manage shared medical equipment and facilities across the network
          </p>
        </div>
        <Button>
          <Share2 className="mr-2 h-4 w-4" />
          Register New Resource
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Resources</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resources.length}</div>
            <p className="text-xs text-muted-foreground">Shared across network</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Now</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {resources.filter(r => r.currentStatus === 'Available').length}
            </div>
            <p className="text-xs text-muted-foreground">Ready for booking</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Utilization</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(resources.reduce((acc, r) => acc + r.currentUtilization, 0) / resources.length)}%
            </div>
            <p className="text-xs text-muted-foreground">Network wide</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agreements</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {agreements.filter(a => a.status === 'Active').length}
            </div>
            <p className="text-xs text-muted-foreground">Collaboration agreements</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="resources" className="space-y-4">
        <TabsList>
          <TabsTrigger value="resources">Available Resources</TabsTrigger>
          <TabsTrigger value="agreements">Collaboration Agreements</TabsTrigger>
          <TabsTrigger value="utilization">Utilization Analytics</TabsTrigger>
        </TabsList>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search resources..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8"
                    />
                  </div>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="in-use">In Use</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Resources Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <Card key={resource.resourceId} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{resource.resourceName}</CardTitle>
                      <CardDescription>{resource.resourceCategory}</CardDescription>
                    </div>
                    <Badge variant={getStatusColor(resource.currentStatus)}>
                      {resource.currentStatus}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Host Information */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Hosted By</p>
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{resource.hostClinic.clinicName}</span>
                    </div>
                  </div>

                  {/* Specifications */}
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Specifications</p>
                    <div className="space-y-1">
                      {resource.specifications.brand && (
                        <div className="flex items-center gap-2 text-sm">
                          <Wrench className="h-3 w-3 text-muted-foreground" />
                          <span>{resource.specifications.brand} - {resource.specifications.model}</span>
                        </div>
                      )}
                      {resource.specifications.features && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {resource.specifications.features.slice(0, 3).map((feature: string, idx: number) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Capacity & Utilization */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-sm text-muted-foreground">Daily Utilization</p>
                      <span className={`text-sm font-medium ${getUtilizationColor(resource.currentUtilization)}`}>
                        {resource.currentUtilization}%
                      </span>
                    </div>
                    <Progress value={resource.currentUtilization} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1">
                      {Math.round(resource.dailyCapacity * (1 - resource.currentUtilization / 100))} slots available today
                    </p>
                  </div>

                  {/* Pricing */}
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs text-muted-foreground">Network Price</p>
                        <div className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4" />
                          <span className="text-lg font-bold">
                            {Math.round(resource.basePrice * (1 - resource.networkDiscountPercent / 100)).toLocaleString('en-IN')}
                          </span>
                          {resource.networkDiscountPercent > 0 && (
                            <Badge variant="success" className="ml-2">
                              {resource.networkDiscountPercent}% off
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground line-through">
                          ₹{resource.basePrice.toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Booking Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Book {resource.advanceBookingDays} days ahead</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{resource.availableToClinics.length} hospitals</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1" 
                      size="sm"
                      onClick={() => handleBookResource(resource)}
                      disabled={resource.currentStatus !== 'Available'}
                    >
                      <CalendarIcon className="mr-1 h-4 w-4" />
                      Book Resource
                    </Button>
                    <Button variant="outline" size="sm">
                      <Info className="mr-1 h-4 w-4" />
                      Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Agreements Tab */}
        <TabsContent value="agreements" className="space-y-4">
          <div className="grid gap-4">
            {agreements.map((agreement) => (
              <Card key={agreement.agreementId}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{agreement.agreementName}</CardTitle>
                      <CardDescription>
                        Between {agreement.clinicA.clinicName} and {agreement.clinicB.clinicName}
                      </CardDescription>
                    </div>
                    <Badge variant={agreement.status === 'Active' ? 'success' : 'secondary'}>
                      {agreement.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Agreement Type</p>
                      <p className="text-sm font-medium">{agreement.agreementType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Effective Period</p>
                      <p className="text-sm font-medium">
                        {format(agreement.effectiveFrom, 'MMM dd, yyyy')} - {format(agreement.effectiveTo, 'MMM dd, yyyy')}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Terms</p>
                      <p className="text-sm font-medium">{agreement.paymentTerms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue Share</p>
                      <p className="text-sm font-medium">
                        {agreement.revenueSharePercentage ? `${agreement.revenueSharePercentage}%` : 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Covered Services</p>
                    <div className="flex flex-wrap gap-2">
                      {agreement.coveredServices.map((service, idx) => (
                        <Badge key={idx} variant="outline">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Utilization Analytics Tab */}
        <TabsContent value="utilization" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Top Utilized Resources */}
            <Card>
              <CardHeader>
                <CardTitle>Top Utilized Resources</CardTitle>
                <CardDescription>Resources with highest usage this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resources
                    .sort((a, b) => b.currentUtilization - a.currentUtilization)
                    .slice(0, 5)
                    .map((resource) => (
                      <div key={resource.resourceId} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Activity className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{resource.resourceName}</p>
                            <p className="text-xs text-muted-foreground">{resource.hostClinic.clinicName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-sm font-medium ${getUtilizationColor(resource.currentUtilization)}`}>
                            {resource.currentUtilization}%
                          </p>
                          <p className="text-xs text-muted-foreground">utilization</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Impact */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Impact</CardTitle>
                <CardDescription>Network resource sharing revenue this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Revenue Generated</span>
                    <span className="text-lg font-bold">₹12,45,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Network Discounts Given</span>
                    <span className="text-lg font-bold text-green-600">₹2,85,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Revenue Share Distributed</span>
                    <span className="text-lg font-bold">₹3,75,000</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Net Revenue</span>
                      <span className="text-xl font-bold">₹5,85,000</span>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <Alert>
                    <TrendingUp className="h-4 w-4" />
                    <AlertDescription>
                      Resource sharing revenue increased by 18% compared to last month
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Utilization by Category */}
          <Card>
            <CardHeader>
              <CardTitle>Utilization by Category</CardTitle>
              <CardDescription>Average utilization across resource categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['Diagnostic Imaging', 'Radiation Therapy', 'Nephrology', 'Cardiology'].map((category) => {
                  const categoryResources = resources.filter(r => r.resourceCategory === category);
                  const avgUtilization = categoryResources.length > 0
                    ? Math.round(categoryResources.reduce((acc, r) => acc + r.currentUtilization, 0) / categoryResources.length)
                    : 0;
                  
                  return (
                    <div key={category}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">{category}</span>
                        <span className={`text-sm font-medium ${getUtilizationColor(avgUtilization)}`}>
                          {avgUtilization}%
                        </span>
                      </div>
                      <Progress value={avgUtilization} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Booking Dialog */}
      <Dialog open={showBookingDialog} onOpenChange={setShowBookingDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Book Resource: {selectedResource?.resourceName}</DialogTitle>
            <DialogDescription>
              Schedule and book this resource for your patient
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 md:grid-cols-2">
            {/* Left Column - Calendar */}
            <div>
              <Label>Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={(date) => {
                  const today = new Date();
                  today.setHours(0, 0, 0, 0);
                  const maxDate = new Date();
                  maxDate.setDate(maxDate.getDate() + (selectedResource?.advanceBookingDays || 0));
                  return date < today || date > maxDate;
                }}
              />
              <Alert className="mt-2">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  You can book up to {selectedResource?.advanceBookingDays} days in advance
                </AlertDescription>
              </Alert>
            </div>

            {/* Right Column - Time Slots & Details */}
            <div className="space-y-4">
              <div>
                <Label>Available Time Slots</Label>
                <div className="grid grid-cols-3 gap-2 mt-2 max-h-48 overflow-y-auto">
                  {generateTimeSlots().map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedSlot === slot.time ? 'default' : slot.available ? 'outline' : 'secondary'}
                      size="sm"
                      disabled={!slot.available}
                      onClick={() => setSelectedSlot(slot.time)}
                      className="text-xs"
                    >
                      {slot.time}
                      {slot.booked && !slot.available && (
                        <Badge className="ml-1" variant="secondary">Booked</Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="patientName">Patient Name *</Label>
                  <Input
                    id="patientName"
                    value={bookingDetails.patientName}
                    onChange={(e) => setBookingDetails({...bookingDetails, patientName: e.target.value})}
                    placeholder="Enter patient name"
                  />
                </div>

                <div>
                  <Label htmlFor="patientId">Patient ID / ABHA Number</Label>
                  <Input
                    id="patientId"
                    value={bookingDetails.patientId}
                    onChange={(e) => setBookingDetails({...bookingDetails, patientId: e.target.value})}
                    placeholder="ABHA-XXXX-XXXX-XXXX"
                  />
                </div>

                <div>
                  <Label htmlFor="referringDoctor">Referring Doctor</Label>
                  <Input
                    id="referringDoctor"
                    value={bookingDetails.referringDoctor}
                    onChange={(e) => setBookingDetails({...bookingDetails, referringDoctor: e.target.value})}
                    placeholder="Dr. Name"
                  />
                </div>

                <div>
                  <Label htmlFor="urgency">Urgency</Label>
                  <Select 
                    value={bookingDetails.urgency} 
                    onValueChange={(value) => setBookingDetails({...bookingDetails, urgency: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Pricing Summary */}
              {selectedResource && selectedSlot && (
                <Card>
                  <CardContent className="p-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Base Price</span>
                        <span>₹{selectedResource.basePrice.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Network Discount ({selectedResource.networkDiscountPercent}%)</span>
                        <span>- ₹{Math.round(selectedResource.basePrice * selectedResource.networkDiscountPercent / 100).toLocaleString('en-IN')}</span>
                      </div>
                      <div className="border-t pt-2 flex justify-between font-medium">
                        <span>Total Amount</span>
                        <span>₹{Math.round(selectedResource.basePrice * (1 - selectedResource.networkDiscountPercent / 100)).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBookingDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmBooking}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Confirm Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}