'use client';

import { useState } from 'react';
import { 
  CreditCard, 
  Download, 
  Search, 
  User, 
  Calendar, 
  AlertCircle,
  CheckCircle,
  Clock,
  IndianRupee,
  FileText,
  Phone,
  Mail,
  Printer,
  Shield,
  TrendingUp,
  TrendingDown,
  Filter,
  Eye,
  Send,
  ChevronRight,
  Building2,
  AlertTriangle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

// Mock patient billing data
const patientAccounts = [
  {
    id: 'PAT001',
    name: 'Rajesh Kumar',
    age: 45,
    gender: 'Male',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@email.com',
    totalBilled: 125000,
    totalPaid: 95000,
    outstanding: 30000,
    lastPayment: '2025-08-05',
    lastPaymentAmount: 15000,
    overdueDays: 15,
    status: 'overdue',
    insuranceProvider: 'Star Health',
    governmentScheme: null,
    ward: 'General Ward A',
    admissionDate: '2025-07-25',
    dischargeDate: '2025-08-01'
  },
  {
    id: 'PAT002',
    name: 'Priya Sharma',
    age: 32,
    gender: 'Female',
    phone: '+91 87654 32109',
    email: 'priya.sharma@email.com',
    totalBilled: 85000,
    totalPaid: 85000,
    outstanding: 0,
    lastPayment: '2025-08-08',
    lastPaymentAmount: 25000,
    overdueDays: 0,
    status: 'paid',
    insuranceProvider: null,
    governmentScheme: 'PM-JAY',
    ward: 'Private Room',
    admissionDate: '2025-08-02',
    dischargeDate: '2025-08-06'
  },
  {
    id: 'PAT003',
    name: 'Mohammed Ali',
    age: 55,
    gender: 'Male',
    phone: '+91 76543 21098',
    email: 'mohammed.ali@email.com',
    totalBilled: 250000,
    totalPaid: 150000,
    outstanding: 100000,
    lastPayment: '2025-07-20',
    lastPaymentAmount: 50000,
    overdueDays: 45,
    status: 'critical',
    insuranceProvider: 'ICICI Lombard',
    governmentScheme: null,
    ward: 'ICU',
    admissionDate: '2025-07-10',
    dischargeDate: '2025-07-18'
  },
  {
    id: 'PAT004',
    name: 'Sunita Devi',
    age: 48,
    gender: 'Female',
    phone: '+91 65432 10987',
    email: null,
    totalBilled: 45000,
    totalPaid: 20000,
    outstanding: 25000,
    lastPayment: '2025-08-06',
    lastPaymentAmount: 10000,
    overdueDays: 5,
    status: 'pending',
    insuranceProvider: null,
    governmentScheme: 'CGHS',
    ward: 'General Ward B',
    admissionDate: '2025-08-03',
    dischargeDate: '2025-08-07'
  },
  {
    id: 'PAT005',
    name: 'Amit Patel',
    age: 38,
    gender: 'Male',
    phone: '+91 54321 09876',
    email: 'amit.patel@email.com',
    totalBilled: 180000,
    totalPaid: 180000,
    outstanding: 0,
    lastPayment: '2025-08-07',
    lastPaymentAmount: 60000,
    overdueDays: 0,
    status: 'paid',
    insuranceProvider: 'Bajaj Allianz',
    governmentScheme: null,
    ward: 'Semi-Private',
    admissionDate: '2025-07-28',
    dischargeDate: '2025-08-04'
  }
];

const recentTransactions = [
  {
    id: 'TXN001',
    patientName: 'Rajesh Kumar',
    patientId: 'PAT001',
    amount: 15000,
    type: 'payment',
    method: 'UPI',
    date: '2025-08-05',
    time: '10:30 AM',
    reference: 'UPI/305/2025',
    status: 'completed'
  },
  {
    id: 'TXN002',
    patientName: 'Priya Sharma',
    patientId: 'PAT002',
    amount: 25000,
    type: 'payment',
    method: 'Card',
    date: '2025-08-08',
    time: '02:15 PM',
    reference: 'CARD/808/2025',
    status: 'completed'
  },
  {
    id: 'TXN003',
    patientName: 'Mohammed Ali',
    patientId: 'PAT003',
    amount: 35000,
    type: 'invoice',
    method: null,
    date: '2025-08-08',
    time: '11:00 AM',
    reference: 'INV/2025/0845',
    status: 'pending'
  },
  {
    id: 'TXN004',
    patientName: 'Sunita Devi',
    patientId: 'PAT004',
    amount: 10000,
    type: 'payment',
    method: 'Cash',
    date: '2025-08-06',
    time: '04:45 PM',
    reference: 'CASH/806/2025',
    status: 'completed'
  },
  {
    id: 'TXN005',
    patientName: 'Amit Patel',
    patientId: 'PAT005',
    amount: 60000,
    type: 'payment',
    method: 'Insurance',
    date: '2025-08-07',
    time: '09:20 AM',
    reference: 'INS/807/2025',
    status: 'completed'
  }
];

export default function PatientBillingPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    amount: '',
    method: '',
    reference: '',
    notes: ''
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Paid</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-orange-500">Overdue</Badge>;
      case 'critical':
        return <Badge variant="destructive">Critical</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getPaymentMethodBadge = (method: string | null) => {
    if (!method) return null;
    
    const colors: Record<string, string> = {
      'UPI': 'bg-purple-500',
      'Card': 'bg-blue-500',
      'Cash': 'bg-green-500',
      'Insurance': 'bg-cyan-500',
      'Cheque': 'bg-gray-500'
    };
    
    return <Badge className={colors[method] || 'bg-gray-500'}>{method}</Badge>;
  };

  const handleRecordPayment = () => {
    if (!selectedPatient || !paymentDetails.amount || !paymentDetails.method) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Payment Recorded",
      description: `Payment of ₹${paymentDetails.amount} recorded for ${selectedPatient.name}`,
    });

    setShowPaymentDialog(false);
    setPaymentDetails({ amount: '', method: '', reference: '', notes: '' });
    setSelectedPatient(null);
  };

  const handleSendReminder = (patient: any) => {
    toast({
      title: "Reminder Sent",
      description: `Payment reminder sent to ${patient.name} via SMS and Email`,
    });
  };

  const handleExportReport = () => {
    toast({
      title: "Exporting Report",
      description: "Patient billing report is being generated...",
    });
  };

  const filteredAccounts = patientAccounts.filter(account => {
    const matchesSearch = 
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.phone?.includes(searchQuery);
    
    const matchesStatus = statusFilter === 'all' || account.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalOutstanding = patientAccounts.reduce((sum, acc) => sum + acc.outstanding, 0);
  const totalOverdue = patientAccounts.filter(acc => acc.overdueDays > 30).reduce((sum, acc) => sum + acc.outstanding, 0);
  const thisMonthRevenue = recentTransactions
    .filter(txn => txn.type === 'payment' && txn.status === 'completed')
    .reduce((sum, txn) => sum + txn.amount, 0);
  const collectionRate = ((thisMonthRevenue / (thisMonthRevenue + totalOutstanding)) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Billing</h1>
          <p className="text-muted-foreground">
            Manage patient accounts, outstanding balances, and payment history
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="mr-2 size-4" />
            Export Report
          </Button>
          <Button onClick={() => setShowPaymentDialog(true)}>
            <CreditCard className="mr-2 size-4" />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Alert for Critical Overdue */}
      {patientAccounts.some(acc => acc.status === 'critical') && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="size-4" />
          <AlertDescription>
            <strong>{patientAccounts.filter(acc => acc.status === 'critical').length} accounts</strong> have critical overdue amounts (&gt;45 days). Immediate action required.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <IndianRupee className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalOutstanding / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              Total unpaid amount
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(thisMonthRevenue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              Revenue collected
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{(totalOverdue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-muted-foreground">
              &gt;30 days overdue
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collection Rate</CardTitle>
            <CheckCircle className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{collectionRate}%</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search by patient name, ID, or phone..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="accounts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="accounts">Patient Accounts</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
          <TabsTrigger value="analytics">Payment Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="accounts">
          <Card>
            <CardHeader>
              <CardTitle>Patient Accounts</CardTitle>
              <CardDescription>Overview of all patient billing accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Patient</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Total Billed</TableHead>
                    <TableHead>Outstanding</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map((account) => (
                    <TableRow key={account.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar>
                            <AvatarFallback>
                              {account.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{account.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {account.id} • {account.age}Y/{account.gender}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Phone className="mr-1 size-3" />
                            {account.phone}
                          </div>
                          {account.email && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Mail className="mr-1 size-3" />
                              {account.email}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">₹{account.totalBilled.toLocaleString()}</p>
                          <p className="text-sm text-muted-foreground">
                            Paid: ₹{account.totalPaid.toLocaleString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">₹{account.outstanding.toLocaleString()}</p>
                          {account.overdueDays > 0 && (
                            <p className="text-sm text-orange-600">
                              {account.overdueDays} days overdue
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(account.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPatient(account);
                              setShowDetailsDialog(true);
                            }}
                          >
                            <Eye className="size-4" />
                          </Button>
                          {account.outstanding > 0 && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedPatient(account);
                                  setShowPaymentDialog(true);
                                }}
                              >
                                <CreditCard className="size-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleSendReminder(account)}
                              >
                                <Send className="size-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest payment and invoice transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((txn) => (
                  <div key={txn.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      {txn.type === 'payment' ? (
                        <div className="p-2 bg-green-100 rounded-lg">
                          <IndianRupee className="size-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <FileText className="size-5 text-blue-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{txn.patientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {txn.date} at {txn.time} • Ref: {txn.reference}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium">₹{txn.amount.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {txn.type === 'payment' ? 'Payment Received' : 'Invoice Generated'}
                        </p>
                      </div>
                      {txn.method && getPaymentMethodBadge(txn.method)}
                      <Badge variant={txn.status === 'completed' ? 'default' : 'outline'}>
                        {txn.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">UPI</span>
                      <span className="text-sm font-medium">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Card</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <Progress value={25} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Cash</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Insurance</span>
                      <span className="text-sm font-medium">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Collection Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="size-5 text-green-600" />
                      <span>On-time Payments</span>
                    </div>
                    <span className="font-bold text-green-600">78%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="size-5 text-yellow-600" />
                      <span>Late Payments (1-30 days)</span>
                    </div>
                    <span className="font-bold text-yellow-600">15%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="size-5 text-red-600" />
                      <span>Overdue (&gt;30 days)</span>
                    </div>
                    <span className="font-bold text-red-600">7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Insurance vs Self-Pay</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="size-5 text-blue-600" />
                      <span>Insurance Covered</span>
                    </div>
                    <span className="font-bold">35%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Building2 className="size-5 text-green-600" />
                      <span>Government Schemes</span>
                    </div>
                    <span className="font-bold">25%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <User className="size-5 text-gray-600" />
                      <span>Self-Pay</span>
                    </div>
                    <span className="font-bold">40%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Current Month</span>
                    <span className="font-bold text-green-600">₹45.2L</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Last Month</span>
                    <span className="font-bold">₹42.8L</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Growth</span>
                    <div className="flex items-center text-green-600">
                      <TrendingUp className="size-4 mr-1" />
                      <span className="font-bold">+5.6%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Record Payment Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              {selectedPatient ? `Record payment for ${selectedPatient.name}` : 'Select a patient to record payment'}
            </DialogDescription>
          </DialogHeader>
          
          {!selectedPatient ? (
            <div className="space-y-4">
              <div>
                <Label htmlFor="patient">Select Patient</Label>
                <Select onValueChange={(value) => setSelectedPatient(patientAccounts.find(p => p.id === value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patientAccounts.filter(acc => acc.outstanding > 0).map(acc => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.name} - ₹{acc.outstanding.toLocaleString()} outstanding
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Outstanding Amount:</span>
                  <span className="font-bold">₹{selectedPatient.outstanding.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <Label htmlFor="amount">Payment Amount *</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={paymentDetails.amount}
                  onChange={(e) => setPaymentDetails({...paymentDetails, amount: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="method">Payment Method *</Label>
                <Select 
                  value={paymentDetails.method} 
                  onValueChange={(value) => setPaymentDetails({...paymentDetails, method: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Card">Credit/Debit Card</SelectItem>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="Cheque">Cheque</SelectItem>
                    <SelectItem value="Insurance">Insurance Claim</SelectItem>
                    <SelectItem value="NEFT">NEFT/RTGS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reference">Reference Number</Label>
                <Input
                  id="reference"
                  placeholder="Transaction reference"
                  value={paymentDetails.reference}
                  onChange={(e) => setPaymentDetails({...paymentDetails, reference: e.target.value})}
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes..."
                  value={paymentDetails.notes}
                  onChange={(e) => setPaymentDetails({...paymentDetails, notes: e.target.value})}
                  rows={3}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowPaymentDialog(false);
              setSelectedPatient(null);
              setPaymentDetails({ amount: '', method: '', reference: '', notes: '' });
            }}>
              Cancel
            </Button>
            <Button onClick={handleRecordPayment} disabled={!selectedPatient}>
              <CheckCircle className="mr-2 size-4" />
              Record Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Patient Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Patient Billing Details</DialogTitle>
            <DialogDescription>
              Complete billing information for {selectedPatient?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedPatient && (
            <div className="space-y-4">
              {/* Patient Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground">Patient ID</p>
                  <p className="font-medium">{selectedPatient.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedPatient.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedPatient.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedPatient.email || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Ward</p>
                  <p className="font-medium">{selectedPatient.ward}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Stay Duration</p>
                  <p className="font-medium">
                    {selectedPatient.admissionDate} to {selectedPatient.dischargeDate}
                  </p>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="space-y-3">
                <h4 className="font-semibold">Financial Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between p-2 border-b">
                    <span>Total Billed</span>
                    <span className="font-medium">₹{selectedPatient.totalBilled.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-2 border-b">
                    <span>Total Paid</span>
                    <span className="font-medium text-green-600">₹{selectedPatient.totalPaid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between p-2 border-b font-bold">
                    <span>Outstanding</span>
                    <span className="text-orange-600">₹{selectedPatient.outstanding.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Coverage Info */}
              <div className="space-y-3">
                <h4 className="font-semibold">Coverage Information</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Insurance Provider</p>
                    <p className="font-medium">{selectedPatient.insuranceProvider || 'None'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Government Scheme</p>
                    <p className="font-medium">{selectedPatient.governmentScheme || 'None'}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 pt-4 border-t">
                <Button variant="outline">
                  <Printer className="mr-2 size-4" />
                  Print Statement
                </Button>
                <Button variant="outline" onClick={() => handleSendReminder(selectedPatient)}>
                  <Send className="mr-2 size-4" />
                  Send Reminder
                </Button>
                <Button>
                  <FileText className="mr-2 size-4" />
                  View Full History
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowDetailsDialog(false);
              setSelectedPatient(null);
            }}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
