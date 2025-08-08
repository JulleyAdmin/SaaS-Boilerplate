// Ready-to-use Patient Management Page
// Drop this into: src/app/[locale]/(auth)/dashboard/patients/page.tsx (replace existing)

import React from 'react';
import { PatientList } from '@/components/patients/PatientList';

// Main Patient Management Page
export default function PatientsPage() {
  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <PatientList />
    </main>
  );
}

// Metadata for the page
export const metadata = {
  title: 'Patient Management - HospitalOS',
  description: 'Manage patient records, search patients, and handle patient information',
};