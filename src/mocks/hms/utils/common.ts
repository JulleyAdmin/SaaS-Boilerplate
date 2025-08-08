/**
 * Common Mock Data Utilities
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a UUID
 */
export function generateUUID(): string {
  return uuidv4();
}

/**
 * Generate a random date between two dates
 */
export function generateRandomDate(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Generate a random date in the past N days
 */
export function generatePastDate(daysAgo: number): Date {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date;
}

/**
 * Generate a random future date in the next N days
 */
export function generateFutureDate(daysAhead: number): Date {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * daysAhead));
  return date;
}

/**
 * Generate a random time string (HH:MM)
 */
export function generateRandomTime(): string {
  const hours = Math.floor(Math.random() * 24);
  const minutes = Math.floor(Math.random() * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Generate a time within business hours (09:00 - 18:00)
 */
export function generateBusinessHoursTime(): string {
  const hours = Math.floor(Math.random() * 9) + 9; // 9-17
  const minutes = Math.floor(Math.random() * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Pick random item from array
 */
export function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Pick multiple random items from array
 */
export function pickMultipleRandom<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

/**
 * Generate a random boolean with given probability
 */
export function randomBoolean(probability = 0.5): boolean {
  return Math.random() < probability;
}

/**
 * Generate a random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a random decimal between min and max
 */
export function randomDecimal(min: number, max: number, decimals = 2): number {
  const value = Math.random() * (max - min) + min;
  return Number(value.toFixed(decimals));
}

/**
 * Generate age from date of birth
 */
export function calculateAge(dateOfBirth: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }

  return age;
}

/**
 * Generate date of birth for given age range
 */
export function generateDateOfBirth(minAge: number, maxAge: number): Date {
  const age = randomInt(minAge, maxAge);
  const date = new Date();
  date.setFullYear(date.getFullYear() - age);
  date.setMonth(randomInt(0, 11));
  date.setDate(randomInt(1, 28)); // Safe for all months
  return date;
}

/**
 * Format date as YYYY-MM-DD
 */
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Format date and time as ISO string
 */
export function formatDateTime(date: Date): string {
  return date.toISOString();
}

/**
 * Generate a sequence number with prefix
 */
let sequenceCounters: Record<string, number> = {};

export function generateSequenceNumber(prefix: string, digits: number = 6): string {
  if (!sequenceCounters[prefix]) {
    sequenceCounters[prefix] = 0;
  }
  sequenceCounters[prefix]++;
  return `${prefix}${sequenceCounters[prefix].toString().padStart(digits, '0')}`;
}

/**
 * Reset sequence counters
 */
export function resetSequenceCounters(): void {
  sequenceCounters = {};
}

/**
 * Generate lorem ipsum text
 */
export function generateLoremIpsum(words: number): string {
  const loremWords = [
    'lorem',
    'ipsum',
    'dolor',
    'sit',
    'amet',
    'consectetur',
    'adipiscing',
    'elit',
    'sed',
    'do',
    'eiusmod',
    'tempor',
    'incididunt',
    'ut',
    'labore',
    'et',
    'dolore',
    'magna',
    'aliqua',
    'enim',
    'ad',
    'minim',
    'veniam',
    'quis',
    'nostrud',
    'exercitation',
    'ullamco',
    'laboris',
    'nisi',
    'aliquip',
    'ex',
    'ea',
    'commodo',
    'consequat',
    'duis',
    'aute',
    'irure',
    'in',
    'reprehenderit',
    'voluptate',
    'velit',
    'esse',
    'cillum',
    'fugiat',
    'nulla',
    'pariatur',
    'excepteur',
    'sint',
    'occaecat',
    'cupidatat',
    'non',
    'proident',
    'sunt',
    'culpa',
    'qui',
    'officia',
    'deserunt',
    'mollit',
    'anim',
    'id',
    'est',
    'laborum',
  ];

  const result = [];
  for (let i = 0; i < words; i++) {
    result.push(pickRandom(loremWords));
  }

  const sentence = result.join(' ');
  return `${sentence.charAt(0).toUpperCase() + sentence.slice(1)}.`;
}

/**
 * Delay function for simulating async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a batch of items
 */
export function createBatch<T>(
  factory: (index: number) => T,
  count: number,
): T[] {
  return Array.from({ length: count }, (_, index) => factory(index));
}

/**
 * Weighted random selection
 */
export function weightedRandom<T>(items: Array<{ value: T; weight: number }>): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of items) {
    random -= item.weight;
    if (random <= 0) {
      return item.value;
    }
  }

  return items[items.length - 1].value;
}
