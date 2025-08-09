'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Monitor,
  MonitorOff,
  MessageSquare,
  Users,
  Settings,
  MoreVertical,
  Camera,
  Volume2,
  FileText,
  Share2,
  PictureInPicture,
  Maximize,
  Minimize,
  Grid,
  User,
  Heart,
  Activity,
  Thermometer,
  Clock,
  AlertCircle,
  CheckCircle,
  Send,
  Paperclip,
  Download,
  Upload,
  Save,
  Edit,
  X,
  ChevronRight,
  ChevronLeft,
  Shield,
  ShieldCheck,
  ShieldOff,
  QrCode,
  Stethoscope,
  Pill,
  Calendar,
  ClipboardList,
  Image,
  File,
  ArrowRightLeft,
  UserCheck,
  Copy,
  ExternalLink,
  Info,
  Loader2,
  RefreshCw,
  Zap,
} from 'lucide-react';
import {
  StandardButton,
  ButtonGroup,
  StandardBadge,
  StandardSearch,
  StandardSelect,
} from '@/components/dashboard/StandardUI';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  abhaNumber?: string;
  abhaVerified?: boolean;
  vitals?: {
    heartRate: number;
    bloodPressure: string;
    temperature: number;
    spo2: number;
    respiratoryRate: number;
  };
  chiefComplaint: string;
  medicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
}

interface ConsultationNote {
  id: string;
  timestamp: string;
  type: 'observation' | 'diagnosis' | 'prescription' | 'advice' | 'followup';
  content: string;
  tagged?: boolean;
}

