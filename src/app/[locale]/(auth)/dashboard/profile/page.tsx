'use client';

import { useUser } from '@clerk/nextjs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Building, 
  Calendar, 
  Mail, 
  MapPin, 
  Phone, 
  Shield, 
  User,
  Edit,
  Save,
  X
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';

export default function ProfilePage() {
  const { user } = useUser();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.emailAddresses?.[0]?.emailAddress || '',
    phone: '+91 98765 43210',
    department: 'General Services',
    employeeId: 'EMP001234',
    designation: 'Support Staff',
    joinDate: '2022-01-15',
    address: '123, MG Road, Bangalore, Karnataka 560001',
    emergencyContact: 'Family Member - +91 87654 32109',
    bloodGroup: 'O+',
    allergies: 'None',
  });

  const handleSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully",
    });
    setIsEditing(false);
  };

  const userRole = (user?.publicMetadata?.role as string) || 'Support-Staff';
  const initials = `${user?.firstName?.[0] || ''}${user?.lastName?.[0] || ''}`.toUpperCase();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences</p>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? (
            <>
              <Save className="mr-2 size-4" />
              Save Changes
            </>
          ) : (
            <>
              <Edit className="mr-2 size-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      {/* Profile Overview */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Avatar className="size-20">
              <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-semibold">{profileData.firstName} {profileData.lastName}</h2>
              <p className="text-muted-foreground">{profileData.designation}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{userRole.replace('-', ' ')}</Badge>
                <Badge variant="outline">ID: {profileData.employeeId}</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Details */}
      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="personal">Personal Info</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="medical">Medical Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="personal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Your personal details and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex items-center space-x-2">
                    <Mail className="size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex items-center space-x-2">
                    <Phone className="size-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <Label htmlFor="address">Address</Label>
                <div className="flex items-start space-x-2">
                  <MapPin className="size-4 text-muted-foreground mt-2" />
                  <Input
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                    disabled={!isEditing}
                    className="flex-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="emergency">Emergency Contact</Label>
                <Input
                  id="emergency"
                  value={profileData.emergencyContact}
                  onChange={(e) => setProfileData({...profileData, emergencyContact: e.target.value})}
                  disabled={!isEditing}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="professional" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>Your employment details and department information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>Employee ID</Label>
                  <div className="flex items-center space-x-2">
                    <User className="size-4 text-muted-foreground" />
                    <Input value={profileData.employeeId} disabled />
                  </div>
                </div>
                <div>
                  <Label>Department</Label>
                  <div className="flex items-center space-x-2">
                    <Building className="size-4 text-muted-foreground" />
                    <Input value={profileData.department} disabled />
                  </div>
                </div>
                <div>
                  <Label>Designation</Label>
                  <Input value={profileData.designation} disabled />
                </div>
                <div>
                  <Label>Join Date</Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="size-4 text-muted-foreground" />
                    <Input value={profileData.joinDate} disabled />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-3">Work Schedule</h4>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Monday - Friday: 9:00 AM - 6:00 PM
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Saturday: 9:00 AM - 1:00 PM
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Sunday: Off
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="medical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medical Information</CardTitle>
              <CardDescription>Your medical details for emergency purposes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Input
                    id="bloodGroup"
                    value={profileData.bloodGroup}
                    onChange={(e) => setProfileData({...profileData, bloodGroup: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="allergies">Known Allergies</Label>
                  <Input
                    id="allergies"
                    value={profileData.allergies}
                    onChange={(e) => setProfileData({...profileData, allergies: e.target.value})}
                    disabled={!isEditing}
                  />
                </div>
              </div>

              <div className="rounded-lg bg-muted p-4">
                <div className="flex items-center space-x-2">
                  <Shield className="size-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    This information is kept confidential and is only used in case of medical emergencies.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security and access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                  <Badge variant="outline">Enabled</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Last Password Change</p>
                    <p className="text-sm text-muted-foreground">30 days ago</p>
                  </div>
                  <Button variant="outline" size="sm">Change Password</Button>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Active Sessions</p>
                    <p className="text-sm text-muted-foreground">2 devices logged in</p>
                  </div>
                  <Button variant="outline" size="sm">View Sessions</Button>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="text-sm font-medium mb-3">Login Activity</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Today, 9:00 AM</span>
                    <span>Windows PC - Chrome</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Yesterday, 2:30 PM</span>
                    <span>Android - Hospital App</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {isEditing && (
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            <X className="mr-2 size-4" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 size-4" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}