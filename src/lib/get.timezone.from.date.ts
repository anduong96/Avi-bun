/**
 * The getTimezoneFromDate function returns the timezone of a given date as a string in the format
 * "UTC±X", where X is the number of hours ahead or behind UTC.
 * @param {Date} date - The `date` parameter is a JavaScript `Date` object representing a specific date
 * and time.
 * @returns the timezone of a given date as a string in the format "UTC±X", where X represents the
 * number of hours ahead or behind UTC (Coordinated Universal Time).
 */
export function getTimezoneOffsetHourFromDate(date: Date) {
  const timezoneOffsetMinutes = date.getTimezoneOffset();
  const timezoneOffsetHours = timezoneOffsetMinutes / 60;
  return timezoneOffsetHours;
}
