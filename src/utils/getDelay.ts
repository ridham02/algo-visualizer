export function getDelay(size: number): number {
  if (size <= 10) return 120;
  if (size <= 25) return 60;
  if (size <= 50) return 35;
  if (size <= 75) return 22;
  if (size <= 100) return 16;
  return 12;
}
