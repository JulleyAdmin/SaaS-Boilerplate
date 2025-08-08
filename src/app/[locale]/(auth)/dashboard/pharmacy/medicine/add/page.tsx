import AddMedicineForm from '@/components/pharmacy/AddMedicineForm';

export default function AddMedicinePage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Add New Medicine</h1>
        <p className="text-muted-foreground">Add a new medicine to the inventory system</p>
      </div>
      <AddMedicineForm />
    </div>
  );
}