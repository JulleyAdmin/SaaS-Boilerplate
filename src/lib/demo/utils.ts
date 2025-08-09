// Demo utilities
export function useDemoMode() {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}

export function isDemoMode() {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true';
}