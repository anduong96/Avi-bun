import {
  FlightDetails,
  FlightProgress,
  FlightStatAirportCondition,
  FlightStatPromptness,
  FlightStatResp,
  FlightStatSearchItemV2,
  RandomFlight,
} from './types';

import { Singleton } from '@app/lib/singleton';
import { FlightQueryParam } from '@app/types/flight';
import generateUniqueId from 'generate-unique-id';
import ky from 'ky';
import { flatten } from 'lodash';
import moment from 'moment-timezone';
import { parseFlightIdFromUrl } from './utils';

class _FlightStats extends Singleton<_FlightStats>() {
  readonly BASE_URL = 'https://www.flightstats.com/v2';
  private readonly client = ky.create({
    prefixUrl: this.BASE_URL,
    searchParams: {
      rqid: generateUniqueId({
        length: 'lsew2g2m343'.length,
      }),
    },
    headers: {
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
      'Referrer-Policy': 'no-referrer-when-downgrade',
    },
  });

  /**
   * The `searchFlights` function searches for flights based on the airline IATA code and flight
   * number, and returns a list of flights with additional information.
   * @param args - The `args` parameter is an object that contains two properties:
   * @returns The function `searchFlights` returns an array of flight objects.
   */
  async searchFlights(
    args: Pick<FlightQueryParam, 'airlineIata' | 'flightNumber'>,
  ) {
    type Response = FlightStatResp<FlightStatSearchItemV2[]>;
    const route = `api-next/flight-tracker/other-days/${args.airlineIata}/${args.flightNumber}`;
    const request = await this.client.get(route);
    const response = await request.json<Response>();

    const flights = flatten(
      response.data.map(entry => {
        const dateStr = `${entry.date1}-${entry.year}`;
        const date = moment(dateStr, 'DD-MMM-YYYY');
        return entry.flights.map(flight => ({
          ...flight,
          year: date.year(),
          month: date.month(),
          date: date.date(),
          flightID: parseFlightIdFromUrl(flight.url),
        }));
      }),
    );

    return flights;
  }

  /**
   * The function `getAirportConditions` retrieves the airport conditions for a given airport IATA code.
   * @param {string} airportIata - The `airportIata` parameter is a string that represents the IATA code
   * of the airport for which you want to retrieve the conditions. The IATA code is a three-letter code
   * that is used to identify airports worldwide.
   * @returns an object of type FlightStatAirportCondition, which represents the conditions of an
   * airport.
   */
  async getAirportConditions(airportIata: string) {
    const route = `api/airport/${airportIata}`;
    const request = await this.client.get(route);
    const response = await request.json<FlightStatAirportCondition>();
    return response;
  }

  /**
   * The function `getFlightPromptness` retrieves the promptness statistics for a specific flight.
   * @param args - The `args` parameter is an object that contains the following properties:
   * @returns the first element of the response array, which is of type FlightStatPromptness.
   */
  async getFlightPromptness(args: {
    airlineIata: string;
    flightNumber: string;
    originIata: string;
    destinationIata: string;
  }) {
    const route = `api/on-time-performance/${args.airlineIata}/${args.flightNumber}/${args.originIata}/${args.destinationIata}`;
    const request = await this.client.get(route);
    const response = await request.json<FlightStatPromptness[]>();
    return response[0];
  }

  /**
   * The function `getFlightDetails` retrieves extended details of a flight using the provided date,
   * airline IATA code, flight number, and optional flight ID.
   * @param args - The `args` parameter is an object that contains the following properties:
   * @returns The function `getFlightDetails` returns a promise that resolves to an object of type
   * `FlightDetails`.
   */
  async getFlightDetails(args: FlightQueryParam & { flightID?: string }) {
    // https://www.flightstats.com/v2/api/extendedDetails/DL/3/2023/08/29/1208166292?rqid=80y713n5xnl

    const date = moment({
      month: args.flightMonth,
      year: args.flightYear,
      date: args.flightDate,
    });

    const dateStr = date.format('YYYY/M/D');
    const { airlineIata, flightID, flightNumber } = args;
    const route = flightID
      ? `api/extendedDetails/${airlineIata}/${flightNumber}/${dateStr}/${flightID}`
      : `api/extendedDetails/${airlineIata}/${flightNumber}/${dateStr}`;

    const request = await this.client.get(route);

    this.logger.debug(
      'Status: [%s], Request: %s',
      request.statusText,
      request.url,
    );

    if (request.status > 299) {
      throw new Error('Failed to get flight details: ' + request.statusText);
    }

    const response = await request.json<FlightDetails>();

    return {
      ...response,
      ...args,
    };
  }

  async getFlightProgress(args: {
    flightID: string;
    airlineIata: string;
    flightNumber: string;
  }) {
    const route = `api-next/flick/${args.flightID}`;
    const request = await this.client.get(route, {
      searchParams: {
        guid: '34b64945a69b9cac:5ae30721:13ca699d305:XXXX',
        flightPlan: true,
        airline: args.airlineIata,
        flight: args.flightNumber,
      },
    });

    const response = await request.json<FlightStatResp<FlightProgress>>();
    return response.data;
  }

  async getRandomFlight() {
    type Response = FlightStatResp<RandomFlight[]>;
    const route = 'api-next/random-flight';
    const request = await this.client.get(route);
    const response = await request.json<Response>();
    return response.data[0]._source;
  }
}

export const FlightStats = _FlightStats.instance;
