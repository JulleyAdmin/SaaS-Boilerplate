// Comprehensive demo data for analytics dashboards with Indian healthcare context

export interface LocationDataPoint {
  lat: number;
  lng: number;
  intensity: number;
  area: string;
  pincode: string;
  patients: number;
  revenue: number;
  avgDistance: number;
  population: number;
}

export interface ReferrerProfile {
  id: string;
  name: string;
  type: 'Doctor' | 'Patient' | 'Corporate' | 'Insurance' | 'HealthCamp';
  specialty?: string;
  organization?: string;
  totalReferrals: number;
  activeReferrals: number;
  conversionRate: number;
  totalRevenue: number;
  avgPatientValue: number;
  lastReferralDate: Date;
  joinedDate: Date;
  contactNumber: string;
  email: string;
  incentivesDue: number;
  incentivesPaid: number;
  rating: number;
  trend: 'up' | 'down' | 'stable';
  referralHistory: ReferralRecord[];
}

export interface ReferralRecord {
  id: string;
  patientName: string;
  referralDate: Date;
  consultationDate?: Date;
  department: string;
  status: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  revenue?: number;
  notes?: string;
}

// Major areas in Bangalore with realistic population data
export const bangaloreAreas: LocationDataPoint[] = [
  // South Bangalore - High density areas
  { lat: 12.9352, lng: 77.6245, intensity: 0.95, area: 'Koramangala', pincode: '560034', patients: 1456, revenue: 8750000, avgDistance: 3.2, population: 125000 },
  { lat: 12.9165, lng: 77.6101, intensity: 0.88, area: 'BTM Layout', pincode: '560076', patients: 1234, revenue: 7450000, avgDistance: 3.8, population: 115000 },
  { lat: 12.9250, lng: 77.5938, intensity: 0.85, area: 'Jayanagar', pincode: '560041', patients: 1198, revenue: 7230000, avgDistance: 4.1, population: 110000 },
  { lat: 12.9081, lng: 77.6476, intensity: 0.82, area: 'HSR Layout', pincode: '560102', patients: 1089, revenue: 6580000, avgDistance: 4.5, population: 98000 },
  { lat: 12.8893, lng: 77.5857, intensity: 0.75, area: 'JP Nagar', pincode: '560078', patients: 987, revenue: 5920000, avgDistance: 5.2, population: 92000 },
  { lat: 12.9255, lng: 77.5468, intensity: 0.72, area: 'Banashankari', pincode: '560050', patients: 923, revenue: 5540000, avgDistance: 5.8, population: 145000 },
  
  // East Bangalore - Growing areas
  { lat: 12.9716, lng: 77.6412, intensity: 0.90, area: 'Indiranagar', pincode: '560038', patients: 1345, revenue: 8120000, avgDistance: 4.3, population: 98000 },
  { lat: 12.9698, lng: 77.7500, intensity: 0.78, area: 'Whitefield', pincode: '560066', patients: 1567, revenue: 9340000, avgDistance: 12.5, population: 287000 },
  { lat: 12.9591, lng: 77.6974, intensity: 0.73, area: 'Marathahalli', pincode: '560037', patients: 1123, revenue: 6740000, avgDistance: 8.7, population: 176000 },
  { lat: 12.9260, lng: 77.6762, intensity: 0.68, area: 'Bellandur', pincode: '560103', patients: 892, revenue: 5350000, avgDistance: 9.8, population: 198000 },
  { lat: 12.9779, lng: 77.7173, intensity: 0.65, area: 'KR Puram', pincode: '560036', patients: 756, revenue: 4530000, avgDistance: 11.2, population: 134000 },
  { lat: 12.9569, lng: 77.7011, intensity: 0.62, area: 'Mahadevapura', pincode: '560048', patients: 689, revenue: 4130000, avgDistance: 13.4, population: 156000 },
  
  // North Bangalore - Emerging areas
  { lat: 13.0280, lng: 77.5989, intensity: 0.58, area: 'Malleshwaram', pincode: '560003', patients: 834, revenue: 5010000, avgDistance: 6.7, population: 78000 },
  { lat: 13.0358, lng: 77.5970, intensity: 0.55, area: 'Rajajinagar', pincode: '560010', patients: 723, revenue: 4340000, avgDistance: 7.2, population: 89000 },
  { lat: 13.1007, lng: 77.5963, intensity: 0.35, area: 'Yelahanka', pincode: '560064', patients: 234, revenue: 1410000, avgDistance: 18.5, population: 198000 },
  { lat: 13.0623, lng: 77.5871, intensity: 0.48, area: 'Hebbal', pincode: '560024', patients: 567, revenue: 3400000, avgDistance: 14.3, population: 112000 },
  { lat: 13.0298, lng: 77.6407, intensity: 0.45, area: 'RT Nagar', pincode: '560032', patients: 489, revenue: 2930000, avgDistance: 9.8, population: 76000 },
  
  // West Bangalore - Industrial areas
  { lat: 12.9099, lng: 77.4850, intensity: 0.42, area: 'Kengeri', pincode: '560060', patients: 345, revenue: 2070000, avgDistance: 16.7, population: 167000 },
  { lat: 12.9343, lng: 77.5351, intensity: 0.52, area: 'Basaveshwaranagar', pincode: '560079', patients: 612, revenue: 3670000, avgDistance: 8.9, population: 87000 },
  { lat: 12.9698, lng: 77.5323, intensity: 0.60, area: 'Vijayanagar', pincode: '560040', patients: 778, revenue: 4670000, avgDistance: 7.6, population: 94000 },
  { lat: 12.9790, lng: 77.5480, intensity: 0.63, area: 'Rajajinagar', pincode: '560055', patients: 823, revenue: 4940000, avgDistance: 6.8, population: 86000 },
  
  // Electronic City & Surroundings
  { lat: 12.8395, lng: 77.6778, intensity: 0.38, area: 'Electronic City', pincode: '560100', patients: 456, revenue: 2740000, avgDistance: 22.3, population: 345000 },
  { lat: 12.8458, lng: 77.6602, intensity: 0.40, area: 'Bommanahalli', pincode: '560068', patients: 534, revenue: 3200000, avgDistance: 14.5, population: 123000 },
  { lat: 12.8700, lng: 77.5936, intensity: 0.48, area: 'Uttarahalli', pincode: '560061', patients: 423, revenue: 2540000, avgDistance: 11.2, population: 98000 },
];

// Generate realistic referrer profiles
export const generateReferrerProfiles = (): ReferrerProfile[] => {
  const doctorNames = [
    'Dr. Rajesh Kumar', 'Dr. Priya Sharma', 'Dr. Amit Verma', 'Dr. Sunita Reddy', 'Dr. Mohammed Khan',
    'Dr. Anita Patel', 'Dr. Vikram Singh', 'Dr. Kavitha Nair', 'Dr. Suresh Gupta', 'Dr. Meera Iyer',
    'Dr. Ravi Shankar', 'Dr. Deepa Menon', 'Dr. Arun Joshi', 'Dr. Pooja Desai', 'Dr. Karthik Rao',
    'Dr. Sneha Kulkarni', 'Dr. Rahul Mehta', 'Dr. Anjali Das', 'Dr. Sanjay Kapoor', 'Dr. Nisha Agarwal'
  ];

  const specialties = [
    'General Physician', 'Cardiologist', 'Orthopedic Surgeon', 'Pediatrician', 'Gynecologist',
    'Neurologist', 'Dermatologist', 'ENT Specialist', 'Ophthalmologist', 'Gastroenterologist',
    'Endocrinologist', 'Pulmonologist', 'Nephrologist', 'Psychiatrist', 'Urologist'
  ];

  const corporates = [
    'Infosys Ltd', 'Wipro Technologies', 'TCS Bangalore', 'Accenture India', 'IBM India',
    'Google India', 'Microsoft IDC', 'Amazon Development Center', 'Flipkart', 'Swiggy',
    'Oracle India', 'SAP Labs', 'Goldman Sachs', 'JP Morgan', 'Wells Fargo'
  ];

  const insuranceCompanies = [
    'Star Health Insurance', 'HDFC Ergo', 'ICICI Lombard', 'Bajaj Allianz', 'Max Bupa',
    'Religare Health', 'Apollo Munich', 'Aditya Birla Health', 'Care Health Insurance', 'National Insurance'
  ];

  const referrers: ReferrerProfile[] = [];

  // Generate doctor referrers
  doctorNames.forEach((name, index) => {
    const totalReferrals = Math.floor(Math.random() * 200) + 50;
    const conversionRate = Math.random() * 30 + 65; // 65-95%
    const avgValue = Math.random() * 15000 + 8000;
    
    referrers.push({
      id: `doc-${index + 1}`,
      name,
      type: 'Doctor',
      specialty: specialties[index % specialties.length],
      totalReferrals,
      activeReferrals: Math.floor(totalReferrals * 0.15),
      conversionRate,
      totalRevenue: Math.floor(totalReferrals * conversionRate / 100 * avgValue),
      avgPatientValue: avgValue,
      lastReferralDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      contactNumber: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      email: `${name.toLowerCase().replace(/[.\s]/g, '')}@clinic.com`,
      incentivesDue: Math.floor(Math.random() * 50000) + 5000,
      incentivesPaid: Math.floor(Math.random() * 200000) + 20000,
      rating: Math.random() * 1.5 + 3.5,
      trend: Math.random() > 0.3 ? (Math.random() > 0.5 ? 'up' : 'stable') : 'down',
      referralHistory: generateReferralHistory(totalReferrals)
    });
  });

  // Generate corporate referrers
  corporates.forEach((corp, index) => {
    const totalReferrals = Math.floor(Math.random() * 150) + 30;
    const conversionRate = Math.random() * 25 + 60; // 60-85%
    const avgValue = Math.random() * 12000 + 6000;
    
    referrers.push({
      id: `corp-${index + 1}`,
      name: `${corp} HR Team`,
      type: 'Corporate',
      organization: corp,
      totalReferrals,
      activeReferrals: Math.floor(totalReferrals * 0.2),
      conversionRate,
      totalRevenue: Math.floor(totalReferrals * conversionRate / 100 * avgValue),
      avgPatientValue: avgValue,
      lastReferralDate: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000),
      joinedDate: new Date(Date.now() - Math.random() * 730 * 24 * 60 * 60 * 1000),
      contactNumber: `+91 80 ${Math.floor(Math.random() * 90000000) + 10000000}`,
      email: `health@${corp.toLowerCase().replace(/\s/g, '')}.com`,
      incentivesDue: Math.floor(Math.random() * 30000) + 10000,
      incentivesPaid: Math.floor(Math.random() * 150000) + 30000,
      rating: Math.random() * 1 + 4,
      trend: Math.random() > 0.4 ? 'up' : 'stable',
      referralHistory: generateReferralHistory(totalReferrals)
    });
  });

  // Generate insurance referrers
  insuranceCompanies.forEach((insurance, index) => {
    const totalReferrals = Math.floor(Math.random() * 100) + 40;
    const conversionRate = Math.random() * 20 + 55; // 55-75%
    const avgValue = Math.random() * 20000 + 10000;
    
    referrers.push({
      id: `ins-${index + 1}`,
      name: insurance,
      type: 'Insurance',
      organization: insurance,
      totalReferrals,
      activeReferrals: Math.floor(totalReferrals * 0.25),
      conversionRate,
      totalRevenue: Math.floor(totalReferrals * conversionRate / 100 * avgValue),
      avgPatientValue: avgValue,
      lastReferralDate: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
      joinedDate: new Date(Date.now() - Math.random() * 1095 * 24 * 60 * 60 * 1000),
      contactNumber: `1800 ${Math.floor(Math.random() * 900) + 100} ${Math.floor(Math.random() * 9000) + 1000}`,
      email: `claims@${insurance.toLowerCase().replace(/\s/g, '')}.com`,
      incentivesDue: 0, // Insurance companies typically don't get incentives
      incentivesPaid: 0,
      rating: Math.random() * 1.5 + 3,
      trend: Math.random() > 0.5 ? 'stable' : 'down',
      referralHistory: generateReferralHistory(totalReferrals)
    });
  });

  // Add some patient referrers
  for (let i = 0; i < 30; i++) {
    const patientNames = ['Rahul Sharma', 'Priya Patel', 'Amit Singh', 'Sneha Gupta', 'Vijay Kumar'];
    const totalReferrals = Math.floor(Math.random() * 10) + 1;
    const conversionRate = Math.random() * 30 + 50;
    const avgValue = Math.random() * 8000 + 4000;
    
    referrers.push({
      id: `pat-${i + 1}`,
      name: patientNames[i % patientNames.length] + ` ${i + 1}`,
      type: 'Patient',
      totalReferrals,
      activeReferrals: Math.floor(totalReferrals * 0.3),
      conversionRate,
      totalRevenue: Math.floor(totalReferrals * conversionRate / 100 * avgValue),
      avgPatientValue: avgValue,
      lastReferralDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      joinedDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000),
      contactNumber: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      email: `patient${i + 1}@gmail.com`,
      incentivesDue: totalReferrals * 200,
      incentivesPaid: Math.floor(Math.random() * 2000),
      rating: Math.random() * 2 + 3,
      trend: Math.random() > 0.5 ? 'up' : 'stable',
      referralHistory: generateReferralHistory(totalReferrals)
    });
  }

  return referrers.sort((a, b) => b.totalRevenue - a.totalRevenue);
};

// Generate referral history for each referrer
function generateReferralHistory(count: number): ReferralRecord[] {
  const history: ReferralRecord[] = [];
  const departments = ['Cardiology', 'Orthopedics', 'General Medicine', 'Pediatrics', 'Gynecology', 'Neurology', 'Gastroenterology'];
  const statuses: ReferralRecord['status'][] = ['completed', 'completed', 'completed', 'scheduled', 'contacted', 'pending', 'cancelled'];
  
  const firstNames = ['Rahul', 'Priya', 'Amit', 'Sneha', 'Vijay', 'Anita', 'Suresh', 'Kavita', 'Ravi', 'Meera'];
  const lastNames = ['Sharma', 'Patel', 'Singh', 'Gupta', 'Kumar', 'Reddy', 'Nair', 'Iyer', 'Desai', 'Mehta'];

  for (let i = 0; i < Math.min(count, 10); i++) {
    const referralDate = new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000);
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    
    history.push({
      id: `ref-${i + 1}`,
      patientName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      referralDate,
      consultationDate: status === 'completed' || status === 'scheduled' 
        ? new Date(referralDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)
        : undefined,
      department: departments[Math.floor(Math.random() * departments.length)],
      status,
      revenue: status === 'completed' ? Math.floor(Math.random() * 25000) + 5000 : undefined,
      notes: Math.random() > 0.7 ? 'Priority case - chronic condition' : undefined
    });
  }

  return history.sort((a, b) => b.referralDate.getTime() - a.referralDate.getTime());
}

// Campaign performance data
export const campaignData = [
  {
    id: 'camp-1',
    name: 'Heart Health Awareness Month',
    type: 'awareness',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-02-29'),
    budget: 250000,
    spent: 223000,
    targetAudience: 45000,
    reached: 38500,
    impressions: 125000,
    clicks: 4500,
    conversions: 234,
    appointments: 189,
    revenue: 2840000,
    roi: 12.7,
    channels: ['Facebook', 'WhatsApp', 'Print', 'Radio'],
    status: 'completed'
  },
  {
    id: 'camp-2',
    name: 'Free Diabetes Screening Camp',
    type: 'screening',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-03-17'),
    budget: 150000,
    spent: 142000,
    targetAudience: 5000,
    reached: 6200,
    impressions: 45000,
    clicks: 2100,
    conversions: 567,
    appointments: 423,
    revenue: 1680000,
    roi: 11.8,
    channels: ['SMS', 'WhatsApp', 'Local Newspapers'],
    status: 'completed'
  },
  {
    id: 'camp-3',
    name: 'Womens Wellness Package',
    type: 'promotion',
    startDate: new Date('2024-03-08'),
    endDate: new Date('2024-03-31'),
    budget: 180000,
    spent: 165000,
    targetAudience: 25000,
    reached: 21000,
    impressions: 89000,
    clicks: 3400,
    conversions: 312,
    appointments: 278,
    revenue: 2180000,
    roi: 13.2,
    channels: ['Instagram', 'Facebook', 'Email', 'SMS'],
    status: 'active'
  }
];

