'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  MapPin,
  Users,
  TrendingUp,
  IndianRupee,
  Navigation,
  Target,
  Activity,
  Map,
  BarChart3,
  Download,
  RefreshCw,
  Filter,
  Globe,
  Building2,
  Compass,
  Route,
} from 'lucide-react';
import PatientHeatMap from './PatientHeatMap';
import LocationInsights from './LocationInsights';
import MarketPenetration from './MarketPenetration';

interface LocationData {
  area: string;
  pincode: string;
  patients: number;
  revenue: number;
  avgDistance: number;
  growthRate: number;
}

interface CatchmentMetrics {
  primaryCatchment: number; // 0-5km
  secondaryCatchment: number; // 5-15km
  tertiaryCatchment: number; // 15-30km
  beyondCatchment: number; // >30km
}

export default function GeographicalAnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState('30days');
  const [filterType, setFilterType] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [loading, setLoading] = useState(false);
  const [mapView, setMapView] = useState<'heatmap' | 'cluster' | 'route'>('heatmap');

  // Mock data for top locations
  const topLocations: LocationData[] = [
    { area: 'Koramangala', pincode: '560034', patients: 456, revenue: 2850000, avgDistance: 3.2, growthRate: 15.5 },
    { area: 'Indiranagar', pincode: '560038', patients: 389, revenue: 2340000, avgDistance: 4.1, growthRate: 12.3 },
    { area: 'Whitefield', pincode: '560066', patients: 367, revenue: 2180000, avgDistance: 8.5, growthRate: 22.1 },
    { area: 'HSR Layout', pincode: '560102', patients: 334, revenue: 1980000, avgDistance: 5.2, growthRate: 18.7 },
    { area: 'Jayanagar', pincode: '560041', patients: 312, revenue: 1850000, avgDistance: 4.8, growthRate: 8.4 },
    { area: 'BTM Layout', pincode: '560076', patients: 298, revenue: 1720000, avgDistance: 3.9, growthRate: 11.2 },
    { area: 'Marathahalli', pincode: '560037', patients: 276, revenue: 1650000, avgDistance: 7.3, growthRate: 19.8 },
    { area: 'Electronic City', pincode: '560100', patients: 234, revenue: 1450000, avgDistance: 12.4, growthRate: 25.3 },
    { area: 'Bellandur', pincode: '560103', patients: 212, revenue: 1280000, avgDistance: 9.1, growthRate: 21.6 },
    { area: 'JP Nagar', pincode: '560078', patients: 198, revenue: 1150000, avgDistance: 6.7, growthRate: 14.2 },
  ];

  // Catchment area metrics
  const catchmentMetrics: CatchmentMetrics = {
    primaryCatchment: 42, // percentage
    secondaryCatchment: 31,
    tertiaryCatchment: 19,
    beyondCatchment: 8,
  };

  // Service utilization by location
  const serviceUtilization = [
    { service: 'OPD Consultations', koramangala: 234, indiranagar: 189, whitefield: 178, others: 456 },
    { service: 'Diagnostics', koramangala: 156, indiranagar: 134, whitefield: 145, others: 389 },
    { service: 'Emergency', koramangala: 89, indiranagar: 76, whitefield: 45, others: 234 },
    { service: 'Surgery', koramangala: 45, indiranagar: 38, whitefield: 42, others: 156 },
    { service: 'Preventive Care', koramangala: 78, indiranagar: 92, whitefield: 67, others: 289 },
  ];

  // Underserved areas with opportunity scores
  const underservedAreas = [
    { area: 'Yelahanka', population: 125000, currentPatients: 34, potentialPatients: 890, opportunityScore: 92 },
    { area: 'Kengeri', population: 98000, currentPatients: 28, potentialPatients: 678, opportunityScore: 88 },
    { area: 'Banashankari', population: 145000, currentPatients: 67, potentialPatients: 1023, opportunityScore: 85 },
    { area: 'Rajarajeshwari Nagar', population: 87000, currentPatients: 19, potentialPatients: 567, opportunityScore: 83 },
    { area: 'Vidyaranyapura', population: 76000, currentPatients: 23, potentialPatients: 489, opportunityScore: 79 },
  ];

  const handleExportData = () => {
    // Implementation for exporting location analytics data
    console.log('Exporting geographical analytics data...');
  };

  const calculateMarketShare = (patients: number, population: number = 10000) => {
    return ((patients / population) * 100).toFixed(2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Geographical Analytics</h1>
          <p className="text-muted-foreground">
            Patient distribution, catchment analysis, and market opportunities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Districts</SelectItem>
              <SelectItem value="bangalore-urban">Bangalore Urban</SelectItem>
              <SelectItem value="bangalore-rural">Bangalore Rural</SelectItem>
              <SelectItem value="mysore">Mysore</SelectItem>
              <SelectItem value="mandya">Mandya</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Coverage Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">287 km²</div>
            <p className="text-xs text-muted-foreground mt-1">Active patient zones</p>
            <Progress value={68} className="mt-2 h-1" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Pincodes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="mr-1 size-3" />
              +8 new this month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6.8 km</div>
            <p className="text-xs text-muted-foreground mt-1">Patient to hospital</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Market Penetration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="mr-1 size-3" />
              +0.4% from last quarter
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Untapped Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45K</div>
            <p className="text-xs text-muted-foreground mt-1">Estimated patients</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="distribution" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="distribution">Patient Distribution</TabsTrigger>
          <TabsTrigger value="catchment">Catchment Analysis</TabsTrigger>
          <TabsTrigger value="locations">Top Locations</TabsTrigger>
          <TabsTrigger value="opportunities">Market Opportunities</TabsTrigger>
          <TabsTrigger value="insights">Location Insights</TabsTrigger>
        </TabsList>

        {/* Patient Distribution Tab */}
        <TabsContent value="distribution" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Patient Heat Map</CardTitle>
                      <CardDescription>Geographic distribution of patients</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={mapView === 'heatmap' ? 'default' : 'outline'}
                        onClick={() => setMapView('heatmap')}
                      >
                        <Map className="mr-1 size-3" />
                        Heat Map
                      </Button>
                      <Button
                        size="sm"
                        variant={mapView === 'cluster' ? 'default' : 'outline'}
                        onClick={() => setMapView('cluster')}
                      >
                        <Globe className="mr-1 size-3" />
                        Clusters
                      </Button>
                      <Button
                        size="sm"
                        variant={mapView === 'route' ? 'default' : 'outline'}
                        onClick={() => setMapView('route')}
                      >
                        <Route className="mr-1 size-3" />
                        Routes
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <PatientHeatMap viewType={mapView} />
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Distance Distribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>0-5 km (Primary)</span>
                      <span className="font-medium">{catchmentMetrics.primaryCatchment}%</span>
                    </div>
                    <Progress value={catchmentMetrics.primaryCatchment} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>5-15 km (Secondary)</span>
                      <span className="font-medium">{catchmentMetrics.secondaryCatchment}%</span>
                    </div>
                    <Progress value={catchmentMetrics.secondaryCatchment} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>15-30 km (Tertiary)</span>
                      <span className="font-medium">{catchmentMetrics.tertiaryCatchment}%</span>
                    </div>
                    <Progress value={catchmentMetrics.tertiaryCatchment} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>&gt;30 km (Beyond)</span>
                      <span className="font-medium">{catchmentMetrics.beyondCatchment}%</span>
                    </div>
                    <Progress value={catchmentMetrics.beyondCatchment} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Service Reach</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Activity className="size-4 text-blue-500" />
                      <span className="text-sm">Emergency Coverage</span>
                    </div>
                    <Badge>8.5 km</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-green-500" />
                      <span className="text-sm">OPD Reach</span>
                    </div>
                    <Badge>15.2 km</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="size-4 text-purple-500" />
                      <span className="text-sm">Specialty Services</span>
                    </div>
                    <Badge>22.8 km</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Navigation className="size-4 text-orange-500" />
                      <span className="text-sm">Health Camps</span>
                    </div>
                    <Badge>35.4 km</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Catchment Analysis Tab */}
        <TabsContent value="catchment" className="space-y-4">
          <LocationInsights />
        </TabsContent>

        {/* Top Locations Tab */}
        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Patient Locations</CardTitle>
              <CardDescription>Areas contributing most to patient volume and revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topLocations.map((location, index) => (
                  <div key={location.pincode} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{location.area}</span>
                          <Badge variant="outline" className="text-xs">
                            {location.pincode}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{location.patients} patients</span>
                          <span>•</span>
                          <span>{location.avgDistance} km avg</span>
                          <span>•</span>
                          <span className="text-green-600">+{location.growthRate}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">₹{(location.revenue / 100000).toFixed(1)}L</div>
                      <div className="text-xs text-muted-foreground">Revenue</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Market Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-4">
          <MarketPenetration />
          
          <Card>
            <CardHeader>
              <CardTitle>Underserved Areas</CardTitle>
              <CardDescription>High-potential areas with low current penetration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {underservedAreas.map((area) => (
                  <div key={area.area} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{area.area}</h4>
                        <p className="text-sm text-muted-foreground">
                          Population: {area.population.toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge className="bg-green-100 text-green-800">
                          Opportunity Score: {area.opportunityScore}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      <div>
                        <p className="text-xs text-muted-foreground">Current Patients</p>
                        <p className="font-medium">{area.currentPatients}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Potential Patients</p>
                        <p className="font-medium text-green-600">{area.potentialPatients}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Market Share</p>
                        <p className="font-medium">{calculateMarketShare(area.currentPatients, area.population)}%</p>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline">
                        <Target className="mr-1 size-3" />
                        Plan Campaign
                      </Button>
                      <Button size="sm" variant="outline">
                        <MapPin className="mr-1 size-3" />
                        Schedule Camp
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Location Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Service Utilization by Area</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {serviceUtilization.map((service) => (
                    <div key={service.service} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{service.service}</span>
                        <span className="text-muted-foreground">
                          {service.koramangala + service.indiranagar + service.whitefield + service.others} total
                        </span>
                      </div>
                      <div className="flex gap-1 h-8">
                        <div 
                          className="bg-blue-500 rounded-sm flex items-center justify-center text-xs text-white"
                          style={{ width: `${(service.koramangala / (service.koramangala + service.indiranagar + service.whitefield + service.others)) * 100}%` }}
                        >
                          {service.koramangala}
                        </div>
                        <div 
                          className="bg-green-500 rounded-sm flex items-center justify-center text-xs text-white"
                          style={{ width: `${(service.indiranagar / (service.koramangala + service.indiranagar + service.whitefield + service.others)) * 100}%` }}
                        >
                          {service.indiranagar}
                        </div>
                        <div 
                          className="bg-purple-500 rounded-sm flex items-center justify-center text-xs text-white"
                          style={{ width: `${(service.whitefield / (service.koramangala + service.indiranagar + service.whitefield + service.others)) * 100}%` }}
                        >
                          {service.whitefield}
                        </div>
                        <div 
                          className="bg-gray-500 rounded-sm flex items-center justify-center text-xs text-white"
                          style={{ width: `${(service.others / (service.koramangala + service.indiranagar + service.whitefield + service.others)) * 100}%` }}
                        >
                          {service.others}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                    <span>Koramangala</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-sm" />
                    <span>Indiranagar</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-purple-500 rounded-sm" />
                    <span>Whitefield</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-gray-500 rounded-sm" />
                    <span>Others</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Growth Trends by Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {topLocations.slice(0, 5).map((location) => (
                    <div key={location.pincode} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-muted-foreground" />
                        <span className="text-sm">{location.area}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={location.growthRate * 4} className="w-20 h-2" />
                        <span className="text-sm font-medium text-green-600 w-12 text-right">
                          +{location.growthRate}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recommended Actions</CardTitle>
              <CardDescription>Data-driven recommendations for market expansion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="size-5 text-blue-500" />
                    <h4 className="font-medium">Target Whitefield</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    High growth rate (22.1%) with increasing patient volume. Consider opening satellite clinic.
                  </p>
                  <Button size="sm" className="w-full">Create Action Plan</Button>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Compass className="size-5 text-green-500" />
                    <h4 className="font-medium">Expand to Yelahanka</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Largest underserved area with 890 potential patients. Plan health camps and awareness drives.
                  </p>
                  <Button size="sm" className="w-full">Schedule Campaign</Button>
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Route className="size-5 text-purple-500" />
                    <h4 className="font-medium">Optimize Transport</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Patients beyond 15km have 40% lower retention. Consider shuttle services for key routes.
                  </p>
                  <Button size="sm" className="w-full">Analyze Routes</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}