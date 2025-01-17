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

function getTrackUrl($: Cheerio.CheerioAPI) {
  const html = $.html();
  const urlPattern =
    /buildTrackMap\(\s*map\s*,\s*["'](\/[a-z]+\/[a-z]+\/[a-z]+\/\d+)["']\s*\);/;

  const match = html.match(urlPattern);
  if (!match) {
    return null;
  }

  return match[1];
}

export function getFlightFromCrawl(
  html: string,
  params: Pick<FlightQueryParam, 'airlineIata' | 'flightNumber'>,
) {
  const $ = Cheerio.load(html);
  return {
    co2EmissionKg: getCo2EmissionKg($),
    departureDate: getFlightDate($, params),
    distanceKm: getFlightDistanceKm($),
    trackURL: getTrackUrl($),
  };
}
