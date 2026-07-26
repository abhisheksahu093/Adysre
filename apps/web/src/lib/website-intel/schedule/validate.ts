import { validateScanUrl, ScanValidationError } from '../validate';
import { isCadence, type ScheduleInput } from './types';

/**
 * Validate a create-schedule body: the URL goes through the same SSRF-safe
 * validator scans use, and the cadence must be one of the known values.
 */
export function parseScheduleInput(body: unknown): ScheduleInput {
  const record = body && typeof body === 'object' ? (body as Record<string, unknown>) : {};

  const url = validateScanUrl(record.url).toString();

  const cadence = record.cadence;
  if (typeof cadence !== 'string' || !isCadence(cadence)) {
    throw new ScanValidationError('Cadence must be hourly, daily or weekly.', 'cadence_invalid');
  }

  return { url, cadence };
}
