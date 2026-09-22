/**
 * Generate a unique grievance ID in format: GRV-YYYY-XXXXX
 * Example: GRV-2026-00125
 */
export function generateGrievanceId(year = new Date().getFullYear()): string {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  return `GRV-${year}-${randomNum}`;
}
