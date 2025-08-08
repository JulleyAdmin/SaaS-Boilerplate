'use client';

import React from 'react';
import QRCode from 'react-qr-code';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  email?: string;
  bloodGroup?: string;
}

interface Doctor {
  id: string;
  name: string;
  regNumber: string;
  department: string;
}

interface LabTest {
  id: string;
  name: string;
  category: string;
  instructions: string;
  priority: 'routine' | 'urgent' | 'stat';
}

interface LabRequisitionFormProps {
  patient: Patient;
  doctor: Doctor;
  tests: LabTest[];
  instructions?: string;
  qrData?: string;
  consultationId: string;
  clinicalNotes?: string;
  provisionalDiagnosis?: string;
}

export default function LabRequisitionForm({
  patient,
  doctor,
  tests,
  instructions,
  qrData,
  consultationId,
  clinicalNotes,
  provisionalDiagnosis
}: LabRequisitionFormProps) {
  // Generate QR code data
  const qrCodeData = qrData || JSON.stringify({
    consultationId,
    patientId: patient.id,
    doctorId: doctor.id,
    tests: tests.map(t => t.id),
    timestamp: new Date().toISOString()
  });

  // Group tests by category
  const testsByCategory = tests.reduce((acc, test) => {
    if (!acc[test.category]) {
      acc[test.category] = [];
    }
    acc[test.category].push(test);
    return acc;
  }, {} as Record<string, LabTest[]>);

  // Get sample types based on test categories
  const getSampleType = (category: string): string => {
    const sampleTypes: Record<string, string> = {
      'Hematology': 'Blood (EDTA)',
      'Biochemistry': 'Blood (Serum)',
      'Microbiology': 'Blood/Urine/Stool',
      'Serology': 'Blood (Serum)',
      'Immunology': 'Blood (Serum)',
      'Molecular': 'Blood/Swab',
      'Urine': 'Urine (Mid-stream)',
      'Stool': 'Stool',
      'Cytology': 'Various'
    };
    return sampleTypes[category] || 'As per test requirement';
  };

  return (
    <div className="p-6 bg-white" id="lab-requisition-form">
      {/* Header with Hospital Info */}
      <div className="border-b-2 border-black pb-4 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold">LABORATORY TEST REQUISITION</h1>
            <p className="text-lg font-semibold">Sanjeevani Hospital & Medical Centre</p>
            <p className="text-sm">123 Main Street, Mumbai - 400001</p>
            <p className="text-sm">Tel: 022-12345678 | Email: lab@sanjeevani.com</p>
            <p className="text-xs mt-1">NABL Accredited Laboratory | License: MH/LAB/2024/001</p>
          </div>
          
          {/* QR Code */}
          <div className="text-center">
            <div className="border-2 border-black p-2">
              <QRCode value={qrCodeData} size={100} />
            </div>
            <p className="text-xs mt-1">Scan for digital access</p>
          </div>
        </div>
      </div>

      {/* Form Number and Date */}
      <div className="flex justify-between mb-4">
        <p className="font-medium">
          Requisition No: <span className="font-mono">LAB-{consultationId.slice(0, 8).toUpperCase()}</span>
        </p>
        <p className="font-medium">
          Date: {format(new Date(), 'dd/MM/yyyy HH:mm')}
        </p>
      </div>

      {/* Patient Information */}
      <div className="border border-gray-400 p-3 mb-4">
        <h3 className="font-bold mb-2 text-sm uppercase bg-gray-100 -m-3 mb-2 p-2">Patient Information</h3>
        <div className="grid grid-cols-2 gap-x-8 gap-y-1 text-sm">
          <div>
            <span className="font-medium">Name:</span> {patient.name}
          </div>
          <div>
            <span className="font-medium">Age/Gender:</span> {patient.age} years / {patient.gender}
          </div>
          <div>
            <span className="font-medium">Patient ID:</span> {patient.id}
          </div>
          <div>
            <span className="font-medium">Contact:</span> {patient.phone}
          </div>
          {patient.bloodGroup && (
            <div>
              <span className="font-medium">Blood Group:</span> {patient.bloodGroup}
            </div>
          )}
          {patient.email && (
            <div>
              <span className="font-medium">Email:</span> {patient.email}
            </div>
          )}
        </div>
      </div>

      {/* Clinical Information */}
      <div className="border border-gray-400 p-3 mb-4">
        <h3 className="font-bold mb-2 text-sm uppercase bg-gray-100 -m-3 mb-2 p-2">Clinical Information</h3>
        <div className="space-y-1 text-sm">
          {provisionalDiagnosis && (
            <div>
              <span className="font-medium">Provisional Diagnosis:</span> {provisionalDiagnosis}
            </div>
          )}
          {clinicalNotes && (
            <div>
              <span className="font-medium">Clinical Notes:</span> {clinicalNotes}
            </div>
          )}
          <div>
            <span className="font-medium">Referring Doctor:</span> Dr. {doctor.name} ({doctor.regNumber})
          </div>
          <div>
            <span className="font-medium">Department:</span> {doctor.department}
          </div>
        </div>
      </div>

      {/* Tests Required */}
      <div className="border border-gray-400 p-3 mb-4">
        <h3 className="font-bold mb-2 text-sm uppercase bg-gray-100 -m-3 mb-2 p-2">Tests Required</h3>
        
        {Object.entries(testsByCategory).map(([category, categoryTests]) => (
          <div key={category} className="mb-3">
            <h4 className="font-semibold text-sm mb-1 underline">{category}</h4>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1 w-8">S.No</th>
                  <th className="text-left py-1">Test Name</th>
                  <th className="text-left py-1">Sample Type</th>
                  <th className="text-left py-1">Special Instructions</th>
                  <th className="text-left py-1">Priority</th>
                </tr>
              </thead>
              <tbody>
                {categoryTests.map((test, index) => (
                  <tr key={test.id} className="border-b">
                    <td className="py-1">{index + 1}</td>
                    <td className="py-1 font-medium">{test.name}</td>
                    <td className="py-1">{getSampleType(category)}</td>
                    <td className="py-1">{test.instructions || '-'}</td>
                    <td className="py-1">
                      {test.priority === 'stat' ? (
                        <Badge variant="destructive" className="text-xs">STAT</Badge>
                      ) : test.priority === 'urgent' ? (
                        <Badge variant="default" className="text-xs bg-orange-500">Urgent</Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Routine</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
        
        {/* Total Test Count */}
        <div className="mt-2 pt-2 border-t text-sm font-medium">
          Total Tests: {tests.length}
        </div>
      </div>

      {/* Patient Instructions */}
      {instructions && (
        <div className="border border-yellow-400 bg-yellow-50 p-3 mb-4">
          <h3 className="font-bold mb-2 text-sm uppercase">Important Patient Instructions</h3>
          <p className="text-sm whitespace-pre-line">{instructions}</p>
        </div>
      )}

      {/* Footer Information */}
      <div className="grid grid-cols-2 gap-4 text-xs mt-6">
        <div>
          <p className="font-medium mb-1">Sample Collection Timings:</p>
          <p>Mon-Sat: 7:00 AM - 8:00 PM</p>
          <p>Sunday: 8:00 AM - 2:00 PM</p>
          <p className="mt-1">Emergency/STAT: 24x7</p>
        </div>
        <div>
          <p className="font-medium mb-1">Report Collection:</p>
          <p>Routine Tests: Same day by 6:00 PM</p>
          <p>Special Tests: As per test requirement</p>
          <p className="mt-1">Online: lab.sanjeevani.com</p>
        </div>
      </div>

      {/* Validity */}
      <div className="text-center mt-4 text-xs text-gray-600 border-t pt-2">
        <p>This requisition is valid for 7 days from the date of issue</p>
      </div>

      {/* For Laboratory Use Only */}
      <div className="mt-6 p-3 border-2 border-dashed border-gray-400">
        <h3 className="font-bold text-sm mb-3">FOR LABORATORY USE ONLY</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-xs font-medium mb-1">Sample Collected By:</p>
            <div className="border-b border-gray-400 h-6"></div>
            <p className="text-xs mt-1">Name & Sign</p>
          </div>
          <div>
            <p className="text-xs font-medium mb-1">Date & Time:</p>
            <div className="border-b border-gray-400 h-6"></div>
            <p className="text-xs mt-1">DD/MM/YYYY HH:MM</p>
          </div>
          <div>
            <p className="text-xs font-medium mb-1">Lab Receipt No:</p>
            <div className="border-b border-gray-400 h-6"></div>
            <p className="text-xs mt-1">System Generated</p>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2 mt-3">
          <div className="text-center">
            <input type="checkbox" className="mr-1" />
            <label className="text-xs">Sample Adequate</label>
          </div>
          <div className="text-center">
            <input type="checkbox" className="mr-1" />
            <label className="text-xs">Sample Labeled</label>
          </div>
          <div className="text-center">
            <input type="checkbox" className="mr-1" />
            <label className="text-xs">Consent Taken</label>
          </div>
          <div className="text-center">
            <input type="checkbox" className="mr-1" />
            <label className="text-xs">Payment Done</label>
          </div>
        </div>
        
        <div className="mt-3">
          <p className="text-xs font-medium mb-1">Remarks (if any):</p>
          <div className="border border-gray-400 h-12"></div>
        </div>
      </div>
    </div>
  );
}