import { Singleton } from '@app/lib/singleton';
import { getAircraftFromHtml } from './plane.crawl';

class _Flightera extends Singleton<_Flightera>() {
  // private readonly client = axios.create({
  //   baseURL: 'https://www.flightera.net',
  //   timeout: 5 * 1000,
  //   headers: {
  //     'Content-Type': 'application/json',
  //     // Authorization: 'oABrVZsnrsSuzytYgxIwkRLWprgkIHSSi',
  //   },
  // });

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
    const route = `https://www.flightera.net/en/planes/${tailNumber}`;
    const response = await fetch(route, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
      },
    });

    const data = await response.text();
    return getAircraftFromHtml(data);
  }
}

export const Flightera = _Flightera.instance;
