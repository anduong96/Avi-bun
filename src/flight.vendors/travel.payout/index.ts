import ky from 'ky';

import { IataByIpResp } from './types';

export class TravelerPayout {
  private static readonly client = ky.create({
    prefixUrl: 'https://www.travelpayouts.com',
  });

  /**
   * The function `getIataByIP` retrieves the IATA code based on the given IP address.
   * @param {string} ipAddress - The `ipAddress` parameter is a string that represents the IP address
   * for which you want to retrieve the IATA code.
   * @returns the IATA code (International Air Transport Association code) associated with the given IP
   * address.
   */
  static async getIataByIP(ipAddress: string) {
    const request = await this.client.get('whereami', {
      searchParams: {
        ip: ipAddress,
      },
    });

    const response = await request.json<IataByIpResp>();
    return response.iata;
  }
}
