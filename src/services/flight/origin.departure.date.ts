import { prisma } from '@app/prisma';
import { FlightQueryParam } from '@app/types/flight';
import assert from 'assert';
import moment from 'moment-timezone';

const FORMAT = 'YYYY-MM-DD' as const;

/**
 * The function converts a given date to the departure date in the timezone of the origin airport.
 * @param date - The `date` parameter is a moment.js compatible date input. It can be a string, a Date
 * object, or a moment.js object representing a specific date and time.
 * @param {string} originIata - The `originIata` parameter is a string that represents the IATA code of
 * the origin airport.
 * @returns the formatted date in the timezone of the origin airport.
 */
export async function toOriginDepartureDate(
  date: moment.MomentInput,
  originIata: string,
) {
  const origin = await prisma.airport.findFirstOrThrow({
    where: {
      iata: originIata,
    },
    select: {
      timezone: true,
    },
  });

  const dateObj = moment(date);
  return dateObj.tz(origin.timezone).format(FORMAT);
}

/**
 * The function converts a date object containing month, date, and year properties into a formatted
 * string.
 * @param dateObj - The `dateObj` parameter is an object that contains the following properties:
 * @returns a formatted date string.
 */
export function toOriginDepartureDAteFromObj(
  dateObj: FlightQueryParam['departureDate'],
) {
  return moment({
    month: dateObj.month,
    date: dateObj.date,
    year: dateObj.year,
  }).format(FORMAT);
}

/**
 * The function takes a date string in the format "YYYY-MM-DD" and returns an object with separate
 * properties for the year, month, and day.
 * @param {string} dateStr - A string representing a date in the format "YYYY-MM-DD".
 * @returns An object with properties `year`, `month`, and `day` is being returned.
 */
export function originDepartureDateToParts(dateStr: string) {
  const [year, month, day] = dateStr.split('-');
  assert(year, 'year is required');
  assert(month, 'month is required');
  assert(day, 'day is required');
  return { year, month, day };
}
