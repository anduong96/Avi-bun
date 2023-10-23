import moment from 'moment-timezone';

/**
 * The function `timezoneToUtcOffset` takes a timezone string as input and returns the UTC offset in
 * minutes.
 * @param {string} timezone - A string representing a specific timezone.
 * @returns the UTC offset of the given timezone.
 */
export function timezoneToUtcOffset(timezone: string): number {
  return moment.tz(timezone).utcOffset() / 60;
}
