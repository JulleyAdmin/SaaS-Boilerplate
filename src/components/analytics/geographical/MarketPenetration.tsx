'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
  ScatterChart,
  Scatter,
  ZAxis,
} from 'recharts';
import {
  Target,
  TrendingUp,
  Users,
  IndianRupee,
  Building2,
  Activity,
  Calendar,
  AlertCircle,
  ChevronRight,
  MapPin,
  Briefcase,
  Home,
  School,
} from 'lucide-react';

const MarketPenetration: React.FC = () => {
  const [selectedSegment, setSelectedSegment] = useState('residential');

  // Market penetration by area
  const penetrationData = [
    { area: 'Koramangala', population: 125000, patients: 456, penetration: 0.36, potential: 3750, growth: 15.5 },
    { area: 'Indiranagar', population: 98000, patients: 389, penetration: 0.40, potential: 2940, growth: 12.3 },
    { area: 'Whitefield', population: 187000, patients: 367, penetration: 0.20, potential: 5610, growth: 22.1 },
    { area: 'HSR Layout', population: 112000, patients: 334, penetration: 0.30, potential: 3360, growth: 18.7 },
    { area: 'Jayanagar', population: 95000, patients: 312, penetration: 0.33, potential: 2850, growth: 8.4 },
    { area: 'BTM Layout', population: 87000, patients: 298, penetration: 0.34, potential: 2610, growth: 11.2 },
    { area: 'Marathahalli', population: 145000, patients: 276, penetration: 0.19, potential: 4350, growth: 19.8 },
    { area: 'Electronic City', population: 234000, patients: 234, penetration: 0.10, potential: 7020, growth: 25.3 },
    { area: 'Bellandur', population: 176000, patients: 212, penetration: 0.12, potential: 5280, growth: 21.6 },
    { area: 'JP Nagar', population: 89000, patients: 198, penetration: 0.22, potential: 2670, growth: 14.2 },
  ];

  // Competitor analysis
  const competitorData = [
    { area: 'Koramangala', ourHospital: 456, competitor1: 678, competitor2: 345, competitor3: 234, marketShare: 27 },
    { area: 'Indiranagar', ourHospital: 389, competitor1: 567, competitor2: 289, competitor3: 198, marketShare: 27 },
    { area: 'Whitefield', ourHospital: 367, competitor1: 890, competitor2: 567, competitor3: 456, marketShare: 14 },
    { area: 'HSR Layout', ourHospital: 334, competitor1: 456, competitor2: 234, competitor3: 178, marketShare: 28 },
    { area: 'Jayanagar', ourHospital: 312, competitor1: 234, competitor2: 345, competitor3: 289, marketShare: 26 },
  ];

  // Segment-wise penetration
  const segmentData = {
    residential: [
      { category: 'Apartments', population: 450000, patients: 1890, penetration: 0.42, avgRevenue: 7800 },
      { category: 'Independent Houses', population: 234000, patients: 678, penetration: 0.29, avgRevenue: 8500 },
      { category: 'Gated Communities', population: 187000, patients: 892, penetration: 0.48, avgRevenue: 9200 },
      { category: 'Slums/Low Income', population: 98000, patients: 123, penetration: 0.13, avgRevenue: 2300 },
    ],
    corporate: [
      { category: 'IT Parks', employees: 125000, patients: 567, penetration: 0.45, avgRevenue: 6500 },
      { category: 'Manufacturing', employees: 45000, patients: 234, penetration: 0.52, avgRevenue: 5800 },
      { category: 'Retail/Hospitality', employees: 67000, patients: 189, penetration: 0.28, avgRevenue: 4200 },
      { category: 'BFSI', employees: 38000, patients: 298, penetration: 0.78, avgRevenue: 8900 },
    ],
    institutional: [
      { category: 'Schools', population: 89000, patients: 234, penetration: 0.26, avgRevenue: 3400 },
      { category: 'Colleges', population: 56000, patients: 456, penetration: 0.81, avgRevenue: 4500 },
      { category: 'Government Offices', population: 34000, patients: 123, penetration: 0.36, avgRevenue: 5600 },
      { category: 'Others', population: 23000, patients: 67, penetration: 0.29, avgRevenue: 4200 },
    ],
  };

  // Growth opportunity matrix
  const opportunityMatrix = [
    { area: 'Electronic City', currentPenetration: 10, potentialPenetration: 45, effort: 'Medium', roi: 'Very High', priority: 1 },
    { area: 'Whitefield', currentPenetration: 20, potentialPenetration: 55, effort: 'Low', roi: 'High', priority: 2 },
    { area: 'Marathahalli', currentPenetration: 19, potentialPenetration: 48, effort: 'Medium', roi: 'High', priority: 3 },
    { area: 'Bellandur', currentPenetration: 12, potentialPenetration: 38, effort: 'High', roi: 'Medium', priority: 4 },
    { area: 'Yelahanka', currentPenetration: 3, potentialPenetration: 35, effort: 'Very High', roi: 'Medium', priority: 5 },
  ];

  // Time series penetration trend
  const penetrationTrend = [
    { month: 'Jan', penetration: 2.1, target: 2.5, actual: 2.1 },
    { month: 'Feb', penetration: 2.3, target: 2.7, actual: 2.3 },
    { month: 'Mar', penetration: 2.5, target: 2.9, actual: 2.5 },
    { month: 'Apr', penetration: 2.8, target: 3.1, actual: 2.8 },
    { month: 'May', penetration: 3.0, target: 3.3, actual: 3.0 },
    { month: 'Jun', penetration: 3.2, target: 3.5, actual: 3.2 },
    { month: 'Jul', penetration: null, target: 3.7, actual: null },
    { month: 'Aug', penetration: null, target: 3.9, actual: null },
    { month: 'Sep', penetration: null, target: 4.1, actual: null },
    { month: 'Oct', penetration: null, target: 4.3, actual: null },
    { month: 'Nov', penetration: null, target: 4.5, actual: null },
    { month: 'Dec', penetration: null, target: 4.8, actual: null },
  ];

  // Bubble chart data for opportunity visualization
  const bubbleData = penetrationData.map(area => ({
    x: area.penetration * 100,
    y: area.growth,
    z: area.potential,
    name: area.area,
  }));

  const calculateOpportunityScore = (penetration: number, growth: number, potential: number) => {
    return Math.round((1 - penetration) * 40 + growth * 0.3 + (potential / 100) * 0.3);
  };

  return (
    <div className="space-y-6">
      {/* Overall Market Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Addressable Market</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15.2L</div>
            <p className="text-xs text-muted-foreground">Population in coverage area</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Current Penetration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <Progress value={3.2} className="mt-2 h-1" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Market Potential</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45K</div>
            <p className="text-xs text-muted-foreground">Untapped patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+18.5%</div>
            <p className="text-xs text-muted-foreground">YoY penetration growth</p>
          </CardContent>
        </Card>
      </div>

      {/* Penetration Analysis Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="segments">Segments</TabsTrigger>
          <TabsTrigger value="competition">Competition</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Market Penetration by Area</CardTitle>
                <CardDescription>Current penetration vs population size</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart data={penetrationData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="area" angle={-45} textAnchor="end" height={80} />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar yAxisId="left" dataKey="patients" fill="#3B82F6" name="Current Patients" />
                    <Line 
                      yAxisId="right" 
                      type="monotone" 
                      dataKey="penetration" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      name="Penetration %"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Penetration Growth Trend</CardTitle>
                <CardDescription>Monthly penetration progress vs target</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={penetrationTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="#3B82F6" 
                      strokeWidth={2}
                      name="Actual"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="target" 
                      stroke="#EF4444" 
                      strokeDasharray="5 5"
                      strokeWidth={2}
                      name="Target"
                    />
                  </LineChart>
                </ResponsiveContainer>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm">
                    <span className="font-medium">Current Status:</span> Tracking 0.3% behind target. 
                    Need 234 additional patients monthly to meet year-end goal.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Areas by Penetration */}
          <Card>
            <CardHeader>
              <CardTitle>Area-wise Penetration Analysis</CardTitle>
              <CardDescription>Detailed breakdown by location</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {penetrationData.slice(0, 5).map((area) => {
                  const opportunityScore = calculateOpportunityScore(area.penetration, area.growth, area.potential);
                  return (
                    <div key={area.area} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{area.area}</h4>
                          <p className="text-sm text-muted-foreground">
                            Population: {area.population.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            className={opportunityScore > 70 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                          >
                            Opportunity Score: {opportunityScore}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-4 mt-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Current Patients</p>
                          <p className="font-medium">{area.patients}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Penetration</p>
                          <p className="font-medium">{(area.penetration * 100).toFixed(2)}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Potential</p>
                          <p className="font-medium text-green-600">{area.potential}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Growth</p>
                          <p className="font-medium text-blue-600">+{area.growth}%</p>
                        </div>
                      </div>
                      <Progress value={area.penetration * 100} className="mt-3 h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Segments Tab */}
        <TabsContent value="segments" className="space-y-4">
          <div className="mb-4">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={selectedSegment === 'residential' ? 'default' : 'outline'}
                onClick={() => setSelectedSegment('residential')}
              >
                <Home className="mr-2 size-4" />
                Residential
              </Button>
              <Button
                size="sm"
                variant={selectedSegment === 'corporate' ? 'default' : 'outline'}
                onClick={() => setSelectedSegment('corporate')}
              >
                <Briefcase className="mr-2 size-4" />
                Corporate
              </Button>
              <Button
                size="sm"
                variant={selectedSegment === 'institutional' ? 'default' : 'outline'}
                onClick={() => setSelectedSegment('institutional')}
              >
                <School className="mr-2 size-4" />
                Institutional
              </Button>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">{selectedSegment} Segment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={segmentData[selectedSegment as keyof typeof segmentData]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="patients" fill="#3B82F6" name="Patients" />
                    <Bar dataKey="penetration" fill="#10B981" name="Penetration" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Segment Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {segmentData[selectedSegment as keyof typeof segmentData].map((item) => (
                    <div key={item.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.category}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{item.patients} patients</Badge>
                          <span className="text-sm text-muted-foreground">
                            ₹{item.avgRevenue} avg
                          </span>
                        </div>
                      </div>
                      <Progress value={item.penetration * 100} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Competition Tab */}
        <TabsContent value="competition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Competitive Landscape</CardTitle>
              <CardDescription>Market share comparison across key areas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={competitorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="area" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ourHospital" stackId="a" fill="#3B82F6" name="Our Hospital" />
                  <Bar dataKey="competitor1" stackId="a" fill="#EF4444" name="Competitor A" />
                  <Bar dataKey="competitor2" stackId="a" fill="#F59E0B" name="Competitor B" />
                  <Bar dataKey="competitor3" stackId="a" fill="#10B981" name="Competitor C" />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 grid grid-cols-5 gap-4">
                {competitorData.map((area) => (
                  <div key={area.area} className="text-center">
                    <p className="text-xs text-muted-foreground">{area.area}</p>
                    <p className="text-lg font-bold">{area.marketShare}%</p>
                    <p className="text-xs">Market Share</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Opportunities Tab */}
        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Opportunity Matrix</CardTitle>
              <CardDescription>High-potential areas for expansion</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <ScatterChart>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="x" 
                    name="Current Penetration" 
                    unit="%" 
                    domain={[0, 50]}
                    label={{ value: 'Current Penetration (%)', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis 
                    dataKey="y" 
                    name="Growth Rate" 
                    unit="%" 
                    domain={[0, 30]}
                    label={{ value: 'Growth Rate (%)', angle: -90, position: 'insideLeft' }}
                  />
                  <ZAxis dataKey="z" range={[64, 400]} name="Potential Patients" />
                  <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Areas" data={bubbleData} fill="#3B82F6">
                    {bubbleData.map((entry, index) => (
                      <text
                        key={`label-${index}`}
                        x={entry.x}
                        y={entry.y}
                        fill="#000"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fontSize={10}
                      >
                        {entry.name}
                      </text>
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Priority Action Areas</CardTitle>
              <CardDescription>Recommended focus areas based on ROI and effort</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {opportunityMatrix.map((opp) => (
                  <div key={opp.area} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                          {opp.priority}
                        </div>
                        <div>
                          <h4 className="font-medium">{opp.area}</h4>
                          <p className="text-sm text-muted-foreground">
                            {opp.currentPenetration}% → {opp.potentialPenetration}% potential
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={opp.roi === 'Very High' ? 'default' : 'secondary'}>
                          ROI: {opp.roi}
                        </Badge>
                        <Badge variant="outline">
                          Effort: {opp.effort}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress 
                        value={(opp.currentPenetration / opp.potentialPenetration) * 100} 
                        className="flex-1 h-2"
                      />
                      <span className="text-sm text-muted-foreground">
                        {Math.round((opp.potentialPenetration - opp.currentPenetration) / opp.potentialPenetration * 100)}% gap
                      </span>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button size="sm" variant="outline">
                        <Target className="mr-2 size-3" />
                        Create Strategy
                      </Button>
                      <Button size="sm" variant="outline">
                        <Calendar className="mr-2 size-3" />
                        Schedule Campaign
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketPenetration;