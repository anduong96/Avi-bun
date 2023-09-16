import { IataByIpResp } from './types';
import axios from 'axios';

export class TravelerPayout {
  static readonly instance = new TravelerPayout();

  private readonly client = axios.create({
    baseURL: 'https://www.travelpayouts.com',
  });

  /**
   * The function `getIataByIP` retrieves the IATA code based on the given IP address.
   * @param {string} ipAddress - The `ipAddress` parameter is a string that represents the IP address
   * for which you want to retrieve the IATA code.
   * @returns the IATA code (International Air Transport Association code) associated with the given IP
   * address.
   */
  async getIataByIP(ipAddress: string) {
    const resp = await this.client.get<IataByIpResp>('/whereami', {
      params: {
        ip: ipAddress,
      },
    });

    return resp.data.iata;
  }
}
