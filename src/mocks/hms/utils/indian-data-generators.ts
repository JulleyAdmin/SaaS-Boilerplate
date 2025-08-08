/**
 * Indian Healthcare Data Generators
 * Utilities for generating realistic Indian-specific mock data
 */

// Indian first names (mixed gender)
const indianFirstNames = [
  // Male names
  'Rajesh',
  'Suresh',
  'Ramesh',
  'Mahesh',
  'Ganesh',
  'Dinesh',
  'Mukesh',
  'Rakesh',
  'Ashok',
  'Vijay',
  'Ajay',
  'Sanjay',
  'Manoj',
  'Sunil',
  'Anil',
  'Vinod',
  'Ravi',
  'Amit',
  'Sumit',
  'Ankit',
  'Rohit',
  'Mohit',
  'Nitin',
  'Sachin',
  'Rahul',
  'Vikas',
  'Deepak',
  'Pradeep',
  'Sandeep',
  'Kuldeep',
  'Rajiv',
  'Sanjiv',
  'Arjun',
  'Karthik',
  'Arun',
  'Varun',
  'Tarun',
  'Krishna',
  'Shiva',
  'Vishnu',
  'Mohammed',
  'Abdul',
  'Imran',
  'Salman',
  'Irfan',
  'Aamir',
  'Zaheer',
  'Asif',

  // Female names
  'Priya',
  'Divya',
  'Kavya',
  'Navya',
  'Shreya',
  'Aadhya',
  'Ananya',
  'Arya',
  'Sunita',
  'Anita',
  'Kavita',
  'Savita',
  'Lalita',
  'Babita',
  'Namita',
  'Sarita',
  'Pooja',
  'Neha',
  'Sneha',
  'Megha',
  'Rekha',
  'Sudha',
  'Radha',
  'Usha',
  'Asha',
  'Nisha',
  'Alisha',
  'Manisha',
  'Tanisha',
  'Ayesha',
  'Fatima',
  'Zara',
  'Lakshmi',
  'Saraswati',
  'Parvati',
  'Durga',
  'Kali',
  'Sita',
  'Gita',
  'Rita',
  'Meera',
  'Seema',
  'Reema',
  'Geeta',
  'Neeta',
  'Preeti',
  'Sweety',
  'Pinky',
];

// Indian last names
const indianLastNames = [
  'Kumar',
  'Singh',
  'Sharma',
  'Verma',
  'Gupta',
  'Patel',
  'Shah',
  'Mehta',
  'Jain',
  'Agarwal',
  'Mittal',
  'Goel',
  'Bansal',
  'Jindal',
  'Saini',
  'Chauhan',
  'Yadav',
  'Pandey',
  'Mishra',
  'Shukla',
  'Tripathi',
  'Dubey',
  'Dwivedi',
  'Tiwari',
  'Nair',
  'Menon',
  'Pillai',
  'Iyer',
  'Iyengar',
  'Krishnan',
  'Raman',
  'Subramanian',
  'Reddy',
  'Rao',
  'Naidu',
  'Raju',
  'Murthy',
  'Prasad',
  'Shetty',
  'Hegde',
  'Das',
  'Bose',
  'Ghosh',
  'Roy',
  'Sen',
  'Mukherjee',
  'Chatterjee',
  'Banerjee',
  'Khan',
  'Ahmed',
  'Ali',
  'Hussain',
  'Sheikh',
  'Siddiqui',
  'Ansari',
  'Qureshi',
  'Desai',
  'Joshi',
  'Kulkarni',
  'Deshpande',
  'Bhosale',
  'Patil',
  'Pawar',
  'More',
];

// Indian cities
const indianCities = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
  'Surat',
  'Jaipur',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Patna',
  'Indore',
  'Bhopal',
  'Ludhiana',
  'Agra',
  'Nashik',
  'Vadodara',
  'Rajkot',
  'Meerut',
  'Varanasi',
  'Srinagar',
  'Aurangabad',
  'Dhanbad',
  'Amritsar',
  'Allahabad',
  'Gwalior',
  'Vijayawada',
  'Jodhpur',
  'Madurai',
  'Coimbatore',
  'Kochi',
  'Thiruvananthapuram',
  'Mysore',
  'Mangalore',
  'Belgaum',
  'Guwahati',
  'Chandigarh',
  'Bhubaneswar',
  'Raipur',
  'Ranchi',
  'Shimla',
  'Dehradun',
];

