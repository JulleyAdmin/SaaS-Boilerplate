'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DashboardLayout,
  MetricsRow,
  ContentGrid,
  DashboardSection,
} from '@/components/dashboard/DashboardLayout';
import {
  StandardButton,
  ButtonGroup,
  StandardBadge,
  StandardSearch,
  StandardSelect,
  EmptyState,
} from '@/components/dashboard/StandardUI';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  User,
  Users,
  Building,
  Calendar,
  Clock,
  FileText,
  Upload,
  Search,
  Filter,
  Star,
  MapPin,
  Phone,
  Mail,
  Shield,
  Award,
  TrendingUp,
  Activity,
  Zap,
  Send,
  X,
  ChevronRight,
  Info,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Stethoscope,
  Heart,
  Brain,
  Bone,
  Eye,
  Baby,
  Pill,
  Microscope,
  Scissors,
  UserCheck,
  Globe,
  Video,
  MessageSquare,
  DollarSign,
  IndianRupee,
  Timer,
  Wifi,
  WifiOff,
} from 'lucide-react';

interface Specialist {
  id: string;
  name: string;
  specialty: string;
  subSpecialty?: string;
  qualification: string;
  experience: number;
  hospital: string;
  location: string;
  distance?: number;
  availability: 'available' | 'busy' | 'offline';
  nextAvailable?: string;
  rating: number;
  consultationCount: number;
  consultationFee: number;
  languages: string[];
  expertise: string[];
  acceptsInsurance: boolean;
  governmentScheme?: string[];
  responseTime: string;
  successRate: number;
  preferredMode: 'video' | 'audio' | 'in-person' | 'any';
  isInNetwork: boolean;
  profileImage?: string;
}

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  abhaNumber?: string;
  medicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
  insurance?: string;
  governmentScheme?: string;
}

interface ReferralData {
  patientId: string;
  referringDoctorId: string;
  specialistId?: string;
  specialty: string;
  urgency: 'routine' | 'urgent' | 'emergency';
  reason: string;
  clinicalNotes: string;
  attachments: File[];
  preferredDate?: string;
  preferredTime?: string;
  consultationType: 'video' | 'audio' | 'in-person' | 'any';
  followUpRequired: boolean;
  shareRecords: boolean;
  insurancePreApproval?: boolean;
}

