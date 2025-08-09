'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Star,
  MessageSquare,
  Send,
  CheckCircle,
  AlertCircle,
  Heart,
  Clock,
  Users,
  Building,
  Stethoscope,
} from 'lucide-react';
import { FeedbackFormData } from '@/types/engagement';
// import { useToast } from '@/components/ui/use-toast';

interface PatientFeedbackFormProps {
  patientId: string;
  referenceId?: string; // consultation_id, appointment_id, etc.
  feedbackType?: 'consultation' | 'service' | 'facility' | 'staff' | 'overall';
  departmentId?: string;
  onSubmitSuccess?: () => void;
  allowAnonymous?: boolean;
}

interface StarRatingProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icon?: React.ReactNode;
  description?: string;
}

const StarRating: React.FC<StarRatingProps> = ({
  label,
  value,
  onChange,
  icon,
  description,
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {icon}
        <Label className="text-sm font-medium">{label}</Label>
      </div>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`p-1 transition-colors ${
              star <= (hoverValue || value)
                ? 'text-yellow-400'
                : 'text-gray-300 hover:text-yellow-200'
            }`}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            onClick={() => onChange(star)}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-500">
        {value === 1 && 'Poor'}
        {value === 2 && 'Fair'}
        {value === 3 && 'Good'}
        {value === 4 && 'Very Good'}
        {value === 5 && 'Excellent'}
        {value === 0 && 'No rating'}
      </div>
    </div>
  );
};

interface NPSRatingProps {
  value: number;
  onChange: (value: number) => void;
}

const NPSRating: React.FC<NPSRatingProps> = ({ value, onChange }) => {
  const getNPSLabel = (score: number) => {
    if (score <= 6) return { label: 'Detractor', color: 'text-red-600' };
    if (score <= 8) return { label: 'Passive', color: 'text-yellow-600' };
    return { label: 'Promoter', color: 'text-green-600' };
  };

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">
        How likely are you to recommend our hospital to others?
      </Label>
      <div className="grid grid-cols-11 gap-1">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
          <button
            key={score}
            type="button"
            onClick={() => onChange(score)}
            className={`p-2 text-xs rounded border transition-colors ${
              value === score
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
            }`}
          >
            {score}
          </button>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500">
        <span>Not likely</span>
        <span>Very likely</span>
      </div>
      {value >= 0 && (
        <div className={`text-sm font-medium ${getNPSLabel(value).color}`}>
          {getNPSLabel(value).label}
        </div>
      )}
    </div>
  );
};

