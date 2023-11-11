import ky from 'ky';
import moment from 'moment';
import { format } from 'sys';

import { TSA_WaitTimeResult } from './types';

export class TSA {
  private static readonly BASE_URL = 'https://www.tsa.gov';
  private static readonly client = ky.create({ prefixUrl: this.BASE_URL });

  /**
   * The function `getAirportWaitTimes` retrieves TSA wait times for a given airport.
   * @param {string} airportIata - The airportIata parameter is a string that represents the IATA code of
   * the airport for which you want to retrieve the wait times. IATA codes are three-letter codes used to
   * identify airports worldwide.
   * @returns a response object of type TSA_WaitTimeResult.
   */
  static async getAirportWaitTimes(airportIata: string) {
    const response = await this.client
      .get(format('api/checkpoint_waittime/v1/%s', airportIata))
      .json<TSA_WaitTimeResult>();

    return {
      airportIata: response.airport_code,
      airportName: response.airport_name,
      data: response.data.map(item => ({
        dayOfWeek: moment().day(item.day).day(),
        hour: Number(item.hour),
        maxWaitMinute: Number(item.max_standard_wait),
        updatedAt: Number(item.updated),
      })),
    };
  }
}