const ReferralCreationWizard: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const patientId = searchParams.get('patient') || '';
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);

  // Mock patient data
  const patient: Patient = {
    id: patientId || 'PAT-001',
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    abhaNumber: '14-1234-5678-9012',
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
    currentMedications: ['Metformin 500mg', 'Amlodipine 5mg'],
    allergies: ['Penicillin'],
    insurance: 'Star Health Insurance',
    governmentScheme: 'PM-JAY',
  };

  // Referral form data
  const [referralData, setReferralData] = useState<ReferralData>({
    patientId: patient.id,
    referringDoctorId: 'DOC-001',
    specialty: '',
    urgency: 'routine',
    reason: '',
    clinicalNotes: '',
    attachments: [],
    consultationType: 'any',
    followUpRequired: false,
    shareRecords: true,
    insurancePreApproval: false,
  });

  // Mock specialists data
  const [specialists, setSpecialists] = useState<Specialist[]>([
    {
      id: 'SPEC-001',
      name: 'Dr. Amit Reddy',
      specialty: 'Cardiology',
      subSpecialty: 'Interventional Cardiology',
      qualification: 'MD, DM (Cardiology), FACC',
      experience: 15,
      hospital: 'Apollo Hospitals',
      location: 'Jubilee Hills, Hyderabad',
      distance: 5.2,
      availability: 'available',
      rating: 4.8,
      consultationCount: 2450,
      consultationFee: 1500,
      languages: ['English', 'Hindi', 'Telugu'],
      expertise: ['Angioplasty', 'Heart Failure', 'Arrhythmia'],
      acceptsInsurance: true,
      governmentScheme: ['PM-JAY', 'CGHS'],
      responseTime: '< 2 hours',
      successRate: 94,
      preferredMode: 'any',
      isInNetwork: true,
    },
    {
      id: 'SPEC-002',
      name: 'Dr. Priya Nair',
      specialty: 'Cardiology',
      subSpecialty: 'Pediatric Cardiology',
      qualification: 'MD, DM (Cardiology)',
      experience: 10,
      hospital: 'CARE Hospitals',
      location: 'Banjara Hills, Hyderabad',
      distance: 3.8,
      availability: 'busy',
      nextAvailable: '2024-01-16 14:00',
      rating: 4.6,
      consultationCount: 1850,
      consultationFee: 1200,
      languages: ['English', 'Hindi', 'Malayalam'],
      expertise: ['Congenital Heart Disease', 'Pediatric Echo'],
      acceptsInsurance: true,
      responseTime: '< 4 hours',
      successRate: 92,
      preferredMode: 'video',
      isInNetwork: true,
    },
    {
      id: 'SPEC-003',
      name: 'Dr. Rajesh Gupta',
      specialty: 'Cardiology',
      qualification: 'MD, DM (Cardiology), FESC',
      experience: 20,
      hospital: 'Yashoda Hospitals',
      location: 'Somajiguda, Hyderabad',
      distance: 8.5,
      availability: 'available',
      rating: 4.9,
      consultationCount: 3200,
      consultationFee: 2000,
      languages: ['English', 'Hindi', 'Punjabi'],
      expertise: ['Complex Angioplasty', 'Structural Heart Disease'],
      acceptsInsurance: true,
      governmentScheme: ['ESI', 'CGHS'],
      responseTime: 'Same day',
      successRate: 96,
      preferredMode: 'in-person',
      isInNetwork: false,
    },
  ]);

  // Filter specialists based on search and filters
  const filteredSpecialists = specialists.filter(specialist => {
    const matchesSearch = specialist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          specialist.hospital.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          specialist.expertise.some(e => e.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesLocation = filterLocation === 'all' || 
                           (filterLocation === 'nearby' && (specialist.distance || 0) < 5) ||
                           (filterLocation === 'network' && specialist.isInNetwork);
    
    const matchesAvailability = filterAvailability === 'all' ||
                               (filterAvailability === 'available' && specialist.availability === 'available') ||
                               (filterAvailability === 'today' && specialist.availability === 'available');
    
    return matchesSearch && matchesLocation && matchesAvailability;
  });

  const steps = [
    { number: 1, title: 'Patient & Urgency', icon: User },
    { number: 2, title: 'Select Specialty', icon: Stethoscope },
    { number: 3, title: 'Choose Specialist', icon: UserCheck },
    { number: 4, title: 'Clinical Details', icon: FileText },
    { number: 5, title: 'Review & Send', icon: Send },
  ];

  const specialties = [
    { value: 'cardiology', label: 'Cardiology', icon: Heart },
    { value: 'neurology', label: 'Neurology', icon: Brain },
    { value: 'orthopedics', label: 'Orthopedics', icon: Bone },
    { value: 'ophthalmology', label: 'Ophthalmology', icon: Eye },
    { value: 'pediatrics', label: 'Pediatrics', icon: Baby },
    { value: 'psychiatry', label: 'Psychiatry', icon: Brain },
    { value: 'oncology', label: 'Oncology', icon: Activity },
    { value: 'pulmonology', label: 'Pulmonology', icon: Activity },
    { value: 'gastroenterology', label: 'Gastroenterology', icon: Activity },
    { value: 'endocrinology', label: 'Endocrinology', icon: Pill },
    { value: 'dermatology', label: 'Dermatology', icon: User },
    { value: 'surgery', label: 'General Surgery', icon: Scissors },
  ];

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSpecialistSelect = (specialist: Specialist) => {
    setSelectedSpecialist(specialist);
    setReferralData(prev => ({ ...prev, specialistId: specialist.id }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      console.log('Submitting referral:', {
        ...referralData,
        specialist: selectedSpecialist,
      });
      
      // Show success message and redirect
      router.push('/dashboard/network/referrals?status=sent');
    }, 2000);
  };

  const getSpecialtyIcon = (specialty: string) => {
    const spec = specialties.find(s => s.value === specialty);
    return spec ? <spec.icon className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />;
  };

  return (
    <DashboardLayout
      title="Create Specialist Referral"
      subtitle="Refer patient to specialist for advanced care"
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Network', href: '/dashboard/network' },
        { label: 'Referrals', href: '/dashboard/network/referrals' },
        { label: 'New Referral' },
      ]}
    >
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                    step.number < currentStep
                      ? 'bg-green-500 border-green-500 text-white'
                      : step.number === currentStep
                      ? 'bg-blue-500 border-blue-500 text-white'
                      : 'bg-white border-gray-300 text-gray-400'
                  }`}
                >
                  {step.number < currentStep ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                <span className={`mt-2 text-sm ${
                  step.number <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className={`flex-1 h-0.5 mx-4 ${
                  step.number < currentStep ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="card-base p-6">
        {/* Step 1: Patient & Urgency */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Patient Information & Urgency</h3>
            
            {/* Patient Info Card */}
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-blue-900">{patient.name}</h4>
                  <p className="text-sm text-blue-700">
                    {patient.age} years, {patient.gender} • ID: {patient.id}
                  </p>
                  {patient.abhaNumber && (
                    <p className="text-sm text-blue-600 mt-1">
                      ABHA: {patient.abhaNumber}
                    </p>
                  )}
                  <div className="mt-3 space-y-1">
                    <p className="text-sm text-blue-700">
                      <strong>Medical History:</strong> {patient.medicalHistory.join(', ')}
                    </p>
                    <p className="text-sm text-blue-700">
                      <strong>Current Medications:</strong> {patient.currentMedications.join(', ')}
                    </p>
                    <p className="text-sm text-red-600">
                      <strong>Allergies:</strong> {patient.allergies.join(', ')}
                    </p>
                  </div>
                </div>
                <StandardBadge variant="info">
                  {patient.insurance || patient.governmentScheme}
                </StandardBadge>
              </div>
            </div>

            {/* Urgency Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Referral Urgency
              </label>
              <div className="grid grid-cols-3 gap-4">
                {(['routine', 'urgent', 'emergency'] as const).map(level => (
                  <button
                    key={level}
                    onClick={() => setReferralData(prev => ({ ...prev, urgency: level }))}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      referralData.urgency === level
                        ? level === 'emergency' 
                          ? 'border-red-500 bg-red-50' 
                          : level === 'urgent'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      {level === 'emergency' && <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />}
                      {level === 'urgent' && <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />}
                      {level === 'routine' && <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />}
                      <h4 className="font-medium capitalize">{level}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {level === 'emergency' && 'Immediate attention required'}
                        {level === 'urgent' && 'Within 24-48 hours'}
                        {level === 'routine' && 'Within 1-2 weeks'}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Consultation Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Consultation Type
              </label>
              <div className="grid grid-cols-4 gap-3">
                {(['video', 'audio', 'in-person', 'any'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setReferralData(prev => ({ ...prev, consultationType: type }))}
                    className={`p-3 rounded-lg border ${
                      referralData.consultationType === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      {type === 'video' && <Video className="w-5 h-5 mx-auto mb-1" />}
                      {type === 'audio' && <Phone className="w-5 h-5 mx-auto mb-1" />}
                      {type === 'in-person' && <Users className="w-5 h-5 mx-auto mb-1" />}
                      {type === 'any' && <Zap className="w-5 h-5 mx-auto mb-1" />}
                      <span className="text-sm capitalize">{type === 'any' ? 'Any' : type.replace('-', ' ')}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Select Specialty */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Select Medical Specialty</h3>
            
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {specialties.map(specialty => (
                <button
                  key={specialty.value}
                  onClick={() => {
                    setReferralData(prev => ({ ...prev, specialty: specialty.value }));
                    // Auto-advance to next step
                    setTimeout(() => handleNext(), 300);
                  }}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    referralData.specialty === specialty.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <specialty.icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="text-sm font-medium">{specialty.label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Choose Specialist */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Choose Specialist</h3>
              <div className="flex items-center gap-2">
                <StandardSearch
                  placeholder="Search by name, hospital, expertise..."
                  value={searchQuery}
                  onChange={setSearchQuery}
                  className="w-64"
                />
                <StandardSelect
                  options={[
                    { value: 'all', label: 'All Locations' },
                    { value: 'nearby', label: 'Nearby (< 5km)' },
                    { value: 'network', label: 'In Network' },
                  ]}
                  value={filterLocation}
                  onChange={setFilterLocation}
                />
                <StandardSelect
                  options={[
                    { value: 'all', label: 'All Availability' },
                    { value: 'available', label: 'Available Now' },
                    { value: 'today', label: 'Available Today' },
                  ]}
                  value={filterAvailability}
                  onChange={setFilterAvailability}
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredSpecialists.map(specialist => (
                <div
                  key={specialist.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedSpecialist?.id === specialist.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleSpecialistSelect(specialist)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{specialist.name}</h4>
                          <p className="text-sm text-gray-600">
                            {specialist.qualification} • {specialist.experience} years exp
                          </p>
                        </div>
                        {specialist.isInNetwork && (
                          <StandardBadge variant="success" size="sm">In Network</StandardBadge>
                        )}
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Hospital:</span>
                          <p className="font-medium">{specialist.hospital}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <p className="font-medium">
                            {specialist.location}
                            {specialist.distance && ` (${specialist.distance} km)`}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Availability:</span>
                          <p className="font-medium">
                            {specialist.availability === 'available' ? (
                              <span className="text-green-600">Available</span>
                            ) : specialist.availability === 'busy' ? (
                              <span className="text-orange-600">Next: {specialist.nextAvailable}</span>
                            ) : (
                              <span className="text-gray-600">Offline</span>
                            )}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-500">Fee:</span>
                          <p className="font-medium">₹{specialist.consultationFee}</p>
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {specialist.expertise.map(exp => (
                          <StandardBadge key={exp} variant="secondary" size="sm">
                            {exp}
                          </StandardBadge>
                        ))}
                      </div>

                      <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{specialist.rating} ({specialist.consultationCount} consults)</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Timer className="w-4 h-4" />
                          <span>{specialist.responseTime}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          <span>{specialist.successRate}% success rate</span>
                        </div>
                      </div>
                    </div>

                    <div className="ml-4">
                      {selectedSpecialist?.id === specialist.id ? (
                        <CheckCircle className="w-6 h-6 text-blue-500" />
                      ) : (
                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Clinical Details */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Clinical Details & Notes</h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Referral
              </label>
              <input
                type="text"
                value={referralData.reason}
                onChange={(e) => setReferralData(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="e.g., Chest pain with abnormal ECG findings"
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Clinical Notes
              </label>
              <textarea
                value={referralData.clinicalNotes}
                onChange={(e) => setReferralData(prev => ({ ...prev, clinicalNotes: e.target.value }))}
                placeholder="Detailed clinical findings, test results, and specific concerns..."
                className="w-full px-4 py-2 border rounded-lg"
                rows={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Attachments
              </label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">
                  Drag and drop files here or click to browse
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  ECG, X-rays, Lab reports, Previous prescriptions
                </p>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setReferralData(prev => ({ ...prev, attachments: files }));
                  }}
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={referralData.shareRecords}
                  onChange={(e) => setReferralData(prev => ({ ...prev, shareRecords: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Share patient's medical records with specialist</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={referralData.followUpRequired}
                  onChange={(e) => setReferralData(prev => ({ ...prev, followUpRequired: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Request follow-up report after consultation</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={referralData.insurancePreApproval}
                  onChange={(e) => setReferralData(prev => ({ ...prev, insurancePreApproval: e.target.checked }))}
                  className="rounded"
                />
                <span className="text-sm">Request insurance pre-approval</span>
              </label>
            </div>
          </div>
        )}

        {/* Step 5: Review & Send */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Review & Send Referral</h3>

            {/* Summary Card */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Patient Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span>
                    <p className="font-medium">{patient.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Age/Gender:</span>
                    <p className="font-medium">{patient.age} years, {patient.gender}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">ABHA:</span>
                    <p className="font-medium">{patient.abhaNumber}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Insurance:</span>
                    <p className="font-medium">{patient.insurance || patient.governmentScheme}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Referral Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Urgency:</span>
                    <p className="font-medium capitalize">
                      <StandardBadge variant={
                        referralData.urgency === 'emergency' ? 'danger' :
                        referralData.urgency === 'urgent' ? 'warning' : 'info'
                      }>
                        {referralData.urgency}
                      </StandardBadge>
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Specialty:</span>
                    <p className="font-medium capitalize">{referralData.specialty}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Consultation Type:</span>
                    <p className="font-medium capitalize">{referralData.consultationType}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Records Sharing:</span>
                    <p className="font-medium">{referralData.shareRecords ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>

              {selectedSpecialist && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Specialist Information</h4>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedSpecialist.name}</p>
                      <p className="text-sm text-gray-600">
                        {selectedSpecialist.hospital} • {selectedSpecialist.location}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Consultation Fee:</span>
                      <p className="font-medium">₹{selectedSpecialist.consultationFee}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Response Time:</span>
                      <p className="font-medium">{selectedSpecialist.responseTime}</p>
                    </div>
                  </div>
                </div>
              )}

              {referralData.reason && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Reason for Referral</h4>
                  <p className="text-sm text-gray-700">{referralData.reason}</p>
                </div>
              )}

              {referralData.clinicalNotes && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Clinical Notes</h4>
                  <p className="text-sm text-gray-700">{referralData.clinicalNotes}</p>
                </div>
              )}
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-medium text-yellow-900">Important Information</p>
                  <ul className="mt-1 space-y-1 text-yellow-700">
                    <li>• The specialist will receive this referral immediately</li>
                    <li>• Patient will be notified via SMS and app notification</li>
                    <li>• You will receive confirmation once the specialist accepts</li>
                    <li>• Average response time: {selectedSpecialist?.responseTime || '2-4 hours'}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between">
          <StandardButton
            variant="secondary"
            icon={ArrowLeft}
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </StandardButton>

          <div className="flex items-center gap-3">
            <StandardButton
              variant="secondary"
              onClick={() => router.push('/dashboard/network/referrals')}
            >
              Cancel
            </StandardButton>
            
            {currentStep < 5 ? (
              <StandardButton
                variant="primary"
                icon={ArrowRight}
                onClick={handleNext}
                disabled={
                  (currentStep === 2 && !referralData.specialty) ||
                  (currentStep === 3 && !selectedSpecialist)
                }
              >
                Next
              </StandardButton>
            ) : (
              <StandardButton
                variant="success"
                icon={isSubmitting ? Loader2 : Send}
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Referral'}
              </StandardButton>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ReferralCreationWizard;