// Indian states
const indianStates = [
  'Maharashtra',
  'Delhi',
  'Karnataka',
  'Tamil Nadu',
  'West Bengal',
  'Telangana',
  'Gujarat',
  'Rajasthan',
  'Uttar Pradesh',
  'Bihar',
  'Madhya Pradesh',
  'Punjab',
  'Haryana',
  'Kerala',
  'Andhra Pradesh',
  'Assam',
  'Odisha',
  'Chhattisgarh',
  'Jharkhand',
  'Uttarakhand',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Goa',
  'Sikkim',
  'Tripura',
  'Meghalaya',
  'Manipur',
  'Nagaland',
  'Arunachal Pradesh',
  'Mizoram',
];

// Medical conditions common in India
const commonMedicalConditions = [
  'Diabetes Type 2',
  'Hypertension',
  'Coronary Artery Disease',
  'Asthma',
  'COPD',
  'Tuberculosis',
  'Dengue',
  'Malaria',
  'Typhoid',
  'Hepatitis B',
  'Hepatitis C',
  'Chronic Kidney Disease',
  'Thyroid Disorder',
  'Anemia',
  'Arthritis',
  'Osteoporosis',
  'GERD',
  'Peptic Ulcer',
  'Fatty Liver',
  'Gallstones',
  'Kidney Stones',
  'Depression',
  'Anxiety Disorder',
  'Migraine',
  'Epilepsy',
  'Parkinson\'s Disease',
];

// Common allergies in India
const commonAllergies = [
  'Dust',
  'Pollen',
  'Milk Products',
  'Peanuts',
  'Shellfish',
  'Eggs',
  'Wheat',
  'Soy',
  'Fish',
  'Tree Nuts',
  'Penicillin',
  'Sulfa Drugs',
  'NSAIDs',
  'Aspirin',
  'Latex',
  'Insect Stings',
  'Mold',
  'Pet Dander',
  'Smoke',
  'Perfumes',
];

// Utility functions

/**
 * Generate a random Indian name
 */
export function generateIndianName(gender?: 'Male' | 'Female'): { firstName: string; lastName: string } {
  let firstName: string;

  if (!gender) {
    firstName = indianFirstNames[Math.floor(Math.random() * indianFirstNames.length)];
  } else {
    // Simple gender detection based on common patterns
    const maleNames = indianFirstNames.filter(name =>
      !['a', 'i', 'y'].includes(name.slice(-1).toLowerCase())
      || ['Krishna', 'Shiva', 'Rama'].includes(name),
    );
    const femaleNames = indianFirstNames.filter(name =>
      ['a', 'i', 'y'].includes(name.slice(-1).toLowerCase())
      && !['Krishna', 'Shiva', 'Rama'].includes(name),
    );

    firstName = gender === 'Male'
      ? maleNames[Math.floor(Math.random() * maleNames.length)]
      : femaleNames[Math.floor(Math.random() * femaleNames.length)];
  }

  const lastName = indianLastNames[Math.floor(Math.random() * indianLastNames.length)];

  return { firstName, lastName };
}

/**
 * Generate a valid Aadhaar number (12 digits)
 * Note: This generates a random 12-digit number, not a real Aadhaar
 */
export function generateAadhaarNumber(): string {
  const digits = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10));
  return digits.join('');
}

/**
 * Generate a valid ABHA number (14 digits)
 * Format: 14 digits
 */
export function generateABHANumber(): string {
  const digits = Array.from({ length: 14 }, () => Math.floor(Math.random() * 10));
  return digits.join('');
}

/**
 * Generate a valid PAN number
 * Format: AAAAA9999A (5 letters, 4 digits, 1 letter)
 */
export function generatePANNumber(): string {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const firstFive = Array.from({ length: 5 }, () => letters[Math.floor(Math.random() * 26)]).join('');
  const fourDigits = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10)).join('');
  const lastLetter = letters[Math.floor(Math.random() * 26)];
  return `${firstFive}${fourDigits}${lastLetter}`;
}

/**
 * Generate a valid Indian mobile number
 * Format: +91 followed by 10 digits starting with 6-9
 */
export function generateIndianMobileNumber(): string {
  const firstDigit = Math.floor(Math.random() * 4) + 6; // 6, 7, 8, or 9
  const remaining = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
  return `+91${firstDigit}${remaining}`;
}

/**
 * Generate an Indian address
 */
