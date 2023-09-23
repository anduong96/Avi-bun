import { Singleton } from '@app/lib/singleton';
import ky from 'ky';
import { getAircraftFromHtml } from './plane.crawl';

class _Flightera extends Singleton<_Flightera>() {
  private readonly client = ky.create({
    prefixUrl: 'https://www.flightera.net',
    timeout: 5 * 1000,
    headers: {
      'Content-Type': 'application/json',
      accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
      'accept-language': 'en-US,en;q=0.9',
      'cache-control': 'max-age=0',
      'sec-ch-ua':
        '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"macOS"',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'none',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1',
      // Authorization: 'oABrVZsnrsSuzytYgxIwkRLWprgkIHSSi',
    },
  });

  /**
   * The function `getAircraftFromCrawl` retrieves aircraft information from a website using a tail
   * number and returns the parsed data.
   * @param {string} tailNumber - The `tailNumber` parameter is a string that represents the unique
   * identifier of an aircraft. It is typically the alphanumeric code painted on the tail of the
   * aircraft, which helps identify and track the specific aircraft.
   * @returns the result of calling the `getAircraftFromHtml` function with the `response` as an
   * argument.
   */
  async getAircraftFromCrawl(tailNumber: string) {
    const route = `en/planes/${tailNumber}`;
    const response = await this.client.get(route);
    const data = await response.text();
    return getAircraftFromHtml(data);
  }
}

export const Flightera = _Flightera.instance;
