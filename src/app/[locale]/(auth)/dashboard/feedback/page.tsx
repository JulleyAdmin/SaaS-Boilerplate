import PatientFeedbackForm from '@/components/engagement/PatientFeedbackForm';

export default async function FeedbackPage() {
  // Demo mode - allow access without authentication
  const DEMO_MODE = true;
  const userId = 'demo-user';

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Share Your Feedback</h1>
        <p className="text-gray-600 mt-2">
          Help us improve our services by sharing your experience with us.
        </p>
      </div>
      
      <PatientFeedbackForm 
        patientId={userId}
        feedbackType="overall"
        allowAnonymous={true}
      />
    </div>
  );
}
