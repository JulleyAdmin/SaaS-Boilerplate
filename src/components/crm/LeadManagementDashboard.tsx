'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import LeadDetailsDialog from './LeadDetailsDialog';
import LeadTableView from './LeadTableView';
import MetricCard from '@/components/ui/metric-card';
import { SkeletonCard, SkeletonMetricCard } from '@/components/ui/skeleton-card';
import { cn } from '@/lib/utils';
import { realisticHospitalLeads } from '@/data/mock-hospital-leads';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Phone,
  Mail,
  MapPin,
  User,
  TrendingUp,
  Users,
  Target,
  Plus,
  MoreVertical,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Star,
  LayoutGrid,
  List,
} from 'lucide-react';
import { Lead } from '@/types/crm';

interface LeadManagementDashboardProps {
  clinicId: string;
  canManage?: boolean;
}

interface LeadCardProps {
  lead: Lead;
  onEdit: (lead: Lead) => void;
  onView: (lead: Lead) => void;
  onStatusChange: (leadId: string, status: string) => void;
  canManage?: boolean;
}

const LeadCard: React.FC<LeadCardProps> = ({
  lead,
  onEdit,
  onView,
  onStatusChange,
  canManage = false,
}) => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'admitted': return <CheckCircle2 className="w-4 h-4" />;
      case 'consultation_done': return <Star className="w-4 h-4" />;
      case 'appointment_scheduled': return <Target className="w-4 h-4" />;
      case 'contacted': return <Phone className="w-4 h-4" />;
      case 'lost': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'; // High urgency/value
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'; // Medium priority
    if (score >= 40) return 'text-orange-600 bg-orange-100'; // Low priority
    return 'text-red-600 bg-red-100'; // Information only
  };

  const getUrgencyBadge = (lead: Lead) => {
    if (lead.healthConcerns?.some(c => 
      c.toLowerCase().includes('emergency') || 
      c.toLowerCase().includes('urgent') ||
      c.toLowerCase().includes('severe')
    )) {
      return <Badge className="bg-red-500 text-white">URGENT</Badge>;
    }
    if (lead.interestedServices?.some(s => 
      s.toLowerCase().includes('surgery') || 
      s.toLowerCase().includes('operation')
    )) {
      return <Badge className="bg-orange-500 text-white">HIGH PRIORITY</Badge>;
    }
    return null;
  };

  const daysSinceLastContact = lead.lastContactDate ? 
    Math.floor((new Date().getTime() - new Date(lead.lastContactDate).getTime()) / (1000 * 60 * 60 * 24)) : null;

  // Priority based styling
  const getPriorityStyle = () => {
    if (lead.urgencyLevel === 'high' || lead.leadScore >= 80) {
      return 'border-l-4 border-l-red-500 shadow-glow hover:shadow-glow-primary';
    }
    if (lead.leadScore >= 60) {
      return 'border-l-4 border-l-yellow-500';
    }
    return '';
  };

  return (
    <Card className={cn(
      'hover-lift transition-all duration-300 overflow-hidden',
      getPriorityStyle()
    )}>
      <CardHeader className="pb-3 bg-gradient-to-r from-transparent to-cyan-50/30">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-soft">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {lead.firstName} {lead.lastName}
              </CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Badge className={cn(
                  `${getStatusColor(lead.status)} text-white border-none`,
                  'shadow-soft'
                )}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(lead.status)}
                    {lead.status.toUpperCase().replace('_', ' ')}
                  </span>
                </Badge>
                <Badge className={cn(
                  getScoreColor(lead.leadScore),
                  'border-none shadow-soft'
                )}>
                  Score: {lead.leadScore}
                </Badge>
                {getUrgencyBadge(lead)}
              </CardDescription>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="hover:bg-white/50">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(lead)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {canManage && (
                <>
                  <DropdownMenuItem onClick={() => onEdit(lead)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Lead
                  </DropdownMenuItem>
                  {lead.status === 'inquiry' && (
                    <DropdownMenuItem onClick={() => onStatusChange(lead.leadId, 'contacted')}>
                      <Phone className="w-4 h-4 mr-2" />
                      Mark Contacted
                    </DropdownMenuItem>
                  )}
                  {lead.status === 'contacted' && (
                    <DropdownMenuItem onClick={() => onStatusChange(lead.leadId, 'appointment_scheduled')}>
                      <Target className="w-4 h-4 mr-2" />
                      Schedule Appointment
                    </DropdownMenuItem>
                  )}
                  {lead.status === 'appointment_scheduled' && (
                    <DropdownMenuItem onClick={() => onStatusChange(lead.leadId, 'consultation_done')}>
                      <Star className="w-4 h-4 mr-2" />
                      Consultation Completed
                    </DropdownMenuItem>
                  )}
                  {lead.status === 'consultation_done' && (
                    <DropdownMenuItem onClick={() => onStatusChange(lead.leadId, 'admitted')}>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Patient Admitted
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Contact Info */}
        <div className="grid grid-cols-1 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-500" />
            <span>{lead.phone}</span>
          </div>
          {lead.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-500" />
              <span className="truncate">{lead.email}</span>
            </div>
          )}
          {lead.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="truncate">{lead.location}</span>
            </div>
          )}
        </div>

        {/* Interested Services */}
        {lead.interestedServices && lead.interestedServices.length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Interested Services:</p>
            <div className="flex flex-wrap gap-1">
              {lead.interestedServices.slice(0, 2).map((service, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {service}
                </Badge>
              ))}
              {lead.interestedServices.length > 2 && (
                <Badge variant="secondary" className="text-xs">
                  +{lead.interestedServices.length - 2} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Lead Source */}
        <div className="text-sm">
          <span className="text-gray-600">Source:</span>
          <span className="ml-2 capitalize">{lead.source.replace('_', ' ')}</span>
        </div>

        {/* Assigned To */}
        {lead.assignedUser && (
          <div className="text-sm">
            <span className="text-gray-600">Assigned to:</span>
            <span className="ml-2">{lead.assignedUser.firstName} {lead.assignedUser.lastName}</span>
          </div>
        )}

        {/* Contact History */}
        <div className="flex justify-between items-center text-sm text-gray-500 pt-2 border-t">
          <span>
            {lead.contactAttempts > 0 
              ? `${lead.contactAttempts} contact attempts`
              : 'No contact yet'
            }
          </span>
          
          {daysSinceLastContact !== null && (
            <span className={daysSinceLastContact > 7 ? 'text-red-600' : 'text-gray-500'}>
              {daysSinceLastContact === 0 
                ? 'Contacted today'
                : `${daysSinceLastContact}d ago`
              }
            </span>
          )}
        </div>

        {/* Health Concerns Preview */}
        {lead.healthConcerns && lead.healthConcerns.length > 0 && (
          <div className="text-xs text-gray-500">
            <span className="font-medium">Concerns:</span> {lead.healthConcerns[0]}
            {lead.healthConcerns.length > 1 && <span> +{lead.healthConcerns.length - 1} more</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const LeadManagementDashboard: React.FC<LeadManagementDashboardProps> = ({
  clinicId,
  canManage = false,
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  useEffect(() => {
    fetchLeads();
  }, [clinicId, selectedTab]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Use mock data for now
      let filteredData = realisticHospitalLeads;
      
      if (selectedTab !== 'all') {
        filteredData = realisticHospitalLeads.filter(lead => lead.status === selectedTab);
      }
      
      setLeads(filteredData);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditLead = (lead: Lead) => {
    console.log('Edit lead:', lead);
  };

  const handleViewLead = (lead: Lead) => {
    setSelectedLead(lead);
    setShowDetailsDialog(true);
  };

  const handleStatusChange = async (leadId: string, status: string) => {
    try {
      // Note: This endpoint would need to be implemented
      const response = await fetch('/api/crm/leads', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ leadId, status }),
      });

      if (response.ok) {
        fetchLeads(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating lead status:', error);
    }
  };

  const getTabCounts = () => {
    return {
      all: leads.length,
      inquiry: leads.filter(l => l.status === 'inquiry').length,
      contacted: leads.filter(l => l.status === 'contacted').length,
      appointment_scheduled: leads.filter(l => l.status === 'appointment_scheduled').length,
      consultation_done: leads.filter(l => l.status === 'consultation_done').length,
      admitted: leads.filter(l => l.status === 'admitted').length,
      lost: leads.filter(l => l.status === 'lost').length,
    };
  };

  const getOverviewStats = () => {
    const totalLeads = leads.length;
    const admittedPatients = leads.filter(l => l.status === 'admitted').length;
    const appointmentsScheduled = leads.filter(l => l.status === 'appointment_scheduled').length;
    const consultationsDone = leads.filter(l => l.status === 'consultation_done').length;
    const averageScore = leads.length > 0 
      ? Math.round(leads.reduce((sum, l) => sum + l.leadScore, 0) / leads.length)
      : 0;
    
    // Hospital-specific conversion rates
    const inquiryToAppointment = totalLeads > 0 
      ? Math.round(((appointmentsScheduled + consultationsDone + admittedPatients) / totalLeads) * 100) : 0;
    const appointmentToAdmission = appointmentsScheduled > 0
      ? Math.round((admittedPatients / (appointmentsScheduled + consultationsDone + admittedPatients)) * 100) : 0;
    
    return {
      totalLeads,
      admittedPatients,
      appointmentsScheduled,
      consultationsDone,
      inquiryToAppointment,
      appointmentToAdmission,
      averageScore,
    };
  };

  const tabCounts = getTabCounts();
  const stats = getOverviewStats();

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header with gradient background */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 p-8 shadow-xl">
        <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
        <div className="relative flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">Patient Acquisition Pipeline</h2>
            <p className="text-white/90 mt-2">Track inquiries through the patient journey</p>
          </div>
          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-white/20 backdrop-blur rounded-lg p-1">
              <Button
                variant={viewMode === 'card' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('card')}
                className={cn(
                  'px-3',
                  viewMode === 'card' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/20'
                )}
              >
                <LayoutGrid className="w-4 h-4 mr-1" />
                Cards
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('table')}
                className={cn(
                  'px-3',
                  viewMode === 'table' ? 'bg-white text-blue-600' : 'text-white hover:bg-white/20'
                )}
              >
                <List className="w-4 h-4 mr-1" />
                Table
              </Button>
            </div>
            {canManage && (
              <Button 
                onClick={() => setShowCreateDialog(true)}
                className="bg-white text-blue-600 hover:bg-white/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Lead
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Overview Stats - Hospital Funnel Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {loading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <SkeletonMetricCard key={i} />
            ))}
          </>
        ) : (
          <>
            <MetricCard
              title="Total Inquiries"
              value={stats.totalLeads}
              subtitle="This month"
              icon={Users}
              iconColor="text-blue-500"
              trend={{ value: 15, direction: 'up' }}
              animate
              glassEffect
            />
        
        <MetricCard
          title="Appointments"
          value={stats.appointmentsScheduled}
          subtitle="Scheduled"
          icon={Clock}
          iconColor="text-purple-500"
          trend={{ value: 8, direction: 'up' }}
          animate
          glassEffect
        />
        
        <MetricCard
          title="Consultations"
          value={stats.consultationsDone}
          subtitle="Completed"
          icon={Star}
          iconColor="text-indigo-500"
          trend={{ value: 5, direction: 'neutral' }}
          animate
          glassEffect
        />
        
        <MetricCard
          title="Admissions"
          value={stats.admittedPatients}
          subtitle="New patients"
          icon={CheckCircle2}
          iconColor="text-green-500"
          trend={{ value: 12, direction: 'up' }}
          animate
          glassEffect
        />
        
        <MetricCard
          title="Booking Rate"
          value={stats.inquiryToAppointment}
          subtitle="Inquiry → Appt"
          icon={TrendingUp}
          iconColor="text-yellow-500"
          format="percentage"
          animate
          glassEffect
        />
        
            <MetricCard
              title="Admission Rate"
              value={stats.appointmentToAdmission}
              subtitle="Appt → Admit"
              icon={Target}
              iconColor="text-orange-500"
              format="percentage"
              animate
              glassEffect
            />
          </>
        )}
      </div>

      {/* Leads List */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-6 glass rounded-lg">
          <TabsTrigger value="all">All ({tabCounts.all})</TabsTrigger>
          <TabsTrigger value="inquiry">Inquiry ({tabCounts.inquiry})</TabsTrigger>
          <TabsTrigger value="contacted">Contacted ({tabCounts.contacted})</TabsTrigger>
          <TabsTrigger value="appointment_scheduled">Scheduled ({tabCounts.appointment_scheduled})</TabsTrigger>
          <TabsTrigger value="consultation_done">Consulted ({tabCounts.consultation_done})</TabsTrigger>
          <TabsTrigger value="admitted">Admitted ({tabCounts.admitted})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} lines={4} className="animate-fadeIn" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          ) : leads.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No {selectedTab === 'all' ? '' : selectedTab} leads found
                </h3>
                <p className="text-gray-500 mb-4">
                  {selectedTab === 'all' 
                    ? "Start building your patient pipeline by adding your first lead!"
                    : `No ${selectedTab} leads to display.`
                  }
                </p>
                {canManage && (
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Lead
                  </Button>
                )}
              </div>
            </Card>
          ) : viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {leads.map((lead) => (
                <LeadCard
                  key={lead.leadId}
                  lead={lead}
                  onEdit={handleEditLead}
                  onView={handleViewLead}
                  onStatusChange={handleStatusChange}
                  canManage={canManage}
                />
              ))}
            </div>
          ) : (
            <LeadTableView
              leads={leads}
              onView={handleViewLead}
              onEdit={handleEditLead}
              onStatusChange={handleStatusChange}
              onRefresh={fetchLeads}
              loading={loading}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Lead Details Dialog */}
      <LeadDetailsDialog
        lead={selectedLead}
        open={showDetailsDialog}
        onClose={() => {
          setShowDetailsDialog(false);
          setSelectedLead(null);
        }}
        onEdit={handleEditLead}
        onStatusChange={handleStatusChange}
      />

      {/* Create Lead Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>
              Add a potential patient to your CRM pipeline.
            </DialogDescription>
          </DialogHeader>
          {/* Add CreateLeadForm component here */}
          <div className="text-center text-gray-500 py-8">
            Create Lead Form Coming Soon...
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadManagementDashboard;