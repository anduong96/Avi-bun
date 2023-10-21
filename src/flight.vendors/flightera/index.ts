import ky from 'ky';
import moment from 'moment';
import { format } from 'util';

import { getAircraftFromHtml } from './plane.crawl';

export class Flightera {
  private static readonly BASE_URL = 'https://www.flightera.net';
  private static readonly client = ky.create({
    headers: {},
    timeout: 5 * 1000,
  });

  /**
   * The function `getAircraftFromCrawl` retrieves aircraft information from a website using a tail
   * number and returns the parsed data.
   * @param {string} tailNumber - The `tailNumber` parameter is a string that represents the unique
   * identifier of an aircraft. It is typically the alphanumeric code painted on the tail of the
   * aircraft, which helps identify and track the specific aircraft.
   * @returns the result of calling the `getAircraftFromHtml` function with the `response` as an
   * argument.
   */
  static async getAircraftFromCrawl(tailNumber: string) {
    const route = this.getPlaneUrl(tailNumber);
    const response = await this.client.get(route);
    const data = await response.text();
    return getAircraftFromHtml(data);
  }

  static getFlightUrl(params: {
    airlineIata: string;
    airlineName: string;
    departureDate: Date;
    destinationCity: string;
    flightNumber: string;
    originCity: string;
    originIata: string;
  }) {
    const fillerStr = [
      params.airlineName,
      params.originCity,
      params.destinationCity,
    ].join('-');

    const flightNumber = format(
      '%s%s',
      params.airlineIata,
      params.flightNumber,
    );

    const url = format(
      '%s/en/flight_details/%s/%s/%s/%s',
      this.BASE_URL,
      fillerStr,
      flightNumber.toUpperCase(),
      params.originIata.toUpperCase(),
      moment(params.departureDate).format('YYYY-MM-DD'),
    );

    return encodeURI(url);
    // https://www.flightera.net/en/flight_details/American+Airlines-New+York-London/AA100/KJFK/2023-10-19
  }
  static getPlaneUrl(tailNumber: string) {
    return encodeURI(this.BASE_URL + `/en/planes/${tailNumber}`);
  }
}
