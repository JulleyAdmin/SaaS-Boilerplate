'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Heart, 
  AlertCircle,
  FileText,
  Activity
} from 'lucide-react';

interface PatientDetailsProps {
  patientId: string;
}

export function PatientDetails({ patientId }: PatientDetailsProps) {
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch patient details
    const fetchPatient = async () => {
      try {
        const response = await fetch(`/api/patients/${patientId}`);
        if (response.ok) {
          const data = await response.json();
          setPatient(data);
        }
      } catch (error) {
        console.error('Failed to fetch patient:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [patientId]);

  if (loading) {
    return <div>Loading patient details...</div>;
  }

  // Mock data for demonstration
  const mockPatient = {
    id: patientId,
    firstName: 'Rajesh',
    lastName: 'Kumar',
    dateOfBirth: '1985-06-15',
    gender: 'Male',
    bloodGroup: 'B+',
    phoneNumber: '9876543210',
    email: 'rajesh.kumar@example.com',
    address: '123 Main Street, Mumbai, Maharashtra',
    aadhaarNumber: '987654321012',
    abhaId: 'ABHA123456789',
    emergencyContact: {
      name: 'Priya Kumar',
      phone: '9876543211',
      relation: 'Spouse',
    },
    allergies: ['Penicillin', 'Peanuts'],
    chronicConditions: ['Hypertension', 'Diabetes Type 2'],
    currentMedications: [
      { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
      { name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily' },
    ],
    recentVisits: [
      {
        date: '2024-12-01',
        doctor: 'Dr. Sharma',
        department: 'General Medicine',
        diagnosis: 'Routine Checkup',
        status: 'Completed',
      },
      {
        date: '2024-11-15',
        doctor: 'Dr. Patel',
        department: 'Cardiology',
        diagnosis: 'Hypertension Follow-up',
        status: 'Completed',
      },
    ],
  };

  const displayPatient = patient || mockPatient;

  return (
    <div className="container mx-auto py-6" data-testid="patient-details">
      {/* Patient Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">
              {displayPatient.firstName} {displayPatient.lastName}
            </h1>
            <p className="text-muted-foreground mt-1">
              Patient ID: {displayPatient.id}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Edit Patient</Button>
            <Button>Schedule Appointment</Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="demographics" className="space-y-4">
        <TabsList>
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="medical">Medical History</TabsTrigger>
          <TabsTrigger value="visits">Recent Visits</TabsTrigger>
        </TabsList>

        {/* Demographics Tab */}
        <TabsContent value="demographics">
          <div className="grid gap-4" data-testid="patient-demographics">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p className="font-medium">{displayPatient.dateOfBirth}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p className="font-medium">{displayPatient.gender}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Blood Group</p>
                  <Badge variant="outline" className="mt-1">
                    {displayPatient.bloodGroup}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Aadhaar Number</p>
                  <p className="font-medium">{displayPatient.aadhaarNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ABHA ID</p>
                  <p className="font-medium">{displayPatient.abhaId}</p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{displayPatient.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{displayPatient.email}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                  <span>{displayPatient.address}</span>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Emergency Contact
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{displayPatient.emergencyContact.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{displayPatient.emergencyContact.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Relationship</p>
                  <p className="font-medium">{displayPatient.emergencyContact.relation}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Medical History Tab */}
        <TabsContent value="medical">
          <div className="grid gap-4" data-testid="medical-history">
            {/* Allergies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  Allergies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {displayPatient.allergies.map((allergy: string) => (
                    <Badge key={allergy} variant="destructive">
                      {allergy}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Chronic Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Chronic Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {displayPatient.chronicConditions.map((condition: string) => (
                    <Badge key={condition} variant="secondary">
                      {condition}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Medications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {displayPatient.currentMedications.map((med: any, index: number) => (
                    <div key={index} className="border-l-2 border-primary pl-3">
                      <p className="font-medium">{med.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {med.dosage} • {med.frequency}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Recent Visits Tab */}
        <TabsContent value="visits">
          <Card data-testid="recent-visits">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Visits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Date</th>
                      <th className="text-left py-2">Doctor</th>
                      <th className="text-left py-2">Department</th>
                      <th className="text-left py-2">Diagnosis</th>
                      <th className="text-left py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayPatient.recentVisits.map((visit: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{visit.date}</td>
                        <td className="py-2">{visit.doctor}</td>
                        <td className="py-2">{visit.department}</td>
                        <td className="py-2">{visit.diagnosis}</td>
                        <td className="py-2">
                          <Badge variant="outline">{visit.status}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}