'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Users,
  Award,
  Clock,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Plus,
  Filter,
} from 'lucide-react';
import { CSRVolunteer } from '@/types/csr';

interface VolunteerCardProps {
  volunteer: CSRVolunteer;
  onViewDetails: (volunteerId: string) => void;
  onAssignEvent: (volunteerId: string) => void;
  onContact: (volunteer: CSRVolunteer) => void;
}

const VolunteerCard: React.FC<VolunteerCardProps> = ({
  volunteer,
  onViewDetails,
  onAssignEvent,
  onContact,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSkillIcon = (skill: string) => {
    const skillIcons: { [key: string]: string } = {
      'Medical': '🏥',
      'Teaching': '📚',
      'Counseling': '💬',
      'First Aid': '🚑',
      'Event Management': '📋',
      'Social Work': '🤝',
      'Nursing': '💉',
      'Translation': '🌐',
    };
    return skillIcons[skill] || '🎯';
  };

  const initials = `${volunteer.firstName[0]}${volunteer.lastName[0]}`.toUpperCase();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {volunteer.firstName} {volunteer.lastName}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(volunteer.status)}>
                  {volunteer.status.toUpperCase()}
                </Badge>
                {volunteer.rating && (
                  <div className="flex items-center text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm ml-1">{volunteer.rating}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Contact Info */}
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex items-center">
              <Phone className="w-4 h-4 mr-2" />
              {volunteer.phone}
            </div>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2" />
              {volunteer.email}
            </div>
            {volunteer.address && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {volunteer.address.split(',')[0]}
              </div>
            )}
          </div>

          {/* Skills */}
          {volunteer.skills && volunteer.skills.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-700 mb-1">Skills</p>
              <div className="flex flex-wrap gap-1">
                {volunteer.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                    {getSkillIcon(skill)} {skill}
                  </span>
                ))}
                {volunteer.skills.length > 3 && (
                  <span className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded-full">
                    +{volunteer.skills.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Availability */}
          {volunteer.availability && volunteer.availability.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-700 mb-1">Available</p>
              <div className="flex flex-wrap gap-1">
                {volunteer.availability.map((day, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {day}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t text-center">
            <div>
              <p className="text-xs text-gray-500">Hours</p>
              <p className="font-semibold">{volunteer.totalHours || 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Events</p>
              <p className="font-semibold">{volunteer.eventsParticipated || 0}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Since</p>
              <p className="font-semibold">
                {new Date(volunteer.joinedDate).getFullYear()}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onViewDetails(volunteer.volunteerId)}
              className="flex-1"
            >
              View Profile
            </Button>
            <Button
              size="sm"
              variant="default"
              onClick={() => onAssignEvent(volunteer.volunteerId)}
              className="flex-1"
            >
              Assign Event
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const VolunteerManagementDashboard: React.FC = () => {
  const [volunteers, setVolunteers] = useState<CSRVolunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('active');

  useEffect(() => {
    fetchVolunteers();
  }, [selectedTab]);

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/csr/volunteers?${selectedTab !== 'all' ? `status=${selectedTab}` : ''}`
      );
      const data = await response.json();
      
      if (data.data) {
        setVolunteers(data.data);
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (volunteerId: string) => {
    console.log('View volunteer details:', volunteerId);
    // Navigate to volunteer profile
  };

  const handleAssignEvent = (volunteerId: string) => {
    console.log('Assign event to volunteer:', volunteerId);
    // Open event assignment dialog
  };

  const handleContact = (volunteer: CSRVolunteer) => {
    console.log('Contact volunteer:', volunteer);
    // Open contact dialog
  };

  const getTabCounts = () => {
    return {
      active: volunteers.filter(v => v.status === 'active').length,
      pending: volunteers.filter(v => v.status === 'pending').length,
      inactive: volunteers.filter(v => v.status === 'inactive').length,
      all: volunteers.length,
    };
  };

  const tabCounts = getTabCounts();

  const getTotalHours = () => {
    return volunteers.reduce((sum, volunteer) => sum + (volunteer.totalHours || 0), 0);
  };

  const getAverageRating = () => {
    const rated = volunteers.filter(v => v.rating);
    if (rated.length === 0) return 0;
    const total = rated.reduce((sum, v) => sum + (v.rating || 0), 0);
    return (total / rated.length).toFixed(1);
  };

  const getTopVolunteers = () => {
    return volunteers
      .filter(v => v.status === 'active')
      .sort((a, b) => (b.totalHours || 0) - (a.totalHours || 0))
      .slice(0, 3);
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
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Volunteer Management</h2>
          <p className="text-gray-600">Recruit and manage CSR volunteers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Volunteer
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Volunteers</p>
                <p className="text-2xl font-bold">{volunteers.length}</p>
                <p className="text-sm text-green-600 flex items-center mt-1">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12 this month
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold">{getTotalHours().toLocaleString()}</p>
                <p className="text-sm text-purple-600">
                  Worth ₹{(getTotalHours() * 200).toLocaleString()}
                </p>
              </div>
              <Clock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Now</p>
                <p className="text-2xl font-bold">{tabCounts.active}</p>
                <p className="text-sm text-blue-600">
                  {Math.round((tabCounts.active / volunteers.length) * 100)}% of total
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">{getAverageRating()}/5</p>
                <div className="flex items-center mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(parseFloat(getAverageRating()))
                          ? 'text-yellow-500 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Volunteers */}
      {getTopVolunteers().length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Top Volunteers This Month</CardTitle>
            <CardDescription>Most active volunteers by hours contributed</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getTopVolunteers().map((volunteer, index) => (
                <div key={volunteer.volunteerId} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold
                      ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-500'}`}>
                      {index + 1}
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {volunteer.firstName[0]}{volunteer.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{volunteer.firstName} {volunteer.lastName}</p>
                      <p className="text-sm text-gray-600">{volunteer.totalHours} hours</p>
                    </div>
                  </div>
                  <Award className={`w-5 h-5 ${
                    index === 0 ? 'text-yellow-500' : index === 1 ? 'text-gray-400' : 'text-orange-500'
                  }`} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Volunteers Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="active">
            Active ({tabCounts.active})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({tabCounts.pending})
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inactive ({tabCounts.inactive})
          </TabsTrigger>
          <TabsTrigger value="all">
            All ({tabCounts.all})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {volunteers.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="w-12 h-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900">No volunteers found</p>
                <p className="text-gray-500 mb-4">Start recruiting volunteers for your CSR programs</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Volunteer
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {volunteers.map((volunteer) => (
                <VolunteerCard
                  key={volunteer.volunteerId}
                  volunteer={volunteer}
                  onViewDetails={handleViewDetails}
                  onAssignEvent={handleAssignEvent}
                  onContact={handleContact}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VolunteerManagementDashboard;