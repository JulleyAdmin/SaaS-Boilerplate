'use client';

import { useAuth } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TestTube, User, Zap } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';

type Patient = {
  patientId: string;
  firstName: string;
  lastName: string;
  patientCode: string;
};

type QuickLabOrderModalProps = {
  patient: Patient;
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
};

type LabTest = {
  id: string;
  name: string;
  category: string;
  urgency: 'routine' | 'urgent' | 'stat';
  cost: number;
};

type LabOrderData = {
  patientId: string;
  doctorId: string;
  tests: string[];
  urgency: 'routine' | 'urgent' | 'stat';
  clinicalNotes?: string;
  fastingRequired?: boolean;
};

// Mock doctors data
const mockDoctors = [
  { id: 'doc1', name: 'Dr. Sarah Wilson', department: 'Cardiology' },
  { id: 'doc2', name: 'Dr. Michael Chen', department: 'Emergency' },
  { id: 'doc3', name: 'Dr. Priya Sharma', department: 'Pediatrics' },
  { id: 'doc4', name: 'Dr. James Rodriguez', department: 'Surgery' },
];

// Common lab tests
const commonLabTests: LabTest[] = [
  // Blood Tests
  { id: 'cbc', name: 'Complete Blood Count (CBC)', category: 'Blood', urgency: 'routine', cost: 150 },
  { id: 'bmp', name: 'Basic Metabolic Panel', category: 'Blood', urgency: 'routine', cost: 200 },
  { id: 'lipid', name: 'Lipid Panel', category: 'Blood', urgency: 'routine', cost: 180 },
  { id: 'hba1c', name: 'HbA1c (Diabetes)', category: 'Blood', urgency: 'routine', cost: 120 },
  { id: 'thyroid', name: 'Thyroid Function (TSH, T3, T4)', category: 'Blood', urgency: 'routine', cost: 250 },
  { id: 'liver', name: 'Liver Function Tests', category: 'Blood', urgency: 'routine', cost: 220 },
  { id: 'kidney', name: 'Kidney Function Tests', category: 'Blood', urgency: 'routine', cost: 180 },

  // Cardiac
  { id: 'troponin', name: 'Troponin (Cardiac)', category: 'Cardiac', urgency: 'stat', cost: 300 },
  { id: 'bnp', name: 'BNP (Heart Failure)', category: 'Cardiac', urgency: 'urgent', cost: 280 },

  // Infectious Disease
  { id: 'covid', name: 'COVID-19 PCR', category: 'Infectious', urgency: 'urgent', cost: 400 },
  { id: 'hepatitis', name: 'Hepatitis Panel', category: 'Infectious', urgency: 'routine', cost: 350 },
  { id: 'hiv', name: 'HIV Testing', category: 'Infectious', urgency: 'routine', cost: 200 },

  // Urine
  { id: 'urinalysis', name: 'Urinalysis', category: 'Urine', urgency: 'routine', cost: 80 },
  { id: 'urine_culture', name: 'Urine Culture', category: 'Urine', urgency: 'routine', cost: 150 },

  // Other
  { id: 'pt_inr', name: 'PT/INR (Coagulation)', category: 'Coagulation', urgency: 'routine', cost: 100 },
  { id: 'vitamin_d', name: 'Vitamin D', category: 'Vitamins', urgency: 'routine', cost: 150 },
];

// Mock API function
async function createLabOrder(data: LabOrderData): Promise<any> {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `order-${Date.now()}`,
        ...data,
        status: 'ordered',
        createdAt: new Date().toISOString(),
      });
    }, 1000);
  });
}

