import { AeroDataBoxAircraft, AeroDataBoxFlight } from './types';

import { ENV } from '@app/env';
import { Singleton } from '@app/lib/singleton';
import { PartialBy } from '@app/types/common';
import { FlightQueryParam } from '@app/types/flight';
import axios, { AxiosError } from 'axios';
import moment from 'moment';
import { tryNice } from 'try-nice';

/**
 * @see https://doc.aerodatabox.com
 */
export class _AeroDataBox extends Singleton<_AeroDataBox>() {
  private readonly client = axios.create({
    baseURL: 'https://aerodatabox.p.rapidapi.com',
    headers: {
      'X-RapidAPI-Key': ENV.AERO_DATABOX_API_KEY,
      'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com',
    },
  });

  private getDateStr(date: Date) {
    return moment(date).format('YYYY-MM-DD');
  }

  /**
   * The function `getAircraft` retrieves aircraft data based on a given tail number.
   * @param {string} tailNumber - The `tailNumber` parameter is a string that represents the unique
   * identifier of an aircraft. It is typically a combination of letters and numbers that are painted
   * on the tail of the aircraft.
   * @returns The function `getAircraft` is returning the data of type `AeroDataBoxAircraft` from the
   * API response.
   */
  async getAircraft(tailNumber: string) {
    const route = `/aircrafts/reg/${tailNumber}`;
    const response = await this.client.get<AeroDataBoxAircraft>(route, {
      params: {
        withRegistrations: true,
        withImage: true,
      },
    });

    return response.data;
  }

  async getFlights(args: PartialBy<FlightQueryParam, 'departureDate'>) {
    const flightNum = `${args.airlineIata}${args.flightNumber}`;
    const route = !args.departureDate
      ? `/flights/number/${flightNum}`
      : `/flights/number/${flightNum}/${this.getDateStr(args.departureDate)}`;

    this.logger.debug(
      'Getting flights from route[%s%s] args[%o]',
      this.client.defaults.baseURL,
      route,
      args,
    );

    const [response, error] = await tryNice(() =>
      this.client.get<AeroDataBoxFlight[]>(route, {
        params: {
          // withLocation: false,
          // withAircraftImage: false,
        },
      }),
    );

    if (!response) {
      const axiosError = error as AxiosError;
      this.logger.error(route, axiosError.message);
      return [];
    }

    return response.data;
  }
}

export const AeroDataBox = _AeroDataBox.instance;
