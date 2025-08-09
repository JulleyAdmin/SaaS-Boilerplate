'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Book, 
  CheckCircle, 
  Download, 
  HelpCircle, 
  PlayCircle, 
  Search,
  FileText,
  Users,
  Settings,
  Shield,
  Calendar,
  CreditCard,
  Activity
} from 'lucide-react';
import Link from 'next/link';

const guideTopics = [
  {
    icon: Users,
    title: 'Getting Started',
    description: 'Learn the basics of using the HMS',
    topics: [
      'First Login and Profile Setup',
      'Understanding Your Dashboard',
      'Navigation Basics',
      'Customizing Your Workspace'
    ]
  },
  {
    icon: FileText,
    title: 'Patient Management',
    description: 'Managing patient records and information',
    topics: [
      'Registering New Patients',
      'Updating Patient Information',
      'Viewing Medical History',
      'Managing Family Connections'
    ]
  },
  {
    icon: Calendar,
    title: 'Appointments & Scheduling',
    description: 'Schedule and manage appointments',
    topics: [
      'Booking Appointments',
      'Managing Your Schedule',
      'Handling Cancellations',
      'Queue Management'
    ]
  },
  {
    icon: CreditCard,
    title: 'Billing & Payments',
    description: 'Process bills and handle payments',
    topics: [
      'Creating Invoices',
      'Processing Payments',
      'Insurance Claims',
      'Government Schemes'
    ]
  },
  {
    icon: Shield,
    title: 'Security & Privacy',
    description: 'Keep your account and data secure',
    topics: [
      'Password Management',
      'Two-Factor Authentication',
      'Data Privacy',
      'Access Control'
    ]
  },
  {
    icon: Activity,
    title: 'Reports & Analytics',
    description: 'Generate and understand reports',
    topics: [
      'Creating Reports',
      'Understanding Analytics',
      'Exporting Data',
      'Custom Dashboards'
    ]
  }
];

const faqs = [
  {
    question: 'How do I reset my password?',
    answer: 'Go to Settings > Security > Change Password or click "Forgot Password" on the login page.'
  },
  {
    question: 'How do I book an appointment for a patient?',
    answer: 'Navigate to Appointments > New Appointment, select the patient, choose a doctor and time slot.'
  },
  {
    question: 'Where can I find patient medical history?',
    answer: 'Go to Patients > Select Patient > Medical History tab to view complete medical records.'
  },
  {
    question: 'How do I process insurance claims?',
    answer: 'Navigate to Billing > Insurance Claims, fill in the claim details and submit to the insurance provider.'
  },
  {
    question: 'How do I generate reports?',
    answer: 'Go to Analytics & Reports, select the report type, set date range and parameters, then click Generate.'
  }
];

const videoTutorials = [
  { title: 'HMS Overview', duration: '5:30', views: '1.2K' },
  { title: 'Patient Registration Process', duration: '8:45', views: '856' },
  { title: 'Appointment Scheduling', duration: '6:20', views: '723' },
  { title: 'Billing Workflow', duration: '10:15', views: '612' },
  { title: 'Report Generation', duration: '7:40', views: '489' }
];

export default function UserGuidePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Guide</h1>
          <p className="text-muted-foreground">Learn how to use the Hospital Management System effectively</p>
        </div>
        <Button>
          <Download className="mr-2 size-4" />
          Download PDF Guide
        </Button>
      </div>

      {/* Quick Start */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start Guide</CardTitle>
          <CardDescription>Get up and running with HMS in minutes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex items-center space-x-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                1
              </div>
              <div>
                <p className="font-medium">Login</p>
                <p className="text-xs text-muted-foreground">Use your credentials</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                2
              </div>
              <div>
                <p className="font-medium">Setup Profile</p>
                <p className="text-xs text-muted-foreground">Complete your info</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                3
              </div>
              <div>
                <p className="font-medium">Explore Dashboard</p>
                <p className="text-xs text-muted-foreground">Navigate features</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                4
              </div>
              <div>
                <p className="font-medium">Start Working</p>
                <p className="text-xs text-muted-foreground">Use HMS features</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="topics" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="topics">Topics</TabsTrigger>
          <TabsTrigger value="videos">Video Tutorials</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="topics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {guideTopics.map((topic, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <topic.icon className="size-5 text-blue-600" />
                    <CardTitle className="text-lg">{topic.title}</CardTitle>
                  </div>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {topic.topics.map((item, idx) => (
                      <li key={idx} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="size-3 text-green-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full mt-4">
                    <Book className="mr-2 size-4" />
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Video Tutorials</CardTitle>
              <CardDescription>Watch step-by-step video guides</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {videoTutorials.map((video, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center space-x-3">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
                        <PlayCircle className="size-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{video.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Duration: {video.duration} • {video.views} views
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Watch Now
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faqs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find answers to common questions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="space-y-2 border-b pb-4 last:border-0">
                    <div className="flex items-start space-x-2">
                      <HelpCircle className="size-5 text-blue-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium">{faq.question}</p>
                        <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Get help from our support team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="font-medium">IT Support</p>
                  <p className="text-sm text-muted-foreground">
                    Extension: 1234<br />
                    Email: it@hospital.com<br />
                    Hours: Mon-Fri 9:00 AM - 6:00 PM
                  </p>
                </div>
                <div>
                  <p className="font-medium">Help Desk</p>
                  <p className="text-sm text-muted-foreground">
                    Extension: 5678<br />
                    Email: helpdesk@hospital.com<br />
                    Available 24/7
                  </p>
                </div>
                <Button className="w-full">
                  <HelpCircle className="mr-2 size-4" />
                  Submit Support Ticket
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resources</CardTitle>
                <CardDescription>Additional help resources</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/help/user-manual">
                    <FileText className="mr-2 size-4" />
                    User Manual (PDF)
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/help/quick-reference">
                    <Book className="mr-2 size-4" />
                    Quick Reference Card
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/help/keyboard-shortcuts">
                    <Settings className="mr-2 size-4" />
                    Keyboard Shortcuts
                  </Link>
                </Button>
                <Button variant="outline" className="w-full justify-start" asChild>
                  <Link href="/help/troubleshooting">
                    <HelpCircle className="mr-2 size-4" />
                    Troubleshooting Guide
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Pro Tips</CardTitle>
          <CardDescription>Make the most of HMS with these helpful tips</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="flex items-start space-x-2">
              <Badge className="mt-0.5">Tip</Badge>
              <p className="text-sm">Use keyboard shortcuts (Ctrl+K) to quickly search for patients</p>
            </div>
            <div className="flex items-start space-x-2">
              <Badge className="mt-0.5">Tip</Badge>
              <p className="text-sm">Star important documents for quick access later</p>
            </div>
            <div className="flex items-start space-x-2">
              <Badge className="mt-0.5">Tip</Badge>
              <p className="text-sm">Set up email notifications for important events</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}