export function QuickLabOrderModal({
  patient,
  open,
  onClose,
  onSuccess,
}: QuickLabOrderModalProps) {
  const { isSignedIn } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    doctorId: '',
    selectedTests: [] as string[],
    urgency: 'routine' as const,
    clinicalNotes: '',
    fastingRequired: false,
  });

  const createLabOrderMutation = useMutation({
    mutationFn: createLabOrder,
    onSuccess: () => {
      toast({
        title: 'Lab Orders Submitted',
        description: `${formData.selectedTests.length} lab test(s) ordered for ${patient.firstName} ${patient.lastName}`,
      });

      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['lab-orders'] });
      queryClient.invalidateQueries({ queryKey: ['patient-lab-orders', patient.patientId] });

      onSuccess?.();
      onClose();
      // Reset form
      setFormData({
        doctorId: '',
        selectedTests: [],
        urgency: 'routine',
        clinicalNotes: '',
        fastingRequired: false,
      });
    },
    onError: (_error: Error) => {
      toast({
        title: 'Error',
        description: 'Failed to submit lab orders. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isSignedIn) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to order lab tests',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.doctorId || formData.selectedTests.length === 0) {
      toast({
        title: 'Missing required fields',
        description: 'Please select a doctor and at least one test',
        variant: 'destructive',
      });
      return;
    }

    createLabOrderMutation.mutate({
      patientId: patient.patientId,
      doctorId: formData.doctorId,
      tests: formData.selectedTests,
      urgency: formData.urgency,
      clinicalNotes: formData.clinicalNotes || undefined,
      fastingRequired: formData.fastingRequired,
    });
  };

  const handleTestToggle = (testId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedTests: checked
        ? [...prev.selectedTests, testId]
        : prev.selectedTests.filter(id => id !== testId),
    }));
  };

  const handleSelectCategory = (category: string) => {
    const categoryTests = commonLabTests
      .filter(test => test.category === category)
      .map(test => test.id);

    const allSelected = categoryTests.every(testId =>
      formData.selectedTests.includes(testId),
    );

    if (allSelected) {
      // Unselect all in category
      setFormData(prev => ({
        ...prev,
        selectedTests: prev.selectedTests.filter(id => !categoryTests.includes(id)),
      }));
    } else {
      // Select all in category
      setFormData(prev => ({
        ...prev,
        selectedTests: [...new Set([...prev.selectedTests, ...categoryTests])],
      }));
    }
  };

  const getSelectedTestsTotal = () => {
    return formData.selectedTests.reduce((total, testId) => {
      const test = commonLabTests.find(t => t.id === testId);
      return total + (test?.cost || 0);
    }, 0);
  };

  const categories = [...new Set(commonLabTests.map(test => test.category))];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <TestTube className="size-5" />
            Order Lab Tests
          </DialogTitle>
          <DialogDescription>
            Order laboratory tests for
            {' '}
            <span className="font-medium">
              {patient.firstName}
              {' '}
              {patient.lastName}
            </span>
            {' '}
            (MRN:
            {' '}
            {patient.patientCode}
            )
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Doctor Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="doctorId">Ordering Doctor *</Label>
              <Select
                value={formData.doctorId}
                onValueChange={value => setFormData(prev => ({ ...prev, doctorId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select doctor" />
                </SelectTrigger>
                <SelectContent>
                  {mockDoctors.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      <div className="flex items-center gap-2">
                        <User className="size-4" />
                        <div>
                          <div className="font-medium">{doctor.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {doctor.department}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="urgency">Urgency</Label>
              <Select
                value={formData.urgency}
                onValueChange={value => setFormData(prev => ({ ...prev, urgency: value as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="urgent">
                    <div className="flex items-center gap-2">
                      <Zap className="size-4 text-orange-500" />
                      Urgent
                    </div>
                  </SelectItem>
                  <SelectItem value="stat">
                    <div className="flex items-center gap-2">
                      <Zap className="size-4 text-red-500" />
                      STAT
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Test Selection */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-medium">Select Lab Tests *</Label>
              {formData.selectedTests.length > 0 && (
                <div className="text-sm text-muted-foreground">
                  {formData.selectedTests.length}
                  {' '}
                  test(s) selected • ₹
                  {getSelectedTestsTotal()}
                </div>
              )}
            </div>

            {categories.map((category) => {
              const categoryTests = commonLabTests.filter(test => test.category === category);
              const selectedInCategory = categoryTests.filter(test =>
                formData.selectedTests.includes(test.id),
              ).length;

              return (
                <div key={category} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleSelectCategory(category)}
                      className="h-8"
                    >
                      {category}
                      {' '}
                      (
                      {selectedInCategory}
                      /
                      {categoryTests.length}
                      )
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pl-4 md:grid-cols-2">
                    {categoryTests.map(test => (
                      <div
                        key={test.id}
                        className="flex items-start space-x-2 rounded-lg border p-3 hover:bg-muted/50"
                      >
                        <Checkbox
                          id={test.id}
                          checked={formData.selectedTests.includes(test.id)}
                          onCheckedChange={checked => handleTestToggle(test.id, !!checked)}
                        />
                        <div className="min-w-0 flex-1">
                          <Label
                            htmlFor={test.id}
                            className="cursor-pointer text-sm font-medium"
                          >
                            {test.name}
                          </Label>
                          <div className="mt-1 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">
                              ₹
                              {test.cost}
                            </span>
                            {test.urgency !== 'routine' && (
                              <span className={`rounded px-2 py-1 text-xs ${
                                test.urgency === 'urgent'
                                  ? 'bg-orange-100 text-orange-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                              >
                                {test.urgency.toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <Separator />

          {/* Additional Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="fastingRequired"
                checked={formData.fastingRequired}
                onCheckedChange={checked =>
                  setFormData(prev => ({ ...prev, fastingRequired: !!checked }))}
              />
              <Label htmlFor="fastingRequired" className="text-sm">
                Fasting required (12 hours)
              </Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clinicalNotes">Clinical Notes</Label>
              <Textarea
                id="clinicalNotes"
                placeholder="Clinical indication for these tests..."
                value={formData.clinicalNotes}
                onChange={e => setFormData(prev => ({ ...prev, clinicalNotes: e.target.value }))}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createLabOrderMutation.isPending || formData.selectedTests.length === 0}
              className="min-w-[120px]"
            >
              {createLabOrderMutation.isPending
                ? (
                    <>
                      <div className="mr-2 size-4 animate-spin rounded-full border-b-2 border-white" />
                      Ordering...
                    </>
                  )
                : (
                    <>
                      <TestTube className="mr-2 size-4" />
                      Order Tests (
                      {formData.selectedTests.length}
                      )
                    </>
                  )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