const PatientFeedbackForm: React.FC<PatientFeedbackFormProps> = ({
  patientId,
  referenceId,
  feedbackType: initialFeedbackType = 'overall',
  departmentId,
  onSubmitSuccess,
  allowAnonymous = true,
}) => {
  // const { toast } = useToast();
  const [formData, setFormData] = useState<FeedbackFormData>({
    feedbackType: initialFeedbackType,
    referenceId,
    departmentId,
    platform: 'web',
    anonymous: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleRatingChange = (field: string, value: number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/patient/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          patientId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit feedback');
      }

      setSubmitted(true);
      // toast({
      //   title: "Feedback Submitted!",
      //   description: "Thank you for your valuable feedback. We appreciate your input.",
      // });
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      // toast({
      //   title: "Submission Failed",
      //   description: "There was an error submitting your feedback. Please try again.",
      //   variant: "destructive",
      // });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="max-w-md mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
          <p className="text-gray-600 mb-4">
            Your feedback has been submitted successfully. We value your input and will use it to improve our services.
          </p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Submit Another Feedback
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Share Your Feedback
        </CardTitle>
        <CardDescription>
          Help us improve by sharing your experience with our services
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Feedback Type Selection */}
          <div className="space-y-3">
            <Label>What would you like to provide feedback about?</Label>
            <RadioGroup
              value={formData.feedbackType}
              onValueChange={(value) => handleInputChange('feedbackType', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="consultation" id="consultation" />
                <Label htmlFor="consultation" className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Medical Consultation
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="service" id="service" />
                <Label htmlFor="service" className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Service Quality
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="facility" id="facility" />
                <Label htmlFor="facility" className="flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  Hospital Facilities
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="staff" id="staff" />
                <Label htmlFor="staff" className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Staff Interaction
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="overall" id="overall" />
                <Label htmlFor="overall">Overall Experience</Label>
              </div>
            </RadioGroup>
          </div>

          <Separator />

          {/* Rating Section */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Rate Your Experience</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <StarRating
                label="Overall Rating"
                value={formData.overallRating || 0}
                onChange={(value) => handleRatingChange('overallRating', value)}
                icon={<Star className="w-4 h-4 text-yellow-500" />}
                description="How would you rate your overall experience?"
              />

              <StarRating
                label="Wait Time"
                value={formData.waitTimeRating || 0}
                onChange={(value) => handleRatingChange('waitTimeRating', value)}
                icon={<Clock className="w-4 h-4 text-blue-500" />}
                description="How satisfied were you with the wait time?"
              />

              <StarRating
                label="Staff Interaction"
                value={formData.staffRating || 0}
                onChange={(value) => handleRatingChange('staffRating', value)}
                icon={<Users className="w-4 h-4 text-green-500" />}
                description="How was the staff's behavior and helpfulness?"
              />

              <StarRating
                label="Facility Cleanliness"
                value={formData.facilityRating || 0}
                onChange={(value) => handleRatingChange('facilityRating', value)}
                icon={<Building className="w-4 h-4 text-purple-500" />}
                description="How clean and comfortable were the facilities?"
              />
            </div>

            {formData.feedbackType === 'consultation' && (
              <StarRating
                label="Treatment Quality"
                value={formData.treatmentRating || 0}
                onChange={(value) => handleRatingChange('treatmentRating', value)}
                icon={<Stethoscope className="w-4 h-4 text-red-500" />}
                description="How satisfied were you with the medical treatment?"
              />
            )}
          </div>

          <Separator />

          {/* NPS Rating */}
          <NPSRating
            value={formData.npsScore || -1}
            onChange={(value) => handleInputChange('npsScore', value.toString())}
          />

          {/* Would Recommend */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="wouldRecommend"
              checked={formData.wouldRecommend || false}
              onCheckedChange={(checked) => handleInputChange('wouldRecommend', checked)}
            />
            <Label htmlFor="wouldRecommend">
              I would recommend this hospital to my friends and family
            </Label>
          </div>

          <Separator />

          {/* Written Feedback */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="feedbackText">Additional Comments (Optional)</Label>
              <Textarea
                id="feedbackText"
                placeholder="Please share your detailed feedback, compliments, or concerns..."
                value={formData.feedbackText || ''}
                onChange={(e) => handleInputChange('feedbackText', e.target.value)}
                rows={4}
                maxLength={2000}
              />
              <div className="text-xs text-gray-500 mt-1">
                {(formData.feedbackText || '').length}/2000 characters
              </div>
            </div>

            <div>
              <Label htmlFor="improvementSuggestions">Suggestions for Improvement (Optional)</Label>
              <Textarea
                id="improvementSuggestions"
                placeholder="How can we improve our services?"
                value={formData.improvementSuggestions || ''}
                onChange={(e) => handleInputChange('improvementSuggestions', e.target.value)}
                rows={3}
                maxLength={1000}
              />
              <div className="text-xs text-gray-500 mt-1">
                {(formData.improvementSuggestions || '').length}/1000 characters
              </div>
            </div>
          </div>

          {/* Anonymous Option */}
          {allowAnonymous && (
            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded">
              <Checkbox
                id="anonymous"
                checked={formData.anonymous || false}
                onCheckedChange={(checked) => handleInputChange('anonymous', checked)}
              />
              <Label htmlFor="anonymous" className="text-sm">
                Submit this feedback anonymously
              </Label>
              <div className="text-xs text-gray-500 ml-2">
                (Your identity will not be shared with the responses)
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.overallRating}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Feedback
                </>
              )}
            </Button>
          </div>

          {/* Required Rating Notice */}
          {!formData.overallRating && (
            <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded">
              <AlertCircle className="w-4 h-4" />
              Please provide at least an overall rating to submit your feedback
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default PatientFeedbackForm;