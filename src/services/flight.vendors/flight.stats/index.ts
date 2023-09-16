import {
  FlightDetails,
  FlightProgress,
  FlightStatAirportCondition,
  FlightStatFlight,
  FlightStatPromptness,
  FlightStatResp,
  FlightStatSearchItemV2,
  RandomFlight,
  SearchFlightParam,
} from './types';
import axios, { AxiosError } from 'axios';

import { Logger } from '@app/services/logger';
import { flatten } from 'lodash';
import generateUniqueId from 'generate-unique-id';
import moment from 'moment-timezone';
import { parseFlightIdFromUrl } from './utils';
import { tryNice } from 'try-nice';

export class FlightStatsService {
  static readonly instance = new FlightStatsService();
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
   * @deprecated
   * The function `getFlight` retrieves flight data based on the provided date, airline IATA code, and
   * flight number.
   * @param {SearchFlightParam}  - - `date`: The date of the flight in the format `YYYY-MM-DD`.
   * @returns the data property of the response from the flight tracker API.
   */
  async getFlight({ date, airlineIata, flightNumber }: SearchFlightParam) {
    const dateStr = moment(date).format('YYYY/MM/DD');
    const route = `/api-next/flight-tracker/${airlineIata}/${flightNumber}/${dateStr}`;
    const response = await this.client.get<FlightStatFlight>(route);
    return response.data.data;
  }

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
    const now = moment(args.departureDate);
    const route = `api-next/flight-tracker/other-days/${args.airlineIata}/${args.flightNumber}`;
    const response =
      await this.client.get<FlightStatResp<FlightStatSearchItemV2[]>>(route);

    const mappedFlights = flatten(
      response.data.data.map((entry) => {
        const dateStr = `${entry.date1}-${entry.year}`;
        const date = moment(dateStr, 'DD-MMM-YYYY');
        return entry.flights.map((flight) => ({
          ...flight,
          flightID: parseFlightIdFromUrl(flight.url),
          date,
        }));
      }),
    );

    this.logger.debug('Search Flights Resp', mappedFlights);

    const populated = await Promise.all(
      mappedFlights
        .filter((flight) => now.isSameOrBefore(flight.date, 'date'))
        .map((flight) =>
          this.getFlightDetails({
            date: flight.date.toDate(),
            airlineIata: args.airlineIata,
            flightNumber: args.flightNumber,
            flightID: flight.flightID,
          }),
        ),
    );

    return populated;
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

    const [result, error] = await tryNice(() =>
      this.client.get<FlightDetails>(route),
    );

    if (error || !result) {
      const axiosError = error as AxiosError;

      this.logger.error(
        'Failed to fetch flight',
        axiosError.request?.res?.responseUrl,
      );

      throw error;
    }

    return result;
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
    const route = '/api-next/random-flight';
    const response =
      await this.client.get<FlightStatResp<RandomFlight[]>>(route);

    return response.data.data[0];
  }
}
