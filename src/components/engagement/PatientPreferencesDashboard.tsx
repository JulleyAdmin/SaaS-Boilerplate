'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  Bell,
  Globe,
  Accessibility,
  Shield,
  Calendar,
  Clock,
  Mail,
  Phone,
  MessageSquare,
  Save,
  User,
  Heart,
} from 'lucide-react';
import { PatientPreferences } from '@/types/engagement';

interface PatientPreferencesDashboardProps {
  patientId: string;
  isProvider?: boolean;
}

const PatientPreferencesDashboard: React.FC<PatientPreferencesDashboardProps> = ({
  patientId,
  isProvider = false,
}) => {
  const [preferences, setPreferences] = useState<PatientPreferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, [patientId]);

  const fetchPreferences = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/patient/preferences?patientId=${patientId}`);
      const data = await response.json();
      
      if (data.data && data.data.length > 0) {
        setPreferences(data.data[0]);
      } else {
        // Set default preferences if none exist
        setPreferences({
          preferenceId: '',
          patientId,
          language: 'English',
          communicationPreferences: {
            email: true,
            sms: true,
            phone: false,
            whatsapp: true,
            preferredTime: 'morning',
          },
          appointmentPreferences: {
            preferredDays: ['weekdays'],
            preferredTime: '09:00-12:00',
            reminderTime: '24_hours',
            autoConfirm: false,
          },
          privacySettings: {
            shareDataForResearch: false,
            allowStudentObservation: false,
            emergencyContactsAccess: true,
            familyAccess: 'limited',
          },
          accessibilityNeeds: {
            largeText: false,
            audioAssistance: false,
            mobilityAssistance: false,
            signLanguage: false,
          },
          dietaryRestrictions: [],
          culturalPreferences: {},
          emergencyPreferences: {
            primaryContact: '',
            secondaryContact: '',
            preferredHospital: '',
            dnrStatus: false,
          },
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePreferences = async () => {
    try {
      const response = await fetch('/api/patient/preferences', {
        method: preferences?.preferenceId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });
      
      if (response.ok) {
        setUnsavedChanges(false);
        // Show success message
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const updatePreference = (category: string, field: string, value: any) => {
    if (!preferences) return;
    
    setPreferences({
      ...preferences,
      [category]: {
        ...(preferences as any)[category],
        [field]: value,
      },
    });
    setUnsavedChanges(true);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-48 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!preferences) {
    return <div>No preferences found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Patient Preferences</h2>
          <p className="text-gray-600">
            {isProvider ? 'View patient preferences and care requirements' : 'Manage your healthcare preferences'}
          </p>
        </div>
        {!isProvider && unsavedChanges && (
          <Button onClick={handleSavePreferences}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        )}
      </div>

      <Tabs defaultValue="communication" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="accessibility">Accessibility</TabsTrigger>
          <TabsTrigger value="emergency">Emergency</TabsTrigger>
        </TabsList>

        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Communication Preferences
              </CardTitle>
              <CardDescription>
                How would you like us to contact you?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email Notifications
                  </Label>
                  <Switch
                    id="email"
                    checked={preferences.communicationPreferences?.email}
                    onCheckedChange={(value) => 
                      updatePreference('communicationPreferences', 'email', value)
                    }
                    disabled={isProvider}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="sms" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    SMS Notifications
                  </Label>
                  <Switch
                    id="sms"
                    checked={preferences.communicationPreferences?.sms}
                    onCheckedChange={(value) => 
                      updatePreference('communicationPreferences', 'sms', value)
                    }
                    disabled={isProvider}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="whatsapp" className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    WhatsApp Messages
                  </Label>
                  <Switch
                    id="whatsapp"
                    checked={preferences.communicationPreferences?.whatsapp}
                    onCheckedChange={(value) => 
                      updatePreference('communicationPreferences', 'whatsapp', value)
                    }
                    disabled={isProvider}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="phone" className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone Calls
                  </Label>
                  <Switch
                    id="phone"
                    checked={preferences.communicationPreferences?.phone}
                    onCheckedChange={(value) => 
                      updatePreference('communicationPreferences', 'phone', value)
                    }
                    disabled={isProvider}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label>Preferred Contact Time</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['morning', 'afternoon', 'evening'].map((time) => (
                    <Button
                      key={time}
                      variant={preferences.communicationPreferences?.preferredTime === time ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updatePreference('communicationPreferences', 'preferredTime', time)}
                      disabled={isProvider}
                    >
                      {time.charAt(0).toUpperCase() + time.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Preferred Language
                </Label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                  className="mt-2 w-full px-3 py-2 border rounded-lg"
                  disabled={isProvider}
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Malayalam">Malayalam</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Appointment Preferences
              </CardTitle>
              <CardDescription>
                Your scheduling and reminder preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Preferred Days</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['weekdays', 'weekends', 'any'].map((day) => (
                    <Button
                      key={day}
                      variant={preferences.appointmentPreferences?.preferredDays?.includes(day) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        const days = preferences.appointmentPreferences?.preferredDays || [];
                        const newDays = days.includes(day)
                          ? days.filter(d => d !== day)
                          : [...days, day];
                        updatePreference('appointmentPreferences', 'preferredDays', newDays);
                      }}
                      disabled={isProvider}
                    >
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Preferred Time Slots</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {['09:00-12:00', '12:00-15:00', '15:00-18:00', '18:00-20:00'].map((time) => (
                    <Button
                      key={time}
                      variant={preferences.appointmentPreferences?.preferredTime === time ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updatePreference('appointmentPreferences', 'preferredTime', time)}
                      disabled={isProvider}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Reminder Preference</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['24_hours', '12_hours', '2_hours'].map((reminder) => (
                    <Button
                      key={reminder}
                      variant={preferences.appointmentPreferences?.reminderTime === reminder ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updatePreference('appointmentPreferences', 'reminderTime', reminder)}
                      disabled={isProvider}
                    >
                      {reminder.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <Label htmlFor="autoConfirm">
                  Auto-confirm appointments
                </Label>
                <Switch
                  id="autoConfirm"
                  checked={preferences.appointmentPreferences?.autoConfirm}
                  onCheckedChange={(value) => 
                    updatePreference('appointmentPreferences', 'autoConfirm', value)
                  }
                  disabled={isProvider}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control how your health information is shared
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="research">Share data for research</Label>
                    <p className="text-sm text-gray-600">Help improve healthcare through anonymized data</p>
                  </div>
                  <Switch
                    id="research"
                    checked={preferences.privacySettings?.shareDataForResearch}
                    onCheckedChange={(value) => 
                      updatePreference('privacySettings', 'shareDataForResearch', value)
                    }
                    disabled={isProvider}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="students">Allow student observation</Label>
                    <p className="text-sm text-gray-600">Medical students may observe consultations</p>
                  </div>
                  <Switch
                    id="students"
                    checked={preferences.privacySettings?.allowStudentObservation}
                    onCheckedChange={(value) => 
                      updatePreference('privacySettings', 'allowStudentObservation', value)
                    }
                    disabled={isProvider}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emergency">Emergency contacts access</Label>
                    <p className="text-sm text-gray-600">Allow emergency contacts to view your records</p>
                  </div>
                  <Switch
                    id="emergency"
                    checked={preferences.privacySettings?.emergencyContactsAccess}
                    onCheckedChange={(value) => 
                      updatePreference('privacySettings', 'emergencyContactsAccess', value)
                    }
                    disabled={isProvider}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label>Family Access Level</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['none', 'limited', 'full'].map((level) => (
                    <Button
                      key={level}
                      variant={preferences.privacySettings?.familyAccess === level ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updatePreference('privacySettings', 'familyAccess', level)}
                      disabled={isProvider}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accessibility" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Accessibility className="w-5 h-5" />
                Accessibility Needs
              </CardTitle>
              <CardDescription>
                Help us accommodate your special requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="largeText">Large text displays</Label>
                  <Switch
                    id="largeText"
                    checked={preferences.accessibilityNeeds?.largeText}
                    onCheckedChange={(value) => 
                      updatePreference('accessibilityNeeds', 'largeText', value)
                    }
                    disabled={isProvider}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="audio">Audio assistance</Label>
                  <Switch
                    id="audio"
                    checked={preferences.accessibilityNeeds?.audioAssistance}
                    onCheckedChange={(value) => 
                      updatePreference('accessibilityNeeds', 'audioAssistance', value)
                    }
                    disabled={isProvider}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="mobility">Mobility assistance</Label>
                  <Switch
                    id="mobility"
                    checked={preferences.accessibilityNeeds?.mobilityAssistance}
                    onCheckedChange={(value) => 
                      updatePreference('accessibilityNeeds', 'mobilityAssistance', value)
                    }
                    disabled={isProvider}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="signLanguage">Sign language interpreter</Label>
                  <Switch
                    id="signLanguage"
                    checked={preferences.accessibilityNeeds?.signLanguage}
                    onCheckedChange={(value) => 
                      updatePreference('accessibilityNeeds', 'signLanguage', value)
                    }
                    disabled={isProvider}
                  />
                </div>
              </div>

              <div className="pt-4 border-t">
                <Label>Dietary Restrictions</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['Vegetarian', 'Vegan', 'Halal', 'Kosher', 'Gluten-Free', 'Diabetic'].map((diet) => (
                    <Badge
                      key={diet}
                      variant={preferences.dietaryRestrictions?.includes(diet) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => {
                        if (!isProvider) {
                          const restrictions = preferences.dietaryRestrictions || [];
                          const newRestrictions = restrictions.includes(diet)
                            ? restrictions.filter(d => d !== diet)
                            : [...restrictions, diet];
                          setPreferences({ ...preferences, dietaryRestrictions: newRestrictions });
                          setUnsavedChanges(true);
                        }
                      }}
                    >
                      {diet}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5" />
                Emergency Preferences
              </CardTitle>
              <CardDescription>
                Critical information for emergency situations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryContact">Primary Emergency Contact</Label>
                  <input
                    id="primaryContact"
                    type="text"
                    value={preferences.emergencyPreferences?.primaryContact || ''}
                    onChange={(e) => 
                      updatePreference('emergencyPreferences', 'primaryContact', e.target.value)
                    }
                    className="mt-1 w-full px-3 py-2 border rounded-lg"
                    placeholder="Name and phone number"
                    disabled={isProvider}
                  />
                </div>

                <div>
                  <Label htmlFor="secondaryContact">Secondary Emergency Contact</Label>
                  <input
                    id="secondaryContact"
                    type="text"
                    value={preferences.emergencyPreferences?.secondaryContact || ''}
                    onChange={(e) => 
                      updatePreference('emergencyPreferences', 'secondaryContact', e.target.value)
                    }
                    className="mt-1 w-full px-3 py-2 border rounded-lg"
                    placeholder="Name and phone number"
                    disabled={isProvider}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="preferredHospital">Preferred Hospital for Emergency</Label>
                <input
                  id="preferredHospital"
                  type="text"
                  value={preferences.emergencyPreferences?.preferredHospital || ''}
                  onChange={(e) => 
                    updatePreference('emergencyPreferences', 'preferredHospital', e.target.value)
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                  placeholder="Hospital name"
                  disabled={isProvider}
                />
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div>
                  <Label htmlFor="dnr">Do Not Resuscitate (DNR) Status</Label>
                  <p className="text-sm text-gray-600">This requires proper documentation</p>
                </div>
                <Switch
                  id="dnr"
                  checked={preferences.emergencyPreferences?.dnrStatus}
                  onCheckedChange={(value) => 
                    updatePreference('emergencyPreferences', 'dnrStatus', value)
                  }
                  disabled={isProvider}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientPreferencesDashboard;