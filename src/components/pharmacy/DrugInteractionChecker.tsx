'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertTriangle,
  CheckCircle,
  Search,
  Shield,
  Zap,
  AlertCircle,
  FileText,
  Eye,
  RefreshCw,
  Activity,
  Heart,
  Brain,
  Pill,
  Clock,
  TrendingUp,
  Filter,
  Database,
  BookOpen,
  ExternalLink
} from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  genericName: string;
  strength: string;
  form: string;
  category: string;
  therapeuticClass: string;
}

interface DrugInteraction {
  id: string;
  drug1: Medication;
  drug2: Medication;
  severity: 'minor' | 'moderate' | 'major' | 'contraindicated';
  mechanism: string;
  clinicalEffect: string;
  management: string;
  description: string;
  evidence: 'theoretical' | 'suspected' | 'probable' | 'established';
  onset: 'rapid' | 'delayed' | 'unspecified';
  documentation: 'poor' | 'fair' | 'good' | 'excellent';
  references?: string[];
}

interface ContraindicationAlert {
  id: string;
  medication: Medication;
  condition: string;
  severity: 'warning' | 'contraindicated';
  reason: string;
  alternatives?: string[];
}

interface AllergyAlert {
  id: string;
  medication: Medication;
  allergen: string;
  crossReactivity: string[];
  severity: 'mild' | 'moderate' | 'severe' | 'anaphylaxis';
}

export default function DrugInteractionChecker() {
  const { toast } = useToast();
  const [selectedMedications, setSelectedMedications] = useState<Medication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [interactions, setInteractions] = useState<DrugInteraction[]>([]);
  const [contraindications, setContraindications] = useState<ContraindicationAlert[]>([]);
  const [allergyAlerts, setAllergyAlerts] = useState<AllergyAlert[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [showInteractionDetails, setShowInteractionDetails] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState<DrugInteraction | null>(null);
  const [patientConditions, setPatientConditions] = useState<string[]>([]);
  const [patientAllergies, setPatientAllergies] = useState<string[]>(['Penicillin']);
  
  // Mock medication database
  const medicationDatabase: Medication[] = [
    {
      id: 'M001',
      name: 'Paracetamol',
      genericName: 'Acetaminophen',
      strength: '500mg',
      form: 'tablet',
      category: 'Analgesic',
      therapeuticClass: 'Non-opioid analgesic'
    },
    {
      id: 'M002',
      name: 'Amoxicillin',
      genericName: 'Amoxicillin Trihydrate',
      strength: '500mg',
      form: 'capsule',
      category: 'Antibiotic',
      therapeuticClass: 'Beta-lactam antibiotic'
    },
    {
      id: 'M003',
      name: 'Warfarin',
      genericName: 'Warfarin Sodium',
      strength: '5mg',
      form: 'tablet',
      category: 'Anticoagulant',
      therapeuticClass: 'Vitamin K antagonist'
    },
    {
      id: 'M004',
      name: 'Aspirin',
      genericName: 'Acetylsalicylic Acid',
      strength: '75mg',
      form: 'tablet',
      category: 'Antiplatelet',
      therapeuticClass: 'NSAID/Antiplatelet'
    },
    {
      id: 'M005',
      name: 'Metformin',
      genericName: 'Metformin Hydrochloride',
      strength: '500mg',
      form: 'tablet',
      category: 'Antidiabetic',
      therapeuticClass: 'Biguanide'
    },
    {
      id: 'M006',
      name: 'Atorvastatin',
      genericName: 'Atorvastatin Calcium',
      strength: '20mg',
      form: 'tablet',
      category: 'Lipid-lowering',
      therapeuticClass: 'HMG-CoA reductase inhibitor'
    },
    {
      id: 'M007',
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      strength: '10mg',
      form: 'tablet',
      category: 'ACE Inhibitor',
      therapeuticClass: 'Cardiovascular'
    }
  ];

  // Mock drug interactions database
  const interactionDatabase: DrugInteraction[] = [
    {
      id: 'INT001',
      drug1: medicationDatabase[2], // Warfarin
      drug2: medicationDatabase[3], // Aspirin
      severity: 'major',
      mechanism: 'Additive anticoagulant effects',
      clinicalEffect: 'Increased risk of bleeding',
      management: 'Monitor INR closely, consider dose reduction',
      description: 'Concurrent use increases bleeding risk due to additive anticoagulant and antiplatelet effects.',
      evidence: 'established',
      onset: 'delayed',
      documentation: 'excellent',
      references: ['Holbrook A, et al. Chest 2012', 'ACCP Guidelines 2012']
    },
    {
      id: 'INT002',
      drug1: medicationDatabase[1], // Amoxicillin
      drug2: medicationDatabase[2], // Warfarin
      severity: 'moderate',
      mechanism: 'Alteration of gut flora affecting vitamin K synthesis',
      clinicalEffect: 'Potential increase in anticoagulant effect',
      management: 'Monitor INR more frequently during antibiotic course',
      description: 'Antibiotics may enhance warfarin effect by reducing vitamin K-producing gut bacteria.',
      evidence: 'probable',
      onset: 'delayed',
      documentation: 'good'
    },
    {
      id: 'INT003',
      drug1: medicationDatabase[5], // Atorvastatin
      drug2: medicationDatabase[6], // Lisinopril
      severity: 'minor',
      mechanism: 'No significant pharmacokinetic interaction',
      clinicalEffect: 'Generally safe combination',
      management: 'No specific monitoring required',
      description: 'This combination is commonly used together safely in cardiovascular protection.',
      evidence: 'established',
      onset: 'unspecified',
      documentation: 'good'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'contraindicated': return 'destructive';
      case 'major': return 'destructive';
      case 'moderate': return 'default';
      case 'minor': return 'secondary';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'contraindicated': return <Shield className="h-4 w-4" />;
      case 'major': return <AlertTriangle className="h-4 w-4" />;
      case 'moderate': return <AlertCircle className="h-4 w-4" />;
      case 'minor': return <CheckCircle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const filteredMedications = medicationDatabase.filter(med =>
    med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    med.genericName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addMedication = (medication: Medication) => {
    if (!selectedMedications.find(m => m.id === medication.id)) {
      setSelectedMedications(prev => [...prev, medication]);
      setSearchTerm('');
      toast({
        title: "Medication added",
        description: `${medication.name} added to interaction check`,
      });
    }
  };

  const removeMedication = (medicationId: string) => {
    setSelectedMedications(prev => prev.filter(m => m.id !== medicationId));
  };

  const checkInteractions = async () => {
    setIsChecking(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Find interactions between selected medications
    const foundInteractions: DrugInteraction[] = [];
    
    for (let i = 0; i < selectedMedications.length; i++) {
      for (let j = i + 1; j < selectedMedications.length; j++) {
        const interaction = interactionDatabase.find(int =>
          (int.drug1.id === selectedMedications[i].id && int.drug2.id === selectedMedications[j].id) ||
          (int.drug1.id === selectedMedications[j].id && int.drug2.id === selectedMedications[i].id)
        );
        
        if (interaction) {
          foundInteractions.push(interaction);
        }
      }
    }
    
    setInteractions(foundInteractions);
    
    // Mock contraindication checking
    const mockContraindications: ContraindicationAlert[] = selectedMedications
      .filter(med => med.name === 'Metformin' && patientConditions.includes('Kidney Disease'))
      .map(med => ({
        id: `CONTRA${med.id}`,
        medication: med,
        condition: 'Kidney Disease',
        severity: 'contraindicated' as const,
        reason: 'Risk of lactic acidosis in renal impairment',
        alternatives: ['Insulin', 'Sulfonylureas']
      }));
    
    setContraindications(mockContraindications);
    
    // Mock allergy checking
    const mockAllergyAlerts: AllergyAlert[] = selectedMedications
      .filter(med => 
        (med.therapeuticClass === 'Beta-lactam antibiotic' && patientAllergies.includes('Penicillin'))
      )
      .map(med => ({
        id: `ALLERGY${med.id}`,
        medication: med,
        allergen: 'Penicillin',
        crossReactivity: ['Amoxicillin', 'Ampicillin', 'Cephalosporins'],
        severity: 'severe' as const
      }));
    
    setAllergyAlerts(mockAllergyAlerts);
    
    setIsChecking(false);
    
    const totalAlerts = foundInteractions.length + mockContraindications.length + mockAllergyAlerts.length;
    
    if (totalAlerts === 0) {
      toast({
        title: "No interactions found",
        description: "Selected medications appear to be safe to use together",
      });
    } else {
      toast({
        title: `${totalAlerts} alert(s) found`,
        description: "Review the interactions and contraindications below",
        variant: totalAlerts > 0 ? "destructive" : "default"
      });
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Drug Interaction Checker</h1>
          <p className="text-muted-foreground">Comprehensive medication safety analysis</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Database className="h-4 w-4 mr-2" />
            Drug Database
          </Button>
          <Button variant="outline" size="sm">
            <BookOpen className="h-4 w-4 mr-2" />
            Clinical Guidelines
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Medication Selection */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Select Medications
              </CardTitle>
              <CardDescription>
                Add medications to check for interactions, contraindications, and allergies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search medications by name or generic name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {/* Search Results */}
              {searchTerm && (
                <ScrollArea className="h-48 border rounded-lg p-2">
                  <div className="space-y-2">
                    {filteredMedications.map((medication) => (
                      <Card 
                        key={medication.id} 
                        className="cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => addMedication(medication)}
                      >
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">{medication.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {medication.genericName} • {medication.strength} • {medication.therapeuticClass}
                              </p>
                            </div>
                            <Badge variant="outline">{medication.category}</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              )}
              
              {/* Selected Medications */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Selected Medications ({selectedMedications.length})</Label>
                {selectedMedications.length === 0 ? (
                  <p className="text-sm text-muted-foreground p-4 border-2 border-dashed rounded-lg text-center">
                    No medications selected. Search and click to add medications.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedMedications.map((medication, index) => (
                      <Card key={medication.id}>
                        <CardContent className="p-3">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 font-semibold text-primary text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium">{medication.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {medication.genericName} • {medication.strength}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {medication.therapeuticClass}
                              </Badge>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => removeMedication(medication.id)}
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                              >
                                ×
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Check Button */}
              <Button 
                className="w-full" 
                onClick={checkInteractions}
                disabled={selectedMedications.length < 1 || isChecking}
              >
                {isChecking ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Checking Interactions...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Check Drug Interactions ({selectedMedications.length} medications)
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Patient Information */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Patient Information</CardTitle>
              <CardDescription>Patient conditions and allergies affect interaction analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm">Medical Conditions</Label>
                <Select onValueChange={(value) => setPatientConditions(prev => 
                  prev.includes(value) ? prev : [...prev, value]
                )}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kidney Disease">Kidney Disease</SelectItem>
                    <SelectItem value="Liver Disease">Liver Disease</SelectItem>
                    <SelectItem value="Heart Disease">Heart Disease</SelectItem>
                    <SelectItem value="Diabetes">Diabetes</SelectItem>
                    <SelectItem value="Hypertension">Hypertension</SelectItem>
                    <SelectItem value="Pregnancy">Pregnancy</SelectItem>
                  </SelectContent>
                </Select>
                {patientConditions.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {patientConditions.map((condition, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {condition}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setPatientConditions(prev => prev.filter(c => c !== condition))}
                          className="h-4 w-4 p-0 ml-1 text-muted-foreground hover:text-destructive"
                        >
                          ×
                        </Button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <Label className="text-sm">Known Allergies</Label>
                <div className="flex flex-wrap gap-1">
                  {patientAllergies.map((allergy, index) => (
                    <Badge key={index} variant="destructive" className="text-xs">
                      {allergy}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setPatientAllergies(prev => prev.filter(a => a !== allergy))}
                        className="h-4 w-4 p-0 ml-1 text-white hover:text-red-200"
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Results */}
      {(interactions.length > 0 || contraindications.length > 0 || allergyAlerts.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Interaction Analysis Results
            </CardTitle>
            <CardDescription>
              Review all identified interactions, contraindications, and allergy alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="interactions">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="interactions">
                  Drug Interactions ({interactions.length})
                </TabsTrigger>
                <TabsTrigger value="contraindications">
                  Contraindications ({contraindications.length})
                </TabsTrigger>
                <TabsTrigger value="allergies">
                  Allergy Alerts ({allergyAlerts.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="interactions" className="mt-4">
                {interactions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    No drug interactions detected
                  </div>
                ) : (
                  <div className="space-y-4">
                    {interactions.map((interaction) => (
                      <Alert key={interaction.id} className={`border-${getSeverityColor(interaction.severity) === 'destructive' ? 'red' : getSeverityColor(interaction.severity) === 'default' ? 'amber' : 'gray'}-200`}>
                        <div className="flex items-start gap-3">
                          {getSeverityIcon(interaction.severity)}
                          <div className="flex-1">
                            <AlertTitle className="flex items-center gap-2">
                              <span>{interaction.drug1.name} + {interaction.drug2.name}</span>
                              <Badge variant={getSeverityColor(interaction.severity)}>
                                {interaction.severity.toUpperCase()}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {interaction.evidence}
                              </Badge>
                            </AlertTitle>
                            <AlertDescription className="mt-2 space-y-2">
                              <p><strong>Clinical Effect:</strong> {interaction.clinicalEffect}</p>
                              <p><strong>Management:</strong> {interaction.management}</p>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedInteraction(interaction);
                                  setShowInteractionDetails(true);
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                View Details
                              </Button>
                            </AlertDescription>
                          </div>
                        </div>
                      </Alert>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="contraindications" className="mt-4">
                {contraindications.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    No contraindications detected
                  </div>
                ) : (
                  <div className="space-y-4">
                    {contraindications.map((contra) => (
                      <Alert key={contra.id} className="border-red-200 bg-red-50">
                        <Shield className="h-4 w-4 text-red-500" />
                        <AlertTitle className="flex items-center gap-2">
                          <span>{contra.medication.name} + {contra.condition}</span>
                          <Badge variant="destructive">CONTRAINDICATED</Badge>
                        </AlertTitle>
                        <AlertDescription className="mt-2 space-y-2">
                          <p><strong>Reason:</strong> {contra.reason}</p>
                          {contra.alternatives && (
                            <p><strong>Alternatives:</strong> {contra.alternatives.join(', ')}</p>
                          )}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="allergies" className="mt-4">
                {allergyAlerts.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    No allergy alerts detected
                  </div>
                ) : (
                  <div className="space-y-4">
                    {allergyAlerts.map((allergy) => (
                      <Alert key={allergy.id} className="border-red-200 bg-red-50">
                        <Heart className="h-4 w-4 text-red-500" />
                        <AlertTitle className="flex items-center gap-2">
                          <span>{allergy.medication.name} - Allergy Risk</span>
                          <Badge variant="destructive">{allergy.severity.toUpperCase()}</Badge>
                        </AlertTitle>
                        <AlertDescription className="mt-2 space-y-2">
                          <p><strong>Known Allergy:</strong> {allergy.allergen}</p>
                          <p><strong>Cross-Reactivity:</strong> {allergy.crossReactivity.join(', ')}</p>
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Interaction Details Modal */}
      <Dialog open={showInteractionDetails} onOpenChange={setShowInteractionDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Drug Interaction Details</DialogTitle>
            <DialogDescription>
              Comprehensive interaction information and clinical guidance
            </DialogDescription>
          </DialogHeader>
          
          {selectedInteraction && (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold">
                    {selectedInteraction.drug1.name} + {selectedInteraction.drug2.name}
                  </h3>
                  <Badge variant={getSeverityColor(selectedInteraction.severity)} className="text-lg px-3 py-1">
                    {selectedInteraction.severity.toUpperCase()}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-muted-foreground">Evidence Level</p>
                    <p className="capitalize">{selectedInteraction.evidence}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Documentation</p>
                    <p className="capitalize">{selectedInteraction.documentation}</p>
                  </div>
                  <div>
                    <p className="font-medium text-muted-foreground">Onset</p>
                    <p className="capitalize">{selectedInteraction.onset}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-muted-foreground">Mechanism</h4>
                    <p>{selectedInteraction.mechanism}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-muted-foreground">Clinical Effect</h4>
                    <p>{selectedInteraction.clinicalEffect}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-muted-foreground">Management</h4>
                    <p>{selectedInteraction.management}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-muted-foreground">Description</h4>
                    <p>{selectedInteraction.description}</p>
                  </div>
                  
                  {selectedInteraction.references && (
                    <div>
                      <h4 className="font-medium text-muted-foreground">References</h4>
                      <div className="space-y-1">
                        {selectedInteraction.references.map((ref, index) => (
                          <p key={index} className="text-sm text-blue-600 flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            {ref}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInteractionDetails(false)}>
              Close
            </Button>
            <Button>
              <FileText className="h-4 w-4 mr-2" />
              Save to Patient Record
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}