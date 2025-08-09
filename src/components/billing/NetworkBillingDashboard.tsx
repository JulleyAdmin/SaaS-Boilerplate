'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { 
  IndianRupee,
  ArrowRightLeft,
  Building,
  TrendingUp,
  TrendingDown,
  FileText,
  Download,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Activity,
  CreditCard,
  PieChart,
  BarChart3,
  Receipt,
  Calculator,
  Banknote,
  HandCoins,
  Share2,
  Network
} from 'lucide-react';
import { 
  mockReferrals, 
  mockTransfers, 
  mockSharedResources,
  mockCollaborationAgreements,
  mockHospitals 
} from '@/data/mock-network-collaboration';

interface NetworkTransaction {
  id: string;
  type: 'referral' | 'transfer' | 'resource';
  partnerHospital: string;
  amount: number;
  status: 'pending' | 'approved' | 'settled' | 'disputed';
  date: Date;
  description: string;
  revenueShare?: number;
  networkDiscount?: number;
}

export default function NetworkBillingDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedHospital, setSelectedHospital] = useState('all');
  const [transactions, setTransactions] = useState<NetworkTransaction[]>([]);
  const [loading, setLoading] = useState(false);

  // Calculate network billing statistics
  const calculateNetworkStats = () => {
    const referralRevenue = mockReferrals.length * 2500; // Average referral fee
    const transferCharges = mockTransfers.filter(t => t.transferCharges).reduce((sum, t) => sum + (t.transferCharges || 0), 0);
    const resourceRevenue = mockSharedResources.reduce((sum, r) => {
      const usage = r.currentUtilization / 100 * r.dailyCapacity;
      const revenue = usage * r.basePrice * (1 - r.networkDiscountPercent / 100);
      return sum + revenue;
    }, 0);

    return {
      totalNetworkRevenue: referralRevenue + transferCharges + resourceRevenue,
      referralRevenue,
      transferCharges,
      resourceRevenue,
      pendingSettlements: 325000,
      completedSettlements: 1250000,
      revenueShareOwed: 185000,
      revenueShareReceived: 145000,
      networkDiscountsGiven: 75000,
      activeAgreements: mockCollaborationAgreements.filter(a => a.status === 'Active').length,
      partnerHospitals: mockHospitals.length - 1
    };
  };

  const stats = calculateNetworkStats();

  useEffect(() => {
    generateMockTransactions();
  }, [selectedPeriod, selectedHospital]);

  const generateMockTransactions = () => {
    setLoading(true);
    
    // Generate mock network transactions
    const mockTransactions: NetworkTransaction[] = [
      // Referral transactions
      ...mockReferrals.slice(0, 3).map((ref, idx) => ({
        id: `NT-REF-${idx + 1}`,
        type: 'referral' as const,
        partnerHospital: ref.referredToClinic.clinicName,
        amount: 2500,
        status: ref.referralStatus === 'Completed' ? 'settled' as const : 'pending' as const,
        date: ref.initiatedAt,
        description: `Referral fee for ${ref.patient.firstName} ${ref.patient.lastName}`,
        revenueShare: 500
      })),
      
      // Transfer transactions
      ...mockTransfers.slice(0, 3).map((trans, idx) => ({
        id: `NT-TRN-${idx + 1}`,
        type: 'transfer' as const,
        partnerHospital: trans.destinationClinic.clinicName,
        amount: trans.transferCharges || 5000,
        status: trans.transferStatus === 'Completed' ? 'settled' as const : 'approved' as const,
        date: trans.initiatedAt,
        description: `Transfer charges for ${trans.patient.firstName} ${trans.patient.lastName}`,
        revenueShare: 0
      })),
      
      // Resource usage transactions
      ...mockSharedResources.slice(0, 3).map((res, idx) => ({
        id: `NT-RES-${idx + 1}`,
        type: 'resource' as const,
        partnerHospital: res.hostClinic.clinicName,
        amount: res.basePrice * (1 - res.networkDiscountPercent / 100),
        status: 'approved' as const,
        date: new Date(),
        description: `${res.resourceName} usage charges`,
        networkDiscount: res.basePrice * res.networkDiscountPercent / 100
      }))
    ];

    // Filter by hospital if needed
    if (selectedHospital !== 'all') {
      setTransactions(mockTransactions.filter(t => 
        t.partnerHospital.toLowerCase().includes(selectedHospital.toLowerCase())
      ));
    } else {
      setTransactions(mockTransactions);
    }
    
    setTimeout(() => setLoading(false), 500);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'settled': return 'success';
      case 'approved': return 'default';
      case 'pending': return 'warning';
      case 'disputed': return 'destructive';
      default: return 'secondary';
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'referral': return <ArrowRightLeft className="h-4 w-4" />;
      case 'transfer': return <Send className="h-4 w-4" />;
      case 'resource': return <Share2 className="h-4 w-4" />;
      default: return <Network className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Network Billing</h1>
          <p className="text-muted-foreground">
            Manage inter-hospital transactions and revenue sharing
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Network Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats.totalNetworkRevenue.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
              <span className="text-green-500">+18%</span>
              <span className="ml-1">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Settlements</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{stats.pendingSettlements.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-muted-foreground">
              {mockHospitals.length - 2} hospitals pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Share</CardTitle>
            <HandCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Owed</span>
                <span className="text-sm font-medium text-red-600">
                  ₹{stats.revenueShareOwed.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Received</span>
                <span className="text-sm font-medium text-green-600">
                  ₹{stats.revenueShareReceived.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Partner Hospitals</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.partnerHospitals}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeAgreements} active agreements
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="settlements">Settlements</TabsTrigger>
          <TabsTrigger value="agreements">Agreements</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Network Transactions</CardTitle>
                <Select value={selectedHospital} onValueChange={setSelectedHospital}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filter by hospital" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Hospitals</SelectItem>
                    {mockHospitals.map(hospital => (
                      <SelectItem key={hospital.clinicId} value={hospital.clinicName}>
                        {hospital.clinicName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {transactions.map(transaction => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{transaction.description}</p>
                          <Badge variant={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{transaction.partnerHospital}</span>
                          <span>•</span>
                          <span>{transaction.date.toLocaleDateString()}</span>
                          {transaction.networkDiscount && (
                            <>
                              <span>•</span>
                              <span className="text-green-600">
                                Discount: ₹{transaction.networkDiscount.toLocaleString('en-IN')}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₹{transaction.amount.toLocaleString('en-IN')}</p>
                      {transaction.revenueShare ? (
                        <p className="text-xs text-muted-foreground">
                          Revenue Share: ₹{transaction.revenueShare.toLocaleString('en-IN')}
                        </p>
                      ) : null}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settlements Tab */}
        <TabsContent value="settlements" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Pending Settlements</CardTitle>
                <CardDescription>Amounts to be settled with partner hospitals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockHospitals.slice(0, 3).map(hospital => (
                    <div key={hospital.clinicId} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{hospital.clinicName}</p>
                        <p className="text-sm text-muted-foreground">
                          Last settled: 15 days ago
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{Math.floor(Math.random() * 100000 + 50000).toLocaleString('en-IN')}</p>
                        <Button size="sm" className="mt-1">
                          Settle Now
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Settlement History</CardTitle>
                <CardDescription>Recently completed settlements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockHospitals.slice(3, 5).map(hospital => (
                    <div key={hospital.clinicId} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{hospital.clinicName}</p>
                        <p className="text-sm text-muted-foreground">
                          Settled on: {new Date().toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          ₹{Math.floor(Math.random() * 80000 + 40000).toLocaleString('en-IN')}
                        </p>
                        <Badge variant="success" className="mt-1">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Completed
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Agreements Tab */}
        <TabsContent value="agreements" className="space-y-4">
          <div className="grid gap-4">
            {mockCollaborationAgreements.map(agreement => (
              <Card key={agreement.agreementId}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{agreement.agreementName}</CardTitle>
                      <CardDescription>
                        {agreement.clinicA.clinicName} ⟷ {agreement.clinicB.clinicName}
                      </CardDescription>
                    </div>
                    <Badge variant={agreement.status === 'Active' ? 'success' : 'secondary'}>
                      {agreement.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Agreement Type</p>
                      <p className="font-medium">{agreement.agreementType}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Payment Terms</p>
                      <p className="font-medium">{agreement.paymentTerms}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Revenue Share</p>
                      <p className="font-medium">
                        {agreement.revenueSharePercentage ? `${agreement.revenueSharePercentage}%` : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Valid Until</p>
                      <p className="font-medium">
                        {new Date(agreement.effectiveTo).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Covered Services</p>
                    <div className="flex flex-wrap gap-2">
                      {agreement.coveredServices.map((service, idx) => (
                        <Badge key={idx} variant="outline">
                          {service}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {agreement.minimumGuaranteedAmount && (
                    <Alert className="mt-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Minimum guaranteed: ₹{agreement.minimumGuaranteedAmount.toLocaleString('en-IN')}/month
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Revenue Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
                <CardDescription>Network revenue by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Referral Fees</span>
                      <span className="text-sm font-medium">
                        ₹{stats.referralRevenue.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <Progress value={35} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Transfer Charges</span>
                      <span className="text-sm font-medium">
                        ₹{stats.transferCharges.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Resource Usage</span>
                      <span className="text-sm font-medium">
                        ₹{Math.round(stats.resourceRevenue).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <Progress value={40} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Partner Hospitals */}
            <Card>
              <CardHeader>
                <CardTitle>Top Partner Hospitals</CardTitle>
                <CardDescription>By transaction volume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockHospitals.slice(0, 4).map((hospital, idx) => (
                    <div key={hospital.clinicId} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{hospital.clinicName}</p>
                          <p className="text-xs text-muted-foreground">{hospital.clinicType}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          ₹{Math.floor(Math.random() * 200000 + 100000).toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Math.floor(Math.random() * 50 + 20)} transactions
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Network Revenue Trends</CardTitle>
              <CardDescription>Monthly network revenue over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mr-2" />
                <span>Revenue trend chart would be displayed here</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Powered by Julley Online */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Network Billing System powered by Julley Online Pvt Ltd | T-Hub Hyderabad</p>
      </div>
    </div>
  );
}