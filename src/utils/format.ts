/**
 * Utility functions for formatting data
 */

/**
 * Format a number as currency in Indian Rupees
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a number with Indian number system (lakhs, crores)
 */
export function formatIndianNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

/**
 * Format a date in a human-readable format
 */
export function formatDate(date: Date | string, format: 'short' | 'long' | 'time' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  switch (format) {
    case 'long':
      return new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'full',
        timeStyle: 'short',
      }).format(dateObj);
    case 'time':
      return new Intl.DateTimeFormat('en-IN', {
        timeStyle: 'short',
      }).format(dateObj);
    case 'short':
    default:
      return new Intl.DateTimeFormat('en-IN', {
        dateStyle: 'medium',
      }).format(dateObj);
  }
}

/**
 * Format a phone number in Indian format
 */
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');

  // Format as +91-XXXXX-XXXXX for 10-digit numbers
  if (digits.length === 10) {
    return `+91-${digits.slice(0, 5)}-${digits.slice(5)}`;
  }

  // Format as +91-XXXXX-XXXXX for 11-digit numbers starting with 91
  if (digits.length === 12 && digits.startsWith('91')) {
    const phoneDigits = digits.slice(2);
    return `+91-${phoneDigits.slice(0, 5)}-${phoneDigits.slice(5)}`;
  }

  // Return as-is if not a standard Indian mobile number
  return phone;
}

/**
 * Format percentage with Indian locale
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value / 100);
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) {
    return '0 Bytes';
  }

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
}

/**
 * Format Indian government ID numbers (Aadhaar, PAN, etc.)
 */
export function formatAadhaar(aadhaar: string): string {
  const digits = aadhaar.replace(/\D/g, '');
  if (digits.length === 12) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 8)} ${digits.slice(8)}`;
  }
  return aadhaar;
}

export function formatPAN(pan: string): string {
  const cleaned = pan.replace(/[^A-Z0-9]/g, '');
  if (cleaned.length === 10) {
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
  }
  return pan;
}
