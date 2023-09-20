import { AirLabsFlightResponse, AirLabsResponse } from './types';

import { ENV } from '@app/env';
import { Singleton } from '@app/lib/singleton';
import axios from 'axios';

export class AirLabs extends Singleton<AirLabs>() {
  private readonly client = axios.create({
    baseURL: 'https://airlabs.co/api/v9',
    params: {
      api_key: ENV.AIR_LABS_API_KEY,
    },
  });

  /**
   * The function `getFlight` retrieves flight information based on the airline IATA code and flight
   * number provided.
   * @param args - The `args` parameter is an object that contains two properties:
   * @returns the data from the API response.
   */
  async getFlight(args: { airlineIata: string; flightNumber: string }) {
    const route = `/flight`;
    const flightIata = args.airlineIata + args.flightNumber;
    const response = await this.client.get<
      AirLabsResponse<AirLabsFlightResponse>
    >(route, {
      params: {
        flight_iata: flightIata,
      },
    });

    return response.data;
  }
}
