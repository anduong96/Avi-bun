import ky from 'ky';
import moment from 'moment-timezone';
import { flatten, uniqBy } from 'lodash';
import generateUniqueId from 'generate-unique-id';

import { Logger } from '@app/lib/logger';
import { FlightQueryParam } from '@app/types/flight';

import { parseFlightIdFromUrl } from './utils';
import {
  FlightDetails,
  FlightProgress,
  FlightStatAirportCondition,
  FlightStatPromptness,
  FlightStatResp,
  FlightStatSearchItemV2,
  RandomFlight,
} from './types';

export class FlightStats {
  private static readonly BASE_URL = 'https://www.flightstats.com/v2';
  private static readonly client = ky.create({
    headers: {
      'Referrer-Policy': 'no-referrer-when-downgrade',
      accept: '*/*',
      'accept-language': 'en-US,en;q=0.9',
      'csrf-token': '',
      'sec-ch-ua':
        '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
    },
    prefixUrl: this.BASE_URL,
    searchParams: {
      rqid: generateUniqueId({
        length: 'lsew2g2m343'.length,
      }),
    },
  });
  private static readonly logger = Logger.getSubLogger({ name: this.name });

  /**
   * The function `getAirportConditions` retrieves the airport conditions for a given airport IATA code.
   * @param {string} airportIata - The `airportIata` parameter is a string that represents the IATA code
   * of the airport for which you want to retrieve the conditions. The IATA code is a three-letter code
   * that is used to identify airports worldwide.
   * @returns an object of type FlightStatAirportCondition, which represents the conditions of an
   * airport.
   */
  static async getAirportConditions(airportIata: string) {
    const route = `api/airport/${airportIata}`;
    const request = await this.client.get(route);
    const response = await request.json<FlightStatAirportCondition>();
    return response;
  }

  /**
   * The function `getFlightDetails` retrieves extended details of a flight using the provided date,
   * airline IATA code, flight number, and optional flight ID.
   * @param args - The `args` parameter is an object that contains the following properties:
   * @returns The function `getFlightDetails` returns a promise that resolves to an object of type
   * `FlightDetails`.
   */
  static async getFlightDetails(
    args: FlightQueryParam & { flightID?: string },
  ) {
    // https://www.flightstats.com/v2/api/extendedDetails/DL/3/2023/08/29/1208166292?rqid=80y713n5xnl

    const date = moment({
      date: args.flightDate,
      month: args.flightMonth,
      year: args.flightYear,
    });

    const dateStr = date.format('YYYY/M/D');
    const { airlineIata, flightNumber } = args;
    const route = `api/extendedDetails/${airlineIata}/${flightNumber}/${dateStr}`;

    const request = await this.client.get(route, {
      throwHttpErrors: false,
    });

    this.logger.debug(
      'Status: [%s], Request: %s',
      request.statusText,
      request.url,
    );

    if (!request.ok) {
      throw new Error('Failed to get flight details: ' + request.statusText);
    }

    const response = await request.json<FlightDetails>();
    this.logger.debug('Flight Detail\n args=%o\nresponse:%o', args, response);

    return {
      ...response,
      ...args,
    };
  }

  static async getFlightProgress(args: {
    airlineIata: string;
    flightID: string;
    flightNumber: string;
  }) {
    const route = `api-next/flick/${args.flightID}`;
    const request = await this.client.get(route, {
      searchParams: {
        airline: args.airlineIata,
        flight: args.flightNumber,
        flightPlan: true,
        guid: '34b64945a69b9cac:5ae30721:13ca699d305:XXXX',
      },
    });

    const response = await request.json<FlightStatResp<FlightProgress>>();
    const data = response.data;
    return data;
  }

  /**
   * The function `getFlightPromptness` retrieves the promptness statistics for a specific flight.
   * @param args - The `args` parameter is an object that contains the following properties:
   * @returns the first element of the response array, which is of type FlightStatPromptness.
   */
  static async getFlightPromptness(args: {
    airlineIata: string;
    destinationIata: string;
    flightNumber: string;
    originIata: string;
  }) {
    const route = `api/on-time-performance/${args.airlineIata}/${args.flightNumber}/${args.originIata}/${args.destinationIata}`;
    const request = await this.client.get(route);
    const response = await request.json<FlightStatPromptness[]>();
    const result = response[0];
    if ('errorCode' in result) {
      this.logger.error(result);
      return null;
    }

    return result;
  }

  static async getRandomFlight() {
    type Response = FlightStatResp<RandomFlight[]>;
    const route = 'api-next/random-flight';
    const request = await this.client.get(route);
    const response = await request.json<Response>();
    const flight = response.data[0]._source;
    const flightDepartureDate = moment(flight.departureDateTime, 'YYYY-MM-DD');
    const flightYear = flightDepartureDate.year();
    const flightMonth = flightDepartureDate.month();
    const flightDate = flightDepartureDate.date();
    this.logger.debug('Random flight', flight.flightId);

    return {
      ...flight,
      flightDate,
      flightMonth,
      flightYear,
    };
  }

  /**
   * The `searchFlights` function searches for flights based on the airline IATA code and flight
   * number, and returns a list of flights with additional information.
   * @param args - The `args` parameter is an object that contains two properties:
   * @returns The function `searchFlights` returns an array of flight objects.
   */
  static async searchFlights(
    args: Pick<FlightQueryParam, 'airlineIata' | 'flightNumber'>,
  ) {
    type Response = FlightStatResp<FlightStatSearchItemV2[]>;
    const route = `api-next/flight-tracker/other-days/${args.airlineIata}/${args.flightNumber}`;
    const request = await this.client.get(route);
    this.logger.debug('Search flights param[%s] url[%s]', args, request.url);

    if (!request.ok) {
      this.logger.debug('Search flights failed');
      return [];
    }

    const response = await request.json<Response>();

    const flights = flatten(
      response.data.map(entry => {
        const dateStr = `${entry.date1}-${entry.year}`;
        const date = moment(dateStr, 'DD-MMM-YYYY');
        return uniqBy(
          entry.flights,
          flight => flight.departureAirport.iata + flight.arrivalAirport.iata,
        ).map(flight => ({
          ...flight,
          flightDate: date.date(),
          flightID: parseFlightIdFromUrl(flight.url),
          flightMonth: date.month(),
          flightYear: date.year(),
        }));
      }),
    );

    return flights;
  }
}
