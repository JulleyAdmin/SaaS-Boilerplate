'use client';

import {
  AlertTriangle,
  BarChart3,
  Clock,
  FileText,
  Package,
  Plus,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
// Mock data imports
import {
  generateAppointment,
  generateConsultation,
  generatePatient,
  generatePrescription,
  generateUser,
  randomInt,
} from '@/mocks/hms';

/**
 * Pharmacy Dashboard Component
 * Manages medicine inventory, prescriptions, and dispensing
 */
export function PharmacyDashboard() {

  // Generate mock data
  const mockData = useMemo(() => {
    const patients = Array.from({ length: 10 }, () => generatePatient('clinic-1'));
    const doctor = generateUser('clinic-1', 'dept-1', 'Senior-Doctor');

    const prescriptions = patients.map((patient) => {
      const appointment = generateAppointment(patient, doctor, 'General Medicine', 'completed');
      const consultation = generateConsultation(appointment, doctor, 'General Medicine');
      return generatePrescription(consultation, doctor, patient);
    });

    return {
      prescriptions,
      inventory: {
        totalMedicines: 1350, // Fixed value to avoid hydration mismatch
        lowStock: 65, // Fixed value to avoid hydration mismatch
        expiringSoon: 30, // Fixed value to avoid hydration mismatch
        outOfStock: 10, // Fixed value to avoid hydration mismatch
      },
      todayStats: {
        prescriptionsReceived: 95, // Fixed value to avoid hydration mismatch
        prescriptionsDispensed: 78, // Fixed value to avoid hydration mismatch
        pendingDispense: 15, // Fixed value to avoid hydration mismatch
        revenue: 72500, // Fixed value to avoid hydration mismatch
      },
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Prescriptions</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.todayStats.prescriptionsReceived}</div>
            <p className="text-xs text-muted-foreground">
              {mockData.todayStats.prescriptionsDispensed}
              {' '}
              dispensed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Status</CardTitle>
            <Package className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.inventory.totalMedicines}</div>
            <p className="text-xs text-muted-foreground">
              <AlertTriangle className="inline size-3 text-amber-500" />
              {' '}
              {mockData.inventory.lowStock}
              {' '}
              low stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹
              {(mockData.todayStats.revenue / 1000).toFixed(1)}
              K
            </div>
            <p className="text-xs text-muted-foreground">
              Target: ₹80K
            </p>
            <Progress value={(mockData.todayStats.revenue / 80000) * 100} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Dispense</CardTitle>
            <Clock className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockData.todayStats.pendingDispense}</div>
            <p className="text-xs text-muted-foreground">
              Avg wait: 15 min
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Prescription Queue */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Prescription Queue</CardTitle>
            <CardDescription>Pending and recent prescriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="dispensed">Dispensed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-4 space-y-3">
                {mockData.prescriptions.slice(0, 5).map((prescription, index) => (
                  <div
                    key={prescription.prescriptionId}
                    className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                        {prescription.prescriptionCode.slice(-3)}
                      </div>
                      <div>
                        <p className="font-medium">{prescription.patientName}</p>
                        <p className="text-sm text-muted-foreground">
                          {prescription.doctorName}
                          {' '}
                          •
                          {3 + index}
                          {' '}
                          items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {index === 0 && <Badge variant="destructive">Urgent</Badge>}
                      <Button size="sm" asChild>
                        <Link href={`/dashboard/pharmacy/dispense/${prescription.prescriptionId}`}>
                          Dispense
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="dispensed" className="mt-4">
                <p className="py-8 text-center text-muted-foreground">
                  No recently dispensed prescriptions
                </p>
              </TabsContent>

              <TabsContent value="cancelled" className="mt-4">
                <p className="py-8 text-center text-muted-foreground">
                  No cancelled prescriptions today
                </p>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Inventory Alerts & Actions */}
        <div className="space-y-6 lg:col-span-3">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2">
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/pharmacy/inventory">
                  <Package className="mr-2 size-4" />
                  Manage Inventory
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/pharmacy/purchase-order">
                  <ShoppingCart className="mr-2 size-4" />
                  Create Purchase Order
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/pharmacy/medicine/add">
                  <Plus className="mr-2 size-4" />
                  Add New Medicine
                </Link>
              </Button>
              <Button className="justify-start" variant="outline" asChild>
                <Link href="/dashboard/pharmacy/reports">
                  <BarChart3 className="mr-2 size-4" />
                  View Reports
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Inventory Alerts */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory Alerts</CardTitle>
              <CardDescription>Requires attention</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="mt-0.5 size-5 text-red-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Out of Stock</p>
                  <p className="text-xs text-muted-foreground">
                    Paracetamol 500mg, Amoxicillin 250mg
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <AlertTriangle className="mt-0.5 size-5 text-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Low Stock Alert</p>
                  <p className="text-xs text-muted-foreground">
                    {mockData.inventory.lowStock}
                    {' '}
                    medicines below reorder level
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="mt-0.5 size-5 text-amber-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Expiring Soon</p>
                  <p className="text-xs text-muted-foreground">
                    {mockData.inventory.expiringSoon}
                    {' '}
                    medicines expire within 30 days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Top Dispensed Medicines */}
          <Card>
            <CardHeader>
              <CardTitle>Top Medicines Today</CardTitle>
              <CardDescription>Most dispensed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Paracetamol 500mg', count: 45, stock: 'Low' },
                { name: 'Amoxicillin 500mg', count: 32, stock: 'OK' },
                { name: 'Pantoprazole 40mg', count: 28, stock: 'OK' },
                { name: 'Vitamin D3', count: 25, stock: 'Low' },
                { name: 'B-Complex', count: 20, stock: 'OK' },
              ].map(medicine => (
                <div key={medicine.name} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{medicine.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {medicine.count}
                      {' '}
                      dispensed
                    </p>
                  </div>
                  <Badge variant={medicine.stock === 'Low' ? 'destructive' : 'outline'}>
                    {medicine.stock}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
