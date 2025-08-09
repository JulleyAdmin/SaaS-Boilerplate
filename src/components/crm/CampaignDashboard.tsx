'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Send,
  Eye,
  MousePointer,
  TrendingUp,
  DollarSign,
  Calendar,
  Target,
  Plus,
  MoreVertical,
  Edit,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  AlertCircle,
  BarChart3,
  Activity,
} from 'lucide-react';
import { CRMCampaign } from '@/types/crm';
import { format } from 'date-fns';

interface CampaignManagementDashboardProps {
  clinicId: string;
  canManage?: boolean;
}

interface CampaignCardProps {
  campaign: CRMCampaign;
  onEdit: (campaign: CRMCampaign) => void;
  onView: (campaign: CRMCampaign) => void;
  onStatusChange: (campaignId: string, status: string) => void;
  canManage?: boolean;
}

const CampaignCard: React.FC<CampaignCardProps> = ({
  campaign,
  onEdit,
  onView,
  onStatusChange,
  canManage = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-500';
      case 'scheduled': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'completed': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="w-4 h-4" />;
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'paused': return <Pause className="w-4 h-4" />;
      case 'scheduled': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getCampaignTypeIcon = (type: string) => {
    switch (type) {
      case 'awareness': return '📢';
      case 'acquisition': return '👥';
      case 'retention': return '💙';
      case 'reactivation': return '🔄';
      default: return '📋';
    }
  };

  const daysRemaining = campaign.endDate ? 
    Math.ceil((new Date(campaign.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  const deliveryRate = campaign.sentCount > 0 ? Math.round((campaign.deliveredCount / campaign.sentCount) * 100) : 0;
  const openRate = campaign.deliveredCount > 0 ? Math.round((campaign.openedCount / campaign.deliveredCount) * 100) : 0;
  const clickRate = campaign.openedCount > 0 ? Math.round((campaign.clickedCount / campaign.openedCount) * 100) : 0;
  const conversionRate = campaign.sentCount > 0 ? Math.round((campaign.convertedCount / campaign.sentCount) * 100) : 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getCampaignTypeIcon(campaign.campaignType)}</span>
            <div>
              <CardTitle className="text-lg">{campaign.campaignName}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={`${getStatusColor(campaign.status)} text-white border-none`}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(campaign.status)}
                    {campaign.status.toUpperCase()}
                  </span>
                </Badge>
                <span className="text-sm capitalize">
                  {campaign.campaignType.replace('_', ' ')}
                </span>
              </CardDescription>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView(campaign)}>
                <Eye className="w-4 h-4 mr-2" />
                View Analytics
              </DropdownMenuItem>
              {canManage && (
                <>
                  <DropdownMenuItem onClick={() => onEdit(campaign)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Campaign
                  </DropdownMenuItem>
                  {campaign.status === 'draft' && (
                    <DropdownMenuItem onClick={() => onStatusChange(campaign.campaignId, 'active')}>
                      <Play className="w-4 h-4 mr-2" />
                      Launch Campaign
                    </DropdownMenuItem>
                  )}
                  {campaign.status === 'active' && (
                    <DropdownMenuItem onClick={() => onStatusChange(campaign.campaignId, 'paused')}>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause Campaign
                    </DropdownMenuItem>
                  )}
                  {campaign.status === 'paused' && (
                    <DropdownMenuItem onClick={() => onStatusChange(campaign.campaignId, 'active')}>
                      <Play className="w-4 h-4 mr-2" />
                      Resume Campaign
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Campaign Details */}
        {campaign.objective && (
          <p className="text-sm text-gray-600 line-clamp-2">{campaign.objective}</p>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Send className="w-4 h-4 text-blue-500" />
            <span>{campaign.sentCount.toLocaleString()} sent</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-green-500" />
            <span>{openRate}% opened</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MousePointer className="w-4 h-4 text-purple-500" />
            <span>{clickRate}% clicked</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-orange-500" />
            <span>{conversionRate}% converted</span>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Delivery Rate</span>
              <span className="font-medium">{deliveryRate}%</span>
            </div>
            <Progress value={deliveryRate} className="h-1" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Engagement Rate</span>
              <span className="font-medium">{openRate}%</span>
            </div>
            <Progress value={openRate} className="h-1" />
          </div>
        </div>

        {/* Budget & ROI */}
        {campaign.budgetAllocated && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Budget:</span>
              <span className="font-medium">₹{campaign.budgetAllocated.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Spent:</span>
              <span className="font-medium">₹{campaign.budgetSpent.toLocaleString()}</span>
            </div>
            {campaign.roi !== undefined && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ROI:</span>
                <span className={`font-medium ${campaign.roi > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {campaign.roi > 0 ? '+' : ''}{campaign.roi.toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        )}

        {/* Timeline */}
        <div className="flex justify-between items-center text-sm text-gray-500 pt-2 border-t">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Started: {format(new Date(campaign.startDate), 'MMM dd')}</span>
          </div>
          
          {daysRemaining !== null && daysRemaining > 0 && (
            <span className="text-orange-600 font-medium">
              {daysRemaining} days left
            </span>
          )}
        </div>

        {/* Target Segments */}
        {campaign.targetSegments && campaign.targetSegments.length > 0 && (
          <div className="text-xs text-gray-500">
            <span className="font-medium">Segments:</span> {campaign.targetSegments[0]}
            {campaign.targetSegments.length > 1 && <span> +{campaign.targetSegments.length - 1} more</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CampaignManagementDashboard: React.FC<CampaignManagementDashboardProps> = ({
  clinicId,
  canManage = false,
}) => {
  const [campaigns, setCampaigns] = useState<CRMCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<CRMCampaign | null>(null);
  const [showAnalyticsDialog, setShowAnalyticsDialog] = useState(false);

  useEffect(() => {
    fetchCampaigns();
  }, [clinicId, selectedTab]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        includeMetrics: 'true',
        limit: '20',
      });
      
      if (selectedTab !== 'all') {
        params.append('status', selectedTab);
      }

      // Note: This endpoint would need to be implemented
      const response = await fetch(`/api/crm/campaigns?${params}`);
      const data = await response.json();
      
      if (data.data) {
        setCampaigns(data.data);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCampaign = (campaign: CRMCampaign) => {
    console.log('Edit campaign:', campaign);
  };

  const handleViewCampaign = (campaign: CRMCampaign) => {
    setSelectedCampaign(campaign);
    setShowAnalyticsDialog(true);
  };

  const handleStatusChange = async (campaignId: string, status: string) => {
    try {
      // Note: This endpoint would need to be implemented
      const response = await fetch('/api/crm/campaigns', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ campaignId, status }),
      });

      if (response.ok) {
        fetchCampaigns(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating campaign status:', error);
    }
  };

  const getTabCounts = () => {
    return {
      all: campaigns.length,
      draft: campaigns.filter(c => c.status === 'draft').length,
      active: campaigns.filter(c => c.status === 'active').length,
      completed: campaigns.filter(c => c.status === 'completed').length,
      paused: campaigns.filter(c => c.status === 'paused').length,
    };
  };

  const getOverviewStats = () => {
    const totalSent = campaigns.reduce((sum, c) => sum + c.sentCount, 0);
    const totalOpened = campaigns.reduce((sum, c) => sum + c.openedCount, 0);
    const totalClicked = campaigns.reduce((sum, c) => sum + c.clickedCount, 0);
    const totalConverted = campaigns.reduce((sum, c) => sum + c.convertedCount, 0);
    const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
    const totalBudget = campaigns.reduce((sum, c) => sum + (c.budgetAllocated || 0), 0);
    const totalSpent = campaigns.reduce((sum, c) => sum + c.budgetSpent, 0);
    
    return {
      totalSent,
      totalOpened,
      totalClicked,
      totalConverted,
      activeCampaigns,
      totalBudget,
      totalSpent,
      averageOpenRate: totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0,
      averageConversionRate: totalSent > 0 ? Math.round((totalConverted / totalSent) * 100) : 0,
    };
  };

  const tabCounts = getTabCounts();
  const stats = getOverviewStats();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Campaign Management</h2>
          <p className="text-gray-600">Create and manage marketing campaigns</p>
        </div>
        {canManage && (
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        )}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold">{stats.activeCampaigns}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages Sent</p>
                <p className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</p>
              </div>
              <Send className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Open Rate</p>
                <p className="text-2xl font-bold">{stats.averageOpenRate}%</p>
              </div>
              <Eye className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversions</p>
                <p className="text-2xl font-bold">{stats.totalConverted}</p>
              </div>
              <Target className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Allocated</p>
                <p className="text-2xl font-bold">₹{(stats.totalBudget / 100000).toFixed(1)}L</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold">{stats.averageConversionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns List */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All ({tabCounts.all})</TabsTrigger>
          <TabsTrigger value="active">Active ({tabCounts.active})</TabsTrigger>
          <TabsTrigger value="draft">Draft ({tabCounts.draft})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({tabCounts.completed})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {campaigns.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No {selectedTab === 'all' ? '' : selectedTab} campaigns found
                </h3>
                <p className="text-gray-500 mb-4">
                  {selectedTab === 'all' 
                    ? "Start engaging your patients by creating your first marketing campaign!"
                    : `No ${selectedTab} campaigns to display.`
                  }
                </p>
                {canManage && (
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Campaign
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.campaignId}
                  campaign={campaign}
                  onEdit={handleEditCampaign}
                  onView={handleViewCampaign}
                  onStatusChange={handleStatusChange}
                  canManage={canManage}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Campaign Analytics Dialog */}
      <Dialog open={showAnalyticsDialog} onOpenChange={setShowAnalyticsDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedCampaign && (
                <>
                  <BarChart3 className="w-5 h-5" />
                  {selectedCampaign.campaignName} - Analytics
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Campaign performance metrics and analytics
            </DialogDescription>
          </DialogHeader>
          {selectedCampaign && (
            <div className="space-y-4">
              {/* Campaign analytics content would go here */}
              <div className="text-center text-gray-500 py-8">
                Campaign analytics view coming soon...
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
            <DialogDescription>
              Design a new marketing campaign to engage your patients.
            </DialogDescription>
          </DialogHeader>
          {/* Add CreateCampaignForm component here */}
          <div className="text-center text-gray-500 py-8">
            Create Campaign Form Coming Soon...
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CampaignManagementDashboard;