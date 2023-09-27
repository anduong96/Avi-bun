import { AirLabsFlightResponse, AirLabsResponse } from './types';

import { ENV } from '@app/env';
import { FlightQueryParam } from '@app/types/flight';
import ky from 'ky';

export class AirLabs {
  private static readonly client = ky.create({
    prefixUrl: 'https://airlabs.co/api/v9',
    searchParams: {
      api_key: ENV.AIR_LABS_API_KEY!,
    },
  });

  /**
   * The function `getFlight` retrieves flight information based on the airline IATA code and flight
   * number provided.
   * @param args - The `args` parameter is an object that contains two properties:
   * @returns the data from the API response.
   */
  static async getFlight(
    args: Pick<FlightQueryParam, 'airlineIata' | 'flightNumber'>,
  ) {
    type Response = AirLabsResponse<AirLabsFlightResponse>;

    const route = `flight`;
    const flightIata = args.airlineIata + args.flightNumber;
    const request = await this.client.get(route, {
      searchParams: {
        flight_iata: flightIata,
      },
    });

    const response = await request.json<Response>();
    return response;
  }
}
