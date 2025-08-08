'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import {
  ShoppingCart,
  Package,
  Truck,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Edit,
  Trash2,
  FileText,
  Download,
  Send,
  Search,
  Filter,
  Calendar,
  DollarSign,
  BarChart3,
  TrendingUp,
  Building,
  User,
  MapPin,
  Phone,
  Mail,
  Hash,
  IndianRupee,
  AlertTriangle,
  RefreshCw,
  Eye,
  Printer
} from 'lucide-react';
import { format } from 'date-fns';

interface Supplier {
  supplierId: string;
  supplierName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  gstNumber: string;
  drugLicense: string;
  paymentTerms: string;
  rating: number;
}

interface OrderItem {
  itemId: string;
  medicineId: string;
  medicineName: string;
  genericName: string;
  manufacturer: string;
  packaging: string;
  currentStock: number;
  reorderLevel: number;
  requiredQuantity: number;
  orderedQuantity: number;
  unitPrice: number;
  totalPrice: number;
  discount: number;
  tax: number;
  netAmount: number;
}

interface PurchaseOrder {
  orderId: string;
  orderNumber: string;
  supplierId: string;
  supplier: Supplier;
  orderDate: string;
  expectedDelivery: string;
  status: 'draft' | 'pending' | 'approved' | 'sent' | 'partial' | 'completed' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  totalDiscount: number;
  totalTax: number;
  shippingCharges: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'partial' | 'paid';
  paymentMode: 'cash' | 'bank_transfer' | 'cheque' | 'credit';
  notes?: string;
  approvedBy?: string;
  approvalDate?: string;
  createdBy: string;
  createdAt: string;
}

export default function PurchaseOrderManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [showManageSuppliers, setShowManageSuppliers] = useState(false);
  const [showAddMedicine, setShowAddMedicine] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PurchaseOrder | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>('');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [medicineSearch, setMedicineSearch] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
  const [medicineQuantity, setMedicineQuantity] = useState('');
  const [medicinePrice, setMedicinePrice] = useState('');

  // Mock data
  const [purchaseOrders] = useState<PurchaseOrder[]>([
    {
      orderId: 'PO001',
      orderNumber: 'PO/2024/08/001',
      supplierId: 'SUP001',
      supplier: {
        supplierId: 'SUP001',
        supplierName: 'MedSupply Pharma Pvt Ltd',
        contactPerson: 'Rajesh Verma',
        phone: '9876543210',
        email: 'orders@medsupply.com',
        address: '123 Industrial Area, Bangalore, Karnataka 560001',
        gstNumber: '29ABCDE1234F1Z5',
        drugLicense: 'KA-B-123456',
        paymentTerms: 'Net 30 days',
        rating: 4.5
      },
      orderDate: '2024-08-07',
      expectedDelivery: '2024-08-14',
      status: 'approved',
      items: [
        {
          itemId: 'ITEM001',
          medicineId: 'MED001',
          medicineName: 'Paracetamol 500mg',
          genericName: 'Paracetamol',
          manufacturer: 'Cipla',
          packaging: '10 tablets/strip',
          currentStock: 50,
          reorderLevel: 100,
          requiredQuantity: 500,
          orderedQuantity: 500,
          unitPrice: 2.5,
          totalPrice: 1250,
          discount: 125,
          tax: 135,
          netAmount: 1260
        },
        {
          itemId: 'ITEM002',
          medicineId: 'MED002',
          medicineName: 'Amoxicillin 500mg',
          genericName: 'Amoxicillin',
          manufacturer: 'Sun Pharma',
          packaging: '10 capsules/strip',
          currentStock: 30,
          reorderLevel: 80,
          requiredQuantity: 300,
          orderedQuantity: 300,
          unitPrice: 8.5,
          totalPrice: 2550,
          discount: 255,
          tax: 275.4,
          netAmount: 2570.4
        }
      ],
      subtotal: 3800,
      totalDiscount: 380,
      totalTax: 410.4,
      shippingCharges: 50,
      totalAmount: 3880.4,
      paymentStatus: 'pending',
      paymentMode: 'bank_transfer',
      notes: 'Urgent requirement for upcoming week',
      approvedBy: 'Dr. Admin',
      approvalDate: '2024-08-07T10:30:00',
      createdBy: 'Pharmacist A',
      createdAt: '2024-08-07T09:00:00'
    },
    {
      orderId: 'PO002',
      orderNumber: 'PO/2024/08/002',
      supplierId: 'SUP002',
      supplier: {
        supplierId: 'SUP002',
        supplierName: 'Generic Medicines Co.',
        contactPerson: 'Priya Sharma',
        phone: '9876543211',
        email: 'sales@genericmeds.com',
        address: '456 Pharma Park, Mumbai, Maharashtra 400001',
        gstNumber: '27XYZAB5678G2H6',
        drugLicense: 'MH-B-654321',
        paymentTerms: 'Net 15 days',
        rating: 4.8
      },
      orderDate: '2024-08-06',
      expectedDelivery: '2024-08-10',
      status: 'sent',
      items: [
        {
          itemId: 'ITEM003',
          medicineId: 'MED003',
          medicineName: 'Metformin 500mg',
          genericName: 'Metformin',
          manufacturer: 'Lupin',
          packaging: '10 tablets/strip',
          currentStock: 20,
          reorderLevel: 50,
          requiredQuantity: 200,
          orderedQuantity: 200,
          unitPrice: 3.5,
          totalPrice: 700,
          discount: 70,
          tax: 75.6,
          netAmount: 705.6
        }
      ],
      subtotal: 700,
      totalDiscount: 70,
      totalTax: 75.6,
      shippingCharges: 30,
      totalAmount: 735.6,
      paymentStatus: 'pending',
      paymentMode: 'cheque',
      createdBy: 'Pharmacist B',
      createdAt: '2024-08-06T14:00:00'
    },
    {
      orderId: 'PO003',
      orderNumber: 'PO/2024/08/003',
      supplierId: 'SUP001',
      supplier: {
        supplierId: 'SUP001',
        supplierName: 'MedSupply Pharma Pvt Ltd',
        contactPerson: 'Rajesh Verma',
        phone: '9876543210',
        email: 'orders@medsupply.com',
        address: '123 Industrial Area, Bangalore, Karnataka 560001',
        gstNumber: '29ABCDE1234F1Z5',
        drugLicense: 'KA-B-123456',
        paymentTerms: 'Net 30 days',
        rating: 4.5
      },
      orderDate: '2024-08-05',
      expectedDelivery: '2024-08-12',
      status: 'pending',
      items: [
        {
          itemId: 'ITEM004',
          medicineId: 'MED004',
          medicineName: 'Omeprazole 20mg',
          genericName: 'Omeprazole',
          manufacturer: 'Dr. Reddy\'s',
          packaging: '10 capsules/strip',
          currentStock: 40,
          reorderLevel: 60,
          requiredQuantity: 150,
          orderedQuantity: 150,
          unitPrice: 5.0,
          totalPrice: 750,
          discount: 75,
          tax: 81,
          netAmount: 756
        }
      ],
      subtotal: 750,
      totalDiscount: 75,
      totalTax: 81,
      shippingCharges: 30,
      totalAmount: 786,
      paymentStatus: 'pending',
      paymentMode: 'cash',
      createdBy: 'Pharmacist C',
      createdAt: '2024-08-05T11:00:00'
    },
    {
      orderId: 'PO004',
      orderNumber: 'PO/2024/08/004',
      supplierId: 'SUP002',
      supplier: {
        supplierId: 'SUP002',
        supplierName: 'Generic Medicines Co.',
        contactPerson: 'Priya Sharma',
        phone: '9876543211',
        email: 'sales@genericmeds.com',
        address: '456 Pharma Park, Mumbai, Maharashtra 400001',
        gstNumber: '27XYZAB5678G2H6',
        drugLicense: 'MH-B-654321',
        paymentTerms: 'Net 15 days',
        rating: 4.8
      },
      orderDate: '2024-08-04',
      expectedDelivery: '2024-08-09',
      status: 'draft',
      items: [
        {
          itemId: 'ITEM005',
          medicineId: 'MED005',
          medicineName: 'Atorvastatin 10mg',
          genericName: 'Atorvastatin',
          manufacturer: 'Ranbaxy',
          packaging: '10 tablets/strip',
          currentStock: 25,
          reorderLevel: 40,
          requiredQuantity: 100,
          orderedQuantity: 100,
          unitPrice: 7.0,
          totalPrice: 700,
          discount: 70,
          tax: 75.6,
          netAmount: 705.6
        }
      ],
      subtotal: 700,
      totalDiscount: 70,
      totalTax: 75.6,
      shippingCharges: 30,
      totalAmount: 735.6,
      paymentStatus: 'pending',
      paymentMode: 'bank_transfer',
      createdBy: 'Pharmacist A',
      createdAt: '2024-08-04T15:00:00'
    },
    {
      orderId: 'PO005',
      orderNumber: 'PO/2024/07/005',
      supplierId: 'SUP001',
      supplier: {
        supplierId: 'SUP001',
        supplierName: 'MedSupply Pharma Pvt Ltd',
        contactPerson: 'Rajesh Verma',
        phone: '9876543210',
        email: 'orders@medsupply.com',
        address: '123 Industrial Area, Bangalore, Karnataka 560001',
        gstNumber: '29ABCDE1234F1Z5',
        drugLicense: 'KA-B-123456',
        paymentTerms: 'Net 30 days',
        rating: 4.5
      },
      orderDate: '2024-07-28',
      expectedDelivery: '2024-08-02',
      status: 'completed',
      items: [
        {
          itemId: 'ITEM006',
          medicineId: 'MED006',
          medicineName: 'Azithromycin 500mg',
          genericName: 'Azithromycin',
          manufacturer: 'Alkem',
          packaging: '3 tablets/strip',
          currentStock: 15,
          reorderLevel: 30,
          requiredQuantity: 100,
          orderedQuantity: 100,
          unitPrice: 12.0,
          totalPrice: 1200,
          discount: 120,
          tax: 129.6,
          netAmount: 1209.6
        }
      ],
      subtotal: 1200,
      totalDiscount: 120,
      totalTax: 129.6,
      shippingCharges: 40,
      totalAmount: 1249.6,
      paymentStatus: 'paid',
      paymentMode: 'bank_transfer',
      notes: 'Delivered on time',
      approvedBy: 'Dr. Admin',
      approvalDate: '2024-07-28T14:00:00',
      createdBy: 'Pharmacist B',
      createdAt: '2024-07-28T10:00:00'
    }
  ]);

  const [suppliers] = useState<Supplier[]>([
    {
      supplierId: 'SUP001',
      supplierName: 'MedSupply Pharma Pvt Ltd',
      contactPerson: 'Rajesh Verma',
      phone: '9876543210',
      email: 'orders@medsupply.com',
      address: '123 Industrial Area, Bangalore, Karnataka 560001',
      gstNumber: '29ABCDE1234F1Z5',
      drugLicense: 'KA-B-123456',
      paymentTerms: 'Net 30 days',
      rating: 4.5
    },
    {
      supplierId: 'SUP002',
      supplierName: 'Generic Medicines Co.',
      contactPerson: 'Priya Sharma',
      phone: '9876543211',
      email: 'sales@genericmeds.com',
      address: '456 Pharma Park, Mumbai, Maharashtra 400001',
      gstNumber: '27XYZAB5678G2H6',
      drugLicense: 'MH-B-654321',
      paymentTerms: 'Net 15 days',
      rating: 4.8
    }
  ]);

  // Mock medicine data for selection
  const availableMedicines = [
    { id: 'MED001', name: 'Paracetamol 500mg', genericName: 'Paracetamol', manufacturer: 'Cipla', packaging: '10 tablets/strip', currentStock: 50, reorderLevel: 100 },
    { id: 'MED002', name: 'Amoxicillin 500mg', genericName: 'Amoxicillin', manufacturer: 'Sun Pharma', packaging: '10 capsules/strip', currentStock: 30, reorderLevel: 80 },
    { id: 'MED003', name: 'Metformin 500mg', genericName: 'Metformin', manufacturer: 'Lupin', packaging: '10 tablets/strip', currentStock: 20, reorderLevel: 50 },
    { id: 'MED004', name: 'Omeprazole 20mg', genericName: 'Omeprazole', manufacturer: 'Dr. Reddy\'s', packaging: '10 capsules/strip', currentStock: 40, reorderLevel: 60 },
    { id: 'MED005', name: 'Atorvastatin 10mg', genericName: 'Atorvastatin', manufacturer: 'Ranbaxy', packaging: '10 tablets/strip', currentStock: 25, reorderLevel: 40 },
    { id: 'MED006', name: 'Azithromycin 500mg', genericName: 'Azithromycin', manufacturer: 'Alkem', packaging: '3 tablets/strip', currentStock: 15, reorderLevel: 30 },
    { id: 'MED007', name: 'Cetirizine 10mg', genericName: 'Cetirizine', manufacturer: 'Glenmark', packaging: '10 tablets/strip', currentStock: 60, reorderLevel: 100 },
    { id: 'MED008', name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', manufacturer: 'Abbott', packaging: '10 tablets/strip', currentStock: 45, reorderLevel: 70 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'pending': return 'default';
      case 'approved': return 'default';
      case 'sent': return 'default';
      case 'partial': return 'default';
      case 'completed': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'default';
      case 'partial': return 'default';
      case 'pending': return 'destructive';
      default: return 'secondary';
    }
  };

  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesTab = activeTab === 'all' || order.status === activeTab;
    return matchesSearch && matchesStatus && matchesTab;
  });

  const handleApproveOrder = (orderId: string) => {
    toast({
      title: "Order approved",
      description: `Purchase order ${orderId} has been approved successfully`,
    });
  };

  const handleSendOrder = (orderId: string) => {
    toast({
      title: "Order sent",
      description: `Purchase order ${orderId} has been sent to supplier`,
    });
  };

  const handleCancelOrder = (orderId: string) => {
    toast({
      title: "Order cancelled",
      description: `Purchase order ${orderId} has been cancelled`,
    });
  };

  const calculateOrderSummary = () => {
    const total = purchaseOrders.length;
    const draft = purchaseOrders.filter(o => o.status === 'draft').length;
    const pending = purchaseOrders.filter(o => o.status === 'pending').length;
    const approved = purchaseOrders.filter(o => o.status === 'approved').length;
    const sent = purchaseOrders.filter(o => o.status === 'sent').length;
    const completed = purchaseOrders.filter(o => o.status === 'completed').length;
    
    return { total, draft, pending, approved, sent, completed };
  };

  const summary = calculateOrderSummary();

  const handleCreateOrder = () => {
    if (!selectedSupplier || orderItems.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please select a supplier and add items to the order",
        variant: "destructive"
      });
      return;
    }

    const newOrder = {
      orderNumber: `PO/2024/08/${String(purchaseOrders.length + 1).padStart(3, '0')}`,
      supplier: selectedSupplier,
      items: orderItems,
      status: 'draft'
    };

    toast({
      title: "Order created",
      description: `Purchase order ${newOrder.orderNumber} has been created successfully`,
    });
    
    setShowCreateOrder(false);
    setSelectedSupplier('');
    setOrderItems([]);
  };

  const handleAddSupplier = (supplier: Partial<Supplier>) => {
    toast({
      title: "Supplier added",
      description: `${supplier.supplierName} has been added successfully`,
    });
  };

  const handleAddMedicineToOrder = () => {
    if (!selectedMedicine || !medicineQuantity || !medicinePrice) {
      toast({
        title: "Validation Error",
        description: "Please select a medicine and enter quantity and price",
        variant: "destructive"
      });
      return;
    }

    const quantity = parseInt(medicineQuantity);
    const price = parseFloat(medicinePrice);
    const totalPrice = quantity * price;
    const discount = totalPrice * 0.1; // 10% discount
    const tax = (totalPrice - discount) * 0.12; // 12% tax
    const netAmount = totalPrice - discount + tax;

    const newItem: OrderItem = {
      itemId: `ITEM${orderItems.length + 1}`,
      medicineId: selectedMedicine.id,
      medicineName: selectedMedicine.name,
      genericName: selectedMedicine.genericName,
      manufacturer: selectedMedicine.manufacturer,
      packaging: selectedMedicine.packaging,
      currentStock: selectedMedicine.currentStock,
      reorderLevel: selectedMedicine.reorderLevel,
      requiredQuantity: quantity,
      orderedQuantity: quantity,
      unitPrice: price,
      totalPrice: totalPrice,
      discount: discount,
      tax: tax,
      netAmount: netAmount
    };

    setOrderItems([...orderItems, newItem]);
    setShowAddMedicine(false);
    setSelectedMedicine(null);
    setMedicineQuantity('');
    setMedicinePrice('');
    setMedicineSearch('');

    toast({
      title: "Medicine added",
      description: `${selectedMedicine.name} has been added to the order`,
    });
  };

  const handleRemoveMedicineFromOrder = (itemId: string) => {
    setOrderItems(orderItems.filter(item => item.itemId !== itemId));
    toast({
      title: "Medicine removed",
      description: "Medicine has been removed from the order",
    });
  };

  const filteredMedicines = availableMedicines.filter(medicine =>
    medicine.name.toLowerCase().includes(medicineSearch.toLowerCase()) ||
    medicine.genericName.toLowerCase().includes(medicineSearch.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Purchase Order Management</h1>
          <p className="text-muted-foreground">Manage medicine procurement and supplier orders</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowManageSuppliers(true)}>
            <Building className="h-4 w-4 mr-2" />
            Manage Suppliers
          </Button>
          <Button size="sm" onClick={() => setShowCreateOrder(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Order
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Orders</p>
                <p className="text-2xl font-bold">{summary.total}</p>
              </div>
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Draft</p>
                <p className="text-2xl font-bold text-gray-600">{summary.draft}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold text-blue-600">{summary.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sent</p>
                <p className="text-2xl font-bold text-purple-600">{summary.sent}</p>
              </div>
              <Send className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-green-600">{summary.completed}</p>
              </div>
              <Package className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by order number or supplier..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="pending">Pending Approval</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="sent">Sent to Supplier</SelectItem>
                <SelectItem value="partial">Partially Received</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
          <CardDescription>Click on an order to view details and take actions</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {filteredOrders.map((order) => (
                    <Card 
                      key={order.orderId} 
                      className="cursor-pointer hover:bg-accent/50"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowOrderDetails(true);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{order.orderNumber}</p>
                                <Badge variant={getStatusColor(order.status)}>
                                  {order.status.replace('_', ' ').toUpperCase()}
                                </Badge>
                                <Badge variant={getPaymentStatusColor(order.paymentStatus)}>
                                  Payment: {order.paymentStatus}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                  <Building className="h-3 w-3" />
                                  {order.supplier.supplierName}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  {format(new Date(order.orderDate), 'dd MMM yyyy')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Truck className="h-3 w-3" />
                                  Expected: {format(new Date(order.expectedDelivery), 'dd MMM')}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Package className="h-3 w-3" />
                                  {order.items.length} items
                                </span>
                                <span className="flex items-center gap-1">
                                  <IndianRupee className="h-3 w-3" />
                                  {order.totalAmount.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {order.status === 'pending' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleApproveOrder(order.orderNumber);
                                }}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                            )}
                            
                            {order.status === 'approved' && (
                              <Button 
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSendOrder(order.orderNumber);
                                }}
                              >
                                <Send className="h-4 w-4 mr-2" />
                                Send to Supplier
                              </Button>
                            )}
                            
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Order Details Modal */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Purchase Order Details</DialogTitle>
            <DialogDescription>
              Order {selectedOrder?.orderNumber} - {selectedOrder?.supplier.supplierName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {/* Supplier Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Supplier Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium">{selectedOrder.supplier.supplierName}</p>
                        <p className="text-muted-foreground">{selectedOrder.supplier.address}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          {selectedOrder.supplier.contactPerson}
                        </p>
                        <p className="flex items-center gap-2">
                          <Phone className="h-3 w-3" />
                          {selectedOrder.supplier.phone}
                        </p>
                        <p className="flex items-center gap-2">
                          <Mail className="h-3 w-3" />
                          {selectedOrder.supplier.email}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Order Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item) => (
                        <div key={item.itemId} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <p className="font-medium">{item.medicineName}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.genericName} • {item.manufacturer} • {item.packaging}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {item.orderedQuantity} units × ₹{item.unitPrice}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Total: ₹{item.netAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Order Summary */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-₹{selectedOrder.totalDiscount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax</span>
                        <span>₹{selectedOrder.totalTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>₹{selectedOrder.shippingCharges.toFixed(2)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold text-base">
                        <span>Total Amount</span>
                        <span>₹{selectedOrder.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Notes */}
                {selectedOrder.notes && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Notes</AlertTitle>
                    <AlertDescription>{selectedOrder.notes}</AlertDescription>
                  </Alert>
                )}
              </div>
            </ScrollArea>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderDetails(false)}>
              Close
            </Button>
            <Button variant="outline">
              <Printer className="h-4 w-4 mr-2" />
              Print Order
            </Button>
            {selectedOrder?.status === 'approved' && (
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Send to Supplier
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Order Modal */}
      <Dialog open={showCreateOrder} onOpenChange={setShowCreateOrder}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Create Purchase Order</DialogTitle>
            <DialogDescription>
              Create a new purchase order for medicine procurement
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-6">
              {/* Supplier Selection */}
              <div className="space-y-2">
                <Label>Select Supplier</Label>
                <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a supplier" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier) => (
                      <SelectItem key={supplier.supplierId} value={supplier.supplierId}>
                        <div className="flex items-center justify-between w-full">
                          <span>{supplier.supplierName}</span>
                          <Badge variant="outline" className="ml-2">
                            Rating: {supplier.rating}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Add Items Section */}
              <div className="space-y-2">
                <Label>Order Items</Label>
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      <Button onClick={() => setShowAddMedicine(true)} className="w-full">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Medicine
                      </Button>
                      
                      {orderItems.length > 0 ? (
                        <div className="space-y-2">
                          {orderItems.map((item) => (
                            <div key={item.itemId} className="flex items-center justify-between p-3 border rounded">
                              <div className="flex-1">
                                <p className="font-medium">{item.medicineName}</p>
                                <p className="text-sm text-muted-foreground">
                                  {item.genericName} • {item.manufacturer} • {item.packaging}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  Quantity: {item.orderedQuantity} × ₹{item.unitPrice} = ₹{item.netAmount.toFixed(2)}
                                </p>
                              </div>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoveMedicineFromOrder(item.itemId)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                          <div className="border-t pt-2">
                            <div className="flex justify-between font-semibold">
                              <span>Total Items: {orderItems.length}</span>
                              <span>Total Amount: ₹{orderItems.reduce((sum, item) => sum + item.netAmount, 0).toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          No items added yet. Click "Add Medicine" to add medicines to the order.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Delivery Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Expected Delivery Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Payment Terms</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment terms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Cash on Delivery</SelectItem>
                      <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                      <SelectItem value="cheque">Cheque</SelectItem>
                      <SelectItem value="credit">Credit (30 days)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Textarea 
                  placeholder="Add any special instructions or notes for this order..."
                  rows={3}
                />
              </div>
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateOrder(false)}>
              Cancel
            </Button>
            <Button variant="outline">
              Save as Draft
            </Button>
            <Button onClick={handleCreateOrder}>
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage Suppliers Modal */}
      <Dialog open={showManageSuppliers} onOpenChange={setShowManageSuppliers}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Manage Suppliers</DialogTitle>
            <DialogDescription>
              Add, edit, or remove medicine suppliers
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="list" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list">Supplier List</TabsTrigger>
              <TabsTrigger value="add">Add New Supplier</TabsTrigger>
            </TabsList>
            
            <TabsContent value="list">
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {suppliers.map((supplier) => (
                    <Card key={supplier.supplierId}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{supplier.supplierName}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {supplier.contactPerson}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {supplier.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" />
                                {supplier.email}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span>GST: {supplier.gstNumber}</span>
                              <span>License: {supplier.drugLicense}</span>
                              <Badge variant="outline">Rating: {supplier.rating}</Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="add">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Supplier Name</Label>
                    <Input placeholder="Enter supplier name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Person</Label>
                    <Input placeholder="Enter contact person name" />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input placeholder="Enter phone number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Email Address</Label>
                    <Input type="email" placeholder="Enter email address" />
                  </div>
                  <div className="space-y-2">
                    <Label>GST Number</Label>
                    <Input placeholder="Enter GST number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Drug License Number</Label>
                    <Input placeholder="Enter drug license number" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Textarea placeholder="Enter complete address" rows={3} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Payment Terms</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="net15">Net 15 days</SelectItem>
                        <SelectItem value="net30">Net 30 days</SelectItem>
                        <SelectItem value="net45">Net 45 days</SelectItem>
                        <SelectItem value="cod">Cash on Delivery</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Supplier Rating</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5 - Excellent</SelectItem>
                        <SelectItem value="4">4 - Good</SelectItem>
                        <SelectItem value="3">3 - Average</SelectItem>
                        <SelectItem value="2">2 - Below Average</SelectItem>
                        <SelectItem value="1">1 - Poor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline">Clear</Button>
                  <Button onClick={() => handleAddSupplier({ supplierName: 'New Supplier' })}>
                    Add Supplier
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowManageSuppliers(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Medicine to Order Dialog */}
      <Dialog open={showAddMedicine} onOpenChange={setShowAddMedicine}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Medicine to Order</DialogTitle>
            <DialogDescription>
              Search and select medicines to add to the purchase order
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Medicine Search */}
            <div className="space-y-2">
              <Label>Search Medicine</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by medicine name or generic name..."
                  value={medicineSearch}
                  onChange={(e) => setMedicineSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Medicine List */}
            <div className="space-y-2">
              <Label>Select Medicine</Label>
              <ScrollArea className="h-[200px] border rounded-md">
                <div className="p-2 space-y-2">
                  {filteredMedicines.map((medicine) => (
                    <div
                      key={medicine.id}
                      className={`p-3 rounded cursor-pointer hover:bg-accent/50 border ${
                        selectedMedicine?.id === medicine.id ? 'border-primary bg-accent' : ''
                      }`}
                      onClick={() => setSelectedMedicine(medicine)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{medicine.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {medicine.genericName} • {medicine.manufacturer} • {medicine.packaging}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              Stock: {medicine.currentStock}
                            </span>
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              Reorder: {medicine.reorderLevel}
                            </span>
                            {medicine.currentStock < medicine.reorderLevel && (
                              <Badge variant="destructive" className="text-xs">
                                Low Stock
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Checkbox
                          checked={selectedMedicine?.id === medicine.id}
                          onCheckedChange={() => setSelectedMedicine(medicine)}
                        />
                      </div>
                    </div>
                  ))}
                  {filteredMedicines.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      No medicines found matching your search
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Quantity and Price */}
            {selectedMedicine && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    value={medicineQuantity}
                    onChange={(e) => setMedicineQuantity(e.target.value)}
                    min="1"
                  />
                  <p className="text-xs text-muted-foreground">
                    Current Stock: {selectedMedicine.currentStock} units
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Unit Price (₹)</Label>
                  <Input
                    type="number"
                    placeholder="Enter unit price"
                    value={medicinePrice}
                    onChange={(e) => setMedicinePrice(e.target.value)}
                    min="0"
                    step="0.01"
                  />
                  {medicineQuantity && medicinePrice && (
                    <p className="text-xs text-muted-foreground">
                      Total: ₹{(parseInt(medicineQuantity) * parseFloat(medicinePrice)).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Summary */}
            {selectedMedicine && medicineQuantity && medicinePrice && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Order Summary</AlertTitle>
                <AlertDescription>
                  <div className="space-y-1 mt-2">
                    <p>Medicine: {selectedMedicine.name}</p>
                    <p>Quantity: {medicineQuantity} units × ₹{medicinePrice} = ₹{(parseInt(medicineQuantity) * parseFloat(medicinePrice)).toFixed(2)}</p>
                    <p>Discount (10%): ₹{(parseInt(medicineQuantity) * parseFloat(medicinePrice) * 0.1).toFixed(2)}</p>
                    <p>Tax (12%): ₹{((parseInt(medicineQuantity) * parseFloat(medicinePrice) * 0.9) * 0.12).toFixed(2)}</p>
                    <p className="font-semibold">
                      Net Amount: ₹{((parseInt(medicineQuantity) * parseFloat(medicinePrice) * 0.9) * 1.12).toFixed(2)}
                    </p>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddMedicine(false);
              setSelectedMedicine(null);
              setMedicineQuantity('');
              setMedicinePrice('');
              setMedicineSearch('');
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddMedicineToOrder}
              disabled={!selectedMedicine || !medicineQuantity || !medicinePrice}
            >
              Add to Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}