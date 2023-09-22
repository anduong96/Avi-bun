import {
  FlightDetails,
  FlightProgress,
  FlightStatAirportCondition,
  FlightStatPromptness,
  FlightStatResp,
  FlightStatSearchItemV2,
  RandomFlight,
} from './types';
import axios, { AxiosError } from 'axios';

import { Logger } from '@app/lib/logger';
import { Singleton } from '@app/lib/singleton';
import { flatten } from 'lodash';
import generateUniqueId from 'generate-unique-id';
import moment from 'moment-timezone';
import { parseFlightIdFromUrl } from './utils';
import { tryNice } from 'try-nice';

class _FlightStats extends Singleton<_FlightStats>() {
  private logger = Logger.child({ name: 'FlightStats' });

  private readonly client = axios.create({
    baseURL: 'https://www.flightstats.com/v2',
    params: {
      rqid: generateUniqueId({
        length: 'lsew2g2m343'.length,
      }),
    },
  });

  /**
   * The function `searchFlightsV2` searches for flight information based on the airline IATA code and
   * flight number.
   * @param args - The `args` parameter is an object that contains two properties:
   * @returns The function `searchFlightsV2` is returning a Promise that resolves to the data of type
   * `FlightStatResp<FlightStatSearchItemV2[]>`.
   */
  async searchFlights(args: {
    airlineIata: string;
    flightNumber: string;
    departureDate: Date;
  }) {
    type Response = FlightStatResp<FlightStatSearchItemV2[]>;
    const route = `api-next/flight-tracker/other-days/${args.airlineIata}/${args.flightNumber}`;
    const response = await this.client.get<Response>(route);
    const flights = flatten(
      response.data.data.map(entry => {
        const dateStr = `${entry.date1}-${entry.year}`;
        const date = moment(dateStr, 'DD-MMM-YYYY');
        return entry.flights.map(flight => ({
          ...flight,
          flightID: parseFlightIdFromUrl(flight.url),
          date: date.toDate(),
        }));
      }),
    );

    return flights;
  }

  async getAirportConditions(airportIata: string) {
    const route = `/api/airport/${airportIata}`;
    const response = await this.client.get<FlightStatAirportCondition>(route);
    return response.data;
  }

  async getFlightPromptness(args: {
    airlineIata: string;
    flightNumber: string;
    originIata: string;
    destinationIata: string;
  }) {
    const route = `/api/on-time-performance/${args.airlineIata}/${args.flightNumber}/${args.originIata}/${args.destinationIata}`;
    const response = await this.client.get<FlightStatPromptness[]>(route);
    return response.data[0];
  }

  async getFlightDetails(args: {
    date: Date;
    airlineIata: string;
    flightNumber: string;
    flightID?: string;
  }) {
    // https://www.flightstats.com/v2/api/extendedDetails/DL/3/2023/08/29/1208166292?rqid=80y713n5xnl
    const { airlineIata, flightID, flightNumber } = args;
    const dateObj = moment(args.date).utc();
    const dateStr = dateObj.format('YYYY/M/D');
    const route = flightID
      ? `/api/extendedDetails/${airlineIata}/${flightNumber}/${dateStr}/${flightID}`
      : `/api/extendedDetails/${airlineIata}/${flightNumber}/${dateStr}`;

    this.logger.debug(
      'getFlightDetails: %s%s',
      this.client.defaults.baseURL,
      route,
    );

    const [result, error] = await tryNice(() =>
      this.client.get<FlightDetails>(route),
    );

    if (error || !result) {
      const axiosError = error as AxiosError;

      this.logger.error(
        'Failed to fetch flight \n%o',
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        axiosError.request?._redirectable?._currentUrl,
      );

      throw error;
    }

    return result.data;
  }

  async getFlightProgress(args: {
    flightID: string;
    airlineIata: string;
    flightNumber: string;
  }) {
    const route = `/api-next/flick/${args.flightID}`;
    const response = await this.client.get<FlightStatResp<FlightProgress>>(
      route,
      {
        params: {
          guid: '34b64945a69b9cac:5ae30721:13ca699d305:XXXX',
          flightPlan: true,
          airline: args.airlineIata,
          flight: args.flightNumber,
        },
      },
    );

    return response.data.data;
  }

  async getRandomFlight() {
    type Response = FlightStatResp<RandomFlight[]>;
    const route = '/api-next/random-flight';
    const response = await this.client.get<Response>(route);
    return response.data.data[0]._source;
  }
}

export const FlightStats = _FlightStats.instance;
