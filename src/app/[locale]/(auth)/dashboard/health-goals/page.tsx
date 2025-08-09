import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

import HealthGoalsDashboard from '@/components/engagement/HealthGoalsDashboard';

export default async function HealthGoalsPage() {
  // Demo mode - allow access without authentication
  const DEMO_MODE = true;
  
  let userId = 'demo-user';
  if (!DEMO_MODE) {
    const authResult = await auth();
    userId = authResult?.userId || '';
    
    if (!userId) {
      redirect('/sign-in');
    }
  }

  return (
    <div className="container mx-auto p-6">
      <HealthGoalsDashboard 
        patientId={userId} 
        isPatientView={true} 
      />
    </div>
  );
}