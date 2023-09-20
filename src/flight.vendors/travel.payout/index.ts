import { IataByIpResp } from './types';
import { Singleton } from '@app/lib/singleton';
import axios from 'axios';

export class TravelerPayout extends Singleton<TravelerPayout>() {
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