const VideoConsultationEnhanced: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session') || 'VID-2024-001';

  // Video states
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isPiPMode, setIsPiPMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'fair' | 'poor'>('excellent');

  // Patient states
  const [patient, setPatient] = useState<Patient>({
    id: 'PAT-001',
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    abhaNumber: '14-1234-5678-9012',
    abhaVerified: false,
    vitals: {
      heartRate: 72,
      bloodPressure: '120/80',
      temperature: 98.6,
      spo2: 98,
      respiratoryRate: 16,
    },
    chiefComplaint: 'Chest pain and shortness of breath for 2 days',
    medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
    currentMedications: ['Metformin 500mg', 'Amlodipine 5mg'],
    allergies: ['Penicillin'],
  });

  // ABHA Verification
  const [isVerifyingABHA, setIsVerifyingABHA] = useState(false);
  const [abhaOTP, setAbhaOTP] = useState('');
  const [showABHADialog, setShowABHADialog] = useState(false);

  // Screen Sharing
  const screenShareRef = useRef<MediaStream | null>(null);
  const [sharedContent, setSharedContent] = useState<'screen' | 'window' | 'tab' | null>(null);

  // Real-time Documentation
  const [consultationNotes, setConsultationNotes] = useState<ConsultationNote[]>([]);
  const [currentNote, setCurrentNote] = useState('');
  const [noteType, setNoteType] = useState<ConsultationNote['type']>('observation');
  const [isNotesOpen, setIsNotesOpen] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  // Chat/Files
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{id: string; sender: string; message: string; timestamp: string; type: 'text' | 'file'}>>([]);
  const [chatInput, setChatInput] = useState('');
  
  // Timer
  const [sessionDuration, setSessionDuration] = useState(0);
  const [sessionStartTime] = useState(Date.now());

  // Referral
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const [referralSpecialty, setReferralSpecialty] = useState('');
  const [referralUrgency, setReferralUrgency] = useState<'routine' | 'urgent' | 'emergency'>('routine');
  const [referralNotes, setReferralNotes] = useState('');

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - sessionStartTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionStartTime]);

  // Auto-save notes
  useEffect(() => {
    if (autoSave && currentNote.length > 0) {
      const saveTimer = setTimeout(() => {
        console.log('Auto-saving notes...');
      }, 2000);
      return () => clearTimeout(saveTimer);
    }
  }, [currentNote, autoSave]);

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ABHA Verification
  const verifyABHA = async () => {
    setIsVerifyingABHA(true);
    setShowABHADialog(true);
  };

  const confirmABHAVerification = async () => {
    if (abhaOTP === '123456') {
      setPatient(prev => ({ ...prev, abhaVerified: true }));
      setShowABHADialog(false);
      addConsultationNote('observation', `ABHA verified: ${patient.abhaNumber}`);
    }
  };

  // Screen Sharing
  const toggleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false,
        });
        screenShareRef.current = stream;
        setIsScreenSharing(true);
        setSharedContent('screen');
        
        stream.getVideoTracks()[0].onended = () => {
          stopScreenShare();
        };
      } catch (err) {
        console.error('Error sharing screen:', err);
      }
    } else {
      stopScreenShare();
    }
  };

  const stopScreenShare = () => {
    if (screenShareRef.current) {
      screenShareRef.current.getTracks().forEach(track => track.stop());
      screenShareRef.current = null;
    }
    setIsScreenSharing(false);
    setSharedContent(null);
  };

  // Documentation
  const addConsultationNote = (type: ConsultationNote['type'], content: string) => {
    const note: ConsultationNote = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString(),
      type,
      content,
      tagged: false,
    };
    setConsultationNotes(prev => [...prev, note]);
  };

  const saveCurrentNote = () => {
    if (currentNote.trim()) {
      addConsultationNote(noteType, currentNote);
      setCurrentNote('');
    }
  };

  const toggleNoteTag = (id: string) => {
    setConsultationNotes(prev => 
      prev.map(note => 
        note.id === id ? { ...note, tagged: !note.tagged } : note
      )
    );
  };

  // Referral
  const createReferral = () => {
    const referral = {
      patientId: patient.id,
      patientName: patient.name,
      referringDoctor: 'Dr. Priya Sharma',
      specialty: referralSpecialty,
      urgency: referralUrgency,
      notes: referralNotes,
      attachments: consultationNotes.filter(n => n.tagged),
      sessionId,
      date: new Date().toISOString(),
    };
    
    console.log('Creating referral:', referral);
    addConsultationNote('followup', `Referral created to ${referralSpecialty} (${referralUrgency})`);
    setShowReferralDialog(false);
    
    // Navigate to referral page
    setTimeout(() => {
      router.push(`/dashboard/network/referrals/new?patient=${patient.id}`);
    }, 1000);
  };

  // Quick Actions
  const quickPrescribe = () => {
    router.push(`/dashboard/prescriptions?type=digital&session=${sessionId}&patient=${patient.id}`);
  };

  const scheduleFollowUp = () => {
    router.push(`/dashboard/appointments?type=followup&patient=${patient.id}`);
  };

  const orderLabTests = () => {
    router.push(`/dashboard/lab/orders?patient=${patient.id}`);
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Main Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-gray-800 border-b border-gray-700 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-white font-semibold">Video Consultation - {sessionId}</h2>
              <StandardBadge variant="success">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  LIVE
                </div>
              </StandardBadge>
              <span className="text-gray-300 font-mono">{formatDuration(sessionDuration)}</span>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Connection Quality */}
              <div className="flex items-center gap-2">
                <Wifi className={`w-4 h-4 ${
                  connectionQuality === 'excellent' ? 'text-green-400' :
                  connectionQuality === 'good' ? 'text-blue-400' :
                  connectionQuality === 'fair' ? 'text-yellow-400' : 'text-red-400'
                }`} />
                <span className="text-sm text-gray-300">{connectionQuality}</span>
              </div>

              {/* ABHA Verification Status */}
              <div className="flex items-center gap-2">
                {patient.abhaVerified ? (
                  <StandardBadge variant="success" size="sm">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    ABHA Verified
                  </StandardBadge>
                ) : (
                  <StandardButton
                    variant="warning"
                    size="sm"
                    icon={Shield}
                    onClick={verifyABHA}
                  >
                    Verify ABHA
                  </StandardButton>
                )}
              </div>

              {/* Recording Status */}
              {isRecording && (
                <StandardBadge variant="danger">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                    Recording
                  </div>
                </StandardBadge>
              )}
            </div>
          </div>
        </div>

        {/* Video Container */}
        <div className="flex-1 relative bg-black">
          {/* Remote Video (Patient) */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full">
              {/* Placeholder for patient video */}
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <User className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                  <p className="text-white text-xl">{patient.name}</p>
                  <p className="text-gray-400">{patient.age} years, {patient.gender}</p>
                  {patient.abhaNumber && (
                    <p className="text-gray-500 text-sm mt-2">ABHA: {patient.abhaNumber}</p>
                  )}
                </div>
              </div>

              {/* Screen Share Overlay */}
              {isScreenSharing && (
                <div className="absolute inset-0 bg-blue-900/20 flex items-center justify-center">
                  <div className="text-center">
                    <Monitor className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                    <p className="text-white">Screen Sharing Active</p>
                    <p className="text-blue-400 text-sm">Sharing {sharedContent}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Local Video (Doctor) - Picture in Picture */}
          <div className="absolute bottom-4 right-4 w-48 h-36 bg-gray-800 rounded-lg shadow-lg border-2 border-gray-700">
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-12 h-12 text-gray-600" />
            </div>
          </div>

          {/* Patient Vitals Overlay */}
          {patient.vitals && (
            <div className="absolute top-4 left-4 bg-gray-800/90 backdrop-blur rounded-lg p-3 border border-gray-700">
              <h3 className="text-white text-sm font-semibold mb-2">Vitals</h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3 text-red-400" />
                  <span className="text-gray-300">HR: {patient.vitals.heartRate} bpm</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-blue-400" />
                  <span className="text-gray-300">BP: {patient.vitals.bloodPressure}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-orange-400" />
                  <span className="text-gray-300">Temp: {patient.vitals.temperature}°F</span>
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-green-400" />
                  <span className="text-gray-300">SpO2: {patient.vitals.spo2}%</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Control Bar */}
        <div className="bg-gray-800 border-t border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Video Control */}
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={`p-3 rounded-full ${
                  isVideoOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                } transition-colors`}
              >
                {isVideoOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-white" />}
              </button>

              {/* Audio Control */}
              <button
                onClick={() => setIsAudioOn(!isAudioOn)}
                className={`p-3 rounded-full ${
                  isAudioOn ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
                } transition-colors`}
              >
                {isAudioOn ? <Mic className="w-5 h-5 text-white" /> : <MicOff className="w-5 h-5 text-white" />}
              </button>

              {/* Screen Share */}
              <button
                onClick={toggleScreenShare}
                className={`p-3 rounded-full ${
                  isScreenSharing ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'
                } transition-colors`}
              >
                {isScreenSharing ? <MonitorOff className="w-5 h-5 text-white" /> : <Monitor className="w-5 h-5 text-white" />}
              </button>

              {/* Recording */}
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`p-3 rounded-full ${
                  isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-700 hover:bg-gray-600'
                } transition-colors`}
              >
                <div className="flex items-center gap-2">
                  {isRecording && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                  <span className="text-white text-sm">{isRecording ? 'Stop' : 'Record'}</span>
                </div>
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <StandardButton
                variant="secondary"
                size="sm"
                icon={Pill}
                onClick={quickPrescribe}
              >
                Prescribe
              </StandardButton>
              <StandardButton
                variant="secondary"
                size="sm"
                icon={ArrowRightLeft}
                onClick={() => setShowReferralDialog(true)}
              >
                Refer
              </StandardButton>
              <StandardButton
                variant="secondary"
                size="sm"
                icon={Calendar}
                onClick={scheduleFollowUp}
              >
                Follow-up
              </StandardButton>
              <StandardButton
                variant="secondary"
                size="sm"
                icon={FileText}
                onClick={orderLabTests}
              >
                Lab Tests
              </StandardButton>
            </div>

            {/* End Call */}
            <button
              onClick={() => router.push('/dashboard/telemedicine')}
              className="p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
            >
              <PhoneOff className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - Documentation */}
      <div className={`bg-gray-800 border-l border-gray-700 transition-all duration-300 ${
        isNotesOpen ? 'w-96' : 'w-12'
      }`}>
        {isNotesOpen ? (
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold">Consultation Notes</h3>
                <div className="flex items-center gap-2">
                  {autoSave && (
                    <StandardBadge variant="success" size="sm">
                      <Save className="w-3 h-3 mr-1" />
                      Auto-save
                    </StandardBadge>
                  )}
                  <button
                    onClick={() => setIsNotesOpen(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Patient Info */}
            <div className="p-4 border-b border-gray-700 bg-gray-900/50">
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Chief Complaint:</span>
                  <p className="text-white">{patient.chiefComplaint}</p>
                </div>
                <div>
                  <span className="text-gray-400">Medical History:</span>
                  <p className="text-white">{patient.medicalHistory.join(', ')}</p>
                </div>
                <div>
                  <span className="text-gray-400">Current Medications:</span>
                  <p className="text-white">{patient.currentMedications.join(', ')}</p>
                </div>
                <div>
                  <span className="text-gray-400">Allergies:</span>
                  <p className="text-red-400">{patient.allergies.join(', ')}</p>
                </div>
              </div>
            </div>

            {/* Notes List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {consultationNotes.map(note => (
                <div
                  key={note.id}
                  className={`p-3 rounded-lg border ${
                    note.tagged ? 'border-blue-500 bg-blue-900/20' : 'border-gray-700 bg-gray-900/50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <StandardBadge variant={
                          note.type === 'diagnosis' ? 'danger' :
                          note.type === 'prescription' ? 'success' :
                          note.type === 'followup' ? 'warning' :
                          note.type === 'advice' ? 'info' : 'secondary'
                        } size="sm">
                          {note.type}
                        </StandardBadge>
                        <span className="text-xs text-gray-400">{note.timestamp}</span>
                      </div>
                      <p className="text-white text-sm">{note.content}</p>
                    </div>
                    <button
                      onClick={() => toggleNoteTag(note.id)}
                      className="ml-2 text-gray-400 hover:text-white"
                    >
                      {note.tagged ? <CheckCircle className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Note Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex gap-2 mb-2">
                <StandardSelect
                  options={[
                    { value: 'observation', label: 'Observation' },
                    { value: 'diagnosis', label: 'Diagnosis' },
                    { value: 'prescription', label: 'Prescription' },
                    { value: 'advice', label: 'Advice' },
                    { value: 'followup', label: 'Follow-up' },
                  ]}
                  value={noteType}
                  onChange={(v) => setNoteType(v as ConsultationNote['type'])}
                  className="flex-1"
                />
              </div>
              <div className="flex gap-2">
                <textarea
                  value={currentNote}
                  onChange={(e) => setCurrentNote(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      saveCurrentNote();
                    }
                  }}
                  placeholder="Add consultation note... (Ctrl+Enter to save)"
                  className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm resize-none"
                  rows={3}
                />
                <button
                  onClick={saveCurrentNote}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center">
            <button
              onClick={() => setIsNotesOpen(true)}
              className="text-gray-400 hover:text-white p-2"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* ABHA Verification Dialog */}
      {showABHADialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Verify Patient ABHA</h3>
            
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-900">Patient Details</div>
                <div className="text-sm text-blue-700 mt-1">
                  Name: {patient.name}<br />
                  ABHA: {patient.abhaNumber}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Enter OTP sent to registered mobile
                </label>
                <input
                  type="text"
                  value={abhaOTP}
                  onChange={(e) => setAbhaOTP(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-3 py-2 border rounded-lg"
                  maxLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">Demo: Enter 123456</p>
              </div>

              <div className="flex gap-3">
                <StandardButton
                  variant="primary"
                  className="flex-1"
                  onClick={confirmABHAVerification}
                  disabled={abhaOTP.length !== 6}
                >
                  Verify
                </StandardButton>
                <StandardButton
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowABHADialog(false)}
                >
                  Cancel
                </StandardButton>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Referral Dialog */}
      {showReferralDialog && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Create Specialist Referral</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialty Required
                </label>
                <StandardSelect
                  options={[
                    { value: 'cardiology', label: 'Cardiology' },
                    { value: 'neurology', label: 'Neurology' },
                    { value: 'orthopedics', label: 'Orthopedics' },
                    { value: 'psychiatry', label: 'Psychiatry' },
                    { value: 'oncology', label: 'Oncology' },
                    { value: 'pulmonology', label: 'Pulmonology' },
                  ]}
                  value={referralSpecialty}
                  onChange={setReferralSpecialty}
                  placeholder="Select specialty"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency Level
                </label>
                <div className="flex gap-2">
                  {(['routine', 'urgent', 'emergency'] as const).map(level => (
                    <button
                      key={level}
                      onClick={() => setReferralUrgency(level)}
                      className={`flex-1 px-3 py-2 rounded-lg border ${
                        referralUrgency === level
                          ? level === 'emergency' ? 'bg-red-100 border-red-500 text-red-700' :
                            level === 'urgent' ? 'bg-orange-100 border-orange-500 text-orange-700' :
                            'bg-blue-100 border-blue-500 text-blue-700'
                          : 'bg-white border-gray-300 text-gray-700'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Referral Notes
                </label>
                <textarea
                  value={referralNotes}
                  onChange={(e) => setReferralNotes(e.target.value)}
                  placeholder="Clinical findings and reason for referral..."
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-1">
                  Tagged Notes to Include
                </div>
                <div className="text-sm text-gray-600">
                  {consultationNotes.filter(n => n.tagged).length} notes selected
                </div>
              </div>

              <div className="flex gap-3">
                <StandardButton
                  variant="primary"
                  className="flex-1"
                  onClick={createReferral}
                  disabled={!referralSpecialty}
                >
                  Create Referral
                </StandardButton>
                <StandardButton
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowReferralDialog(false)}
                >
                  Cancel
                </StandardButton>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Add missing Circle import
const Circle: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="12" r="10" strokeWidth="2" />
  </svg>
);

export default VideoConsultationEnhanced;