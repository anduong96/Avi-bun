import ky from 'ky';
import moment from 'moment';
import { format } from 'util';

import { getAircraftFromHtml } from './plane.crawl';
import { getFlightFromCrawl } from './flight.crawl';

export class Flightera {
  private static readonly BASE_URL = 'https://www.flightera.net';
  private static readonly client = ky.create({
    headers: {
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'max-age=0',
      cookie:
        '_pk_id.1.afcf=57f8219651488213.1694222158.; token=ovhMnNuvhLdfclvQSbzBsLRVkZlviZyVw; _pk_ref.1.afcf=%5B%22%22%2C%22%22%2C1697916660%2C%22https%3A%2F%2Fwww.google.com%2F%22%5D; _pk_ses.1.afcf=1',
      'sec-ch-ua':
        '"Chromium";v="118", "Google Chrome";v="118", "Not=A?Brand";v="99"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      'user-agent':
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    },
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
    const html = await response.text();
    return getAircraftFromHtml(html);
  }

  static getDirectFlightUrl(params: {
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
  static async getFlightFromCrawl(params: {
    airlineIata: string;
    flightNumber: string;
  }) {
    const route = this.getFlightUrl(params);
    const request = await this.client.get(route);
    const html = await request.text();
    return getFlightFromCrawl(html);
  }

  static getFlightUrl(params: { airlineIata: string; flightNumber: string }) {
    const route = format(
      '%s/en/flight/%s%s',
      this.BASE_URL,
      params.airlineIata.toUpperCase(),
      params.flightNumber,
    );

    return encodeURI(route);
  }
  static getPlaneUrl(tailNumber: string) {
    return encodeURI(this.BASE_URL + `/en/planes/${tailNumber}`);
  }
}
