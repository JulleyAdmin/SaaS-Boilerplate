'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  FileText, 
  Clock, 
  User, 
  Search, 
  Calendar,
  Edit,
  Save,
  AlertCircle,
  Activity,
  Heart,
  Thermometer,
  Plus,
  Eye,
  Printer
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Mock nursing notes data
const nursingNotes = [
  {
    id: 'NOTE001',
    patientName: 'Rajesh Kumar',
    patientId: 'P001',
    wardBed: 'General Ward A - Bed 101',
    nurse: 'Sister Mary Johnson',
    timestamp: '2024-01-15 14:30:00',
    shift: 'Day Shift (7 AM - 7 PM)',
    noteType: 'General Assessment',
    priority: 'routine',
    content: 'Patient appears comfortable and in no acute distress. Vital signs stable. Ambulating independently. No complaints of pain or discomfort. Appetite good, taking oral medications as prescribed. Bowel movement this morning - formed, brown. Urine output adequate, clear yellow.',
    vitals: {
      temperature: '98.6°F',
      bloodPressure: '120/80 mmHg',
      heartRate: '72 bpm',
      respiratoryRate: '16/min',
      oxygenSaturation: '98%'
    },
    interventions: ['Assisted with morning hygiene', 'Administered medications as scheduled', 'Encouraged fluid intake'],
    followUp: 'Continue current care plan. Monitor for any changes in condition.'
  },
  {
    id: 'NOTE002',
    patientName: 'Sunita Devi',
    patientId: 'P003',
    wardBed: 'ICU - Bed 201',
    nurse: 'Sister Jane Smith',
    timestamp: '2024-01-15 13:15:00',
    shift: 'Day Shift (7 AM - 7 PM)',
    noteType: 'Critical Care Assessment',
    priority: 'high',
    content: 'Patient remains on mechanical ventilation. Sedated but responsive to verbal stimuli. Pupils equal, reactive to light. Ventilator settings unchanged. No signs of respiratory distress. Cardiac rhythm regular on monitor. Urine output 50ml/hour via Foley catheter.',
    vitals: {
      temperature: '101.2°F',
      bloodPressure: '110/70 mmHg',
      heartRate: '88 bpm',
      respiratoryRate: '16/min (ventilated)',
      oxygenSaturation: '96%'
    },
    interventions: ['Turned patient every 2 hours', 'Oral care performed', 'Family education provided', 'Medication titration per protocol'],
    followUp: 'Continue close monitoring. Reassess sedation level in 2 hours. Plan family conference with physician.'
  },
  {
    id: 'NOTE003',
    patientName: 'Baby Sharma',
    patientId: 'P004',
    wardBed: 'Pediatric Ward - Bed 301',
    nurse: 'Sister Priya Patel',
    timestamp: '2024-01-15 12:45:00',
    shift: 'Day Shift (7 AM - 7 PM)',
    noteType: 'Pediatric Assessment',
    priority: 'routine',
    content: 'Child is alert, active, and playful. Temperature decreased from yesterday. Appetite improving - took full bottle feeding. No vomiting or diarrhea. Mother present and participating in care. Skin pink and warm, no rashes noted. Playing with toys appropriately for age.',
    vitals: {
      temperature: '99.1°F',
      bloodPressure: '85/50 mmHg',
      heartRate: '110 bpm',
      respiratoryRate: '24/min',
      oxygenSaturation: '99%'
    },
    interventions: ['Administered pediatric medications', 'Encouraged age-appropriate play', 'Parent education on home care'],
    followUp: 'Continue current treatment plan. Prepare for discharge planning with social services.'
  },
  {
    id: 'NOTE004',
    patientName: 'Amit Patel',
    patientId: 'P006',
    wardBed: 'Private Room - Bed 401',
    nurse: 'Sister Rita Gupta',
    timestamp: '2024-01-15 11:20:00',
    shift: 'Day Shift (7 AM - 7 PM)',
    noteType: 'Post-Operative Assessment',
    priority: 'high',
    content: 'Post-operative day 1 following appendectomy. Surgical site clean, dry, and intact with staples. No signs of infection. Pain level 3/10, well controlled with prescribed analgesics. Patient ambulated in hallway with minimal assistance. Tolerating clear liquids well.',
    vitals: {
      temperature: '98.8°F',
      bloodPressure: '125/82 mmHg',
      heartRate: '76 bpm',
      respiratoryRate: '18/min',
      oxygenSaturation: '97%'
    },
    interventions: ['Wound assessment and dressing change', 'Pain management per protocol', 'Progressive ambulation'],
    followUp: 'Advance diet as tolerated. Continue wound monitoring. Plan for discharge education.'
  }
];

