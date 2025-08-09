'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Users,
  Calendar,
  MapPin,
  Heart,
  Activity,
  Award,
  Target,
  Megaphone,
  UserPlus,
  Building,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Globe,
  Gift,
} from 'lucide-react';

const CommunityHealthPrograms: React.FC = () => {
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);

  // Mock data for community health programs with Indian context
  const healthPrograms = [
    {
      id: 'prog-001',
      name: 'Swasth Bharat Health Camp',
      type: 'Free Health Screening',
      category: 'CSR',
      date: '25 Jan 2025',
      time: '9:00 AM - 5:00 PM',
      location: 'Community Center, Rajendra Nagar',
      status: 'upcoming',
      registrations: 245,
      capacity: 500,
      services: [
        'Blood Sugar Testing',
        'Blood Pressure Check',
        'ECG',
        'Eye Examination',
        'Dental Checkup',
        'BMI Assessment',
      ],
      sponsors: ['Rotary Club', 'Lions Club'],
      governmentScheme: 'Ayushman Bharat',
      volunteers: 25,
      impact: {
        previousCamps: 8,
        peopleServed: 3200,
        diseasesDetected: 450,
        referrals: 120,
      },
    },
    {
      id: 'prog-002',
      name: 'Diabetes Awareness & Management',
      type: 'Disease Management Program',
      category: 'Chronic Care',
      date: 'Every Saturday',
      time: '10:00 AM - 12:00 PM',
      location: 'Hospital Auditorium',
      status: 'ongoing',
      registrations: 180,
      capacity: 200,
      curriculum: [
        'Understanding Diabetes',
        'Diet Management',
        'Exercise Programs',
        'Medication Adherence',
        'Foot Care',
        'Complication Prevention',
      ],
      duration: '8 weeks',
      certified: true,
      completionRate: 78,
    },
    {
      id: 'prog-003',
      name: 'Mission Indradhanush Plus',
      type: 'Immunization Drive',
      category: 'Government',
      date: '1-7 Feb 2025',
      time: '9:00 AM - 4:00 PM',
      location: 'Mobile Units - Multiple Locations',
      status: 'planned',
      targetGroup: 'Children 0-5 years & Pregnant Women',
      vaccines: [
        'BCG',
        'Polio',
        'Hepatitis B',
        'DPT',
        'Measles',
        'Tetanus (for pregnant women)',
      ],
      coverage: {
        target: 5000,
        achieved: 0,
        villages: 25,
      },
      partners: ['WHO', 'UNICEF', 'District Health Office'],
    },
    {
      id: 'prog-004',
      name: 'Senior Citizen Wellness Program',
      type: 'Geriatric Care',
      category: 'Community Welfare',
      date: 'Every Tuesday & Thursday',
      time: '6:00 AM - 8:00 AM',
      location: 'Hospital Garden',
      status: 'active',
      enrollments: 125,
      activities: [
        'Yoga Sessions',
        'Physiotherapy',
        'Health Talks',
        'Nutrition Counseling',
        'Mental Health Support',
        'Social Activities',
      ],
      ageGroup: '60+ years',
      freeServices: true,
      satisfaction: 92,
    },
  ];

  const volunteerOpportunities = [
    {
      role: 'Medical Volunteer',
      required: 10,
      enrolled: 7,
      skills: 'Medical degree/Nursing',
      commitment: '1 day/week',
    },
    {
      role: 'Registration Desk',
      required: 15,
      enrolled: 12,
      skills: 'Basic computer',
      commitment: '4 hours/week',
    },
    {
      role: 'Health Educator',
      required: 5,
      enrolled: 3,
      skills: 'Communication skills',
      commitment: '2 days/month',
    },
    {
      role: 'Logistics Support',
      required: 8,
      enrolled: 8,
      skills: 'Organization skills',
      commitment: 'Event-based',
    },
  ];

  const impactMetrics = {
    totalPrograms: 24,
    activeBeneficiaries: 15680,
    villagesCovered: 45,
    volunteerHours: 2450,
    healthScreenings: 8900,
    vaccinationsGiven: 12500,
    chronicPatientsManaged: 3200,
    livesImpacted: 45000,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">Community Health Programs</h1>
            <p className="text-green-100">
              Making healthcare accessible to everyone through community initiatives
            </p>
            <div className="flex gap-4 mt-4">
              <Badge className="bg-white/20 text-white">
                <Globe className="h-3 w-3 mr-1" />
                45 Villages Covered
              </Badge>
              <Badge className="bg-white/20 text-white">
                <Users className="h-3 w-3 mr-1" />
                15,680 Active Beneficiaries
              </Badge>
              <Badge className="bg-white/20 text-white">
                <Heart className="h-3 w-3 mr-1" />
                45,000 Lives Impacted
              </Badge>
            </div>
          </div>
          <Button variant="secondary" size="lg">
            <UserPlus className="h-4 w-4 mr-2" />
            Join as Volunteer
          </Button>
        </div>
      </div>

      {/* Impact Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Health Screenings</p>
                <p className="text-2xl font-bold mt-1">{impactMetrics.healthScreenings.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">+23% this quarter</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vaccinations</p>
                <p className="text-2xl font-bold mt-1">{impactMetrics.vaccinationsGiven.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">On target</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Volunteer Hours</p>
                <p className="text-2xl font-bold mt-1">{impactMetrics.volunteerHours.toLocaleString()}</p>
                <p className="text-xs text-purple-600 mt-1">125 active volunteers</p>
              </div>
              <Award className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Programs</p>
                <p className="text-2xl font-bold mt-1">{impactMetrics.totalPrograms}</p>
                <p className="text-xs text-orange-600 mt-1">8 ongoing</p>
              </div>
              <Target className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="programs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="programs">Active Programs</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteer Network</TabsTrigger>
          <TabsTrigger value="impact">Impact Report</TabsTrigger>
        </TabsList>

        <TabsContent value="programs" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {healthPrograms.map((program) => (
              <Card key={program.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{program.name}</CardTitle>
                      <CardDescription>{program.type}</CardDescription>
                    </div>
                    <Badge 
                      variant={
                        program.status === 'active' || program.status === 'ongoing' ? 'default' :
                        program.status === 'upcoming' ? 'secondary' : 'outline'
                      }
                    >
                      {program.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {/* Date and Location */}
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{program.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>{program.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{program.location}</span>
                  </div>

                  {/* Services or Activities */}
                  {program.services && (
                    <div>
                      <p className="text-sm font-medium mb-2">Services Offered:</p>
                      <div className="flex flex-wrap gap-1">
                        {program.services.slice(0, 4).map((service, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {service}
                          </Badge>
                        ))}
                        {program.services.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{program.services.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Registration Progress */}
                  {program.registrations && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Registrations</span>
                        <span className="font-medium">
                          {program.registrations}/{program.capacity}
                        </span>
                      </div>
                      <Progress value={(program.registrations / program.capacity) * 100} />
                    </div>
                  )}

                  {/* Government Scheme Badge */}
                  {program.governmentScheme && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-blue-600 font-medium">
                        {program.governmentScheme}
                      </span>
                    </div>
                  )}

                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Health Events</CardTitle>
              <CardDescription>
                Join us in making healthcare accessible to all
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {healthPrograms
                  .filter(p => p.status === 'upcoming' || p.status === 'planned')
                  .map((program) => (
                    <Alert key={program.id}>
                      <Megaphone className="h-4 w-4" />
                      <AlertDescription>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">{program.name}</span>
                            <span className="text-gray-600 mx-2">•</span>
                            <span className="text-sm">{program.date} at {program.location}</span>
                          </div>
                          <Button size="sm">Register</Button>
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="volunteers">
          <Card>
            <CardHeader>
              <CardTitle>Volunteer Opportunities</CardTitle>
              <CardDescription>
                Be a part of the change - volunteer for community health
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {volunteerOpportunities.map((opp, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-semibold">{opp.role}</h4>
                        <p className="text-sm text-gray-600 mt-1">Skills: {opp.skills}</p>
                        <p className="text-sm text-gray-600">Commitment: {opp.commitment}</p>
                      </div>
                      <Badge variant={opp.enrolled >= opp.required ? 'secondary' : 'default'}>
                        {opp.enrolled}/{opp.required}
                      </Badge>
                    </div>
                    <Progress value={(opp.enrolled / opp.required) * 100} className="mb-3" />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      disabled={opp.enrolled >= opp.required}
                    >
                      {opp.enrolled >= opp.required ? 'Position Filled' : 'Apply Now'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact">
          <Card>
            <CardHeader>
              <CardTitle>Community Impact Report</CardTitle>
              <CardDescription>
                Our contribution to community health and wellness
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-blue-600">45</p>
                  <p className="text-sm text-gray-600">Villages Covered</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-green-600">15.6K</p>
                  <p className="text-sm text-gray-600">Active Beneficiaries</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-purple-600">92%</p>
                  <p className="text-sm text-gray-600">Satisfaction Rate</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-orange-600">₹2.5Cr</p>
                  <p className="text-sm text-gray-600">CSR Investment</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommunityHealthPrograms;