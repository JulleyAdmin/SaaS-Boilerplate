'use client';

import { useQuery } from '@tanstack/react-query';

type GovernmentScheme = {
  schemeId: string;
  schemeName: string;
  schemeCode: string;
  schemeType: string;
  coverageAmount: number;
  isActive: boolean;
};

// Mock data for development
const mockSchemes: GovernmentScheme[] = [
  {
    schemeId: '1',
    schemeName: 'Ayushman Bharat Pradhan Mantri Jan Arogya Yojana',
    schemeCode: 'AB-PMJAY',
    schemeType: 'health_insurance',
    coverageAmount: 500000,
    isActive: true,
  },
  {
    schemeId: '2',
    schemeName: 'Employee State Insurance Scheme',
    schemeCode: 'ESI',
    schemeType: 'health_insurance',
    coverageAmount: 100000,
    isActive: true,
  },
  {
    schemeId: '3',
    schemeName: 'Central Government Health Scheme',
    schemeCode: 'CGHS',
    schemeType: 'health_insurance',
    coverageAmount: 200000,
    isActive: true,
  },
];

export function useGovernmentSchemes() {
  return useQuery<GovernmentScheme[]>({
    queryKey: ['government-schemes'],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockSchemes;
    },
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}

export function useGovernmentScheme(schemeId: string) {
  return useQuery<GovernmentScheme>({
    queryKey: ['government-scheme', schemeId],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300));

      const scheme = mockSchemes.find(s => s.schemeId === schemeId);
      if (!scheme) {
        throw new Error('Government scheme not found');
      }

      return scheme;
    },
    enabled: !!schemeId,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });
}
