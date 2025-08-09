'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Trophy,
  Medal,
  Award,
  TrendingUp,
  TrendingDown,
  Users,
  IndianRupee,
  Calendar,
  Search,
  Filter,
  Download,
  Send,
  Gift,
  Star,
  Phone,
  Mail,
  ChevronUp,
  ChevronDown,
  Minus,
} from 'lucide-react';
import { generateReferrerProfiles, type ReferrerProfile } from '@/lib/demo/analyticsData';
import { toast } from '@/components/ui/use-toast';

const ReferrerLeaderboard: React.FC = () => {
  const [referrers, setReferrers] = useState<ReferrerProfile[]>([]);
  const [filteredReferrers, setFilteredReferrers] = useState<ReferrerProfile[]>([]);
  const [selectedReferrer, setSelectedReferrer] = useState<ReferrerProfile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'revenue' | 'referrals' | 'conversion' | 'recent'>('revenue');
  const [timeRange, setTimeRange] = useState('all');
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  useEffect(() => {
    // Load demo data
    const data = generateReferrerProfiles();
    setReferrers(data);
    setFilteredReferrers(data);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...referrers];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(r => 
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.organization?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(r => r.type === typeFilter);
    }

    // Time range filter
    if (timeRange !== 'all') {
      const now = Date.now();
      const ranges: Record<string, number> = {
        '7days': 7 * 24 * 60 * 60 * 1000,
        '30days': 30 * 24 * 60 * 60 * 1000,
        '90days': 90 * 24 * 60 * 60 * 1000,
      };
      
      if (ranges[timeRange]) {
        filtered = filtered.filter(r => 
          r.lastReferralDate.getTime() > now - ranges[timeRange]
        );
      }
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'revenue':
          return b.totalRevenue - a.totalRevenue;
        case 'referrals':
          return b.totalReferrals - a.totalReferrals;
        case 'conversion':
          return b.conversionRate - a.conversionRate;
        case 'recent':
          return b.lastReferralDate.getTime() - a.lastReferralDate.getTime();
        default:
          return 0;
      }
    });

    setFilteredReferrers(filtered);
  }, [searchTerm, typeFilter, sortBy, timeRange, referrers]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="size-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="size-5 text-gray-400" />;
    if (rank === 3) return <Medal className="size-5 text-orange-600" />;
    return <span className="text-sm font-medium text-muted-foreground">#{rank}</span>;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <ChevronUp className="size-4 text-green-600" />;
    if (trend === 'down') return <ChevronDown className="size-4 text-red-600" />;
    return <Minus className="size-4 text-gray-400" />;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Doctor': return '👨‍⚕️';
      case 'Patient': return '👤';
      case 'Corporate': return '🏢';
      case 'Insurance': return '🛡️';
      case 'HealthCamp': return '⛺';
      default: return '👥';
    }
  };

  const handleSendReward = (referrer: ReferrerProfile) => {
    toast({
      title: 'Reward Sent',
      description: `Incentive of ₹${referrer.incentivesDue.toLocaleString()} sent to ${referrer.name}`,
    });
  };

  const handleContactReferrer = (referrer: ReferrerProfile, method: 'phone' | 'email') => {
    if (method === 'phone') {
      window.location.href = `tel:${referrer.contactNumber}`;
    } else {
      window.location.href = `mailto:${referrer.email}`;
    }
  };

  const handleExportLeaderboard = () => {
    toast({
      title: 'Export Started',
      description: 'Downloading referrer leaderboard report...',
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Referrer Leaderboard</CardTitle>
          <CardDescription>Top performing referrers ranked by contribution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search referrers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Doctor">Doctors</SelectItem>
                  <SelectItem value="Patient">Patients</SelectItem>
                  <SelectItem value="Corporate">Corporates</SelectItem>
                  <SelectItem value="Insurance">Insurance</SelectItem>
                </SelectContent>
              </Select>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7days">Last 7 Days</SelectItem>
                  <SelectItem value="30days">Last 30 Days</SelectItem>
                  <SelectItem value="90days">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">By Revenue</SelectItem>
                  <SelectItem value="referrals">By Referrals</SelectItem>
                  <SelectItem value="conversion">By Conversion</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleExportLeaderboard}>
                <Download className="mr-2 size-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Top 3 Referrers */}
          <div className="grid gap-4 md:grid-cols-3 mb-6">
            {filteredReferrers.slice(0, 3).map((referrer, index) => (
              <Card 
                key={referrer.id} 
                className={`cursor-pointer hover:shadow-lg transition-shadow ${
                  index === 0 ? 'border-yellow-500 bg-yellow-50/50' :
                  index === 1 ? 'border-gray-400 bg-gray-50/50' :
                  'border-orange-600 bg-orange-50/50'
                }`}
                onClick={() => {
                  setSelectedReferrer(referrer);
                  setShowDetailsDialog(true);
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getRankIcon(index + 1)}
                      <Avatar className="size-10">
                        <AvatarFallback>
                          {getTypeIcon(referrer.type)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    {getTrendIcon(referrer.trend)}
                  </div>
                  <h4 className="font-semibold mb-1">{referrer.name}</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    {referrer.specialty || referrer.organization || referrer.type}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Revenue</span>
                      <span className="font-medium">₹{(referrer.totalRevenue / 100000).toFixed(1)}L</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Referrals</span>
                      <span className="font-medium">{referrer.totalReferrals}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Conversion</span>
                      <span className="font-medium">{referrer.conversionRate.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center mt-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-3 ${
                          i < Math.floor(referrer.rating) 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-xs text-muted-foreground">
                      {referrer.rating.toFixed(1)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Full Leaderboard Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Rank</TableHead>
                  <TableHead>Referrer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-center">Referrals</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                  <TableHead className="text-center">Conversion</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-center">Trend</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReferrers.slice(3, 20).map((referrer, index) => (
                  <TableRow 
                    key={referrer.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => {
                      setSelectedReferrer(referrer);
                      setShowDetailsDialog(true);
                    }}
                  >
                    <TableCell className="font-medium">
                      {index + 4}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback className="text-xs">
                            {getTypeIcon(referrer.type)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{referrer.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {referrer.specialty || referrer.organization}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{referrer.type}</Badge>
                    </TableCell>
                    <TableCell className="text-center">{referrer.totalReferrals}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary">{referrer.activeReferrals}</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="font-medium">{referrer.conversionRate.toFixed(1)}%</span>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{(referrer.totalRevenue / 100000).toFixed(1)}L
                    </TableCell>
                    <TableCell className="text-center">
                      {getTrendIcon(referrer.trend)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContactReferrer(referrer, 'phone');
                          }}
                        >
                          <Phone className="size-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-8"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContactReferrer(referrer, 'email');
                          }}
                        >
                          <Mail className="size-3" />
                        </Button>
                        {referrer.incentivesDue > 0 && (
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSendReward(referrer);
                            }}
                          >
                            <Gift className="size-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Referrer Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedReferrer && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarFallback>{getTypeIcon(selectedReferrer.type)}</AvatarFallback>
                  </Avatar>
                  {selectedReferrer.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedReferrer.specialty || selectedReferrer.organization || selectedReferrer.type} • 
                  Member since {selectedReferrer.joinedDate.toLocaleDateString()}
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="overview" className="mt-6">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="history">Referral History</TabsTrigger>
                  <TabsTrigger value="incentives">Incentives</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Total Referrals</span>
                          <span className="font-medium">{selectedReferrer.totalReferrals}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Active Referrals</span>
                          <Badge>{selectedReferrer.activeReferrals}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Conversion Rate</span>
                          <span className="font-medium">{selectedReferrer.conversionRate.toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Avg Patient Value</span>
                          <span className="font-medium">₹{selectedReferrer.avgPatientValue.toLocaleString()}</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">Contact Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Phone</span>
                          <span className="font-medium">{selectedReferrer.contactNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Email</span>
                          <span className="font-medium text-xs">{selectedReferrer.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Last Referral</span>
                          <span className="font-medium">
                            {selectedReferrer.lastReferralDate.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Rating</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`size-3 ${
                                  i < Math.floor(selectedReferrer.rating) 
                                    ? 'fill-yellow-400 text-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="ml-1 text-sm">{selectedReferrer.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Financial Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold">₹{(selectedReferrer.totalRevenue / 100000).toFixed(1)}L</p>
                          <p className="text-xs text-muted-foreground">Total Revenue</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold">₹{selectedReferrer.incentivesPaid.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Incentives Paid</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-600">₹{selectedReferrer.incentivesDue.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Pending Incentives</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Recent Referrals</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedReferrer.referralHistory.map((referral) => (
                          <div key={referral.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{referral.patientName}</p>
                              <p className="text-sm text-muted-foreground">
                                {referral.department} • {referral.referralDate.toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge
                                variant={
                                  referral.status === 'completed' ? 'default' :
                                  referral.status === 'scheduled' ? 'secondary' :
                                  referral.status === 'cancelled' ? 'destructive' :
                                  'outline'
                                }
                              >
                                {referral.status}
                              </Badge>
                              {referral.revenue && (
                                <p className="text-sm font-medium mt-1">
                                  ₹{referral.revenue.toLocaleString()}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="incentives" className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base">Incentive Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Pending Amount</span>
                          <span className="text-2xl font-bold text-green-600">
                            ₹{selectedReferrer.incentivesDue.toLocaleString()}
                          </span>
                        </div>
                        <Button className="w-full" onClick={() => handleSendReward(selectedReferrer)}>
                          <Gift className="mr-2 size-4" />
                          Process Payment
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium">Payment History</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Total Paid</span>
                            <span className="font-medium">₹{selectedReferrer.incentivesPaid.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Last Payment</span>
                            <span className="font-medium">
                              {new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Payment Method</span>
                            <span className="font-medium">Bank Transfer</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReferrerLeaderboard;