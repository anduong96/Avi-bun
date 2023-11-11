import ky from 'ky';
import moment from 'moment';
import { format } from 'sys';

import { TSA_CheckpointResult, TSA_WaitTimeResult } from './types';

export class TSA {
  private static readonly BASE_URL = 'https://www.tsa.gov';
  private static readonly client = ky.create({ prefixUrl: this.BASE_URL });

  /**
   * The function retrieves the status of airport checkpoints for a specific airport and day of the week.
   * @param {string} airportIata - The airportIata parameter is a string that represents the IATA code of
   * the airport. IATA codes are three-letter codes used to identify airports worldwide. For example,
   * "JFK" represents John F. Kennedy International Airport in New York.
   * @param {number} dayOfWeek - The `dayOfWeek` parameter represents the day of the week as a number,
   * where Sunday is 0 and Saturday is 6.
   * @returns the transformed TSA_CheckpointResult.
   */
  static async getAirportCheckpointsStatus(
    airportIata: string,
    dayOfWeek: number,
  ) {
    const dayOfWeekName = moment().day(dayOfWeek).format('dddd');
    const route = format(
      'api/checkpoints/v1/data/%s/%s',
      airportIata,
      dayOfWeekName,
    );

    const result = await this.client.get(route).json<TSA_CheckpointResult>();
    return this.transformCheckpointResult(result);
  }

  /**
   * The function `getAirportWaitTimes` retrieves TSA wait times for a given airport.
   * @param {string} airportIata - The airportIata parameter is a string that represents the IATA code of
   * the airport for which you want to retrieve the wait times. IATA codes are three-letter codes used to
   * identify airports worldwide.
   * @returns a response object of type TSA_WaitTimeResult.
   */
  static async getAirportWaitTimes(airportIata: string) {
    const route = format('api/checkpoint_waittime/v1/%s', airportIata);
    const result = await this.client.get(route).json<TSA_WaitTimeResult>();
    return {
      airportIata: result.airport_code,
      airportName: result.airport_name,
      data: result.data?.map(item => ({
        dayOfWeek: moment().day(item.day).day(),
        hour: Number(item.hour),
        maxWaitMinute: Number(item.max_standard_wait),
        updatedAt: new Date(Number(item.updated) * 1000),
      })),
    };
  }

  /**
   * The function transforms a TSA_CheckpointResult object into a new object structure.
   * @param {TSA_CheckpointResult} result - The `result` parameter is an object of type
   * `TSA_CheckpointResult`.
   * @returns The function `transformCheckpointResult` returns an object with the following structure:
   */
  private static transformCheckpointResult(result: TSA_CheckpointResult) {
    return {
      airportIata: result.airport_code,
      airportName: result.airport_name,
      terminals: Object.values(result.terminals).map(terminal => ({
        checkpoints: Object.values(terminal.checkpoints).map(checkpoint => ({
          checkPointName: checkpoint.checkpoint_name,
          hours: Object.entries(checkpoint.hours).map(([hour, status]) => ({
            hour: Number(hour),
            status: status,
          })),
        })),
        terminalName: terminal.terminal_name,
      })),
    };
  }
}
