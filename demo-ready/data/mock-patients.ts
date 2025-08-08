// Ready-to-use Mock Patient Data
// Drop this into: src/data/mock-patients.ts

export interface MockPatient {
  id: string;
  patientCode: string;
  name: string;
  gender: 'male' | 'female';
  dateOfBirth: string;
  age: number;
  phone: string;
  email: string;
  bloodGroup: string;
  status: 'active' | 'inactive';
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  aadhaarNumber: string;
  abhaId?: string;
  allergies: string[];
  currentMedications: string[];
  medicalHistory: string[];
  insurance: {
    provider: string;
    policyNumber?: string;
    validUntil?: string;
  };
  registrationDate: string;
  lastVisit?: string;
  totalVisits: number;
  avatar: string;
  _isDemoData: boolean;
}

// Indian Healthcare Demo Data
export const MOCK_PATIENTS: MockPatient[] = [
  {
    id: "PAT-000001",
    patientCode: "P-2025-0001",
    name: "Priya Sharma",
    gender: "female",
    dateOfBirth: "1990-03-15",
    age: 34,
    phone: "+91-9876543210",
    email: "priya.sharma@gmail.com",
    bloodGroup: "A+",
    status: "active",
    address: {
      street: "123 MG Road",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      country: "India"
    },
    emergencyContact: {
      name: "Raj Sharma",
      relationship: "Husband",
      phone: "+91-9876543211"
    },
    aadhaarNumber: "1234 5678 9012",
    abhaId: "12345678901234",
    allergies: ["Penicillin", "Dust"],
    currentMedications: ["Lisinopril 10mg"],
    medicalHistory: ["Hypertension", "Regular checkups"],
    insurance: {
      provider: "Bajaj Allianz",
      policyNumber: "POL-123456",
      validUntil: "2025-12-31"
    },
    registrationDate: "2024-01-15T10:30:00Z",
    lastVisit: "2024-12-01T14:20:00Z",
    totalVisits: 8,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=b6e3f4",
    _isDemoData: true
  },
  {
    id: "PAT-000002",
    patientCode: "P-2025-0002",
    name: "Arjun Patel",
    gender: "male",
    dateOfBirth: "1985-07-22",
    age: 39,
    phone: "+91-9876543220",
    email: "arjun.patel@yahoo.com",
    bloodGroup: "B+",
    status: "active",
    address: {
      street: "456 FC Road",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411005",
      country: "India"
    },
    emergencyContact: {
      name: "Meera Patel",
      relationship: "Wife",
      phone: "+91-9876543221"
    },
    aadhaarNumber: "2345 6789 0123",
    abhaId: "23456789012345",
    allergies: ["Shellfish"],
    currentMedications: ["Metformin 500mg"],
    medicalHistory: ["Diabetes Type 2", "Family history of heart disease"],
    insurance: {
      provider: "ICICI Lombard",
      policyNumber: "POL-234567",
      validUntil: "2025-10-15"
    },
    registrationDate: "2024-03-10T09:15:00Z",
    lastVisit: "2024-11-28T16:45:00Z",
    totalVisits: 12,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun&backgroundColor=c0aede",
    _isDemoData: true
  },
  {
    id: "PAT-000003",
    patientCode: "P-2025-0003",
    name: "Sneha Reddy",
    gender: "female",
    dateOfBirth: "1992-11-08",
    age: 32,
    phone: "+91-9876543230",
    email: "sneha.reddy@hotmail.com",
    bloodGroup: "O+",
    status: "active",
    address: {
      street: "789 Jubilee Hills",
      city: "Hyderabad",
      state: "Telangana",
      pincode: "500033",
      country: "India"
    },
    emergencyContact: {
      name: "Vikram Reddy",
      relationship: "Brother",
      phone: "+91-9876543231"
    },
    aadhaarNumber: "3456 7890 1234",
    allergies: ["Nuts", "Dairy"],
    currentMedications: [],
    medicalHistory: ["Annual checkups", "No major issues"],
    insurance: {
      provider: "Star Health",
      policyNumber: "POL-345678",
      validUntil: "2025-08-20"
    },
    registrationDate: "2024-02-28T13:22:00Z",
    lastVisit: "2024-12-15T11:30:00Z",
    totalVisits: 3,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha&backgroundColor=d1d4f9",
    _isDemoData: true
  },
  {
    id: "PAT-000004",
    patientCode: "P-2025-0004",
    name: "Ravi Kumar",
    gender: "male",
    dateOfBirth: "1978-05-12",
    age: 46,
    phone: "+91-9876543240",
    email: "ravi.kumar@gmail.com",
    bloodGroup: "AB+",
    status: "active",
    address: {
      street: "321 Anna Salai",
      city: "Chennai",
      state: "Tamil Nadu",
      pincode: "600002",
      country: "India"
    },
    emergencyContact: {
      name: "Lakshmi Kumar",
      relationship: "Wife",
      phone: "+91-9876543241"
    },
    aadhaarNumber: "4567 8901 2345",
    abhaId: "45678901234567",
    allergies: [],
    currentMedications: ["Atorvastatin 20mg", "Aspirin 75mg"],
    medicalHistory: ["High cholesterol", "Heart murmur", "Regular cardiac checkups"],
    insurance: {
      provider: "New India Assurance",
      policyNumber: "POL-456789",
      validUntil: "2025-06-30"
    },
    registrationDate: "2023-11-20T15:45:00Z",
    lastVisit: "2024-12-10T09:15:00Z",
    totalVisits: 15,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi&backgroundColor=fbb6ce",
    _isDemoData: true
  },
  {
    id: "PAT-000005",
    patientCode: "P-2025-0005",
    name: "Anjali Singh",
    gender: "female",
    dateOfBirth: "1988-09-03",
    age: 36,
    phone: "+91-9876543250",
    email: "anjali.singh@outlook.com",
    bloodGroup: "A-",
    status: "active",
    address: {
      street: "567 Mall Road",
      city: "Delhi",
      state: "Delhi",
      pincode: "110001",
      country: "India"
    },
    emergencyContact: {
      name: "Suresh Singh",
      relationship: "Husband",
      phone: "+91-9876543251"
    },
    aadhaarNumber: "5678 9012 3456",
    allergies: ["Pollen"],
    currentMedications: ["Levothyroxine 50mcg"],
    medicalHistory: ["Hypothyroidism", "Pregnancy (2020, 2022)"],
    insurance: {
      provider: "HDFC ERGO",
      policyNumber: "POL-567890",
      validUntil: "2025-04-15"
    },
    registrationDate: "2024-01-05T11:20:00Z",
    lastVisit: "2024-11-25T14:30:00Z",
    totalVisits: 6,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali&backgroundColor=a7f3d0",
    _isDemoData: true
  },
  {
    id: "PAT-000006",
    patientCode: "P-2025-0006",
    name: "Mohit Agarwal",
    gender: "male",
    dateOfBirth: "1995-12-18",
    age: 29,
    phone: "+91-9876543260",
    email: "mohit.agarwal@gmail.com",
    bloodGroup: "B-",
    status: "active",
    address: {
      street: "890 Park Street",
      city: "Kolkata",
      state: "West Bengal",
      pincode: "700017",
      country: "India"
    },
    emergencyContact: {
      name: "Sunita Agarwal",
      relationship: "Mother",
      phone: "+91-9876543261"
    },
    aadhaarNumber: "6789 0123 4567",
    allergies: ["Latex"],
    currentMedications: ["Inhaler (Salbutamol)"],
    medicalHistory: ["Asthma", "Sports injury (2023)"],
    insurance: {
      provider: "Oriental Insurance",
      policyNumber: "POL-678901",
      validUntil: "2025-09-10"
    },
    registrationDate: "2024-04-12T16:10:00Z",
    lastVisit: "2024-12-08T10:45:00Z",
    totalVisits: 4,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohit&backgroundColor=fed7d7",
    _isDemoData: true
  },
  {
    id: "PAT-000007",
    patientCode: "P-2025-0007",
    name: "Kavya Nair",
    gender: "female",
    dateOfBirth: "1993-04-25",
    age: 31,
    phone: "+91-9876543270",
    email: "kavya.nair@yahoo.in",
    bloodGroup: "O-",
    status: "active",
    address: {
      street: "234 Marine Drive",
      city: "Kochi",
      state: "Kerala",
      pincode: "682011",
      country: "India"
    },
    emergencyContact: {
      name: "Arun Nair",
      relationship: "Husband",
      phone: "+91-9876543271"
    },
    aadhaarNumber: "7890 1234 5678",
    abhaId: "78901234567890",
    allergies: ["Iodine"],
    currentMedications: ["Iron supplements"],
    medicalHistory: ["Anemia", "Regular gynecological checkups"],
    insurance: {
      provider: "Government Scheme (CGHS)",
      validUntil: "2025-12-31"
    },
    registrationDate: "2024-06-18T12:35:00Z",
    lastVisit: "2024-12-20T15:20:00Z",
    totalVisits: 7,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavya&backgroundColor=ddd6fe",
    _isDemoData: true
  },
  {
    id: "PAT-000008",
    patientCode: "P-2025-0008",
    name: "Suresh Gupta",
    gender: "male",
    dateOfBirth: "1965-08-14",
    age: 59,
    phone: "+91-9876543280",
    email: "suresh.gupta@rediffmail.com",
    bloodGroup: "A+",
    status: "active",
    address: {
      street: "678 Civil Lines",
      city: "Jaipur",
      state: "Rajasthan",
      pincode: "302006",
      country: "India"
    },
    emergencyContact: {
      name: "Rekha Gupta",
      relationship: "Wife",
      phone: "+91-9876543281"
    },
    aadhaarNumber: "8901 2345 6789",
    allergies: ["Sulfa drugs"],
    currentMedications: ["Amlodipine 5mg", "Metformin 1000mg", "Simvastatin 20mg"],
    medicalHistory: ["Diabetes Type 2", "Hypertension", "High cholesterol", "Cataract surgery (2023)"],
    insurance: {
      provider: "ESI Scheme",
      validUntil: "2025-12-31"
    },
    registrationDate: "2023-08-30T14:15:00Z",
    lastVisit: "2024-12-18T08:30:00Z",
    totalVisits: 22,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Suresh&backgroundColor=fef3c7",
    _isDemoData: true
  },
  {
    id: "PAT-000009",
    patientCode: "P-2025-0009",
    name: "Meera Joshi",
    gender: "female",
    dateOfBirth: "1980-01-30",
    age: 44,
    phone: "+91-9876543290",
    email: "meera.joshi@gmail.com",
    bloodGroup: "B+",
    status: "active",
    address: {
      street: "345 Laxmi Road",
      city: "Pune",
      state: "Maharashtra",
      pincode: "411030",
      country: "India"
    },
    emergencyContact: {
      name: "Amit Joshi",
      relationship: "Husband",
      phone: "+91-9876543291"
    },
    aadhaarNumber: "9012 3456 7890",
    allergies: ["Aspirin"],
    currentMedications: ["Calcium supplements", "Vitamin D"],
    medicalHistory: ["Osteoporosis", "Menopause management"],
    insurance: {
      provider: "Ayushman Bharat",
      validUntil: "2025-12-31"
    },
    registrationDate: "2024-05-22T10:45:00Z",
    lastVisit: "2024-12-12T13:15:00Z",
    totalVisits: 9,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera&backgroundColor=bfdbfe",
    _isDemoData: true
  },
  {
    id: "PAT-000010",
    patientCode: "P-2025-0010",
    name: "Vikash Yadav",
    gender: "male",
    dateOfBirth: "2000-06-10",
    age: 24,
    phone: "+91-9876543300",
    email: "vikash.yadav@student.edu",
    bloodGroup: "O+",
    status: "active",
    address: {
      street: "123 University Road",
      city: "Lucknow",
      state: "Uttar Pradesh",
      pincode: "226007",
      country: "India"
    },
    emergencyContact: {
      name: "Ramesh Yadav",
      relationship: "Father",
      phone: "+91-9876543301"
    },
    aadhaarNumber: "0123 4567 8901",
    allergies: [],
    currentMedications: [],
    medicalHistory: ["Sports physical", "No major health issues"],
    insurance: {
      provider: "Self Pay"
    },
    registrationDate: "2024-09-05T17:20:00Z",
    lastVisit: "2024-12-05T12:00:00Z",
    totalVisits: 2,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikash&backgroundColor=c7d2fe",
    _isDemoData: true
  }
];

// Utility functions
export const calculateAge = (dateOfBirth: string): number => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export const getPatientById = (id: string): MockPatient | undefined => {
  return MOCK_PATIENTS.find(patient => patient.id === id);
};

export const searchPatients = (query: string): MockPatient[] => {
  if (!query.trim()) return MOCK_PATIENTS;
  
  const lowerQuery = query.toLowerCase();
  return MOCK_PATIENTS.filter(patient => 
    patient.name.toLowerCase().includes(lowerQuery) ||
    patient.patientCode.toLowerCase().includes(lowerQuery) ||
    patient.phone.includes(query) ||
    patient.email.toLowerCase().includes(lowerQuery)
  );
};