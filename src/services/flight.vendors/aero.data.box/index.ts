import { AeroDataBoxAircraft, AeroDataBoxFlight } from './types';

import { ENV } from '@app/services/env';
import axios from 'axios';
import moment from 'moment';

/**
 * @see https://doc.aerodatabox.com
 */
export class AeroDataBox {
  static readonly instance = new AeroDataBox();

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

  async getFlight(args: {
    airlineIata: string;
    flightNumber: string;
    date?: Date;
  }) {
    const flightNum = `${args.airlineIata}${args.flightNumber}`;
    const route = args.date
      ? `/flights/%7BsearchBy%7D/${flightNum}/${this.getDateStr(args.date)}`
      : `/flights/number/${flightNum}`;

    const response = await this.client.get<AeroDataBoxFlight[]>(route, {
      params: {
        withLocation: false,
        withAircraftImage: false,
      },
    });

    return response.data;
  }
}
