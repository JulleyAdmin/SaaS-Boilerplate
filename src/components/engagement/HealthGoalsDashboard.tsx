'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertCircle,
  Target,
  TrendingUp,
  Calendar,
  User,
  Plus,
  Edit,
  CheckCircle2,
  Trophy,
  Clock,
} from 'lucide-react';
import { HealthGoal } from '@/types/engagement';
// import { format } from 'date-fns';

interface HealthGoalsDashboardProps {
  patientId: string;
  isPatientView?: boolean; // If true, shows patient view; if false, shows provider view
}

interface HealthGoalCardProps {
  goal: HealthGoal;
  onEdit: (goal: HealthGoal) => void;
  onUpdateProgress: (goalId: string) => void;
  isPatientView?: boolean;
}

const HealthGoalCard: React.FC<HealthGoalCardProps> = ({
  goal,
  onEdit,
  onUpdateProgress,
  isPatientView = false,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-blue-500';
      case 'achieved': return 'bg-green-500';
      case 'paused': return 'bg-yellow-500';
      case 'abandoned': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'achieved': return <Trophy className="w-4 h-4" />;
      case 'active': return <Target className="w-4 h-4" />;
      case 'paused': return <Clock className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getGoalTypeIcon = (type: string) => {
    switch (type) {
      case 'weight_loss': return '⚖️';
      case 'weight_gain': return '🏋️';
      case 'bp_control': return '🩺';
      case 'diabetes_management': return '🩸';
      case 'fitness_improvement': return '💪';
      case 'quit_smoking': return '🚭';
      case 'mental_health': return '🧠';
      default: return '🎯';
    }
  };

  const daysRemaining = goal.targetDate ? 
    Math.ceil((new Date(goal.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getGoalTypeIcon(goal.goalType)}</span>
            <div>
              <CardTitle className="text-lg">{goal.goalName}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <Badge variant="outline" className={`${getStatusColor(goal.status)} text-white border-none`}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(goal.status)}
                    {goal.status.replace('_', ' ').toUpperCase()}
                  </span>
                </Badge>
              </CardDescription>
            </div>
          </div>
          {!isPatientView && (
            <Button variant="ghost" size="sm" onClick={() => onEdit(goal)}>
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span>Progress</span>
            <span className="font-semibold">{goal.progressPercentage}%</span>
          </div>
          <Progress value={goal.progressPercentage} className="h-2" />
        </div>

        {/* Current vs Target */}
        {goal.currentValue && goal.targetValue && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-2 bg-blue-50 rounded">
              <p className="text-gray-600">Current</p>
              <p className="font-semibold text-blue-600">
                {goal.currentValue.value} {goal.currentValue.unit}
              </p>
            </div>
            <div className="text-center p-2 bg-green-50 rounded">
              <p className="text-gray-600">Target</p>
              <p className="font-semibold text-green-600">
                {goal.targetValue.value} {goal.targetValue.unit}
              </p>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="flex justify-between items-center text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
          </div>
          {daysRemaining && daysRemaining > 0 && (
            <span className="text-orange-600 font-medium">
              {daysRemaining} days left
            </span>
          )}
          {daysRemaining && daysRemaining <= 0 && goal.status === 'active' && (
            <span className="text-red-600 font-medium">Overdue</span>
          )}
        </div>

        {/* Coach */}
        {goal.assignedCoach && (
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-gray-500" />
            <span>Coach: {goal.assignedCoach.firstName} {goal.assignedCoach.lastName}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {goal.status === 'active' && (
            <Button size="sm" onClick={() => onUpdateProgress(goal.goalId)}>
              <TrendingUp className="w-4 h-4 mr-1" />
              Update Progress
            </Button>
          )}
          {goal.progressPercentage >= 100 && goal.status !== 'achieved' && (
            <Button size="sm" variant="default" className="bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-4 h-4 mr-1" />
              Mark Complete
            </Button>
          )}
        </div>

        {/* Recent milestones */}
        {goal.milestones && goal.milestones.length > 0 && goal.milestones[goal.milestones.length - 1] && (
          <div className="text-xs text-gray-500">
            <p>Latest milestone: {new Date(goal.milestones[goal.milestones.length - 1].date).toLocaleDateString()} - 
              {goal.milestones[goal.milestones.length - 1].value} {goal.currentValue?.unit || ''}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

const HealthGoalsDashboard: React.FC<HealthGoalsDashboardProps> = ({
  patientId,
  isPatientView = false,
}) => {
  const [goals, setGoals] = useState<HealthGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('active');
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  useEffect(() => {
    fetchHealthGoals();
  }, [patientId, selectedTab]);

  const fetchHealthGoals = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/patient/health-goals?patientId=${patientId}&status=${selectedTab === 'all' ? '' : selectedTab}`
      );
      const data = await response.json();
      
      if (data.data) {
        setGoals(data.data);
      }
    } catch (error) {
      console.error('Error fetching health goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditGoal = (goal: HealthGoal) => {
    // Open edit dialog
    console.log('Edit goal:', goal);
  };

  const handleUpdateProgress = (goalId: string) => {
    // Open progress update dialog
    console.log('Update progress for goal:', goalId);
  };

  const getTabCounts = () => {
    return {
      active: goals.filter(g => g.status === 'active').length,
      achieved: goals.filter(g => g.status === 'achieved').length,
      paused: goals.filter(g => g.status === 'paused').length,
      all: goals.length,
    };
  };

  const tabCounts = getTabCounts();

  const getOverallProgress = () => {
    const activeGoals = goals.filter(g => g.status === 'active');
    if (activeGoals.length === 0) return 0;
    
    const totalProgress = activeGoals.reduce((sum, goal) => sum + goal.progressPercentage, 0);
    return Math.round(totalProgress / activeGoals.length);
  };

  const getAchievedThisMonth = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return goals.filter(goal => {
      if (!goal.achievedDate) return false;
      const achievedDate = new Date(goal.achievedDate);
      return achievedDate.getMonth() === currentMonth && achievedDate.getFullYear() === currentYear;
    }).length;
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
          <h2 className="text-2xl font-bold">Health Goals</h2>
          <p className="text-gray-600">Track and manage health objectives</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Goal
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Progress</p>
                <p className="text-2xl font-bold">{getOverallProgress()}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold">{tabCounts.active}</p>
              </div>
              <Target className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Achieved This Month</p>
                <p className="text-2xl font-bold">{getAchievedThisMonth()}</p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals List */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="active">Active ({tabCounts.active})</TabsTrigger>
          <TabsTrigger value="achieved">Achieved ({tabCounts.achieved})</TabsTrigger>
          <TabsTrigger value="paused">Paused ({tabCounts.paused})</TabsTrigger>
          <TabsTrigger value="all">All ({tabCounts.all})</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {goals.length === 0 ? (
            <Card className="p-12">
              <div className="text-center">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  No {selectedTab === 'all' ? '' : selectedTab} goals found
                </h3>
                <p className="text-gray-500 mb-4">
                  {selectedTab === 'active' 
                    ? "Start your health journey by setting your first goal!"
                    : `No ${selectedTab} goals to display.`
                  }
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Goal
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.map((goal) => (
                <HealthGoalCard
                  key={goal.goalId}
                  goal={goal}
                  onEdit={handleEditGoal}
                  onUpdateProgress={handleUpdateProgress}
                  isPatientView={isPatientView}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create Goal Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Health Goal</DialogTitle>
            <DialogDescription>
              Set a new health objective to track your progress.
            </DialogDescription>
          </DialogHeader>
          {/* Add CreateHealthGoalForm component here */}
          <div className="text-center text-gray-500 py-8">
            Create Health Goal Form Coming Soon...
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HealthGoalsDashboard;