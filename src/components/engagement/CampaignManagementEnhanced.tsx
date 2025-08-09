'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Megaphone,
  Plus,
  Edit,
  Trash2,
  Play,
  Pause,
  Send,
  Calendar,
  Users,
  Target,
  TrendingUp,
  MessageSquare,
  Mail,
  Phone,
  BarChart3,
  ChevronRight,
  Copy,
  CheckCircle,
  AlertCircle,
  Clock,
  Settings,
  Filter,
  Download,
} from 'lucide-react';
import { mockPatientDatabase, getActiveCampaigns, getPatientSegments } from '@/data/mock-patient-engagement';
import { toast } from 'sonner';

const CampaignManagementEnhanced: React.FC = () => {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  
  // Dialog states
  const [createDialog, setCreateDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [previewDialog, setPreviewDialog] = useState(false);
  const [analyticsDialog, setAnalyticsDialog] = useState(false);
  
  // Filter state
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  
  // Form state for new campaign
  const [campaignForm, setCampaignForm] = useState({
    name: '',
    type: '',
    targetSegment: '',
    channels: [] as string[],
    startDate: '',
    endDate: '',
    content: {
      subject: '',
      message: '',
      cta: '',
    },
    automation: {
      trigger: 'manual',
      frequency: 'once',
    },
  });

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = () => {
    setLoading(true);
    const activeCampaigns = getActiveCampaigns();
    const allCampaigns = mockPatientDatabase.campaigns;
    setCampaigns(allCampaigns);
    
    const patientSegments = getPatientSegments();
    setSegments(patientSegments);
    setLoading(false);
  };

  const handleCreateCampaign = () => {
    const newCampaign = {
      id: `CAMP${Date.now()}`,
      ...campaignForm,
      status: 'draft',
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        responded: 0,
        appointments: 0,
        roi: 0,
      },
      createdAt: new Date().toISOString(),
    };
    
    setCampaigns([newCampaign, ...campaigns]);
    toast.success('Campaign created successfully!', {
      description: `"${campaignForm.name}" has been created and saved as draft.`,
    });
    
    setCreateDialog(false);
    resetForm();
  };

  const handleLaunchCampaign = (campaignId: string) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaignId 
        ? { ...c, status: 'active', launchedAt: new Date().toISOString() }
        : c
    ));
    
    const campaign = campaigns.find(c => c.id === campaignId);
    toast.success(`Campaign "${campaign?.name}" launched!`, {
      description: 'Messages are being sent to the target segment.',
    });
    
    // Simulate sending messages
    setTimeout(() => {
      setCampaigns(prev => prev.map(c => 
        c.id === campaignId 
          ? { 
              ...c, 
              metrics: {
                ...c.metrics,
                sent: Math.floor(Math.random() * 1000) + 500,
                delivered: Math.floor(Math.random() * 900) + 400,
              }
            }
          : c
      ));
    }, 2000);
  };

  const handlePauseCampaign = (campaignId: string) => {
    setCampaigns(campaigns.map(c => 
      c.id === campaignId ? { ...c, status: 'paused' } : c
    ));
    toast.info('Campaign paused');
  };

  const handleDuplicateCampaign = (campaign: any) => {
    const duplicated = {
      ...campaign,
      id: `CAMP${Date.now()}`,
      name: `${campaign.name} (Copy)`,
      status: 'draft',
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        responded: 0,
        appointments: 0,
        roi: 0,
      },
    };
    
    setCampaigns([duplicated, ...campaigns]);
    toast.success('Campaign duplicated');
  };

  const handleDeleteCampaign = (campaignId: string) => {
    setCampaigns(campaigns.filter(c => c.id !== campaignId));
    toast.info('Campaign deleted');
  };

  const resetForm = () => {
    setCampaignForm({
      name: '',
      type: '',
      targetSegment: '',
      channels: [],
      startDate: '',
      endDate: '',
      content: {
        subject: '',
        message: '',
        cta: '',
      },
      automation: {
        trigger: 'manual',
        frequency: 'once',
      },
    });
  };

  const filteredCampaigns = campaigns.filter(c => {
    if (filterStatus !== 'all' && c.status !== filterStatus) return false;
    if (filterType !== 'all' && c.type !== filterType) return false;
    return true;
  });

  // Calculate overall metrics
  const overallMetrics = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalSent: campaigns.reduce((acc, c) => acc + (c.metrics?.sent || 0), 0),
    totalConverted: campaigns.reduce((acc, c) => acc + (c.metrics?.appointments || 0), 0),
    avgRoi: campaigns.filter(c => c.metrics?.roi).reduce((acc, c) => acc + c.metrics.roi, 0) / 
            campaigns.filter(c => c.metrics?.roi).length || 0,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campaign Management</h1>
          <p className="text-gray-600 mt-1">
            Create and manage patient engagement campaigns
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info('Downloading campaign report...')}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Campaign
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold mt-1">{overallMetrics.totalCampaigns}</p>
              </div>
              <Megaphone className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold mt-1">{overallMetrics.activeCampaigns}</p>
              </div>
              <Play className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Messages Sent</p>
                <p className="text-2xl font-bold mt-1">
                  {overallMetrics.totalSent.toLocaleString()}
                </p>
              </div>
              <Send className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversions</p>
                <p className="text-2xl font-bold mt-1">{overallMetrics.totalConverted}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg ROI</p>
                <p className="text-2xl font-bold mt-1">{overallMetrics.avgRoi.toFixed(1)}x</p>
              </div>
              <TrendingUp className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="paused">Paused</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Disease Management">Disease Management</SelectItem>
            <SelectItem value="Preventive Care">Preventive Care</SelectItem>
            <SelectItem value="Geriatric Care">Geriatric Care</SelectItem>
            <SelectItem value="patient_care">Patient Care</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="icon">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      {/* Campaign List */}
      <div className="space-y-4">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{campaign.name}</h3>
                    <Badge 
                      variant={
                        campaign.status === 'active' ? 'default' :
                        campaign.status === 'draft' ? 'secondary' :
                        campaign.status === 'paused' ? 'outline' : 'secondary'
                      }
                    >
                      {campaign.status}
                    </Badge>
                    {campaign.governmentScheme && (
                      <Badge className="bg-green-100 text-green-800">
                        Government Scheme
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {campaign.type} • Target: {campaign.targetSegment}
                  </p>
                  
                  {/* Channels */}
                  <div className="flex gap-2 mb-3">
                    {campaign.channels?.map((channel: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {channel === 'whatsapp' && <MessageSquare className="h-3 w-3 mr-1" />}
                        {channel === 'sms' && <Phone className="h-3 w-3 mr-1" />}
                        {channel === 'email' && <Mail className="h-3 w-3 mr-1" />}
                        {channel}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Dates */}
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{campaign.startDate} - {campaign.endDate}</span>
                    </div>
                    {campaign.segments && (
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{campaign.segments.length} segments</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Metrics */}
                  {campaign.metrics && campaign.metrics.sent > 0 && (
                    <div className="grid grid-cols-6 gap-4 p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-xs text-gray-600">Sent</p>
                        <p className="font-semibold">{campaign.metrics.sent.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Delivered</p>
                        <p className="font-semibold">
                          {Math.round((campaign.metrics.delivered / campaign.metrics.sent) * 100)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Opened</p>
                        <p className="font-semibold">
                          {Math.round((campaign.metrics.opened / campaign.metrics.sent) * 100)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Responded</p>
                        <p className="font-semibold">{campaign.metrics.responded}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">Converted</p>
                        <p className="font-semibold">{campaign.metrics.appointments}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600">ROI</p>
                        <p className="font-semibold text-green-600">{campaign.metrics.roi}x</p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  {campaign.status === 'draft' && (
                    <Button 
                      size="sm" 
                      onClick={() => handleLaunchCampaign(campaign.id)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Launch
                    </Button>
                  )}
                  
                  {campaign.status === 'active' && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handlePauseCampaign(campaign.id)}
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Pause
                    </Button>
                  )}
                  
                  {campaign.status === 'paused' && (
                    <Button 
                      size="sm"
                      onClick={() => handleLaunchCampaign(campaign.id)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Resume
                    </Button>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedCampaign(campaign);
                      setPreviewDialog(true);
                    }}
                  >
                    Preview
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      setSelectedCampaign(campaign);
                      setAnalyticsDialog(true);
                    }}
                  >
                    <BarChart3 className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDuplicateCampaign(campaign)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline"
                    className="text-red-600"
                    onClick={() => handleDeleteCampaign(campaign.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Campaign Dialog */}
      <Dialog open={createDialog} onOpenChange={setCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Set up a new patient engagement campaign
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Campaign Name</Label>
                <Input 
                  placeholder="e.g., Diabetes Awareness Month"
                  value={campaignForm.name}
                  onChange={(e) => setCampaignForm({...campaignForm, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Campaign Type</Label>
                <Select 
                  value={campaignForm.type}
                  onValueChange={(v) => setCampaignForm({...campaignForm, type: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disease Management">Disease Management</SelectItem>
                    <SelectItem value="Preventive Care">Preventive Care</SelectItem>
                    <SelectItem value="Health Education">Health Education</SelectItem>
                    <SelectItem value="Follow-up">Follow-up Care</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Target Segment</Label>
                <Select 
                  value={campaignForm.targetSegment}
                  onValueChange={(v) => setCampaignForm({...campaignForm, targetSegment: v})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select segment" />
                  </SelectTrigger>
                  <SelectContent>
                    {segments.map((seg) => (
                      <SelectItem key={seg.id} value={seg.name}>
                        {seg.name} ({seg.patientCount} patients)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Channels</Label>
                <div className="flex gap-2 mt-2">
                  {['WhatsApp', 'SMS', 'Email', 'Voice'].map((channel) => (
                    <label key={channel} className="flex items-center gap-1">
                      <input 
                        type="checkbox"
                        checked={campaignForm.channels.includes(channel.toLowerCase())}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCampaignForm({
                              ...campaignForm, 
                              channels: [...campaignForm.channels, channel.toLowerCase()]
                            });
                          } else {
                            setCampaignForm({
                              ...campaignForm,
                              channels: campaignForm.channels.filter(c => c !== channel.toLowerCase())
                            });
                          }
                        }}
                      />
                      <span className="text-sm">{channel}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input 
                  type="date"
                  value={campaignForm.startDate}
                  onChange={(e) => setCampaignForm({...campaignForm, startDate: e.target.value})}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input 
                  type="date"
                  value={campaignForm.endDate}
                  onChange={(e) => setCampaignForm({...campaignForm, endDate: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <Label>Message Content</Label>
              <Textarea 
                placeholder="Enter your campaign message..."
                className="min-h-[100px]"
                value={campaignForm.content.message}
                onChange={(e) => setCampaignForm({
                  ...campaignForm,
                  content: {...campaignForm.content, message: e.target.value}
                })}
              />
              <p className="text-xs text-gray-600 mt-1">
                Use {'{name}'} for patient name, {'{appointment_date}'} for dates
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Call to Action</Label>
                <Input 
                  placeholder="e.g., Book Appointment"
                  value={campaignForm.content.cta}
                  onChange={(e) => setCampaignForm({
                    ...campaignForm,
                    content: {...campaignForm.content, cta: e.target.value}
                  })}
                />
              </div>
              <div>
                <Label>Automation</Label>
                <Select 
                  value={campaignForm.automation.trigger}
                  onValueChange={(v) => setCampaignForm({
                    ...campaignForm,
                    automation: {...campaignForm.automation, trigger: v}
                  })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="event_based">Event Based</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setCreateDialog(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleCreateCampaign}>
              Create Campaign
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={previewDialog} onOpenChange={setPreviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Campaign Preview</DialogTitle>
            <DialogDescription>
              {selectedCampaign?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCampaign && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-2">WhatsApp Message:</p>
                <p className="text-sm">
                  {selectedCampaign.content?.whatsapp?.message || 
                   'Hello {name}, this is a reminder about your health checkup.'}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-2">SMS Message:</p>
                <p className="text-sm">
                  {selectedCampaign.content?.sms || 
                   'Dear {name}, your appointment is scheduled. Reply YES to confirm.'}
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  Send Test Message
                </Button>
                <Button className="flex-1" onClick={() => {
                  toast.success('Test message sent to your phone');
                  setPreviewDialog(false);
                }}>
                  Looks Good
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Analytics Dialog */}
      <Dialog open={analyticsDialog} onOpenChange={setAnalyticsDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Campaign Analytics</DialogTitle>
            <DialogDescription>
              {selectedCampaign?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCampaign && selectedCampaign.metrics && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">Delivery Rate</p>
                    <p className="text-2xl font-bold">
                      {Math.round((selectedCampaign.metrics.delivered / selectedCampaign.metrics.sent) * 100)}%
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">Open Rate</p>
                    <p className="text-2xl font-bold">
                      {Math.round((selectedCampaign.metrics.opened / selectedCampaign.metrics.sent) * 100)}%
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-2xl font-bold">
                      {Math.round((selectedCampaign.metrics.appointments / selectedCampaign.metrics.sent) * 100)}%
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium mb-3">Channel Performance</h4>
                <div className="space-y-2">
                  {selectedCampaign.channels?.map((channel: string) => (
                    <div key={channel} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{channel}</span>
                      <div className="flex items-center gap-2">
                        <Progress value={Math.random() * 100} className="w-32" />
                        <span className="text-sm font-medium">
                          {Math.floor(Math.random() * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <Button className="w-full" onClick={() => {
                toast.info('Downloading detailed analytics report...');
                setAnalyticsDialog(false);
              }}>
                Download Full Report
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignManagementEnhanced;