import { NextRequest, NextResponse } from 'next/server';

// Mock health goals progress data
const mockHealthGoalsProgress = {
  generateProgress: (goalId: string, patientId: string) => ({
    progressId: `prog-${goalId}`,
    goalId,
    patientId,
    
    // Goal details
    goalType: ['weight_loss', 'bp_control', 'diabetes_management', 'fitness_improvement'][Math.floor(Math.random() * 4)],
    targetValue: Math.floor(Math.random() * 20) + 60,
    currentValue: Math.floor(Math.random() * 15) + 65,
    unit: ['kg', 'mmHg', 'mg/dl', 'steps'][Math.floor(Math.random() * 4)],
    
    // Progress tracking
    progressPercentage: Math.floor(Math.random() * 40) + 40,
    trend: ['improving', 'stable', 'declining'][Math.floor(Math.random() * 2)],
    
    // Timeline
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    lastUpdated: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
    
    // Milestones
    milestones: [
      {
        date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        value: 78,
        achieved: true,
        note: 'Good progress, keep it up!',
      },
      {
        date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        value: 75,
        achieved: true,
        note: 'Milestone achieved!',
      },
      {
        date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        value: 70,
        achieved: false,
        note: 'Next target',
      },
    ],
    
    // Daily tracking
    dailyProgress: Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000),
      value: Math.floor(Math.random() * 10) + 70 - (i * 0.2),
      compliance: Math.random() > 0.3,
      notes: Math.random() > 0.7 ? 'Followed diet plan' : null,
    })),
    
    // Recommendations
    recommendations: [
      'Increase daily water intake to 3 liters',
      'Add 30 minutes of walking daily',
      'Reduce carbohydrate intake by 20%',
      'Schedule weekly progress reviews',
    ],
    
    // Provider feedback
    providerFeedback: {
      lastReviewDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      reviewedBy: 'Dr. Sharma',
      feedback: 'Excellent progress! Continue with current plan.',
      nextReviewDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    
    // Gamification
    achievements: [
      {
        badge: '7-Day Streak',
        earnedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        icon: '🔥',
      },
      {
        badge: '50% Progress',
        earnedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        icon: '🎯',
      },
    ],
    
    streakDays: 12,
    totalPointsEarned: 450,
  }),
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const goalId = searchParams.get('goalId');
    const patientId = searchParams.get('patientId');
    
    if (!goalId || !patientId) {
      return NextResponse.json(
        { error: 'Goal ID and Patient ID are required' },
        { status: 400 }
      );
    }
    
    const progress = mockHealthGoalsProgress.generateProgress(goalId, patientId);
    
    return NextResponse.json({
      data: progress,
    });
  } catch (error) {
    console.error('Error fetching goal progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch goal progress' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { goalId, patientId, progressUpdate } = body;
    
    // Record progress update
    const updatedProgress = {
      ...mockHealthGoalsProgress.generateProgress(goalId, patientId),
      currentValue: progressUpdate.value,
      lastUpdated: new Date(),
      progressPercentage: Math.min(100, Math.floor((progressUpdate.value / 60) * 100)),
      dailyProgress: [
        {
          date: new Date(),
          value: progressUpdate.value,
          compliance: true,
          notes: progressUpdate.notes || 'Manual update',
        },
      ],
    };
    
    // Check for new achievements
    if (updatedProgress.progressPercentage >= 75 && updatedProgress.achievements.length < 3) {
      updatedProgress.achievements.push({
        badge: '75% Complete',
        earnedDate: new Date(),
        icon: '🏆',
      });
    }
    
    return NextResponse.json({
      data: updatedProgress,
      message: 'Progress updated successfully',
    });
  } catch (error) {
    console.error('Error updating goal progress:', error);
    return NextResponse.json(
      { error: 'Failed to update goal progress' },
      { status: 500 }
    );
  }
}