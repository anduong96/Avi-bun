import moment from 'moment';
import { format } from 'sys';
import * as Cheerio from 'cheerio';
import { compact, fromPairs } from 'lodash';

import { toNumber } from '@app/lib/to.number';
import { FlightQueryParam } from '@app/types/flight';

/**
 * The function `getFlightDistanceKm` extracts the direct distance in kilometers from a Cheerio object.
 * @param $ - The parameter "$" is an instance of the Cheerio library's CheerioAPI. It is used to parse
 * and manipulate HTML or XML documents. In this function, it is used to select elements from the
 * document and extract the flight distance in kilometers.
 * @returns the flight distance in kilometers as a floating-point number.
 */
function getFlightDistanceKm($: Cheerio.CheerioAPI) {
  const labelElement = $('dt:contains("DIRECT DISTANCE")');
  const distance = labelElement.next().text().trim();
  const distanceKm = distance.split('\n')[0].trim();
  return parseFloat(distanceKm.replace(/[^0-9.]/g, ''));
}

/**
 * The function `getCo2EmissionKg` extracts CO2 emission data from a Cheerio object and returns it as a
 * TypeScript object.
 * @param $ - The parameter `$` is of type `Cheerio.CheerioAPI`. Cheerio is a library that allows you
 * to parse and manipulate HTML or XML documents using a jQuery-like syntax. In this code, the `$`
 * parameter is used to select elements from the HTML document and perform various operations
 * @returns an object of type `Result`, which is a record with keys 'Business', 'Eco+', 'Economy', and
 * 'First', and corresponding values of type `number`.
 */
function getCo2EmissionKg($: Cheerio.CheerioAPI) {
  const emissionsLabel = $('div:contains("CO2 EMISSION"):not(:has(*))');
  const emissionsEntries = emissionsLabel
    .nextAll()
    .slice(0, 4)
    .map((_, element) => $(element).text().trim())
    .get()
    .map(entry => compact(entry.split('\n').map(entry => entry.trim())))
    .map(entry => [entry[0], toNumber(entry[1])]);

  type Result = Record<'Business' | 'Eco+' | 'Economy' | 'First', number>;
  const emissions = fromPairs(emissionsEntries);
  return emissions as Result;
}

function getDepartureTime($: Cheerio.CheerioAPI) {
  const labelElement = $('span:contains("Departure")');
  const departureTime = labelElement.next().text().trim();
  const [time, timezone] = departureTime.split('\n');
  return {
    time,
    timezone,
  };
}

function getArrivalTime($: Cheerio.CheerioAPI) {
  const labelElement = $('span:contains("Arrival")');
  const departureTime = labelElement.next().text().trim();
  const [time, timezone] = departureTime.split('\n');
  return {
    time,
    timezone,
  };
}

function getFlightDate(
  $: Cheerio.CheerioAPI,
  params: Pick<FlightQueryParam, 'airlineIata' | 'flightNumber'>,
) {
  const flightIata = format(
    '%s%s',
    params.airlineIata.toUpperCase(),
    params.flightNumber,
  );

  const query = format('h1:contains("%s")', flightIata);
  const flightIataLabel = $(query);
  const dateElement = flightIataLabel.next();
  const dateStr = dateElement.text().trim();
  const date = moment(dateStr, 'DD. MMM YYYY').toDate();
  return date;
}

function getFlightTime(
  $: Cheerio.CheerioAPI,
  params: Pick<FlightQueryParam, 'airlineIata' | 'flightNumber'>,
) {
  const DATE_FORMAT = 'YYYY-MM-DD';
  const TIME_FORMAT = 'HH:mm Z';
  const DATE_TIME_FORMAT = format('%s %s', DATE_FORMAT, TIME_FORMAT);
  const flightDate = getFlightDate($, params);
  const flightDateStr = moment(flightDate).format(DATE_FORMAT);
  const departure = getDepartureTime($);
  const arrival = getArrivalTime($);
  const departureTimeStr = format(
    '%s %s %s',
    flightDateStr,
    departure.time,
    departure.timezone,
  );
  const arrivalTimeStr = format(
    '%s %s %s',
    flightDateStr,
    arrival.time,
    arrival.timezone,
  );
  const departureTime = moment(departureTimeStr, DATE_TIME_FORMAT);
  const arrivalTime = moment(arrivalTimeStr, DATE_TIME_FORMAT);

  /**
   * Flights with more than 24 hours is extremely rare
   */
  if (arrivalTime.isBefore(departureTime, 'minutes')) {
    arrivalTime.add(1, 'days');
  }

  const duration = arrivalTime.diff(departureTime);

  return {
    arrivalTime,
    departureTime,
    duration,
    flightDate,
  };
}

export function getFlightFromCrawl(
  html: string,
  params: Pick<FlightQueryParam, 'airlineIata' | 'flightNumber'>,
) {
  const $ = Cheerio.load(html);
  return {
    co2EmissionKg: getCo2EmissionKg($),
    distanceKm: getFlightDistanceKm($),
    ...getFlightTime($, params),
  };
}
