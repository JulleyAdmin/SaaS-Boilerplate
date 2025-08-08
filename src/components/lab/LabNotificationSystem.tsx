'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  Send,
  Phone,
  Mail,
  MessageSquare,
  User,
  TestTube,
  FileText,
  X
} from 'lucide-react';
import { format } from 'date-fns';

interface Notification {
  id: string;
  type: 'critical-result' | 'report-ready' | 'sample-issue' | 'equipment-alert';
  priority: 'high' | 'medium' | 'low';
  message: string;
  patientName?: string;
  testName?: string;
  doctorName: string;
  doctorContact: string;
  timestamp: string;
  status: 'pending' | 'sent' | 'acknowledged';
  attempts: number;
  maxAttempts: number;
}

export default function LabNotificationSystem() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 'N001',
      type: 'critical-result',
      priority: 'high',
      message: 'Critical low hemoglobin: 6.2 g/dL (Ref: 12.0-16.0)',
      patientName: 'Rajesh Kumar',
      testName: 'Complete Blood Count',
      doctorName: 'Dr. Amit Sharma',
      doctorContact: '9876543210',
      timestamp: '2024-08-07T11:30:00',
      status: 'pending',
      attempts: 0,
      maxAttempts: 3
    },
    {
      id: 'N002',
      type: 'report-ready',
      priority: 'medium',
      message: 'Lab report is ready for review',
      patientName: 'Priya Patel',
      testName: 'Liver Function Test',
      doctorName: 'Dr. Priya Patel',
      doctorContact: 'priya.patel@hospital.com',
      timestamp: '2024-08-07T11:00:00',
      status: 'pending',
      attempts: 0,
      maxAttempts: 2
    },
    {
      id: 'N003',
      type: 'sample-issue',
      priority: 'medium',
      message: 'Sample hemolyzed - repeat collection required',
      patientName: 'Amit Singh',
      testName: 'Blood Sugar Fasting',
      doctorName: 'Dr. Rahul Singh',
      doctorContact: '9876543211',
      timestamp: '2024-08-07T10:45:00',
      status: 'pending',
      attempts: 1,
      maxAttempts: 3
    }
  ]);

  const [autoNotifications, setAutoNotifications] = useState(true);

  useEffect(() => {
    if (autoNotifications) {
      const interval = setInterval(() => {
        // Auto-send pending high priority notifications
        const pendingCritical = notifications.filter(
          n => n.status === 'pending' && n.priority === 'high' && n.attempts < n.maxAttempts
        );
        
        if (pendingCritical.length > 0) {
          pendingCritical.forEach(notification => {
            sendNotification(notification.id);
          });
        }
      }, 30000); // Check every 30 seconds

      return () => clearInterval(interval);
    }
  }, [autoNotifications, notifications]);

  const sendNotification = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => {
      if (notification.id === notificationId) {
        const newAttempts = notification.attempts + 1;
        const newStatus = newAttempts >= notification.maxAttempts ? 'sent' : 'pending';
        
        toast({
          title: "Notification sent",
          description: `${notification.type === 'critical-result' ? 'Critical result' : 'Notification'} sent to ${notification.doctorName}`,
          variant: notification.type === 'critical-result' ? 'destructive' : 'default'
        });
        
        return {
          ...notification,
          attempts: newAttempts,
          status: newStatus as 'pending' | 'sent' | 'acknowledged'
        };
      }
      return notification;
    }));
  };

  const markAsAcknowledged = (notificationId: string) => {
    setNotifications(prev => prev.map(notification => {
      if (notification.id === notificationId) {
        return { ...notification, status: 'acknowledged' as const };
      }
      return notification;
    }));
    
    toast({
      title: "Notification acknowledged",
      description: "Notification has been marked as acknowledged",
    });
  };

  const dismissNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'critical-result': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'report-ready': return <FileText className="h-5 w-5 text-blue-500" />;
      case 'sample-issue': return <TestTube className="h-5 w-5 text-amber-500" />;
      case 'equipment-alert': return <Bell className="h-5 w-5 text-purple-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-amber-200 bg-amber-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getStatusBadge = (status: string, attempts: number, maxAttempts: number) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            Pending ({attempts}/{maxAttempts})
          </Badge>
        );
      case 'sent':
        return (
          <Badge variant="default">
            <Send className="h-3 w-3 mr-1" />
            Sent
          </Badge>
        );
      case 'acknowledged':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Acknowledged
          </Badge>
        );
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const criticalNotifications = notifications.filter(n => n.priority === 'high');
  const pendingNotifications = notifications.filter(n => n.status === 'pending');

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Laboratory Notification System</h1>
          <p className="text-muted-foreground">Manage critical results and lab notifications</p>
        </div>
        <div className="flex gap-2 items-center">
          <Button
            variant={autoNotifications ? "default" : "outline"}
            size="sm"
            onClick={() => setAutoNotifications(!autoNotifications)}
          >
            <Bell className="h-4 w-4 mr-2" />
            Auto-Notify: {autoNotifications ? 'ON' : 'OFF'}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">{criticalNotifications.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{pendingNotifications.length}</p>
              </div>
              <Clock className="h-8 w-8 text-amber-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sent Today</p>
                <p className="text-2xl font-bold">{notifications.filter(n => n.status === 'sent').length}</p>
              </div>
              <Send className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Acknowledged</p>
                <p className="text-2xl font-bold">{notifications.filter(n => n.status === 'acknowledged').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      {criticalNotifications.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertTitle className="text-red-700">Critical Results Require Immediate Attention</AlertTitle>
          <AlertDescription className="text-red-600">
            {criticalNotifications.length} critical result(s) pending physician notification
          </AlertDescription>
        </Alert>
      )}

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Notifications</CardTitle>
          <CardDescription>Manage laboratory notifications and alerts</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-4">
              {notifications.map((notification) => (
                <Card key={notification.id} className={`${getNotificationColor(notification.priority)}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge 
                              variant={notification.priority === 'high' ? 'destructive' : 'secondary'}
                              className="text-xs"
                            >
                              {notification.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {notification.type.replace('-', ' ').toUpperCase()}
                            </Badge>
                            {getStatusBadge(notification.status, notification.attempts, notification.maxAttempts)}
                          </div>
                          
                          <div className="space-y-2">
                            <p className="font-medium">{notification.message}</p>
                            
                            {notification.patientName && (
                              <div className="text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  Patient: {notification.patientName}
                                </span>
                                {notification.testName && (
                                  <span className="flex items-center gap-1 mt-1">
                                    <TestTube className="h-3 w-3" />
                                    Test: {notification.testName}
                                  </span>
                                )}
                              </div>
                            )}
                            
                            <div className="text-sm">
                              <p><span className="font-medium">Doctor:</span> {notification.doctorName}</p>
                              <p><span className="font-medium">Contact:</span> {notification.doctorContact}</p>
                              <p><span className="font-medium">Time:</span> {format(new Date(notification.timestamp), 'dd MMM yyyy HH:mm')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {notification.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => sendNotification(notification.id)}
                              disabled={notification.attempts >= notification.maxAttempts}
                            >
                              <Phone className="h-4 w-4 mr-2" />
                              Call
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => sendNotification(notification.id)}
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              SMS
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => sendNotification(notification.id)}
                              className={notification.priority === 'high' ? 'bg-red-600 hover:bg-red-700' : ''}
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Send
                            </Button>
                          </>
                        )}
                        
                        {notification.status === 'sent' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsAcknowledged(notification.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark Read
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => dismissNotification(notification.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Notification Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Templates</CardTitle>
          <CardDescription>Standard templates for different notification types</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Critical Result Template</h4>
              <div className="text-sm bg-red-50 p-3 rounded border-l-4 border-red-400">
                "URGENT: Critical lab result for [PATIENT_NAME]. [TEST_NAME]: [VALUE] [UNIT] (Ref: [REF_RANGE]). 
                Immediate attention required. Contact lab at [LAB_PHONE] for details."
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Report Ready Template</h4>
              <div className="text-sm bg-blue-50 p-3 rounded border-l-4 border-blue-400">
                "Lab report ready for [PATIENT_NAME]. [TEST_NAME] completed on [DATE]. 
                View report at [PORTAL_LINK] or contact lab for copy."
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Sample Issue Template</h4>
              <div className="text-sm bg-amber-50 p-3 rounded border-l-4 border-amber-400">
                "Sample collection issue for [PATIENT_NAME]. [ISSUE_DESCRIPTION]. 
                Please arrange repeat sample collection. Contact lab for guidance."
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Equipment Alert Template</h4>
              <div className="text-sm bg-purple-50 p-3 rounded border-l-4 border-purple-400">
                "Lab equipment alert: [EQUIPMENT_NAME] requires attention. 
                Potential impact on test processing times. Alternative arrangements may be needed."
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}