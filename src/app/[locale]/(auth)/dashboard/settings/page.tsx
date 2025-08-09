'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Settings,
  Shield,
  Globe,
  Bell,
  Database,
  Zap,
  Monitor,
  Palette,
  Key,
  Users,
  Building,
  ToggleLeft,
  ToggleRight,
  Save,
  AlertCircle,
  CheckCircle,
  Info,
  Moon,
  Sun,
  Smartphone,
  Heart,
  Stethoscope,
  Activity,
  Hospital,
  CreditCard,
  FileText,
  Package,
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // HMS Feature Flags State
  const [featureFlags, setFeatureFlags] = useState({
    // Core HMS Features
    patientManagement: true,
    appointmentSystem: true,
    emergencyModule: true,
    icuMonitoring: true,
    
    // Clinical Features
    electronicPrescriptions: true,
    labIntegration: true,
    radiologyIntegration: false,
    telemedicine: false,
    
    // Billing & Insurance
    insuranceClaims: true,
    governmentSchemes: true,
    onlinePayments: true,
    autoInvoicing: false,
    
    // Advanced Features
    aiDiagnostics: false,
    predictiveAnalytics: false,
    voiceAssistant: false,
    mobileApp: false,
    
    // Operational Features
    inventoryManagement: true,
    staffScheduling: true,
    leaveManagement: true,
    performanceDashboard: true,
    
    // Compliance & Reporting
    regulatoryCompliance: true,
    auditTrails: true,
    customReports: false,
    dataExport: true,
    
    // Integration Features
    aadharIntegration: true,
    abhaIntegration: true,
    cowinIntegration: false,
    digilockerIntegration: false,
    
    // Communication
    smsNotifications: true,
    emailNotifications: true,
    whatsappIntegration: false,
    pushNotifications: false,
  });

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    hospitalName: 'City General Hospital',
    hospitalType: 'Multi-Specialty',
    registrationNumber: 'MH/2024/HSP/1234',
    address: '123 Healthcare Avenue, Mumbai 400001',
    phone: '+91 22 1234 5678',
    email: 'info@cityhospital.in',
    website: 'www.cityhospital.in',
    language: 'en',
    timezone: 'Asia/Kolkata',
    currency: 'INR',
    dateFormat: 'DD/MM/YYYY',
    timeFormat: '24h',
  });

  // Appearance Settings
  const [appearanceSettings, setAppearanceSettings] = useState({
    theme: 'light',
    primaryColor: '#06B6D4',
    sidebarCollapsed: false,
    compactMode: false,
    highContrast: false,
    fontSize: 'medium',
  });

  const handleFeatureToggle = (feature: string) => {
    setFeatureFlags(prev => ({
      ...prev,
      [feature]: !prev[feature as keyof typeof prev]
    }));
  };

  const handleSaveSettings = () => {
    setSaveStatus('saving');
    // Simulate save operation
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const FeatureToggle = ({ name, label, description, enabled, beta = false, premium = false }: any) => (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">{label}</span>
          {beta && <Badge className="bg-blue-100 text-blue-800">Beta</Badge>}
          {premium && <Badge className="bg-purple-100 text-purple-800">Premium</Badge>}
        </div>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <button
        onClick={() => handleFeatureToggle(name)}
        className="ml-4"
      >
        {enabled ? (
          <ToggleRight className="w-10 h-10 text-cyan-600" />
        ) : (
          <ToggleLeft className="w-10 h-10 text-gray-400" />
        )}
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-gray-600 mt-1">Manage hospital system configuration and feature flags</p>
        </div>
        <div className="flex gap-2">
          {saveStatus === 'saving' && (
            <Badge className="bg-yellow-100 text-yellow-800">
              <AlertCircle className="w-3 h-3 mr-1" />
              Saving...
            </Badge>
          )}
          {saveStatus === 'saved' && (
            <Badge className="bg-green-100 text-green-800">
              <CheckCircle className="w-3 h-3 mr-1" />
              Saved
            </Badge>
          )}
          <Button onClick={handleSaveSettings}>
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="features">HMS Features</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Hospital Information</CardTitle>
              <CardDescription>Basic information about your healthcare facility</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Hospital Name</label>
                  <input
                    type="text"
                    value={generalSettings.hospitalName}
                    onChange={(e) => setGeneralSettings({...generalSettings, hospitalName: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Hospital Type</label>
                  <select
                    value={generalSettings.hospitalType}
                    onChange={(e) => setGeneralSettings({...generalSettings, hospitalType: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  >
                    <option>Multi-Specialty</option>
                    <option>General Hospital</option>
                    <option>Specialty Hospital</option>
                    <option>Clinic</option>
                    <option>Nursing Home</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Registration Number</label>
                  <input
                    type="text"
                    value={generalSettings.registrationNumber}
                    onChange={(e) => setGeneralSettings({...generalSettings, registrationNumber: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Phone</label>
                  <input
                    type="text"
                    value={generalSettings.phone}
                    onChange={(e) => setGeneralSettings({...generalSettings, phone: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium">Address</label>
                  <input
                    type="text"
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Settings</CardTitle>
              <CardDescription>Localization and format preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium">Language</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Marathi</option>
                    <option>Tamil</option>
                    <option>Telugu</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Currency</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg">
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Date Format</label>
                  <select className="w-full mt-1 px-3 py-2 border rounded-lg">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* HMS Features Tab */}
        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Core HMS Features</CardTitle>
              <CardDescription>Enable or disable core hospital management features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <FeatureToggle
                name="patientManagement"
                label="Patient Management"
                description="Complete patient registration, records, and history management"
                enabled={featureFlags.patientManagement}
              />
              <FeatureToggle
                name="appointmentSystem"
                label="Appointment System"
                description="Online and offline appointment scheduling and management"
                enabled={featureFlags.appointmentSystem}
              />
              <FeatureToggle
                name="emergencyModule"
                label="Emergency Module"
                description="Emergency department triage and patient management"
                enabled={featureFlags.emergencyModule}
              />
              <FeatureToggle
                name="icuMonitoring"
                label="ICU Live Monitoring"
                description="Real-time ICU patient monitoring and alerts"
                enabled={featureFlags.icuMonitoring}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Clinical Features</CardTitle>
              <CardDescription>Medical and clinical functionality</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <FeatureToggle
                name="electronicPrescriptions"
                label="Electronic Prescriptions"
                description="Digital prescription creation and management"
                enabled={featureFlags.electronicPrescriptions}
              />
              <FeatureToggle
                name="labIntegration"
                label="Laboratory Integration"
                description="Lab test ordering and result management"
                enabled={featureFlags.labIntegration}
              />
              <FeatureToggle
                name="radiologyIntegration"
                label="Radiology Integration"
                description="Imaging orders and PACS integration"
                enabled={featureFlags.radiologyIntegration}
                beta
              />
              <FeatureToggle
                name="telemedicine"
                label="Telemedicine"
                description="Video consultations and remote patient care"
                enabled={featureFlags.telemedicine}
                premium
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Billing & Financial</CardTitle>
              <CardDescription>Payment and insurance features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <FeatureToggle
                name="insuranceClaims"
                label="Insurance Claims"
                description="Insurance claim processing and tracking"
                enabled={featureFlags.insuranceClaims}
              />
              <FeatureToggle
                name="governmentSchemes"
                label="Government Schemes"
                description="PM-JAY, CGHS, ESI scheme integration"
                enabled={featureFlags.governmentSchemes}
              />
              <FeatureToggle
                name="onlinePayments"
                label="Online Payments"
                description="UPI, card, and net banking payment options"
                enabled={featureFlags.onlinePayments}
              />
              <FeatureToggle
                name="autoInvoicing"
                label="Auto Invoicing"
                description="Automatic invoice generation and email"
                enabled={featureFlags.autoInvoicing}
                beta
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Advanced Features</CardTitle>
              <CardDescription>AI and automation capabilities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <FeatureToggle
                name="aiDiagnostics"
                label="AI Diagnostics Assistant"
                description="AI-powered diagnosis suggestions and clinical decision support"
                enabled={featureFlags.aiDiagnostics}
                premium
                beta
              />
              <FeatureToggle
                name="predictiveAnalytics"
                label="Predictive Analytics"
                description="Patient outcome prediction and resource forecasting"
                enabled={featureFlags.predictiveAnalytics}
                premium
              />
              <FeatureToggle
                name="voiceAssistant"
                label="Voice Assistant"
                description="Voice-controlled system navigation and data entry"
                enabled={featureFlags.voiceAssistant}
                beta
              />
              <FeatureToggle
                name="mobileApp"
                label="Mobile Application"
                description="Native mobile apps for staff and patients"
                enabled={featureFlags.mobileApp}
                premium
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Indian Healthcare Integrations</CardTitle>
              <CardDescription>Government and national healthcare platform integrations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <FeatureToggle
                name="aadharIntegration"
                label="Aadhaar Integration"
                description="Patient verification using Aadhaar authentication"
                enabled={featureFlags.aadharIntegration}
              />
              <FeatureToggle
                name="abhaIntegration"
                label="ABHA (Health ID)"
                description="Ayushman Bharat Health Account integration"
                enabled={featureFlags.abhaIntegration}
              />
              <FeatureToggle
                name="cowinIntegration"
                label="CoWIN Integration"
                description="COVID-19 vaccination certificate verification"
                enabled={featureFlags.cowinIntegration}
                beta
              />
              <FeatureToggle
                name="digilockerIntegration"
                label="DigiLocker"
                description="Digital document storage and retrieval"
                enabled={featureFlags.digilockerIntegration}
                beta
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Appearance Settings */}
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Colors</CardTitle>
              <CardDescription>Customize the look and feel of the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Theme Mode</label>
                <div className="flex gap-4">
                  <Button variant={appearanceSettings.theme === 'light' ? 'default' : 'outline'}>
                    <Sun className="w-4 h-4 mr-2" />
                    Light
                  </Button>
                  <Button variant={appearanceSettings.theme === 'dark' ? 'default' : 'outline'}>
                    <Moon className="w-4 h-4 mr-2" />
                    Dark
                  </Button>
                  <Button variant={appearanceSettings.theme === 'auto' ? 'default' : 'outline'}>
                    <Monitor className="w-4 h-4 mr-2" />
                    System
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Primary Color</label>
                <div className="flex gap-2">
                  {['#06B6D4', '#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444'].map(color => (
                    <button
                      key={color}
                      className={`w-10 h-10 rounded-lg border-2 ${appearanceSettings.primaryColor === color ? 'border-gray-900' : 'border-gray-300'}`}
                      style={{ backgroundColor: color }}
                      onClick={() => setAppearanceSettings({...appearanceSettings, primaryColor: color})}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Compact Mode</p>
                    <p className="text-sm text-gray-600">Reduce spacing and padding</p>
                  </div>
                  <button>
                    {appearanceSettings.compactMode ? (
                      <ToggleRight className="w-10 h-10 text-cyan-600" />
                    ) : (
                      <ToggleLeft className="w-10 h-10 text-gray-400" />
                    )}
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">High Contrast</p>
                    <p className="text-sm text-gray-600">Improve visibility for better accessibility</p>
                  </div>
                  <button>
                    {appearanceSettings.highContrast ? (
                      <ToggleRight className="w-10 h-10 text-cyan-600" />
                    ) : (
                      <ToggleLeft className="w-10 h-10 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Other tabs can be implemented similarly */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Notification settings coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Security settings coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardContent className="p-8 text-center">
              <Database className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">Integration settings coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;