// Monthly analytics trends
export const generateMonthlyTrends = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  return months.slice(0, currentMonth + 1).map((month, index) => ({
    month,
    patients: Math.floor(2500 + Math.random() * 500 + index * 50),
    revenue: Math.floor(3000000 + Math.random() * 500000 + index * 100000),
    newPatients: Math.floor(400 + Math.random() * 100 + index * 10),
    referrals: Math.floor(150 + Math.random() * 50 + index * 8),
    avgWaitTime: Math.floor(20 + Math.random() * 10),
    satisfaction: (4.2 + Math.random() * 0.5).toFixed(1),
    occupancy: Math.floor(75 + Math.random() * 15)
  }));
};

// Service utilization by location
export const serviceUtilizationData = [
  { service: 'OPD Consultations', koramangala: 456, indiranagar: 389, whitefield: 367, hsr: 334, jayanagar: 312 },
  { service: 'Diagnostics', koramangala: 234, indiranagar: 212, whitefield: 198, hsr: 187, jayanagar: 176 },
  { service: 'Emergency', koramangala: 89, indiranagar: 76, whitefield: 72, hsr: 68, jayanagar: 65 },
  { service: 'Surgery', koramangala: 45, indiranagar: 42, whitefield: 38, hsr: 35, jayanagar: 32 },
  { service: 'Preventive Care', koramangala: 178, indiranagar: 165, whitefield: 156, hsr: 145, jayanagar: 134 },
  { service: 'Vaccination', koramangala: 123, indiranagar: 112, whitefield: 108, hsr: 98, jayanagar: 92 },
  { service: 'Physiotherapy', koramangala: 67, indiranagar: 62, whitefield: 58, hsr: 54, jayanagar: 51 }
];

// Disease prevalence data by area
export const diseasePrevalenceByArea = {
  'Koramangala': {
    diabetes: 234,
    hypertension: 312,
    cardiac: 145,
    respiratory: 89,
    orthopedic: 167,
    gastro: 78,
    neuro: 45
  },
  'Indiranagar': {
    diabetes: 212,
    hypertension: 289,
    cardiac: 134,
    respiratory: 76,
    orthopedic: 156,
    gastro: 72,
    neuro: 42
  },
  'Whitefield': {
    diabetes: 298,
    hypertension: 267,
    cardiac: 123,
    respiratory: 134,
    orthopedic: 189,
    gastro: 89,
    neuro: 56
  },
  'HSR Layout': {
    diabetes: 189,
    hypertension: 234,
    cardiac: 98,
    respiratory: 67,
    orthopedic: 145,
    gastro: 65,
    neuro: 38
  },
  'Jayanagar': {
    diabetes: 167,
    hypertension: 223,
    cardiac: 112,
    respiratory: 72,
    orthopedic: 134,
    gastro: 61,
    neuro: 35
  }
};

// Patient demographics by area
export const demographicsByArea = {
  'Koramangala': {
    ageGroups: {
      '0-18': 234,
      '19-35': 567,
      '36-50': 456,
      '51-65': 234,
      '65+': 123
    },
    gender: {
      male: 823,
      female: 791
    },
    insurance: {
      government: 234,
      private: 678,
      corporate: 456,
      self: 246
    }
  },
  'Whitefield': {
    ageGroups: {
      '0-18': 312,
      '19-35': 723,
      '36-50': 489,
      '51-65': 198,
      '65+': 89
    },
    gender: {
      male: 934,
      female: 877
    },
    insurance: {
      government: 178,
      private: 892,
      corporate: 623,
      self: 118
    }
  }
};

// Export all data generators
export default {
  bangaloreAreas,
  generateReferrerProfiles,
  campaignData,
  generateMonthlyTrends,
  serviceUtilizationData,
  diseasePrevalenceByArea,
  demographicsByArea
};