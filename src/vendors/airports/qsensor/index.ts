import ky from 'ky';
import { format } from 'sys';
import { toLower } from 'lodash';
import * as Cheerio from 'cheerio';

import { Logger } from '@app/lib/logger';
import { toNumber } from '@app/lib/to.number';

import { QSensor_AirportSearchResult, QSensor_TerminalMetadata } from './types';

export class QSensor {
  private static readonly BASE_URL = 'https://qsensor.co';
  private static readonly HEADERS = {
    Accept: '*/*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Host: 'qsensor.co',
    Referer: 'https://qsensor.co/',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
    'X-Requested-With': 'XMLHttpRequest',
  };
  private static readonly client = ky.create({
    headers: this.HEADERS,
  });
  private static readonly logger = Logger.getSubLogger({
    name: this.name,
  });

  static async getAirportLink(airportIata: string) {
    const route = this.BASE_URL + '/wp-admin/admin-ajax.php';
    const response = await this.client.post(route, {
      body: format('action=airports_load_results&search=%s', airportIata),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      throwHttpErrors: false,
      timeout: 1000 * 60 * 5,
    });

    const statusCode = response.status;
    const result = await response.json<QSensor_AirportSearchResult[]>();
    this.logger
      .getSubLogger({ name: 'getAirportLink' })
      .debug('Status=%s, Route=%s', statusCode, response.url);

    const target = result?.find(
      item => toLower(item.iata) === toLower(airportIata),
    );

    if (!target) {
      throw new Error('Failed to find airport');
    }

    return target.link;
  }

  static async getCurrentSecurityMetadata(airportIata: string) {
    const link = await this.getAirportLink(airportIata);
    const response = await this.client(link, {
      throwHttpErrors: false,
      timeout: 1000 * 60 * 30,
    });

    const statusCode = response.status;

    this.logger
      .getSubLogger({ name: 'getCurrentSecurityMetadata' })
      .debug('Status=%s, Route=%s', statusCode, response.url);

    if (statusCode !== 200) {
      throw new Error(`Failed to get security metadata`);
    }

    const terminals: QSensor_TerminalMetadata[] = [];
    const html = await response.text();
    const $ = Cheerio.load(html);

    $('.pick-terminal ul li').each((_, element) => {
      const minutes = $(element).find('.mins').text().trim();
      const terminal = $(element)
        .find('div a')
        .first()
        .contents()
        .first()
        .text()
        .trim();

      terminals.push({
        estimatedWaitMinutes: toNumber(minutes),
        name: terminal,
      });
    });

    return {
      terminals,
    };
  }
}