const noteStats = {
  totalNotes: 24,
  todayNotes: 8,
  highPriority: 3,
  pendingReview: 2
};

export default function NursingNotesPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [noteTypeFilter, setNoteTypeFilter] = useState('all');
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [notes, setNotes] = useState(nursingNotes);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedNote, setSelectedNote] = useState<any>(null);
  const [editingNote, setEditingNote] = useState<any>(null);
  const [newNote, setNewNote] = useState({
    patientId: '',
    noteType: '',
    priority: 'routine',
    content: '',
    interventions: '',
    followUp: '',
    vitals: {
      temperature: '',
      bloodPressure: '',
      heartRate: '',
      respiratoryRate: '',
      oxygenSaturation: ''
    }
  });

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive">High Priority</Badge>;
      case 'routine':
        return <Badge variant="outline">Routine</Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  const getNoteTypeColor = (noteType: string) => {
    switch (noteType) {
      case 'Critical Care Assessment':
        return 'text-red-600';
      case 'Post-Operative Assessment':
        return 'text-orange-600';
      case 'Pediatric Assessment':
        return 'text-blue-600';
      default:
        return 'text-gray-600';
    }
  };


  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      note.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.wardBed.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesPriority = priorityFilter === 'all' || note.priority === priorityFilter;
    const matchesShift = shiftFilter === 'all' || note.shift.includes(shiftFilter);
    const matchesNoteType = noteTypeFilter === 'all' || note.noteType === noteTypeFilter;
    
    return matchesSearch && matchesPriority && matchesShift && matchesNoteType;
  });

  const noteTypes = Array.from(new Set(notes.map(note => note.noteType)));

  const handleSaveNote = () => {
    if (!newNote.patientId || !newNote.content) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const nurseNames = ['Sister Mary Johnson', 'Sister Jane Smith', 'Sister Priya Patel', 'Sister Rita Gupta'];
    const randomNurse = nurseNames[Math.floor(Math.random() * nurseNames.length)];
    
    const noteToAdd = {
      id: `NOTE${Date.now().toString().slice(-6)}`,
      patientName: newNote.patientId === 'P001' ? 'Rajesh Kumar' : 
                   newNote.patientId === 'P003' ? 'Sunita Devi' :
                   newNote.patientId === 'P004' ? 'Baby Sharma' : 'Amit Patel',
      patientId: newNote.patientId,
      wardBed: 'General Ward A - Bed ' + Math.floor(Math.random() * 500 + 100),
      nurse: randomNurse,
      timestamp: new Date().toISOString(),
      shift: 'Day Shift (7 AM - 7 PM)',
      noteType: newNote.noteType,
      priority: newNote.priority,
      content: newNote.content,
      vitals: newNote.vitals,
      interventions: newNote.interventions.split(',').map(i => i.trim()).filter(i => i),
      followUp: newNote.followUp
    };

    setNotes(prev => [noteToAdd, ...prev]);
    
    toast({
      title: "Success",
      description: "Nursing note saved successfully",
    });

    // Reset form
    setNewNote({
      patientId: '',
      noteType: '',
      priority: 'routine',
      content: '',
      interventions: '',
      followUp: '',
      vitals: {
        temperature: '',
        bloodPressure: '',
        heartRate: '',
        respiratoryRate: '',
        oxygenSaturation: ''
      }
    });
    setIsCreatingNote(false);
  };

  const handleViewNote = (note: any) => {
    setSelectedNote(note);
    setShowViewDialog(true);
  };

  const handleEditNoteClick = (note: any) => {
    setEditingNote({...note});
    setShowEditDialog(true);
  };

  const handleEditNote = () => {
    if (!editingNote) return;

    setNotes(prev => prev.map(note => 
      note.id === editingNote.id ? editingNote : note
    ));

    toast({
      title: "Success",
      description: "Nursing note updated successfully",
    });

    setShowEditDialog(false);
    setEditingNote(null);
  };

  const handlePrintNote = (note: any) => {
    toast({
      title: "Print",
      description: `Printing note for ${note.patientName}`,
    });
    // In production, this would trigger actual printing
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Nursing Notes</h1>
          <p className="text-muted-foreground">Document patient care, assessments, and interventions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Calendar className="mr-2 size-4" />
            View Calendar
          </Button>
          <Button onClick={() => setIsCreatingNote(true)}>
            <Plus className="mr-2 size-4" />
            New Note
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Notes</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{noteStats.totalNotes}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Notes</CardTitle>
            <Clock className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{noteStats.todayNotes}</div>
            <p className="text-xs text-muted-foreground">Current shift</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertCircle className="size-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{noteStats.highPriority}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Edit className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{noteStats.pendingReview}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, content, or ward..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="routine">Routine</SelectItem>
              </SelectContent>
            </Select>
            <Select value={noteTypeFilter} onValueChange={setNoteTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {noteTypes.map(type => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Nursing Notes Content */}
      <Tabs defaultValue="notes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notes">Nursing Notes</TabsTrigger>
          <TabsTrigger value="create">Create New Note</TabsTrigger>
          <TabsTrigger value="templates">Note Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="notes">
          <div className="space-y-4">
            {filteredNotes.map(note => (
              <Card key={note.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {note.patientName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{note.patientName}</CardTitle>
                        <CardDescription>{note.wardBed} • ID: {note.patientId}</CardDescription>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {getPriorityBadge(note.priority)}
                      <span className={`text-sm font-medium ${getNoteTypeColor(note.noteType)}`}>
                        {note.noteType}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Vital Signs */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="text-center">
                      <Thermometer className="size-4 mx-auto mb-1 text-red-500" />
                      <p className="text-xs text-muted-foreground">Temperature</p>
                      <p className="font-semibold text-sm">{note.vitals.temperature}</p>
                    </div>
                    <div className="text-center">
                      <Heart className="size-4 mx-auto mb-1 text-red-500" />
                      <p className="text-xs text-muted-foreground">Heart Rate</p>
                      <p className="font-semibold text-sm">{note.vitals.heartRate}</p>
                    </div>
                    <div className="text-center">
                      <Activity className="size-4 mx-auto mb-1 text-blue-500" />
                      <p className="text-xs text-muted-foreground">Blood Pressure</p>
                      <p className="font-semibold text-sm">{note.vitals.bloodPressure}</p>
                    </div>
                    <div className="text-center">
                      <Activity className="size-4 mx-auto mb-1 text-green-500" />
                      <p className="text-xs text-muted-foreground">Respiratory</p>
                      <p className="font-semibold text-sm">{note.vitals.respiratoryRate}</p>
                    </div>
                    <div className="text-center">
                      <Activity className="size-4 mx-auto mb-1 text-purple-500" />
                      <p className="text-xs text-muted-foreground">O2 Sat</p>
                      <p className="font-semibold text-sm">{note.vitals.oxygenSaturation}</p>
                    </div>
                  </div>

                  {/* Assessment Content */}
                  <div>
                    <h4 className="font-medium mb-2">Assessment & Observations</h4>
                    <p className="text-sm leading-relaxed">{note.content}</p>
                  </div>

                  {/* Interventions */}
                  <div>
                    <h4 className="font-medium mb-2">Interventions Provided</h4>
                    <ul className="space-y-1">
                      {note.interventions.map((intervention, index) => (
                        <li key={index} className="text-sm flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                          {intervention}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Follow-up */}
                  <div>
                    <h4 className="font-medium mb-2">Plan & Follow-up</h4>
                    <p className="text-sm">{note.followUp}</p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <User className="size-4 mr-1" />
                        {note.nurse}
                      </span>
                      <span className="flex items-center mt-1">
                        <Clock className="size-4 mr-1" />
                        {new Date(note.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleViewNote(note)}>
                        <Eye className="size-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleEditNoteClick(note)}>
                        <Edit className="size-4 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Create New Nursing Note</CardTitle>
              <CardDescription>Document patient assessment, interventions, and care plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="patientSelect">Patient *</Label>
                  <Select value={newNote.patientId} onValueChange={(value) => setNewNote({...newNote, patientId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select patient" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="P001">Rajesh Kumar (P001)</SelectItem>
                      <SelectItem value="P003">Sunita Devi (P003)</SelectItem>
                      <SelectItem value="P004">Baby Sharma (P004)</SelectItem>
                      <SelectItem value="P006">Amit Patel (P006)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="noteType">Note Type *</Label>
                  <Select value={newNote.noteType} onValueChange={(value) => setNewNote({...newNote, noteType: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select note type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="General Assessment">General Assessment</SelectItem>
                      <SelectItem value="Critical Care Assessment">Critical Care Assessment</SelectItem>
                      <SelectItem value="Post-Operative Assessment">Post-Operative Assessment</SelectItem>
                      <SelectItem value="Pediatric Assessment">Pediatric Assessment</SelectItem>
                      <SelectItem value="Discharge Planning">Discharge Planning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select value={newNote.priority} onValueChange={(value) => setNewNote({...newNote, priority: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine</SelectItem>
                      <SelectItem value="high">High Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Vital Signs Entry */}
              <div>
                <h4 className="font-medium mb-3">Vital Signs</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Input 
                      placeholder="98.6°F"
                      value={newNote.vitals.temperature}
                      onChange={(e) => setNewNote({
                        ...newNote, 
                        vitals: {...newNote.vitals, temperature: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heartRate">Heart Rate</Label>
                    <Input 
                      placeholder="72 bpm"
                      value={newNote.vitals.heartRate}
                      onChange={(e) => setNewNote({
                        ...newNote, 
                        vitals: {...newNote.vitals, heartRate: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bloodPressure">Blood Pressure</Label>
                    <Input 
                      placeholder="120/80 mmHg"
                      value={newNote.vitals.bloodPressure}
                      onChange={(e) => setNewNote({
                        ...newNote, 
                        vitals: {...newNote.vitals, bloodPressure: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="respiratoryRate">Respiratory Rate</Label>
                    <Input 
                      placeholder="16/min"
                      value={newNote.vitals.respiratoryRate}
                      onChange={(e) => setNewNote({
                        ...newNote, 
                        vitals: {...newNote.vitals, respiratoryRate: e.target.value}
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oxygenSaturation">O2 Saturation</Label>
                    <Input 
                      placeholder="98%"
                      value={newNote.vitals.oxygenSaturation}
                      onChange={(e) => setNewNote({
                        ...newNote, 
                        vitals: {...newNote.vitals, oxygenSaturation: e.target.value}
                      })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Assessment & Observations *</Label>
                <Textarea
                  placeholder="Document patient's condition, behavior, symptoms, and any observations..."
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interventions">Interventions Provided</Label>
                <Textarea
                  placeholder="List all interventions, treatments, medications administered, or care provided..."
                  value={newNote.interventions}
                  onChange={(e) => setNewNote({...newNote, interventions: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="followUp">Plan & Follow-up</Label>
                <Textarea
                  placeholder="Document the care plan, follow-up needed, or special instructions..."
                  value={newNote.followUp}
                  onChange={(e) => setNewNote({...newNote, followUp: e.target.value})}
                  rows={2}
                />
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setIsCreatingNote(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveNote}>
                  <Save className="mr-2 size-4" />
                  Save Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Note Templates</CardTitle>
              <CardDescription>Quick templates for common nursing assessments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4">
                  <h4 className="font-medium mb-2">General Assessment Template</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Standard template for routine patient assessments
                  </p>
                  <Button size="sm" onClick={() => {
                    setNewNote({
                      ...newNote,
                      noteType: 'General Assessment',
                      content: 'Patient appears comfortable and in no acute distress. Vital signs stable. Ambulating independently. No complaints of pain or discomfort.',
                      interventions: 'Assisted with morning hygiene, Administered medications as scheduled, Encouraged fluid intake',
                      followUp: 'Continue current care plan. Monitor for any changes in condition.'
                    });
                    toast({
                      title: "Template Applied",
                      description: "General Assessment template loaded",
                    });
                  }}>Use Template</Button>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Post-Operative Care</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Template for post-surgical patient monitoring
                  </p>
                  <Button size="sm" onClick={() => {
                    setNewNote({
                      ...newNote,
                      noteType: 'Post-Operative Assessment',
                      content: 'Post-operative day X following [procedure]. Surgical site clean, dry, and intact. No signs of infection. Pain level X/10, controlled with prescribed analgesics.',
                      interventions: 'Wound assessment and dressing change, Pain management per protocol, Progressive ambulation',
                      followUp: 'Advance diet as tolerated. Continue wound monitoring. Plan for discharge education.'
                    });
                    toast({
                      title: "Template Applied",
                      description: "Post-Operative Care template loaded",
                    });
                  }}>Use Template</Button>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Critical Care Assessment</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Comprehensive template for ICU patient care
                  </p>
                  <Button size="sm" onClick={() => {
                    setNewNote({
                      ...newNote,
                      noteType: 'Critical Care Assessment',
                      priority: 'high',
                      content: 'Patient remains on mechanical ventilation. Sedated but responsive to verbal stimuli. Pupils equal, reactive to light. No signs of respiratory distress.',
                      interventions: 'Turned patient every 2 hours, Oral care performed, Family education provided, Medication titration per protocol',
                      followUp: 'Continue close monitoring. Reassess sedation level in 2 hours. Plan family conference with physician.'
                    });
                    toast({
                      title: "Template Applied",
                      description: "Critical Care Assessment template loaded",
                    });
                  }}>Use Template</Button>
                </Card>
                <Card className="p-4">
                  <h4 className="font-medium mb-2">Pediatric Assessment</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Age-appropriate template for pediatric patients
                  </p>
                  <Button size="sm" onClick={() => {
                    setNewNote({
                      ...newNote,
                      noteType: 'Pediatric Assessment',
                      content: 'Child is alert, active, and playful. Temperature improving. Appetite adequate. No vomiting or diarrhea. Parent present and participating in care.',
                      interventions: 'Administered pediatric medications, Encouraged age-appropriate play, Parent education on home care',
                      followUp: 'Continue current treatment plan. Prepare for discharge planning with social services.'
                    });
                    toast({
                      title: "Template Applied",
                      description: "Pediatric Assessment template loaded",
                    });
                  }}>Use Template</Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Note Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Nursing Note Details</DialogTitle>
            <DialogDescription>
              {selectedNote && `${selectedNote.patientName} - ${new Date(selectedNote.timestamp).toLocaleString()}`}
            </DialogDescription>
          </DialogHeader>
          {selectedNote && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold">Patient</Label>
                  <p className="text-sm">{selectedNote.patientName} ({selectedNote.patientId})</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Ward/Bed</Label>
                  <p className="text-sm">{selectedNote.wardBed}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Nurse</Label>
                  <p className="text-sm">{selectedNote.nurse}</p>
                </div>
                <div>
                  <Label className="text-sm font-semibold">Shift</Label>
                  <p className="text-sm">{selectedNote.shift}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-semibold">Note Type</Label>
                <p className="text-sm">{selectedNote.noteType}</p>
              </div>

              <div>
                <Label className="text-sm font-semibold">Assessment Notes</Label>
                <p className="text-sm whitespace-pre-wrap">{selectedNote.content}</p>
              </div>

              {selectedNote.vitals && (
                <div>
                  <Label className="text-sm font-semibold mb-2">Vital Signs</Label>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <div className="p-2 bg-muted rounded">
                      <p className="text-xs text-muted-foreground">Temperature</p>
                      <p className="font-medium">{selectedNote.vitals.temperature}</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="text-xs text-muted-foreground">Blood Pressure</p>
                      <p className="font-medium">{selectedNote.vitals.bloodPressure}</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="text-xs text-muted-foreground">Heart Rate</p>
                      <p className="font-medium">{selectedNote.vitals.heartRate}</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="text-xs text-muted-foreground">Respiratory Rate</p>
                      <p className="font-medium">{selectedNote.vitals.respiratoryRate}</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="text-xs text-muted-foreground">SpO2</p>
                      <p className="font-medium">{selectedNote.vitals.oxygenSaturation}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedNote.interventions && selectedNote.interventions.length > 0 && (
                <div>
                  <Label className="text-sm font-semibold">Interventions</Label>
                  <ul className="list-disc list-inside text-sm mt-1">
                    {selectedNote.interventions.map((intervention: string, index: number) => (
                      <li key={index}>{intervention}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedNote.followUp && (
                <div>
                  <Label className="text-sm font-semibold">Follow-up Plan</Label>
                  <p className="text-sm">{selectedNote.followUp}</p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewDialog(false)}>Close</Button>
            <Button onClick={() => selectedNote && handlePrintNote(selectedNote)}>
              <Printer className="size-4 mr-2" />
              Print Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Note Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Nursing Note</DialogTitle>
            <DialogDescription>
              {editingNote && `Editing note for ${editingNote.patientName}`}
            </DialogDescription>
          </DialogHeader>
          {editingNote && (
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <Label htmlFor="editContent">Assessment Notes *</Label>
                <Textarea
                  id="editContent"
                  value={editingNote.content}
                  onChange={(e) => setEditingNote({...editingNote, content: e.target.value})}
                  rows={5}
                />
              </div>

              <div>
                <Label htmlFor="editPriority">Priority</Label>
                <Select 
                  value={editingNote.priority} 
                  onValueChange={(value) => setEditingNote({...editingNote, priority: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="editFollowUp">Follow-up Plan</Label>
                <Textarea
                  id="editFollowUp"
                  value={editingNote.followUp || ''}
                  onChange={(e) => setEditingNote({...editingNote, followUp: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowEditDialog(false);
              setEditingNote(null);
            }}>Cancel</Button>
            <Button onClick={handleEditNote}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}