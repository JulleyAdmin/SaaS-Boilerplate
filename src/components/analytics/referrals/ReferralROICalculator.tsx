'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  IndianRupee,
  TrendingUp,
  Calculator,
  Users,
  Target,
  Award,
  AlertCircle,
  ChevronRight,
  Download,
  RefreshCw,
  Info,
} from 'lucide-react';
import { generateReferrerProfiles } from '@/lib/demo/analyticsData';
import { toast } from '@/components/ui/use-toast';

interface ROIMetrics {
  totalInvestment: number;
  totalRevenue: number;
  netProfit: number;
  roi: number;
  paybackPeriod: number;
  costPerAcquisition: number;
  lifetimeValue: number;
  profitMargin: number;
}

const ReferralROICalculator: React.FC = () => {
  const [selectedReferrerType, setSelectedReferrerType] = useState('Doctor');
  const [incentiveAmount, setIncentiveAmount] = useState(500);
  const [avgPatientValue, setAvgPatientValue] = useState(12500);
  const [conversionRate, setConversionRate] = useState(75);
  const [referralsPerMonth, setReferralsPerMonth] = useState(10);
  const [retentionRate, setRetentionRate] = useState(60);
  const [calculatedROI, setCalculatedROI] = useState<ROIMetrics | null>(null);

  // Load referrer data
  const referrers = generateReferrerProfiles();

  // Calculate ROI metrics
  const calculateROI = () => {
    const monthlyIncentives = incentiveAmount * referralsPerMonth * (conversionRate / 100);
    const monthlyRevenue = referralsPerMonth * (conversionRate / 100) * avgPatientValue;
    const yearlyIncentives = monthlyIncentives * 12;
    const yearlyRevenue = monthlyRevenue * 12;
    
    // Account for retention and repeat visits
    const retentionMultiplier = 1 + (retentionRate / 100) * 0.5; // Assuming 50% additional value from retained patients
    const adjustedRevenue = yearlyRevenue * retentionMultiplier;
    
    const netProfit = adjustedRevenue - yearlyIncentives;
    const roi = ((netProfit / yearlyIncentives) * 100);
    const paybackPeriod = yearlyIncentives / (adjustedRevenue / 12);
    const costPerAcquisition = incentiveAmount / (conversionRate / 100);
    const lifetimeValue = avgPatientValue * retentionMultiplier * 2; // Assuming 2 visits per year for retained patients
    const profitMargin = (netProfit / adjustedRevenue) * 100;

    setCalculatedROI({
      totalInvestment: yearlyIncentives,
      totalRevenue: adjustedRevenue,
      netProfit,
      roi,
      paybackPeriod,
      costPerAcquisition,
      lifetimeValue,
      profitMargin
    });
  };

  useEffect(() => {
    calculateROI();
  }, [incentiveAmount, avgPatientValue, conversionRate, referralsPerMonth, retentionRate]);

  // ROI comparison data by referrer type
  const roiComparison = [
    { type: 'Doctor', roi: 245, investment: 450000, revenue: 1552500 },
    { type: 'Patient', roi: 180, investment: 120000, revenue: 336000 },
    { type: 'Corporate', roi: 220, investment: 280000, revenue: 896000 },
    { type: 'Insurance', roi: 150, investment: 0, revenue: 1870000 },
    { type: 'Health Camp', roi: 320, investment: 180000, revenue: 756000 },
  ];

  // Monthly projection data
  const generateProjection = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let cumulativeRevenue = 0;
    let cumulativeInvestment = 0;
    
    return months.map((month, index) => {
      const monthlyIncentives = incentiveAmount * referralsPerMonth * (conversionRate / 100);
      const monthlyRevenue = referralsPerMonth * (conversionRate / 100) * avgPatientValue;
      
      // Add growth factor
      const growthFactor = 1 + (index * 0.02); // 2% monthly growth
      
      cumulativeInvestment += monthlyIncentives;
      cumulativeRevenue += monthlyRevenue * growthFactor;
      
      return {
        month,
        investment: Math.round(cumulativeInvestment),
        revenue: Math.round(cumulativeRevenue),
        profit: Math.round(cumulativeRevenue - cumulativeInvestment),
        roi: Math.round(((cumulativeRevenue - cumulativeInvestment) / cumulativeInvestment) * 100)
      };
    });
  };

  const projectionData = generateProjection();

  // Cost breakdown
  const costBreakdown = [
    { category: 'Direct Incentives', amount: incentiveAmount * referralsPerMonth * 12 * (conversionRate / 100), percentage: 60 },
    { category: 'Program Management', amount: 50000, percentage: 15 },
    { category: 'Marketing Materials', amount: 30000, percentage: 10 },
    { category: 'Training & Support', amount: 40000, percentage: 12 },
    { category: 'Technology Platform', amount: 10000, percentage: 3 },
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

  // Referrer type specific settings
  const referrerTypeSettings: Record<string, { incentive: number; conversion: number; avgValue: number }> = {
    'Doctor': { incentive: 500, conversion: 75, avgValue: 12500 },
    'Patient': { incentive: 200, conversion: 60, avgValue: 8000 },
    'Corporate': { incentive: 0, conversion: 70, avgValue: 10000 },
    'Insurance': { incentive: 0, conversion: 65, avgValue: 15000 },
    'HealthCamp': { incentive: 1000, conversion: 45, avgValue: 6000 },
  };

  useEffect(() => {
    const settings = referrerTypeSettings[selectedReferrerType];
    if (settings) {
      setIncentiveAmount(settings.incentive);
      setConversionRate(settings.conversion);
      setAvgPatientValue(settings.avgValue);
    }
  }, [selectedReferrerType]);

  const handleExportAnalysis = () => {
    toast({
      title: 'Export Started',
      description: 'Downloading ROI analysis report...',
    });
  };

  const handleResetCalculator = () => {
    setSelectedReferrerType('Doctor');
    setIncentiveAmount(500);
    setAvgPatientValue(12500);
    setConversionRate(75);
    setReferralsPerMonth(10);
    setRetentionRate(60);
  };

  return (
    <div className="space-y-6">
      {/* ROI Calculator */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>ROI Calculator</CardTitle>
              <CardDescription>Calculate return on investment for referral programs</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleResetCalculator}>
                <RefreshCw className="mr-2 size-4" />
                Reset
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportAnalysis}>
                <Download className="mr-2 size-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Parameters */}
            <div className="space-y-6">
              <div>
                <Label>Referrer Type</Label>
                <Select value={selectedReferrerType} onValueChange={setSelectedReferrerType}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Doctor">Doctor Referral</SelectItem>
                    <SelectItem value="Patient">Patient Referral</SelectItem>
                    <SelectItem value="Corporate">Corporate Tie-up</SelectItem>
                    <SelectItem value="Insurance">Insurance Partner</SelectItem>
                    <SelectItem value="HealthCamp">Health Camp</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Incentive per Referral</Label>
                  <span className="text-sm font-medium">₹{incentiveAmount}</span>
                </div>
                <Slider
                  value={[incentiveAmount]}
                  onValueChange={(value) => setIncentiveAmount(value[0])}
                  min={0}
                  max={2000}
                  step={100}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Average Patient Value</Label>
                  <span className="text-sm font-medium">₹{avgPatientValue.toLocaleString()}</span>
                </div>
                <Slider
                  value={[avgPatientValue]}
                  onValueChange={(value) => setAvgPatientValue(value[0])}
                  min={2000}
                  max={50000}
                  step={500}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Conversion Rate</Label>
                  <span className="text-sm font-medium">{conversionRate}%</span>
                </div>
                <Slider
                  value={[conversionRate]}
                  onValueChange={(value) => setConversionRate(value[0])}
                  min={10}
                  max={100}
                  step={5}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Referrals per Month</Label>
                  <span className="text-sm font-medium">{referralsPerMonth}</span>
                </div>
                <Slider
                  value={[referralsPerMonth]}
                  onValueChange={(value) => setReferralsPerMonth(value[0])}
                  min={1}
                  max={50}
                  step={1}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Patient Retention Rate</Label>
                  <span className="text-sm font-medium">{retentionRate}%</span>
                </div>
                <Slider
                  value={[retentionRate]}
                  onValueChange={(value) => setRetentionRate(value[0])}
                  min={10}
                  max={90}
                  step={5}
                />
              </div>
            </div>

            {/* Calculated Results */}
            {calculatedROI && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">ROI</p>
                          <p className="text-2xl font-bold text-green-600">
                            {calculatedROI.roi.toFixed(1)}%
                          </p>
                        </div>
                        <TrendingUp className="size-8 text-green-600/20" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Net Profit</p>
                          <p className="text-2xl font-bold">
                            ₹{(calculatedROI.netProfit / 100000).toFixed(1)}L
                          </p>
                        </div>
                        <IndianRupee className="size-8 text-blue-600/20" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Payback Period</p>
                          <p className="text-2xl font-bold">
                            {calculatedROI.paybackPeriod.toFixed(1)} mo
                          </p>
                        </div>
                        <Calculator className="size-8 text-purple-600/20" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Cost/Acquisition</p>
                          <p className="text-2xl font-bold">
                            ₹{calculatedROI.costPerAcquisition.toFixed(0)}
                          </p>
                        </div>
                        <Users className="size-8 text-orange-600/20" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Financial Summary (Annual)</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Investment</span>
                        <span className="font-medium">₹{calculatedROI.totalInvestment.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Revenue</span>
                        <span className="font-medium">₹{calculatedROI.totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Profit Margin</span>
                        <span className="font-medium">{calculatedROI.profitMargin.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Patient LTV</span>
                        <span className="font-medium">₹{calculatedROI.lifetimeValue.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {calculatedROI.roi > 200 && (
                  <Alert className="border-green-200 bg-green-50">
                    <AlertCircle className="size-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Excellent ROI! This referral program configuration shows strong profitability 
                      with {calculatedROI.roi.toFixed(0)}% return on investment.
                    </AlertDescription>
                  </Alert>
                )}

                {calculatedROI.roi < 100 && (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertCircle className="size-4 text-amber-600" />
                    <AlertDescription className="text-amber-800">
                      Consider optimizing incentive structure or improving conversion rates to achieve better ROI.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ROI Projections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">12-Month ROI Projection</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value: any) => `₹${(value / 1000).toFixed(0)}K`} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} name="Revenue" />
                <Line type="monotone" dataKey="investment" stroke="#EF4444" strokeWidth={2} name="Investment" />
                <Line type="monotone" dataKey="profit" stroke="#3B82F6" strokeWidth={2} name="Profit" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">ROI by Referrer Type</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={roiComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="roi" fill="#3B82F6" name="ROI %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Program Cost Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 lg:grid-cols-2">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-3">
              {costBreakdown.map((item, index) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="text-sm">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">₹{item.amount.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">{item.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performers ROI */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers by ROI</CardTitle>
          <CardDescription>Referrers generating the highest return on investment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {referrers.slice(0, 5).map((referrer, index) => {
              const roiValue = ((referrer.totalRevenue - referrer.incentivesPaid) / (referrer.incentivesPaid || 1)) * 100;
              
              return (
                <div key={referrer.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{referrer.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {referrer.type} • {referrer.totalReferrals} referrals
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">
                      {roiValue > 1000 ? '>1000%' : `${roiValue.toFixed(0)}%`} ROI
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ₹{(referrer.totalRevenue / 100000).toFixed(1)}L revenue
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferralROICalculator;