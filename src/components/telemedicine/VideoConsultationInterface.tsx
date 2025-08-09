'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  DashboardLayout,
  MetricsRow,
  ContentGrid,
  DashboardSection,
} from '@/components/dashboard/DashboardLayout';
import {
  StandardMetricCard,
  ActionCard,
  AlertCard,
  QueueCard,
  StatsCard,
} from '@/components/dashboard/StandardCards';
import {
  StandardButton,
  ButtonGroup,
  StandardTabs,
  StandardBadge,
  EmptyState,
  StandardSearch,
  StandardSelect,
} from '@/components/dashboard/StandardUI';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Monitor,
  Settings,
  Users,
  MessageSquare,
  FileText,
  Camera,
  Volume2,
  VolumeX,
  Record,
  StopCircle,
  RotateCcw,
  Maximize,
  Minimize,
  Share,
  Clock,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  AlertCircle,
  CheckCircle,
  Activity,
  Heart,
  Thermometer,
  Zap,
  Eye,
  EyeOff,
  Download,
  Upload,
  Clipboard,
  Send,
  Smartphone,
  Tablet,
  Laptop,
  User,
  UserCheck,
  Shield,
  Globe,
  Calendar,
} from 'lucide-react';

interface VideoSession {
  sessionId: string;
  patientName: string;
  patientAge: number;
  doctorName: string;
  specialty: string;
  startTime: string;
  duration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'failed';
  connectionQuality: 'excellent' | 'good' | 'fair' | 'poor';
  platform: string;
  sessionType: 'video' | 'audio' | 'chat';
  chiefComplaint: string;
  vitalsShared: boolean;
  recordingEnabled: boolean;
  patientConsent: boolean;
  emergencyContact: boolean;
}

