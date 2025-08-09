'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Plus,
  Edit,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Award,
  Filter,
} from 'lucide-react';
import { CSREvent } from '@/types/csr';
import { format } from 'date-fns';

// Extend CSREvent type for demo display
interface CSREventExtended extends CSREvent {
  eventStatus?: string;
  eventType?: string;
  description?: string;
  venueName?: string;
  requirements?: string[];
}

interface EventCardProps {
  event: CSREventExtended;
  onEdit: (event: CSREventExtended) => void;
  onViewDetails: (eventId: string) => void;
  onManageRegistrations: (eventId: string) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  onEdit,
  onViewDetails,
  onManageRegistrations,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'health_camp': return '🏥';
      case 'vaccination_drive': return '💉';
      case 'screening': return '🔍';
      case 'workshop': return '📚';
      case 'blood_donation': return '🩸';
      default: return '📅';
    }
  };

  const registrationPercentage = event.maxParticipants 
    ? Math.round((event.registeredCount / event.maxParticipants) * 100)
    : 0;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{getEventTypeIcon(event.eventType)}</span>
              <div>
                <CardTitle className="text-lg">{event.eventName}</CardTitle>
                {event.eventStatus && (
                  <Badge className={getStatusColor(event.eventStatus)}>
                    {event.eventStatus.toUpperCase()}
                  </Badge>
                )}
              </div>
            </div>
            <CardDescription>{event.description}</CardDescription>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(event)}
          >
            <Edit className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Event Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="w-4 h-4 mr-2" />
              {format(new Date(event.eventDate), 'MMM dd, yyyy')}
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-2" />
              {event.startTime} - {event.endTime}
            </div>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-4 h-4 mr-2" />
              {event.venueName || 'TBD'}
            </div>
            <div className="flex items-center text-gray-600">
              <Users className="w-4 h-4 mr-2" />
              {event.registeredCount}/{event.maxParticipants || '∞'}
            </div>
          </div>

          {/* Registration Progress */}
          {event.maxParticipants && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span>Registration Progress</span>
                <span>{registrationPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    registrationPercentage >= 90 ? 'bg-red-500' :
                    registrationPercentage >= 70 ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${registrationPercentage}%` }}
                />
              </div>
            </div>
          )}

          {/* Requirements */}
          {event.requirements && event.requirements.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {event.requirements.slice(0, 3).map((req, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {req}
                </Badge>
              ))}
              {event.requirements.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{event.requirements.length - 3} more
                </Badge>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(event.eventId)}
              className="flex-1"
            >
              View Details
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => onManageRegistrations(event.eventId)}
              className="flex-1"
            >
              Registrations
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const EventManagementDashboard: React.FC = () => {
  // Demo data for CSR events
  const demoEvents: CSREventExtended[] = [
    {
      eventId: 'EVT-2024-001',
      programId: 'PRG-001',
      eventName: 'Free Eye Check-up Camp - Dharavi',
      eventDate: new Date('2024-12-28'),
      startTime: '09:00',
      endTime: '17:00',
      maxParticipants: 500,
      registeredCount: 423,
      attendedCount: 0,
      activities: [
        { name: 'Eye Screening', duration: 30, facilitator: 'Dr. Arun Sharma' },
        { name: 'Cataract Detection', duration: 45, facilitator: 'Dr. Priya Mehta' },
        { name: 'Free Spectacles Distribution', duration: 15, facilitator: 'NGO Team' }
      ],
      teamMembers: ['Dr. Arun Sharma', 'Dr. Priya Mehta', 'Nurse Anjali'],
      volunteers: ['Raj Kumar', 'Sunita Patel', 'Mohammed Khan'],
      status: 'scheduled',
      eventStatus: 'scheduled',
      eventType: 'screening',
      description: 'Comprehensive eye care camp for underprivileged communities',
      venueName: 'Dharavi Community Center',
      requirements: ['Eye testing equipment', 'Free spectacles', 'Medicines', 'Registration desk'],
      createdAt: new Date()
    },
    {
      eventId: 'EVT-2024-002',
      programId: 'PRG-002',
      eventName: 'Polio Vaccination Drive - Phase 2',
      eventDate: new Date('2024-12-26'),
      startTime: '08:00',
      endTime: '18:00',
      maxParticipants: 1000,
      registeredCount: 856,
      attendedCount: 412,
      activities: [
        { name: 'Polio Drops Administration', duration: 5, facilitator: 'Healthcare Workers' },
        { name: 'Health Education', duration: 15, facilitator: 'Community Educators' }
      ],
      teamMembers: ['Dr. Rajesh Verma', 'Nurse Fatima', 'Nurse Geeta'],
      volunteers: ['Youth Volunteers Group'],
      status: 'in_progress',
      eventStatus: 'ongoing',
      eventType: 'vaccination_drive',
      description: 'Door-to-door polio vaccination for children under 5 years',
      venueName: 'Multiple locations in Mumbai',
      requirements: ['Polio vaccines', 'Cold chain storage', 'Vehicles', 'Volunteers'],
      createdAt: new Date()
    },
    {
      eventId: 'EVT-2024-003',
      programId: 'PRG-003',
      eventName: 'Blood Donation Drive - Save Lives',
      eventDate: new Date('2024-12-30'),
      startTime: '10:00',
      endTime: '16:00',
      maxParticipants: 200,
      registeredCount: 178,
      attendedCount: 0,
      activities: [
        { name: 'Donor Registration', duration: 10, facilitator: 'Registration Team' },
        { name: 'Health Screening', duration: 15, facilitator: 'Medical Team' },
        { name: 'Blood Collection', duration: 20, facilitator: 'Blood Bank Team' },
        { name: 'Post-donation Care', duration: 30, facilitator: 'Nursing Team' }
      ],
      teamMembers: ['Dr. Sanjay Gupta', 'Blood Bank Team'],
      volunteers: ['Red Cross Volunteers'],
      status: 'scheduled',
      eventStatus: 'scheduled',
      eventType: 'blood_donation',
      description: 'Voluntary blood donation camp in collaboration with Red Cross',
      venueName: 'Hospital Main Auditorium',
      requirements: ['Blood collection units', 'Refreshments', 'Donor beds', 'Medical supplies'],
      createdAt: new Date()
    },
    {
      eventId: 'EVT-2024-004',
      programId: 'PRG-004',
      eventName: 'Diabetes Screening Camp - Andheri',
      eventDate: new Date('2024-12-22'),
      startTime: '09:00',
      endTime: '14:00',
      maxParticipants: 300,
      registeredCount: 289,
      attendedCount: 276,
      activities: [
        { name: 'Blood Sugar Testing', duration: 10, facilitator: 'Lab Technicians' },
        { name: 'HbA1c Testing', duration: 15, facilitator: 'Lab Team' },
        { name: 'Diet Counseling', duration: 20, facilitator: 'Nutritionists' },
        { name: 'Medicine Distribution', duration: 10, facilitator: 'Pharmacy Team' }
      ],
      teamMembers: ['Dr. Meera Shah', 'Dietician Kavita'],
      volunteers: ['Lions Club Members'],
      status: 'completed',
      eventStatus: 'completed',
      eventType: 'screening',
      description: 'Free diabetes screening and awareness for senior citizens',
      venueName: 'Andheri Sports Complex',
      requirements: ['Glucometers', 'Test strips', 'HbA1c kits', 'Educational materials'],
      createdAt: new Date()
    },
    {
      eventId: 'EVT-2024-005',
      programId: 'PRG-005',
      eventName: 'Mental Health Awareness Workshop',
      eventDate: new Date('2025-01-02'),
      startTime: '14:00',
      endTime: '17:00',
      maxParticipants: 100,
      registeredCount: 67,
      attendedCount: 0,
      activities: [
        { name: 'Stress Management Techniques', duration: 45, facilitator: 'Dr. Anita Desai' },
        { name: 'Meditation Session', duration: 30, facilitator: 'Yoga Instructor' },
        { name: 'Q&A Session', duration: 30, facilitator: 'Mental Health Team' }
      ],
      teamMembers: ['Dr. Anita Desai', 'Counselor Ravi'],
      volunteers: ['Psychology Students'],
      status: 'scheduled',
      eventStatus: 'scheduled',
      eventType: 'workshop',
      description: 'Breaking stigma around mental health in communities',
      venueName: 'Hospital Conference Hall',
      requirements: ['Projector', 'Yoga mats', 'Information booklets', 'Refreshments'],
      createdAt: new Date()
    },
    {
      eventId: 'EVT-2024-006',
      programId: 'PRG-006',
      eventName: 'Pediatric Health Camp - Slum Areas',
      eventDate: new Date('2024-12-20'),
      startTime: '09:00',
      endTime: '15:00',
      maxParticipants: 400,
      registeredCount: 387,
      attendedCount: 362,
      activities: [
        { name: 'Growth Monitoring', duration: 15, facilitator: 'Pediatric Team' },
        { name: 'Immunization', duration: 10, facilitator: 'Nursing Staff' },
        { name: 'Nutrition Assessment', duration: 20, facilitator: 'Nutritionists' },
        { name: 'Deworming', duration: 5, facilitator: 'Medical Team' }
      ],
      teamMembers: ['Dr. Kavita Joshi', 'Dr. Suresh Kumar'],
      volunteers: ['Medical Students', 'NGO Workers'],
      status: 'completed',
      eventStatus: 'completed',
      eventType: 'health_camp',
      description: 'Comprehensive pediatric care for underprivileged children',
      venueName: 'Mobile Health Van - Multiple Locations',
      requirements: ['Vaccines', 'Growth charts', 'Medicines', 'Mobile van'],
      createdAt: new Date()
    },
    {
      eventId: 'EVT-2024-007',
      programId: 'PRG-007',
      eventName: 'Cancer Screening Camp for Women',
      eventDate: new Date('2024-12-29'),
      startTime: '08:00',
      endTime: '14:00',
      maxParticipants: 150,
      registeredCount: 134,
      attendedCount: 0,
      activities: [
        { name: 'Breast Cancer Screening', duration: 30, facilitator: 'Dr. Rashmi Patel' },
        { name: 'Cervical Cancer Screening', duration: 30, facilitator: 'Gynecology Team' },
        { name: 'Health Education', duration: 45, facilitator: 'Health Educators' }
      ],
      teamMembers: ['Dr. Rashmi Patel', 'Dr. Sneha Rao'],
      volunteers: ['Women\'s Self Help Groups'],
      status: 'scheduled',
      eventStatus: 'scheduled',
      eventType: 'screening',
      description: 'Early detection saves lives - Free cancer screening for women',
      venueName: 'Primary Health Center, Bandra',
      requirements: ['Screening equipment', 'Privacy screens', 'Female staff', 'Educational materials'],
      createdAt: new Date()
    },
    {
      eventId: 'EVT-2024-008',
      programId: 'PRG-008',
      eventName: 'Senior Citizen Health Check-up',
      eventDate: new Date('2024-12-27'),
      startTime: '09:00',
      endTime: '13:00',
      maxParticipants: 200,
      registeredCount: 189,
      attendedCount: 0,
      activities: [
        { name: 'General Health Check-up', duration: 30, facilitator: 'Medical Team' },
        { name: 'ECG & Blood Tests', duration: 20, facilitator: 'Diagnostic Team' },
        { name: 'Physiotherapy Assessment', duration: 25, facilitator: 'Physiotherapists' }
      ],
      teamMembers: ['Dr. Ashok Mehta', 'Physiotherapist Team'],
      volunteers: ['Rotary Club Members'],
      status: 'scheduled',
      eventStatus: 'scheduled',
      eventType: 'health_camp',
      description: 'Comprehensive health check-up for senior citizens above 60 years',
      venueName: 'Rotary Club Hall, Juhu',
      requirements: ['ECG machines', 'Blood test kits', 'BP monitors', 'Medicines'],
      createdAt: new Date()
    }
  ];

  const [events, setEvents] = useState<CSREventExtended[]>(demoEvents);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('upcoming');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // Filter events based on selected tab, search term, and type
    filterEvents();
  }, [selectedTab, searchTerm, filterType]);

  const filterEvents = () => {
    const today = new Date();
    let filtered = demoEvents;
    
    // Filter by tab
    switch(selectedTab) {
      case 'upcoming':
        filtered = demoEvents.filter(e => 
          new Date(e.eventDate) > today && e.eventStatus === 'scheduled'
        );
        break;
      case 'ongoing':
        filtered = demoEvents.filter(e => e.eventStatus === 'ongoing');
        break;
      case 'completed':
        filtered = demoEvents.filter(e => e.eventStatus === 'completed');
        break;
      case 'all':
      default:
        filtered = demoEvents;
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(e => 
        e.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.venueName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by event type
    if (filterType !== 'all') {
      filtered = filtered.filter(e => e.eventType === filterType);
    }
    
    setEvents(filtered);
  };

  const handleEditEvent = (event: CSREventExtended) => {
    console.log('Edit event:', event);
    // Open edit dialog
  };

  const handleViewDetails = (eventId: string) => {
    console.log('View event details:', eventId);
    // Navigate to event details page
  };

  const handleManageRegistrations = (eventId: string) => {
    console.log('Manage registrations for event:', eventId);
    // Open registrations management
  };

  const getTabCounts = () => {
    const today = new Date();
    return {
      upcoming: events.filter(e => new Date(e.eventDate) > today && e.eventStatus === 'scheduled').length,
      ongoing: events.filter(e => e.eventStatus === 'ongoing').length,
      completed: events.filter(e => e.eventStatus === 'completed').length,
      all: events.length,
    };
  };

  const tabCounts = getTabCounts();

  const getTotalRegistrations = () => {
    return demoEvents.reduce((sum, event) => sum + event.registeredCount, 0);
  };

  const getUpcomingThisWeek = () => {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return demoEvents.filter(e => {
      const eventDate = new Date(e.eventDate);
      return eventDate >= today && eventDate <= nextWeek && e.eventStatus === 'scheduled';
    }).length;
  };
  
  const getActiveVolunteers = () => {
    const uniqueVolunteers = new Set();
    demoEvents.forEach(event => {
      event.volunteers.forEach(v => uniqueVolunteers.add(v));
    });
    return uniqueVolunteers.size;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">Event Management</h2>
            <p className="text-gray-600">Organize and track CSR events for community welfare</p>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search events by name, location, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <option value="all">All Types</option>
            <option value="health_camp">Health Camp</option>
            <option value="vaccination_drive">Vaccination Drive</option>
            <option value="screening">Screening Program</option>
            <option value="blood_donation">Blood Donation</option>
            <option value="workshop">Workshop</option>
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold">{demoEvents.length}</p>
                <p className="text-xs text-gray-500 mt-1">This month</p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-2xl font-bold">{getUpcomingThisWeek()}</p>
                <p className="text-xs text-gray-500 mt-1">Upcoming events</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Beneficiaries</p>
                <p className="text-2xl font-bold">{getTotalRegistrations().toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">People registered</p>
              </div>
              <Users className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Volunteers</p>
                <p className="text-2xl font-bold">{getActiveVolunteers()}</p>
                <p className="text-xs text-gray-500 mt-1">Across all events</p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Events Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming">
            Upcoming ({tabCounts.upcoming})
          </TabsTrigger>
          <TabsTrigger value="ongoing">
            Ongoing ({tabCounts.ongoing})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({tabCounts.completed})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({tabCounts.all})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {events.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900">No events found</p>
                <p className="text-gray-500 mb-4">Create your first CSR event</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event) => (
                <EventCard
                  key={event.eventId}
                  event={event}
                  onEdit={handleEditEvent}
                  onViewDetails={handleViewDetails}
                  onManageRegistrations={handleManageRegistrations}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EventManagementDashboard;