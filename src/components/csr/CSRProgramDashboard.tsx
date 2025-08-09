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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Heart,
  Users,
  Calendar,
  MapPin,
  DollarSign,
  Plus,
  MoreVertical,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Star,
  Activity,
} from 'lucide-react';
import { CSRProgram } from '@/types/csr';
import { format } from 'date-fns';

interface CSRProgramDashboardProps {
  clinicId: string;
  canManage?: boolean; // If user can create/edit programs
}

interface ProgramCardProps {
  program: CSRProgram;
  onEdit: (program: CSRProgram) => void;
  onView: (program: CSRProgram) => void;
  onStatusChange: (programId: string, status: string) => void;
  canManage?: boolean;
}

const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  onEdit,
  onView,
  onStatusChange,
  canManage = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-500';
      case 'approved': return 'bg-green-500';
      case 'active': return 'bg-purple-500';
      case 'completed': return 'bg-emerald-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'active': return <Activity className="w-4 h-4" />;
      case 'planned': return <Clock className="w-4 h-4" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getProgramTypeIcon = (type: string) => {
    switch (type) {
      case 'health_camp': return '🏥';
      case 'vaccination_drive': return '💉';
      case 'screening_program': return '🔬';
      case 'health_education': return '📚';
      case 'blood_donation': return '🩸';
      case 'mental_health_awareness': return '🧠';
      case 'nutrition_program': return '🥗';
      case 'fitness_program': return '💪';
      default: return '❤️';
    }
  };

  const daysRemaining = program.startDate ? 
    Math.ceil((new Date(program.startDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getProgramTypeIcon(program.programType)}</span>
            <div>
              <CardTitle className="text-lg">{program.programName}</CardTitle>
              <CardDescription className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={`${getStatusColor(program.status)} text-white border-none`}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(program.status)}
                    {program.status.replace('_', ' ').toUpperCase()}
                  </span>
                </Badge>
                <span className="text-sm capitalize">
                  {program.programType.replace('_', ' ')}
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
              <DropdownMenuItem onClick={() => onView(program)}>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {canManage && (
                <>
                  <DropdownMenuItem onClick={() => onEdit(program)}>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Program
                  </DropdownMenuItem>
                  {program.status === 'planned' && (
                    <DropdownMenuItem onClick={() => onStatusChange(program.programId, 'active')}>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Start Program
                    </DropdownMenuItem>
                  )}
                  {program.status === 'active' && (
                    <DropdownMenuItem onClick={() => onStatusChange(program.programId, 'completed')}>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark Complete
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        {program.description && (
          <p className="text-sm text-gray-600 line-clamp-2">{program.description}</p>
        )}

        {/* Key Info Grid */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>{format(new Date(program.startDate), 'MMM dd, yyyy')}</span>
          </div>
          
          {program.venueName && (
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-500" />
              <span className="truncate">{program.venueName}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-500" />
            <span>
              {program.actualBeneficiaries > 0 
                ? `${program.actualBeneficiaries} served`
                : `Target: ${program.targetCount || 'N/A'}`
              }
            </span>
          </div>
          
          {program.budget && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-yellow-500" />
              <span>₹{program.budget.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* Stats (if available) */}
        {program.stats && (
          <div className="bg-gray-50 rounded-lg p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Events:</span>
              <span className="font-medium">{program.stats.eventCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Registrations:</span>
              <span className="font-medium">{program.stats.totalRegistrations}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Attendance:</span>
              <span className="font-medium">
                {program.stats.totalAttendance} ({program.stats.attendanceRate}%)
              </span>
            </div>
          </div>
        )}

        {/* Timeline Info */}
        <div className="flex justify-between items-center text-sm text-gray-500 pt-2 border-t">
          {daysRemaining !== null && (
            <span>
              {daysRemaining > 0 
                ? `Starts in ${daysRemaining} days`
                : daysRemaining === 0 
                  ? 'Starts today'
                  : 'Started'
              }
            </span>
          )}
          
          {program.feedbackScore && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>{program.feedbackScore.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Objectives Preview */}
        {program.objectives && program.objectives.length > 0 && (
          <div className="text-xs text-gray-500">
            <span className="font-medium">Objectives:</span> {program.objectives[0]}
            {program.objectives.length > 1 && <span> +{program.objectives.length - 1} more</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const CSRProgramDashboard: React.FC<CSRProgramDashboardProps> = ({
  clinicId,
  canManage = false,
}) => {
  const [programs, setPrograms] = useState<CSRProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<CSRProgram | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    fetchPrograms();
  }, [clinicId, selectedTab]);

  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        includeStats: 'true',
        limit: '20',
      });
      
      if (selectedTab !== 'all') {
        params.append('status', selectedTab);
      }

      const response = await fetch(`/api/csr/programs?${params}`);
      const data = await response.json();
      
      if (data.data) {
        setPrograms(data.data);
      }
    } catch (error) {
      console.error('Error fetching CSR programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProgram = (program: CSRProgram) => {
    // Open edit dialog
    console.log('Edit program:', program);
  };

  const handleViewProgram = (program: CSRProgram) => {
    setSelectedProgram(program);
    setShowDetailsDialog(true);
  };

  const handleStatusChange = async (programId: string, status: string) => {
    try {
      const response = await fetch('/api/csr/programs', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ programId, status }),
      });

      if (response.ok) {
        fetchPrograms(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating program status:', error);
    }
  };

  const getTabCounts = () => {
    return {
      all: programs.length,
      planned: programs.filter(p => p.status === 'planned').length,
      approved: programs.filter(p => p.status === 'approved').length,
      active: programs.filter(p => p.status === 'active').length,
      completed: programs.filter(p => p.status === 'completed').length,
    };
  };

  const getOverviewStats = () => {
    const totalBeneficiaries = programs.reduce((sum, p) => sum + p.actualBeneficiaries, 0);
    const totalBudget = programs.reduce((sum, p) => sum + (p.budget || 0), 0);
    const activePrograms = programs.filter(p => p.status === 'active').length;
    const completedPrograms = programs.filter(p => p.status === 'completed').length;
    
    return {
      totalBeneficiaries,
      totalBudget,
      activePrograms,
      completedPrograms,
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
          <h2 className="text-2xl font-bold">CSR Programs</h2>
          <p className="text-gray-600">Community service and social responsibility initiatives</p>
        </div>
        {canManage && (
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Program
          </Button>
        )}
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Beneficiaries</p>
                <p className="text-2xl font-bold">{stats.totalBeneficiaries.toLocaleString()}</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Programs</p>
                <p className="text-2xl font-bold">{stats.activePrograms}</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Programs</p>
                <p className="text-2xl font-bold">{stats.completedPrograms}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold">₹{(stats.totalBudget / 100000).toFixed(1)}L</p>
              </div>
              <DollarSign className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Programs List */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All ({tabCounts.all})</TabsTrigger>
          <TabsTrigger value="planned">Planned ({tabCounts.planned})</TabsTrigger>
          <TabsTrigger value="active">Active ({tabCounts.active})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({tabCounts.completed})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {programs.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Heart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No {selectedTab === 'all' ? '' : selectedTab} programs found
                </h3>
                <p className="text-gray-500 mb-4">
                  {selectedTab === 'all' 
                    ? "Start making a difference in your community by creating your first CSR program!"
                    : `No ${selectedTab} programs to display.`
                  }
                </p>
                {canManage && (
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Program
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program) => (
                <ProgramCard
                  key={program.programId}
                  program={program}
                  onEdit={handleEditProgram}
                  onView={handleViewProgram}
                  onStatusChange={handleStatusChange}
                  canManage={canManage}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Program Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedProgram && (
                <>
                  <span className="text-2xl">
                    {selectedProgram.programType === 'health_camp' ? '🏥' :
                     selectedProgram.programType === 'vaccination_drive' ? '💉' :
                     selectedProgram.programType === 'blood_donation' ? '🩸' : '❤️'}
                  </span>
                  {selectedProgram.programName}
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              Program details and impact metrics
            </DialogDescription>
          </DialogHeader>
          {selectedProgram && (
            <div className="space-y-4">
              {/* Program details content would go here */}
              <div className="text-center text-gray-500 py-8">
                Program details view coming soon...
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Program Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New CSR Program</DialogTitle>
            <DialogDescription>
              Design a new community service program to make a positive impact.
            </DialogDescription>
          </DialogHeader>
          {/* Add CreateCSRProgramForm component here */}
          <div className="text-center text-gray-500 py-8">
            Create CSR Program Form Coming Soon...
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CSRProgramDashboard;