'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  Clock,
  User,
  Heart,
  Shield,
  IndianRupee,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
  FileText,
  Activity,
  Target,
  TrendingUp,
  Stethoscope,
  Users,
  CreditCard,
  Car,
  Star,
  ChevronRight,
  Download,
  Edit,
  Send,
  PhoneCall,
  Video,
  CalendarPlus,
  UserPlus,
  ClipboardList,
  Timer,
  Building,
} from 'lucide-react';

interface LeadDetailsDialogProps {
  lead: any;
  open: boolean;
  onClose: () => void;
  onEdit?: (lead: any) => void;
  onStatusChange?: (leadId: string, status: string) => void;
}

const LeadDetailsDialog: React.FC<LeadDetailsDialogProps> = ({
  lead,
  open,
  onClose,
  onEdit,
  onStatusChange,
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!lead) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inquiry': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'appointment_scheduled': return 'bg-purple-500';
      case 'consultation_done': return 'bg-indigo-500';
      case 'admitted': return 'bg-green-500';
      case 'lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  // Mock activity timeline
  const activities = [
    {
      id: 1,
      type: 'status_change',
      title: 'Lead Created',
      description: 'New inquiry received from website',
      timestamp: lead.createdAt,
      icon: <UserPlus className="w-4 h-4" />,
      color: 'bg-blue-500',
    },
    {
      id: 2,
      type: 'contact',
      title: 'First Contact Attempt',
      description: 'Called patient, scheduled callback for tomorrow',
      timestamp: lead.lastContactDate,
      user: 'Priya Patel',
      icon: <Phone className="w-4 h-4" />,
      color: 'bg-yellow-500',
    },
    {
      id: 3,
      type: 'appointment',
      title: 'Appointment Scheduled',
      description: `Appointment booked for ${lead.appointmentDate ? new Date(lead.appointmentDate).toLocaleDateString() : 'TBD'}`,
      timestamp: lead.updatedAt,
      icon: <Calendar className="w-4 h-4" />,
      color: 'bg-purple-500',
    },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">
                {lead.firstName} {lead.lastName}
              </DialogTitle>
              <DialogDescription className="mt-2 flex items-center gap-3">
                <Badge className={`${getStatusColor(lead.status)} text-white`}>
                  {lead.status?.replace('_', ' ').toUpperCase()}
                </Badge>
                {lead.urgencyLevel && (
                  <Badge className={getUrgencyColor(lead.urgencyLevel)}>
                    {lead.urgencyLevel.toUpperCase()} PRIORITY
                  </Badge>
                )}
                <span className="text-sm text-gray-500">
                  Lead ID: {lead.leadId}
                </span>
              </DialogDescription>
            </div>
            <div className="flex gap-2">
              {onEdit && (
                <Button variant="outline" size="sm" onClick={() => onEdit(lead)}>
                  <Edit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="medical">Medical Info</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(90vh-200px)] mt-4">
            <TabsContent value="overview" className="space-y-4">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span>{lead.phone}</span>
                      <Badge variant="outline" className="text-xs">
                        {lead.preferredContactMethod || 'Phone'}
                      </Badge>
                    </div>
                    {lead.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span>{lead.email}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{lead.location}</span>
                      {lead.pincode && <span className="text-gray-500">({lead.pincode})</span>}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span>Age: {lead.age || lead.ageRange}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>Gender: {lead.gender}</span>
                    </div>
                    {lead.preferredTimeSlot && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>Preferred: {lead.preferredTimeSlot}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Lead Source & Scoring */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Lead Source
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Source</p>
                      <p className="font-medium capitalize">{lead.source?.replace('_', ' ')}</p>
                    </div>
                    {lead.sourceDetails && (
                      <div>
                        <p className="text-sm text-gray-500">Details</p>
                        <div className="text-sm">
                          {Object.entries(lead.sourceDetails).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-600">{key.replace('_', ' ')}:</span>
                              <span>{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-500">Created On</p>
                      <p className="font-medium">
                        {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Lead Scoring
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center mb-4">
                      <div className={`text-4xl font-bold ${getScoreColor(lead.leadScore || 0)}`}>
                        {lead.leadScore || 0}
                      </div>
                      <p className="text-sm text-gray-500">Overall Score</p>
                    </div>
                    {lead.scoreBreakdown && (
                      <div className="space-y-2">
                        {Object.entries(lead.scoreBreakdown).map(([key, value]) => (
                          <div key={key}>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="capitalize">{key.replace('_', ' ')}</span>
                              <span>{value as number}/30</span>
                            </div>
                            <Progress value={((value as number) / 30) * 100} className="h-2" />
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Insurance & Financial */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Insurance & Financial Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Insurance Type</p>
                      <p className="font-medium">{lead.insuranceType || 'Not Specified'}</p>
                    </div>
                    {lead.insuranceCoverage && (
                      <div>
                        <p className="text-sm text-gray-500">Coverage Limit</p>
                        <p className="font-medium">{formatCurrency(lead.insuranceCoverage)}</p>
                      </div>
                    )}
                    {lead.ayushmanCardNumber && (
                      <div>
                        <p className="text-sm text-gray-500">Ayushman Card</p>
                        <p className="font-medium">{lead.ayushmanCardNumber}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Estimated Revenue</p>
                      <p className="font-medium text-lg">
                        {formatCurrency(lead.estimatedRevenue || 0)}
                      </p>
                    </div>
                    {lead.appointmentPreference && (
                      <div>
                        <p className="text-sm text-gray-500">Appointment Preference</p>
                        <p className="font-medium">{lead.appointmentPreference}</p>
                      </div>
                    )}
                    {lead.transportationNeeded && (
                      <div className="flex items-center gap-2 text-orange-600">
                        <Car className="w-4 h-4" />
                        <span className="text-sm">Transportation Required</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Assignment */}
              {lead.assignedUser && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Assignment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {lead.assignedUser.firstName} {lead.assignedUser.lastName}
                          </p>
                          <p className="text-sm text-gray-500">{lead.assignedUser.role}</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Reassign
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="medical" className="space-y-4">
              {/* Health Concerns */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    Health Concerns
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {lead.healthConcerns && lead.healthConcerns.length > 0 ? (
                    <div className="space-y-2">
                      {lead.healthConcerns.map((concern: string, index: number) => (
                        <div key={index} className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
                          <span>{concern}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No health concerns specified</p>
                  )}
                </CardContent>
              </Card>

              {/* Interested Services */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Stethoscope className="w-5 h-5" />
                    Requested Services
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {lead.interestedServices && lead.interestedServices.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {lead.interestedServices.map((service: string, index: number) => (
                        <Badge key={index} variant="secondary">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No services specified</p>
                  )}
                </CardContent>
              </Card>

              {/* Preferred Doctors */}
              {lead.preferredDoctors && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Preferred Doctors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {lead.preferredDoctors.map((doctor: string, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span>{doctor}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Treatment Information (if consultation done) */}
              {lead.status === 'consultation_done' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <ClipboardList className="w-5 h-5" />
                      Consultation Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {lead.consultationDate && (
                      <div>
                        <p className="text-sm text-gray-500">Consultation Date</p>
                        <p className="font-medium">
                          {new Date(lead.consultationDate).toLocaleDateString('en-IN')}
                        </p>
                      </div>
                    )}
                    {lead.consultationNotes && (
                      <div>
                        <p className="text-sm text-gray-500">Doctor's Notes</p>
                        <p className="text-sm mt-1">{lead.consultationNotes}</p>
                      </div>
                    )}
                    {lead.treatmentPlanProposed && (
                      <div>
                        <p className="text-sm text-gray-500">Treatment Plan</p>
                        <p className="font-medium">{lead.treatmentPlanProposed}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Activity Timeline
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities.map((activity, index) => (
                      <div key={activity.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full ${activity.color} text-white flex items-center justify-center`}>
                            {activity.icon}
                          </div>
                          {index < activities.length - 1 && (
                            <div className="w-0.5 h-16 bg-gray-200 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-8">
                          <p className="font-medium">{activity.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>{new Date(activity.timestamp).toLocaleString('en-IN')}</span>
                            {activity.user && (
                              <>
                                <span>•</span>
                                <span>by {activity.user}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="actions" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Communication Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Communication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <PhoneCall className="w-4 h-4 mr-2" />
                      Call Patient
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Send WhatsApp Message
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Mail className="w-4 h-4 mr-2" />
                      Send Email
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Video className="w-4 h-4 mr-2" />
                      Schedule Video Call
                    </Button>
                  </CardContent>
                </Card>

                {/* Lead Management Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Lead Management</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button className="w-full justify-start" variant="outline">
                      <CalendarPlus className="w-4 h-4 mr-2" />
                      Schedule Appointment
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Quote
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Timer className="w-4 h-4 mr-2" />
                      Set Follow-up Reminder
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Convert to Patient
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Status Change */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Update Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    {lead.status === 'inquiry' && (
                      <Button 
                        variant="outline"
                        onClick={() => onStatusChange?.(lead.leadId, 'contacted')}
                      >
                        Mark as Contacted
                      </Button>
                    )}
                    {lead.status === 'contacted' && (
                      <Button 
                        variant="outline"
                        onClick={() => onStatusChange?.(lead.leadId, 'appointment_scheduled')}
                      >
                        Schedule Appointment
                      </Button>
                    )}
                    {lead.status === 'appointment_scheduled' && (
                      <Button 
                        variant="outline"
                        onClick={() => onStatusChange?.(lead.leadId, 'consultation_done')}
                      >
                        Consultation Complete
                      </Button>
                    )}
                    {lead.status === 'consultation_done' && (
                      <Button 
                        variant="outline"
                        onClick={() => onStatusChange?.(lead.leadId, 'admitted')}
                      >
                        Admit Patient
                      </Button>
                    )}
                    {lead.status !== 'lost' && lead.status !== 'admitted' && (
                      <Button 
                        variant="outline"
                        className="text-red-600"
                        onClick={() => onStatusChange?.(lead.leadId, 'lost')}
                      >
                        Mark as Lost
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default LeadDetailsDialog;