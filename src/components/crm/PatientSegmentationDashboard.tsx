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
import {
  Users,
  Filter,
  Plus,
  Edit,
  Target,
  TrendingUp,
  Calendar,
  Hash,
  Activity,
  Settings,
  Download,
  Upload,
} from 'lucide-react';
import { PatientSegment } from '@/types/crm';

interface SegmentCardProps {
  segment: PatientSegment;
  onEdit: (segment: PatientSegment) => void;
  onActivate: (segmentId: string) => void;
  onExport: (segmentId: string) => void;
}

const SegmentCard: React.FC<SegmentCardProps> = ({
  segment,
  onEdit,
  onActivate,
  onExport,
}) => {
  const getSegmentTypeColor = (type: string) => {
    switch (type) {
      case 'demographic': return 'bg-blue-100 text-blue-800';
      case 'behavioral': return 'bg-green-100 text-green-800';
      case 'clinical': return 'bg-purple-100 text-purple-800';
      case 'engagement': return 'bg-yellow-100 text-yellow-800';
      case 'custom': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCriteria = (criteria: any) => {
    if (!criteria) return 'No criteria defined';
    const items = [];
    if (criteria?.ageRange) items.push(`Age: ${criteria.ageRange.min}-${criteria.ageRange.max}`);
    if (criteria?.gender) items.push(`Gender: ${criteria.gender}`);
    if (criteria?.conditions?.length) items.push(`Conditions: ${criteria.conditions.length}`);
    if (criteria?.visitFrequency) items.push(`Visits: ${criteria.visitFrequency}`);
    return items.length > 0 ? items.join(' • ') : 'No criteria defined';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <CardTitle className="text-lg">{segment.segmentName}</CardTitle>
              <Badge className={getSegmentTypeColor(segment.segmentType || 'demographic')}>
                {(segment.segmentType || 'demographic').toUpperCase()}
              </Badge>
              {segment.isActive && (
                <Badge variant="outline" className="bg-green-50">
                  Active
                </Badge>
              )}
            </div>
            <CardDescription>{segment.description}</CardDescription>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(segment)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Criteria Summary */}
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-1">Criteria:</p>
            <p className="text-xs">{formatCriteria(segment.criteria)}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t">
            <div>
              <p className="text-xs text-gray-500">Size</p>
              <p className="font-semibold flex items-center">
                <Hash className="w-3 h-3 mr-1" />
                {segment.segmentSize?.toLocaleString() || 0}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Growth</p>
              <p className="font-semibold flex items-center text-green-600">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{segment.growthRate || 0}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Engagement</p>
              <p className="font-semibold flex items-center">
                <Activity className="w-3 h-3 mr-1" />
                {segment.engagementScore || 0}%
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-3">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onActivate(segment.segmentId)}
              className="flex-1"
            >
              <Target className="w-4 h-4 mr-1" />
              {segment.isActive ? 'Deactivate' : 'Activate'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExport(segment.segmentId)}
              className="flex-1"
            >
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>

          {/* Last Updated */}
          <div className="text-xs text-gray-500 flex items-center">
            <Calendar className="w-3 h-3 mr-1" />
            Updated {new Date(segment.lastCalculated || new Date()).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PatientSegmentationDashboard: React.FC = () => {
  const [segments, setSegments] = useState<PatientSegment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    fetchSegments();
  }, [selectedTab]);

  const fetchSegments = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/crm/segments?${selectedTab !== 'all' ? `segmentType=${selectedTab}` : ''}`
      );
      const data = await response.json();
      
      if (data.data) {
        setSegments(data.data);
      }
    } catch (error) {
      console.error('Error fetching segments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSegment = (segment: PatientSegment) => {
    console.log('Edit segment:', segment);
    // Open edit dialog
  };

  const handleActivateSegment = async (segmentId: string) => {
    console.log('Toggle activation for segment:', segmentId);
    // Toggle segment activation
    await fetchSegments();
  };

  const handleExportSegment = (segmentId: string) => {
    console.log('Export segment:', segmentId);
    // Export segment data
  };

  const getTabCounts = () => {
    return {
      all: segments.length,
      demographic: segments.filter(s => s.segmentType === 'demographic').length,
      behavioral: segments.filter(s => s.segmentType === 'behavioral').length,
      clinical: segments.filter(s => s.segmentType === 'clinical').length,
      engagement: segments.filter(s => s.segmentType === 'engagement').length,
    };
  };

  const tabCounts = getTabCounts();

  const getTotalPatients = () => {
    return segments.reduce((sum, segment) => sum + (segment.segmentSize || 0), 0);
  };

  const getActiveSegments = () => {
    return segments.filter(s => s.isActive).length;
  };

  const getAverageEngagement = () => {
    const engaged = segments.filter(s => s.engagementScore);
    if (engaged.length === 0) return 0;
    const total = engaged.reduce((sum, s) => sum + (s.engagementScore || 0), 0);
    return Math.round(total / engaged.length);
  };

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
          <h2 className="text-2xl font-bold">Patient Segmentation</h2>
          <p className="text-gray-600">Create and manage targeted patient groups</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Segment
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Segments</p>
                <p className="text-2xl font-bold">{segments.length}</p>
              </div>
              <Filter className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold">{getTotalPatients().toLocaleString()}</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Segments</p>
                <p className="text-2xl font-bold">{getActiveSegments()}</p>
              </div>
              <Target className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Engagement</p>
                <p className="text-2xl font-bold">{getAverageEngagement()}%</p>
              </div>
              <Activity className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segments Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">
            All ({tabCounts.all})
          </TabsTrigger>
          <TabsTrigger value="demographic">
            Demographic ({tabCounts.demographic})
          </TabsTrigger>
          <TabsTrigger value="behavioral">
            Behavioral ({tabCounts.behavioral})
          </TabsTrigger>
          <TabsTrigger value="clinical">
            Clinical ({tabCounts.clinical})
          </TabsTrigger>
          <TabsTrigger value="engagement">
            Engagement ({tabCounts.engagement})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {segments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Filter className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900">No segments found</p>
                <p className="text-gray-500 mb-4">Create your first patient segment</p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Segment
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {segments.map((segment) => (
                <SegmentCard
                  key={segment.segmentId}
                  segment={segment}
                  onEdit={handleEditSegment}
                  onActivate={handleActivateSegment}
                  onExport={handleExportSegment}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Segment Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Segment</DialogTitle>
            <DialogDescription>
              Define criteria to create a targeted patient segment for campaigns
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <p className="text-sm text-gray-600">Segment creation form would go here...</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientSegmentationDashboard;