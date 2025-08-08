'use client';

import React, { useState, useEffect } from 'react';
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
import { Progress } from '@/components/ui/progress';
import {
  Package,
  AlertTriangle,
  Clock,
  TrendingDown,
  TrendingUp,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  FileText,
  Download,
  Upload,
  BarChart3,
  ShoppingCart,
  AlertCircle,
  Calendar,
  DollarSign,
  Activity,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Pill,
  Database,
  MapPin,
  Hash,
  IndianRupee,
  PackageCheck,
  PackageX,
  PackagePlus,
  PackageMinus,
  Truck,
  CheckCircle,
  XCircle,
  Info
} from 'lucide-react';
import { format, differenceInDays, addDays, isBefore } from 'date-fns';

interface Medicine {
  medicineId: string;
  medicineCode: string;
  medicineName: string;
  genericName: string;
  category: string;
  dosageForm: string;
  strength: string;
  manufacturer: string;
  hsnCode?: string;
  scheduleType?: string;
  storageConditions?: string;
  requiresRefrigeration?: boolean;
  lightSensitive?: boolean;
}

interface InventoryItem {
  inventoryId: string;
  clinicId?: string; // For multi-tenant support
  medicineId: string;
  medicine: Medicine;
  currentStock: number;
  unitOfMeasurement: string;
  batchNumber: string;
  expiryDate: string;
  manufacturingDate?: string;
  purchasePrice: number;
  sellingPrice: number;
  mrp: number;
  discountPercentage: number;
  reorderLevel: number;
  minimumStock: number;
  maximumStock: number;
  rackNumber?: string;
  shelfNumber?: string;
  supplierName?: string;
  stockStatus: 'Normal' | 'Low' | 'Critical' | 'Out of Stock' | 'Overstocked';
  lastUpdated: string;
}

interface StockMovement {
  movementId: string;
  clinicId?: string; // For multi-tenant support
  medicineId: string;
  inventoryId?: string; // Reference to inventory item
  medicine: Medicine;
  movementType: 'Purchase' | 'Sale' | 'Return' | 'Adjustment' | 'Expired' | 'Damaged';
  movementDate: string;
  quantity: number;
  unitOfMeasurement: string;
  referenceType?: string;
  referenceId?: string;
  stockBefore: number;
  stockAfter: number;
  unitCost?: number;
  totalCost?: number;
  performedBy: string;
  notes?: string;
}

interface StockAlert {
  type: 'low_stock' | 'out_of_stock' | 'expiring_soon' | 'expired' | 'overstock';
  severity: 'critical' | 'warning' | 'info';
  items: InventoryItem[];
  message: string;
}

function InventoryManagement() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [showAddStock, setShowAddStock] = useState(false);
  const [showAdjustStock, setShowAdjustStock] = useState(false);
  const [showMovementHistory, setShowMovementHistory] = useState(false);
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [selectedMovements, setSelectedMovements] = useState<StockMovement[]>([]);

  // Mock data for inventory
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      inventoryId: 'INV001',
      medicineId: 'MED001',
      medicine: {
        medicineId: 'MED001',
        medicineName: 'Paracetamol',
        genericName: 'Acetaminophen',
        category: 'Analgesic',
        dosageForm: 'Tablet',
        strength: '500mg',
        manufacturer: 'PharmaCorp',
        scheduleType: 'OTC'
      },
      currentStock: 2500,
      unitOfMeasurement: 'Tablets',
      batchNumber: 'PCM2024001',
      expiryDate: '2025-06-15',
      manufacturingDate: '2024-01-15',
      purchasePrice: 1.50,
      sellingPrice: 2.50,
      mrp: 3.00,
      discountPercentage: 10,
      reorderLevel: 500,
      minimumStock: 200,
      maximumStock: 5000,
      rackNumber: 'A1',
      shelfNumber: '3',
      stockStatus: 'Normal',
      lastUpdated: new Date().toISOString()
    },
    {
      inventoryId: 'INV002',
      medicineId: 'MED002',
      medicine: {
        medicineId: 'MED002',
        medicineName: 'Amoxicillin',
        genericName: 'Amoxicillin Trihydrate',
        category: 'Antibiotic',
        dosageForm: 'Capsule',
        strength: '500mg',
        manufacturer: 'BioMed Inc',
        scheduleType: 'H'
      },
      currentStock: 150,
      unitOfMeasurement: 'Capsules',
      batchNumber: 'AMX2024005',
      expiryDate: '2024-12-01',
      manufacturingDate: '2023-12-01',
      purchasePrice: 8.00,
      sellingPrice: 15.00,
      mrp: 18.00,
      discountPercentage: 15,
      reorderLevel: 200,
      minimumStock: 100,
      maximumStock: 1000,
      rackNumber: 'B2',
      shelfNumber: '1',
      stockStatus: 'Low',
      lastUpdated: new Date().toISOString()
    },
    {
      inventoryId: 'INV003',
      medicineId: 'MED003',
      medicine: {
        medicineId: 'MED003',
        medicineName: 'Omeprazole',
        genericName: 'Omeprazole',
        category: 'Antacid',
        dosageForm: 'Capsule',
        strength: '20mg',
        manufacturer: 'GastroPharm',
        scheduleType: 'OTC'
      },
      currentStock: 0,
      unitOfMeasurement: 'Capsules',
      batchNumber: 'OMP2024003',
      expiryDate: '2024-09-15',
      manufacturingDate: '2023-09-15',
      purchasePrice: 5.00,
      sellingPrice: 12.00,
      mrp: 14.00,
      discountPercentage: 12,
      reorderLevel: 150,
      minimumStock: 50,
      maximumStock: 500,
      rackNumber: 'C3',
      shelfNumber: '2',
      stockStatus: 'Out of Stock',
      lastUpdated: new Date().toISOString()
    },
    {
      inventoryId: 'INV004',
      medicineId: 'MED004',
      medicine: {
        medicineId: 'MED004',
        medicineName: 'Insulin Glargine',
        genericName: 'Insulin Glargine',
        category: 'Antidiabetic',
        dosageForm: 'Injection',
        strength: '100IU/ml',
        manufacturer: 'DiabetesCare',
        scheduleType: 'H'
      },
      currentStock: 25,
      unitOfMeasurement: 'Vials',
      batchNumber: 'INS2024002',
      expiryDate: '2024-08-20',
      manufacturingDate: '2024-02-20',
      purchasePrice: 800.00,
      sellingPrice: 1200.00,
      mrp: 1400.00,
      discountPercentage: 10,
      reorderLevel: 20,
      minimumStock: 10,
      maximumStock: 100,
      rackNumber: 'REF1',
      shelfNumber: '1',
      stockStatus: 'Normal',
      lastUpdated: new Date().toISOString()
    },
    {
      inventoryId: 'INV005',
      medicineId: 'MED005',
      medicine: {
        medicineId: 'MED005',
        medicineName: 'Atorvastatin',
        genericName: 'Atorvastatin Calcium',
        category: 'Lipid-lowering',
        dosageForm: 'Tablet',
        strength: '20mg',
        manufacturer: 'StatinPharma',
        scheduleType: 'H'
      },
      currentStock: 3500,
      unitOfMeasurement: 'Tablets',
      batchNumber: 'ATV2024012',
      expiryDate: '2025-08-20',
      manufacturingDate: '2024-02-20',
      purchasePrice: 3.00,
      sellingPrice: 8.00,
      mrp: 10.00,
      discountPercentage: 15,
      reorderLevel: 300,
      minimumStock: 200,
      maximumStock: 2000,
      rackNumber: 'D4',
      shelfNumber: '3',
      stockStatus: 'Overstocked',
      lastUpdated: new Date().toISOString()
    }
  ]);

  // Mock stock movements
  const [stockMovements] = useState<StockMovement[]>([
    {
      movementId: 'MOV001',
      medicineId: 'MED001',
      medicine: inventory[0].medicine,
      movementType: 'Sale',
      movementDate: new Date().toISOString(),
      quantity: 20,
      unitOfMeasurement: 'Tablets',
      referenceType: 'Prescription',
      referenceId: 'RX001',
      stockBefore: 2520,
      stockAfter: 2500,
      unitCost: 2.50,
      totalCost: 50.00,
      performedBy: 'Pharmacist A',
      notes: 'Dispensed to patient'
    },
    {
      movementId: 'MOV002',
      medicineId: 'MED001',
      medicine: inventory[0].medicine,
      movementType: 'Purchase',
      movementDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      quantity: 1000,
      unitOfMeasurement: 'Tablets',
      referenceType: 'Purchase Order',
      referenceId: 'PO2024001',
      stockBefore: 1520,
      stockAfter: 2520,
      unitCost: 1.50,
      totalCost: 1500.00,
      performedBy: 'Store Manager',
      notes: 'Regular stock replenishment'
    }
  ]);

  // Calculate statistics
  const calculateStats = () => {
    const totalItems = inventory.length;
    const totalValue = inventory.reduce((sum, item) => sum + (item.currentStock * item.sellingPrice), 0);
    const lowStockItems = inventory.filter(item => item.stockStatus === 'Low').length;
    const outOfStockItems = inventory.filter(item => item.stockStatus === 'Out of Stock').length;
    const expiringItems = inventory.filter(item => {
      const daysToExpiry = differenceInDays(new Date(item.expiryDate), new Date());
      return daysToExpiry <= 30 && daysToExpiry > 0;
    }).length;

    return {
      totalItems,
      totalValue,
      lowStockItems,
      outOfStockItems,
      expiringItems
    };
  };

  const stats = calculateStats();

  // Get stock alerts
  const getStockAlerts = (): StockAlert[] => {
    const alerts: StockAlert[] = [];

    // Out of stock alert
    const outOfStock = inventory.filter(item => item.currentStock === 0);
    if (outOfStock.length > 0) {
      alerts.push({
        type: 'out_of_stock',
        severity: 'critical',
        items: outOfStock,
        message: `${outOfStock.length} items are out of stock`
      });
    }

    // Low stock alert
    const lowStock = inventory.filter(item => 
      item.currentStock > 0 && item.currentStock <= item.reorderLevel
    );
    if (lowStock.length > 0) {
      alerts.push({
        type: 'low_stock',
        severity: 'warning',
        items: lowStock,
        message: `${lowStock.length} items are below reorder level`
      });
    }

    // Expiring soon alert
    const expiringSoon = inventory.filter(item => {
      const daysToExpiry = differenceInDays(new Date(item.expiryDate), new Date());
      return daysToExpiry <= 30 && daysToExpiry > 0;
    });
    if (expiringSoon.length > 0) {
      alerts.push({
        type: 'expiring_soon',
        severity: 'warning',
        items: expiringSoon,
        message: `${expiringSoon.length} items expiring within 30 days`
      });
    }

    // Expired alert
    const expired = inventory.filter(item => 
      isBefore(new Date(item.expiryDate), new Date())
    );
    if (expired.length > 0) {
      alerts.push({
        type: 'expired',
        severity: 'critical',
        items: expired,
        message: `${expired.length} items have expired`
      });
    }

    return alerts;
  };

  const stockAlerts = getStockAlerts();

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Normal': return 'default';
      case 'Low': return 'default';
      case 'Critical': return 'destructive';
      case 'Out of Stock': return 'destructive';
      case 'Overstocked': return 'secondary';
      default: return 'outline';
    }
  };

  // Get expiry status
  const getExpiryStatus = (expiryDate: string) => {
    const daysToExpiry = differenceInDays(new Date(expiryDate), new Date());
    
    if (daysToExpiry < 0) {
      return { status: 'Expired', color: 'destructive', days: Math.abs(daysToExpiry) };
    } else if (daysToExpiry <= 30) {
      return { status: 'Expiring Soon', color: 'default', days: daysToExpiry };
    } else if (daysToExpiry <= 90) {
      return { status: 'Caution', color: 'secondary', days: daysToExpiry };
    } else {
      return { status: 'Good', color: 'default', days: daysToExpiry };
    }
  };

  // Filter inventory
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = 
      item.medicine.medicineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.medicine.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batchNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = filterCategory === 'all' || item.medicine.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || item.stockStatus === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle stock adjustment
  const handleStockAdjustment = (item: InventoryItem, adjustmentType: string, quantity: number, notes: string) => {
    const newStock = adjustmentType === 'add' ? item.currentStock + quantity : item.currentStock - quantity;
    
    // Update inventory
    setInventory(prev => prev.map(inv => 
      inv.inventoryId === item.inventoryId 
        ? { 
            ...inv, 
            currentStock: newStock,
            stockStatus: newStock === 0 ? 'Out of Stock' : 
                        newStock <= inv.reorderLevel ? 'Low' :
                        newStock >= inv.maximumStock ? 'Overstocked' : 'Normal',
            lastUpdated: new Date().toISOString()
          }
        : inv
    ));

    toast({
      title: "Stock adjusted",
      description: `${item.medicine.medicineName} stock ${adjustmentType === 'add' ? 'increased' : 'decreased'} by ${quantity}`,
    });

    setShowAdjustStock(false);
    setSelectedItem(null);
  };

  const handleExportReport = () => {
    // Mock export functionality
    const csvContent = inventory.map(item => 
      `"${item.medicine.medicineName}","${item.medicine.medicineCode}","${item.currentStock}","${item.medicine.unitOfMeasurement}","${item.expiryDate}","${item.reorderLevel}"`
    ).join('\n');
    
    const header = '"Medicine Name","Code","Current Stock","Unit","Expiry Date","Reorder Level"\n';
    const blob = new Blob([header + csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `inventory_report_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Report exported successfully",
      description: "Inventory report has been downloaded as CSV file",
    });
  };

  const handleAddMedicine = (medicineData: any) => {
    // Mock adding new medicine
    const newItem: InventoryItem = {
      inventoryId: `INV${String(inventory.length + 1).padStart(3, '0')}`,
      medicineId: `MED${String(inventory.length + 1).padStart(3, '0')}`,
      medicine: {
        medicineId: `MED${String(inventory.length + 1).padStart(3, '0')}`,
        medicineName: medicineData.name,
        medicineCode: medicineData.code,
        genericName: medicineData.genericName,
        manufacturer: medicineData.manufacturer,
        unitOfMeasurement: medicineData.unit,
        category: medicineData.category,
        price: medicineData.price,
      },
      currentStock: medicineData.initialStock || 0,
      expiryDate: medicineData.expiryDate,
      batchNumber: medicineData.batchNumber,
      location: medicineData.location || 'Shelf A1',
      reorderLevel: medicineData.reorderLevel || 50,
      maximumStock: medicineData.maxStock || 500,
      stockStatus: 'Normal',
      lastUpdated: new Date().toISOString(),
    };
    
    setInventory([...inventory, newItem]);
    setShowAddMedicineModal(false);
    
    toast({
      title: "Medicine added successfully",
      description: `${medicineData.name} has been added to inventory`,
    });
  };

  const handleImportStock = (file: File) => {
    // Mock import functionality
    toast({
      title: "Import started",
      description: `Processing file: ${file.name}`,
    });
    
    // Simulate processing
    setTimeout(() => {
      setShowImportModal(false);
      toast({
        title: "Import completed",
        description: "Stock data has been imported successfully",
      });
    }, 2000);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pharmacy Inventory Management</h1>
          <p className="text-muted-foreground">Manage medicine stock, track expiry dates, and monitor inventory levels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowImportModal(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import Stock
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button size="sm" onClick={() => setShowAddMedicineModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add New Medicine
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">Medicine types in stock</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{stats.totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current inventory value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.lowStockItems}</div>
            <p className="text-xs text-muted-foreground">Items below reorder level</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.outOfStockItems}</div>
            <p className="text-xs text-muted-foreground">Items need ordering</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.expiringItems}</div>
            <p className="text-xs text-muted-foreground">Within 30 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Stock Alerts */}
      {stockAlerts.length > 0 && (
        <div className="space-y-2">
          {stockAlerts.map((alert, index) => (
            <Alert key={index} className={`border-${alert.severity === 'critical' ? 'red' : alert.severity === 'warning' ? 'amber' : 'blue'}-200`}>
              {alert.severity === 'critical' ? (
                <AlertCircle className="h-4 w-4 text-red-500" />
              ) : alert.severity === 'warning' ? (
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              ) : (
                <Info className="h-4 w-4 text-blue-500" />
              )}
              <AlertTitle className="text-sm font-medium">{alert.message}</AlertTitle>
              <AlertDescription className="text-xs">
                {alert.items.slice(0, 3).map(item => item.medicine.medicineName).join(', ')}
                {alert.items.length > 3 && ` and ${alert.items.length - 3} more`}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Inventory</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search medicines, batch numbers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Analgesic">Analgesic</SelectItem>
                  <SelectItem value="Antibiotic">Antibiotic</SelectItem>
                  <SelectItem value="Antacid">Antacid</SelectItem>
                  <SelectItem value="Antidiabetic">Antidiabetic</SelectItem>
                  <SelectItem value="Lipid-lowering">Lipid-lowering</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Normal">Normal</SelectItem>
                  <SelectItem value="Low">Low Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  <SelectItem value="Overstocked">Overstocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="expiry">Expiry Tracking</TabsTrigger>
              <TabsTrigger value="movements">Stock Movements</TabsTrigger>
              <TabsTrigger value="reorder">Reorder List</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-4">
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {filteredInventory.map((item) => {
                    const expiryStatus = getExpiryStatus(item.expiryDate);
                    const stockPercentage = (item.currentStock / item.maximumStock) * 100;
                    
                    return (
                      <Card key={item.inventoryId} className="hover:bg-accent/50 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Pill className="h-5 w-5 text-muted-foreground" />
                                <div>
                                  <h3 className="font-semibold text-lg">{item.medicine.medicineName}</h3>
                                  <p className="text-sm text-muted-foreground">
                                    {item.medicine.genericName} • {item.medicine.strength} • {item.medicine.dosageForm}
                                  </p>
                                </div>
                                <Badge variant={getStatusColor(item.stockStatus)}>
                                  {item.stockStatus}
                                </Badge>
                                {item.medicine.scheduleType && (
                                  <Badge variant="outline" className="text-xs">
                                    Schedule {item.medicine.scheduleType}
                                  </Badge>
                                )}
                              </div>

                              <div className="grid grid-cols-6 gap-4 text-sm">
                                <div>
                                  <p className="text-muted-foreground">Current Stock</p>
                                  <p className="font-semibold text-lg">
                                    {item.currentStock} {item.unitOfMeasurement}
                                  </p>
                                  <Progress value={stockPercentage} className="h-2 mt-1" />
                                </div>

                                <div>
                                  <p className="text-muted-foreground">Batch Number</p>
                                  <p className="font-medium">{item.batchNumber}</p>
                                  <p className="text-xs text-muted-foreground">
                                    Mfg: {item.manufacturingDate && format(new Date(item.manufacturingDate), 'MMM yyyy')}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground">Expiry Date</p>
                                  <p className="font-medium">{format(new Date(item.expiryDate), 'dd MMM yyyy')}</p>
                                  <Badge variant={expiryStatus.color as any} className="text-xs mt-1">
                                    {expiryStatus.status} ({expiryStatus.days}d)
                                  </Badge>
                                </div>

                                <div>
                                  <p className="text-muted-foreground">Location</p>
                                  <p className="font-medium flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {item.rackNumber}/{item.shelfNumber}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground">Pricing</p>
                                  <p className="font-medium">₹{item.sellingPrice}</p>
                                  <p className="text-xs text-muted-foreground">
                                    MRP: ₹{item.mrp}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-muted-foreground">Stock Levels</p>
                                  <p className="text-xs">Min: {item.minimumStock}</p>
                                  <p className="text-xs">Reorder: {item.reorderLevel}</p>
                                  <p className="text-xs">Max: {item.maximumStock}</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-2 ml-4">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setShowAdjustStock(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedItem(item);
                                  setSelectedMovements(stockMovements.filter(m => m.medicineId === item.medicineId));
                                  setShowMovementHistory(true);
                                }}
                              >
                                <Activity className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="expiry" className="mt-4">
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {['Expired', 'Expiring Soon', 'Caution', 'Good'].map(status => {
                    const itemsInStatus = filteredInventory.filter(item => 
                      getExpiryStatus(item.expiryDate).status === status
                    );
                    
                    if (itemsInStatus.length === 0) return null;
                    
                    return (
                      <div key={status}>
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          {status === 'Expired' && <XCircle className="h-5 w-5 text-red-500" />}
                          {status === 'Expiring Soon' && <AlertTriangle className="h-5 w-5 text-amber-500" />}
                          {status === 'Caution' && <Clock className="h-5 w-5 text-orange-500" />}
                          {status === 'Good' && <CheckCircle className="h-5 w-5 text-green-500" />}
                          {status} ({itemsInStatus.length})
                        </h3>
                        <div className="grid gap-2">
                          {itemsInStatus.map(item => {
                            const expiryStatus = getExpiryStatus(item.expiryDate);
                            return (
                              <Card key={item.inventoryId}>
                                <CardContent className="p-3">
                                  <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                      <div>
                                        <p className="font-medium">{item.medicine.medicineName}</p>
                                        <p className="text-sm text-muted-foreground">
                                          Batch: {item.batchNumber} • Stock: {item.currentStock} {item.unitOfMeasurement}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">{format(new Date(item.expiryDate), 'dd MMM yyyy')}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {expiryStatus.days === 0 ? 'Today' : 
                                         expiryStatus.days < 0 ? `${Math.abs(expiryStatus.days)} days ago` :
                                         `${expiryStatus.days} days remaining`}
                                      </p>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="movements" className="mt-4">
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {stockMovements.map((movement) => (
                    <Card key={movement.movementId}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            {movement.movementType === 'Purchase' && <PackagePlus className="h-5 w-5 text-green-500" />}
                            {movement.movementType === 'Sale' && <PackageMinus className="h-5 w-5 text-blue-500" />}
                            {movement.movementType === 'Return' && <Package className="h-5 w-5 text-orange-500" />}
                            {movement.movementType === 'Adjustment' && <PackageCheck className="h-5 w-5 text-purple-500" />}
                            {movement.movementType === 'Expired' && <PackageX className="h-5 w-5 text-red-500" />}
                            <div>
                              <p className="font-medium">{movement.medicine.medicineName}</p>
                              <p className="text-sm text-muted-foreground">
                                {movement.movementType} • {movement.quantity} {movement.unitOfMeasurement}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {movement.stockBefore} → {movement.stockAfter}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(movement.movementDate), 'dd MMM yyyy HH:mm')}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              By: {movement.performedBy}
                            </p>
                          </div>
                        </div>
                        {movement.notes && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Note: {movement.notes}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="reorder" className="mt-4">
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {filteredInventory
                    .filter(item => item.currentStock <= item.reorderLevel)
                    .sort((a, b) => a.currentStock - b.currentStock)
                    .map((item) => {
                      const orderQuantity = item.maximumStock - item.currentStock;
                      const estimatedCost = orderQuantity * item.purchasePrice;
                      
                      return (
                        <Card key={item.inventoryId} className={item.currentStock === 0 ? 'border-red-200 bg-red-50' : ''}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-4">
                                <div>
                                  <p className="font-semibold">{item.medicine.medicineName}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {item.medicine.genericName} • {item.medicine.strength}
                                  </p>
                                </div>
                                <Badge variant={item.currentStock === 0 ? 'destructive' : 'default'}>
                                  {item.currentStock === 0 ? 'Out of Stock' : 'Low Stock'}
                                </Badge>
                              </div>
                              
                              <div className="flex items-center gap-6">
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">Current Stock</p>
                                  <p className="font-semibold">{item.currentStock} / {item.reorderLevel}</p>
                                </div>
                                
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">Order Quantity</p>
                                  <p className="font-semibold">{orderQuantity} units</p>
                                </div>
                                
                                <div className="text-right">
                                  <p className="text-sm text-muted-foreground">Estimated Cost</p>
                                  <p className="font-semibold">₹{estimatedCost.toFixed(2)}</p>
                                </div>
                                
                                <Button size="sm">
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  Create Order
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Stock Adjustment Modal */}
      <Dialog open={showAdjustStock} onOpenChange={setShowAdjustStock}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Stock</DialogTitle>
            <DialogDescription>
              Adjust stock levels for {selectedItem?.medicine.medicineName}
            </DialogDescription>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Stock</p>
                <p className="text-xl font-bold">{selectedItem.currentStock} {selectedItem.unitOfMeasurement}</p>
              </div>
              
              <div className="space-y-2">
                <Label>Adjustment Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select adjustment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add Stock</SelectItem>
                    <SelectItem value="remove">Remove Stock</SelectItem>
                    <SelectItem value="damage">Damaged</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" placeholder="Enter quantity" />
              </div>
              
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea placeholder="Add notes about this adjustment..." />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdjustStock(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Handle stock adjustment
              setShowAdjustStock(false);
              toast({
                title: "Stock adjusted",
                description: "Stock levels have been updated successfully",
              });
            }}>
              Confirm Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Movement History Modal */}
      <Dialog open={showMovementHistory} onOpenChange={setShowMovementHistory}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Stock Movement History</DialogTitle>
            <DialogDescription>
              {selectedItem?.medicine.medicineName} - All transactions
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-2">
              {selectedMovements.map((movement) => (
                <Card key={movement.movementId}>
                  <CardContent className="p-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        {movement.movementType === 'Purchase' && <ArrowDown className="h-4 w-4 text-green-500" />}
                        {movement.movementType === 'Sale' && <ArrowUp className="h-4 w-4 text-blue-500" />}
                        <div>
                          <p className="font-medium">{movement.movementType}</p>
                          <p className="text-sm text-muted-foreground">
                            {movement.quantity} {movement.unitOfMeasurement} • {movement.referenceType}: {movement.referenceId}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{movement.stockBefore} → {movement.stockAfter}</p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(movement.movementDate), 'dd MMM yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowMovementHistory(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Medicine Modal */}
      <Dialog open={showAddMedicineModal} onOpenChange={setShowAddMedicineModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Medicine</DialogTitle>
            <DialogDescription>
              Add a new medicine to the inventory system
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Medicine Name *</Label>
              <Input id="medicine-name" placeholder="Enter medicine name" />
            </div>
            <div>
              <Label>Medicine Code *</Label>
              <Input id="medicine-code" placeholder="MED001" />
            </div>
            <div>
              <Label>Generic Name</Label>
              <Input id="generic-name" placeholder="Enter generic name" />
            </div>
            <div>
              <Label>Manufacturer *</Label>
              <Input id="manufacturer" placeholder="Enter manufacturer" />
            </div>
            <div>
              <Label>Category *</Label>
              <Select defaultValue="tablets">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tablets">Tablets</SelectItem>
                  <SelectItem value="capsules">Capsules</SelectItem>
                  <SelectItem value="syrups">Syrups</SelectItem>
                  <SelectItem value="injections">Injections</SelectItem>
                  <SelectItem value="ointments">Ointments</SelectItem>
                  <SelectItem value="drops">Drops</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Unit of Measurement *</Label>
              <Select defaultValue="strips">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="strips">Strips</SelectItem>
                  <SelectItem value="bottles">Bottles</SelectItem>
                  <SelectItem value="vials">Vials</SelectItem>
                  <SelectItem value="tubes">Tubes</SelectItem>
                  <SelectItem value="packets">Packets</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price per Unit (₹) *</Label>
              <Input id="price" type="number" placeholder="0.00" />
            </div>
            <div>
              <Label>Initial Stock</Label>
              <Input id="initial-stock" type="number" placeholder="0" />
            </div>
            <div>
              <Label>Batch Number</Label>
              <Input id="batch-number" placeholder="BATCH001" />
            </div>
            <div>
              <Label>Expiry Date *</Label>
              <Input id="expiry-date" type="date" />
            </div>
            <div>
              <Label>Reorder Level</Label>
              <Input id="reorder-level" type="number" placeholder="50" />
            </div>
            <div>
              <Label>Maximum Stock</Label>
              <Input id="max-stock" type="number" placeholder="500" />
            </div>
            <div className="col-span-2">
              <Label>Storage Location</Label>
              <Input id="location" placeholder="e.g., Shelf A1, Refrigerator B2" />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddMedicineModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              // Collect form data and call handleAddMedicine
              const formData = {
                name: (document.getElementById('medicine-name') as HTMLInputElement)?.value,
                code: (document.getElementById('medicine-code') as HTMLInputElement)?.value,
                genericName: (document.getElementById('generic-name') as HTMLInputElement)?.value,
                manufacturer: (document.getElementById('manufacturer') as HTMLInputElement)?.value,
                category: 'Tablets',
                unit: 'Strips',
                price: parseFloat((document.getElementById('price') as HTMLInputElement)?.value || '0'),
                initialStock: parseInt((document.getElementById('initial-stock') as HTMLInputElement)?.value || '0'),
                batchNumber: (document.getElementById('batch-number') as HTMLInputElement)?.value,
                expiryDate: (document.getElementById('expiry-date') as HTMLInputElement)?.value,
                reorderLevel: parseInt((document.getElementById('reorder-level') as HTMLInputElement)?.value || '50'),
                maxStock: parseInt((document.getElementById('max-stock') as HTMLInputElement)?.value || '500'),
                location: (document.getElementById('location') as HTMLInputElement)?.value,
              };
              handleAddMedicine(formData);
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Medicine
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Stock Modal */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import Stock Data</DialogTitle>
            <DialogDescription>
              Upload a CSV file to import stock data in bulk
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>File Format</AlertTitle>
              <AlertDescription>
                CSV file should contain columns: Medicine Name, Code, Stock, Unit, Expiry Date, Batch Number
              </AlertDescription>
            </Alert>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-sm text-gray-600 mb-2">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                CSV files only (max 10MB)
              </p>
              <Input
                type="file"
                accept=".csv"
                className="hidden"
                id="file-upload"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImportStock(file);
                  }
                }}
              />
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                Select File
              </Button>
            </div>
            
            <div className="flex justify-between">
              <Button variant="link" className="text-sm">
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImportModal(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default InventoryManagement;