export function generateIndianAddress(): {
  address: string;
  city: string;
  state: string;
  pincode: string;
} {
  const houseNumber = Math.floor(Math.random() * 999) + 1;
  const streets = ['MG Road', 'Station Road', 'Market Street', 'Temple Street', 'College Road', 'Hospital Road', 'Gandhi Nagar', 'Nehru Nagar', 'Shivaji Nagar', 'Indira Nagar'];
  const street = streets[Math.floor(Math.random() * streets.length)];
  const areas = ['Phase 1', 'Phase 2', 'Sector 1', 'Sector 2', 'East', 'West', 'North', 'South', 'Central', 'New'];
  const area = areas[Math.floor(Math.random() * areas.length)];

  const city = indianCities[Math.floor(Math.random() * indianCities.length)];
  const state = indianStates[Math.floor(Math.random() * indianStates.length)];

  // Generate pincode (6 digits, first digit 1-9, others 0-9)
  const firstDigit = Math.floor(Math.random() * 9) + 1;
  const remainingDigits = Array.from({ length: 5 }, () => Math.floor(Math.random() * 10)).join('');
  const pincode = `${firstDigit}${remainingDigits}`;

  return {
    address: `${houseNumber}, ${street}, ${area}`,
    city,
    state,
    pincode,
  };
}

/**
 * Generate a patient code (hospital-specific format)
 * Format: HOSP-YYYY-NNNNNN
 */
export function generatePatientCode(hospitalPrefix = 'HMS'): string {
  const year = new Date().getFullYear();
  const sequence = Math.floor(Math.random() * 999999) + 1;
  return `${hospitalPrefix}-${year}-${sequence.toString().padStart(6, '0')}`;
}

/**
 * Generate an employee code
 * Format: EMP-DEPT-NNNN
 */
export function generateEmployeeCode(department = 'GEN'): string {
  const sequence = Math.floor(Math.random() * 9999) + 1;
  return `EMP-${department}-${sequence.toString().padStart(4, '0')}`;
}

/**
 * Get random medical conditions
 */
export function getRandomMedicalConditions(count = 2): string[] {
  const shuffled = [...commonMedicalConditions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Get random allergies
 */
export function getRandomAllergies(count = 1): string[] {
  const shuffled = [...commonAllergies].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Generate a government scheme number
 */
export function generateGovernmentSchemeNumber(scheme: string): string {
  const year = new Date().getFullYear() % 100;
  const stateCode = Math.floor(Math.random() * 35) + 1;
  const sequence = Math.floor(Math.random() * 9999999) + 1;

  switch (scheme) {
    case 'Ayushman-Bharat':
      return `ABY${year}${stateCode.toString().padStart(2, '0')}${sequence.toString().padStart(7, '0')}`;
    case 'CGHS':
      return `CGHS${sequence.toString().padStart(8, '0')}`;
    case 'ESIC':
      return `ESIC${stateCode.toString().padStart(2, '0')}${sequence.toString().padStart(8, '0')}`;
    default:
      return `GS${year}${sequence.toString().padStart(8, '0')}`;
  }
}

/**
 * Generate a prescription code
 */
export function generatePrescriptionCode(): string {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}${date.getDate().toString().padStart(2, '0')}`;
  const sequence = Math.floor(Math.random() * 9999) + 1;
  return `RX-${dateStr}-${sequence.toString().padStart(4, '0')}`;
}

/**
 * Generate a bill number
 */
export function generateBillNumber(): string {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  const sequence = Math.floor(Math.random() * 99999) + 1;
  return `BILL-${dateStr}-${sequence.toString().padStart(5, '0')}`;
}

/**
 * Generate random consultation fee based on doctor type
 */
export function generateConsultationFee(doctorType: string): number {
  const fees: Record<string, [number, number]> = {
    'General': [200, 500],
    'Specialist': [500, 1500],
    'Super-Specialist': [1000, 3000],
    'Visiting': [1500, 5000],
  };

  const [min, max] = fees[doctorType] || fees.General;
  return Math.floor(Math.random() * (max - min) / 50) * 50 + min; // Round to nearest 50
}

/**
 * Generate random vital signs
 */
export function generateVitals() {
  return {
    bp_systolic: Math.floor(Math.random() * 40) + 100, // 100-140
    bp_diastolic: Math.floor(Math.random() * 20) + 70, // 70-90
    pulse: Math.floor(Math.random() * 40) + 60, // 60-100
    temperature: Number((Math.random() * 2 + 97).toFixed(1)), // 97-99
    weight: Math.floor(Math.random() * 50) + 40, // 40-90 kg
    height: Math.floor(Math.random() * 50) + 140, // 140-190 cm
    spo2: Math.floor(Math.random() * 5) + 95, // 95-100
    respiratoryRate: Math.floor(Math.random() * 8) + 12, // 12-20
  };
}