const VideoConsultationInterface: React.FC = () => {
  const [activeSession, setActiveSession] = useState<VideoSession | null>(null);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('good');
  const [sessionDuration, setSessionDuration] = useState(0);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: string; message: string; time: string }>>([]);
  const [newMessage, setNewMessage] = useState('');
  const [patientVitals, setPatientVitals] = useState({
    heartRate: 72,
    bloodPressure: '120/80',
    temperature: 98.6,
    spO2: 98,
    lastUpdated: '2 min ago',
  });
  const [activeTab, setActiveTab] = useState('video');

  const videoRef = useRef<HTMLVideoElement>(null);
  const patientVideoRef = useRef<HTMLVideoElement>(null);

  // Mock active session data
  useEffect(() => {
    const mockSession: VideoSession = {
      sessionId: 'VID-2024-001',
      patientName: 'Rajesh Kumar',
      patientAge: 45,
      doctorName: 'Dr. Priya Sharma',
      specialty: 'Cardiology',
      startTime: '14:30',
      duration: 12,
      status: 'in-progress',
      connectionQuality: 'good',
      platform: 'WebRTC',
      sessionType: 'video',
      chiefComplaint: 'Chest pain and palpitations',
      vitalsShared: true,
      recordingEnabled: false,
      patientConsent: true,
      emergencyContact: true,
    };
    setActiveSession(mockSession);

    // Mock initial chat messages
    setChatMessages([
      { sender: 'System', message: 'Video consultation started', time: '14:30' },
      { sender: 'Patient', message: 'Hello Doctor, I can see and hear you clearly', time: '14:31' },
      { sender: 'Doctor', message: 'Good afternoon! I can see you as well. How are you feeling today?', time: '14:31' },
    ]);
  }, []);

  // Session duration timer - separate useEffect to avoid hydration issues
  useEffect(() => {
    if (activeSession) {
      const timer = setInterval(() => {
        setSessionDuration(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [activeSession]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getConnectionQualityIcon = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return <Wifi className="w-4 h-4 text-green-500" />;
      case 'good':
        return <Wifi className="w-4 h-4 text-yellow-500" />;
      case 'fair':
        return <Wifi className="w-4 h-4 text-orange-500" />;
      case 'poor':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const timeStr = `${hours}:${minutes}`;
      setChatMessages(prev => [...prev, { sender: 'Doctor', message: newMessage, time: timeStr }]);
      setNewMessage('');
    }
  };

  const handleEndCall = () => {
    console.log('Ending video consultation...');
    // Implement end call logic
  };

  const handleStartRecording = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      console.log('Starting session recording...');
    } else {
      console.log('Stopping session recording...');
    }
  };

  const tabs = [
    { id: 'video', label: 'Video Call', icon: Video },
    { id: 'chat', label: 'Chat', badge: chatMessages.length, icon: MessageSquare },
    { id: 'vitals', label: 'Vitals', icon: Activity },
    { id: 'notes', label: 'Clinical Notes', icon: FileText },
  ];

  if (!activeSession) {
    return (
      <EmptyState
        icon={Video}
        title="No Active Video Session"
        description="Start a video consultation to begin"
        action={{
          label: 'Start New Session',
          onClick: () => console.log('Start new session'),
        }}
      />
    );
  }

  return (
    <DashboardLayout
      title="Video Consultation"
      subtitle={`${activeSession.patientName} • ${activeSession.specialty} • Session: ${activeSession.sessionId}`}
      breadcrumbs={[
        { label: 'Dashboard', href: '/dashboard' },
        { label: 'Telemedicine', href: '/dashboard/telemedicine' },
        { label: 'Video Consultations' },
      ]}
      actions={
        <ButtonGroup>
          <StandardButton
            variant="danger"
            icon={PhoneOff}
            onClick={handleEndCall}
          >
            End Call
          </StandardButton>
        </ButtonGroup>
      }
    >
      {/* Session Status Bar */}
      <DashboardSection fullWidth>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-medium text-green-800">Live Consultation</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-green-700">
                <Clock className="w-4 h-4" />
                <span>{formatDuration(sessionDuration)}</span>
              </div>
              <div className="flex items-center gap-2">
                {getConnectionQualityIcon(connectionQuality)}
                <span className="text-sm text-green-700 capitalize">{connectionQuality}</span>
              </div>
              {isRecording && (
                <div className="flex items-center gap-2 text-sm text-red-700">
                  <Record className="w-4 h-4 text-red-500" />
                  <span>Recording</span>
                </div>
              )}
            </div>
            <div className="text-sm text-green-700">
              Platform: {activeSession.platform} • Patient consented: ✓
            </div>
          </div>
        </div>
      </DashboardSection>

      {/* Main Video Interface */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Call Area */}
        <div className="lg:col-span-2">
          <div className="card-base">
            <div className="p-6">
              <div className="relative bg-gray-900 rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
                {/* Patient Video (Main) */}
                <video
                  ref={patientVideoRef}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  poster="/api/placeholder/800/450"
                />
                
                {/* Doctor Video (Picture-in-Picture) */}
                <div className="absolute top-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
                  <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    poster="/api/placeholder/128/96"
                  />
                  {!isVideoOn && (
                    <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                      <VideoOff className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Connection Quality Indicator */}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 bg-black/50 rounded-lg px-3 py-2 text-white text-sm">
                    {getConnectionQualityIcon(connectionQuality)}
                    <span className="capitalize">{connectionQuality}</span>
                  </div>
                </div>

                {/* Session Info Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <div className="bg-black/50 rounded-lg px-3 py-2 text-white text-sm">
                      {activeSession.patientName} ({activeSession.patientAge}y)
                    </div>
                    {isScreenSharing && (
                      <div className="bg-blue-500 rounded-lg px-3 py-2 text-white text-sm flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        Screen Sharing
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Video Controls */}
              <div className="flex items-center justify-center gap-4 mt-6">
                <StandardButton
                  variant={isVideoOn ? 'secondary' : 'danger'}
                  icon={isVideoOn ? Video : VideoOff}
                  onClick={() => setIsVideoOn(!isVideoOn)}
                >
                  {isVideoOn ? 'Camera On' : 'Camera Off'}
                </StandardButton>
                
                <StandardButton
                  variant={isMicOn ? 'secondary' : 'danger'}
                  icon={isMicOn ? Mic : MicOff}
                  onClick={() => setIsMicOn(!isMicOn)}
                >
                  {isMicOn ? 'Mic On' : 'Mic Off'}
                </StandardButton>

                <StandardButton
                  variant={isRecording ? 'danger' : 'secondary'}
                  icon={isRecording ? StopCircle : Record}
                  onClick={handleStartRecording}
                >
                  {isRecording ? 'Stop Recording' : 'Start Recording'}
                </StandardButton>

                <StandardButton
                  variant="secondary"
                  icon={Monitor}
                  onClick={() => setIsScreenSharing(!isScreenSharing)}
                >
                  Share Screen
                </StandardButton>

                <StandardButton
                  variant="secondary"
                  icon={Settings}
                  onClick={() => console.log('Settings')}
                >
                  Settings
                </StandardButton>
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="space-y-6">
          {/* Patient Info Card */}
          <div className="card-base p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" />
              Patient Information
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-900">{activeSession.patientName}</div>
                <div className="text-sm text-gray-600">{activeSession.patientAge} years old</div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Chief Complaint</div>
                <div className="text-sm font-medium text-gray-900">{activeSession.chiefComplaint}</div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-green-600">Consent ✓</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4 text-blue-500" />
                  <span className="text-blue-600">Emergency ✓</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Vitals */}
          {activeSession.vitalsShared && (
            <div className="card-base p-4">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5 text-red-600" />
                Patient Vitals
              </h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-600">Heart Rate</div>
                  <div className="font-medium">{patientVitals.heartRate} bpm</div>
                </div>
                <div>
                  <div className="text-gray-600">Blood Pressure</div>
                  <div className="font-medium">{patientVitals.bloodPressure} mmHg</div>
                </div>
                <div>
                  <div className="text-gray-600">Temperature</div>
                  <div className="font-medium">{patientVitals.temperature}°F</div>
                </div>
                <div>
                  <div className="text-gray-600">SpO2</div>
                  <div className="font-medium">{patientVitals.spO2}%</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-2">
                Last updated: {patientVitals.lastUpdated}
              </div>
            </div>
          )}

          {/* Session Actions */}
          <div className="card-base p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <StandardButton
                variant="secondary"
                icon={FileText}
                size="sm"
                className="w-full justify-start"
                onClick={() => console.log('Digital prescription')}
              >
                Create Digital Prescription
              </StandardButton>
              <StandardButton
                variant="secondary"
                icon={Calendar}
                size="sm"
                className="w-full justify-start"
                onClick={() => console.log('Schedule follow-up')}
              >
                Schedule Follow-up
              </StandardButton>
              <StandardButton
                variant="secondary"
                icon={Download}
                size="sm"
                className="w-full justify-start"
                onClick={() => console.log('Download session')}
              >
                Download Session Report
              </StandardButton>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tabs Panel */}
      <DashboardSection fullWidth>
        <div className="card-base">
          <StandardTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
          
          <div className="p-6">
            {activeTab === 'chat' && (
              <div className="space-y-4">
                <div className="h-64 bg-gray-50 rounded-lg p-4 overflow-y-auto">
                  {chatMessages.map((msg, index) => (
                    <div key={index} className={`mb-3 ${msg.sender === 'Doctor' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block max-w-xs p-3 rounded-lg text-sm ${
                        msg.sender === 'Doctor' 
                          ? 'bg-blue-500 text-white' 
                          : msg.sender === 'System'
                          ? 'bg-gray-200 text-gray-700'
                          : 'bg-white border text-gray-900'
                      }`}>
                        <div className="font-medium text-xs opacity-75 mb-1">{msg.sender}</div>
                        <div>{msg.message}</div>
                        <div className="text-xs opacity-75 mt-1">{msg.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <StandardButton
                    variant="primary"
                    icon={Send}
                    onClick={handleSendMessage}
                  >
                    Send
                  </StandardButton>
                </div>
              </div>
            )}

            {activeTab === 'vitals' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StandardMetricCard
                  label="Heart Rate"
                  value={`${patientVitals.heartRate}`}
                  icon={Heart}
                  color="success"
                  subtitle="bpm"
                />
                <StandardMetricCard
                  label="Blood Pressure"
                  value={patientVitals.bloodPressure}
                  icon={Activity}
                  color="info"
                  subtitle="mmHg"
                />
                <StandardMetricCard
                  label="Temperature"
                  value={`${patientVitals.temperature}`}
                  icon={Thermometer}
                  color="warning"
                  subtitle="°F"
                />
                <StandardMetricCard
                  label="SpO2"
                  value={`${patientVitals.spO2}`}
                  icon={Zap}
                  color="secondary"
                  subtitle="%"
                />
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                <textarea
                  className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter clinical notes for this consultation..."
                />
                <div className="flex justify-end gap-2">
                  <StandardButton variant="secondary" icon={Clipboard}>
                    Save Draft
                  </StandardButton>
                  <StandardButton variant="primary" icon={FileText}>
                    Complete Consultation
                  </StandardButton>
                </div>
              </div>
            )}
          </div>
        </div>
      </DashboardSection>
    </DashboardLayout>
  );
};

export default VideoConsultationInterface;