import ky from 'ky';
import moment from 'moment';
import { format } from 'sys';
import * as Cheerio from 'cheerio';

import { Logger } from '@app/lib/logger';
import { toNumber } from '@app/lib/to.number';

import { SeatGuruAmenityTypes, SeatGuruSeat } from './types';

export class SeatGuru {
  static readonly MAX_FUTURE_DAYS = 30;
  private static readonly BASE_URL = 'https://www.seatguru.com';
  private static readonly HEADERS = {
    Accept: 'text/html, */*; q=0.01',
    'Accept-Language': 'en-US,en;q=0.5',
    Referer: 'https://www.seatguru.com/findseatmap/findseatmap.php',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:121.0) Gecko/20100101 Firefox/121.0',
    'X-Requested-With': 'XMLHttpRequest',
  };
  private static readonly client = ky.create({
    headers: this.HEADERS,
    prefixUrl: this.BASE_URL,
  });
  private static readonly logger = Logger.getSubLogger({
    name: 'SeatGuru',
  });

  static async crawlAircraftLink(aircraftLink: string) {
    const request = await ky.get(aircraftLink);
    const html = await request.text();
    const $ = Cheerio.load(html);
    const target = $('#main-container .aside');
    const seatingsMap: SeatGuruSeat[] = [];
    const amenitiesMap: Record<SeatGuruAmenityTypes, null | string> = {
      'AC Power': null,
      Audio: null,
      Food: null,
      Internet: null,
      Video: null,
    };

    target
      .find('.aircraftPage')
      .find('.seat-list-wrapper table tbody tr')
      .each((_, element) => {
        const item1 = $(element).find('.item1').text().trim();
        const item2 = $(element).find('.item2').text().trim();
        const item3 = $(element).find('.item3').text().trim();
        seatingsMap.push({
          name: item1,
          pitchInches: toNumber(item2),
          widthInches: toNumber(item3),
        });
      });

    target.find('#amenities_list li').each((_, element) => {
      const elementID = $(element).attr('id');
      const description = $(format('#%s_text', elementID)).html();
      const elementText = $(element)
        .find('.' + elementID)
        .text()
        .trim() as SeatGuruAmenityTypes | null;

      if (!elementText || !description) {
        return;
      }

      amenitiesMap[elementText] = description;
    });

    this.logger.debug({
      amenitiesMap,
    });

    return {
      amenitiesMap,
      seatingsMap,
    };
  }

  static async findFlightAircraftLink(params: {
    airlineIata: string;
    date: Date;
    flightNumber: string;
  }) {
    const route = 'ajax/findseatmap.php?';
    const response = await this.client.get(route, {
      searchParams: {
        carrier: params.airlineIata,
        date: moment(params.date).format('MM/DD/YYYY'),
        flightno: params.flightNumber,
        from: '',
        to: '',
      },
      throwHttpErrors: false,
    });

    const status = response.status;
    const data = await response.text();

    this.logger
      .getSubLogger({ name: 'findFlightAircraftLink' })
      .debug('Status=%s, Route=%s', status, response.url);

    const $ = Cheerio.load(data);
    const flightAircraftURL = $('.chooseFlights-row')
      .first()
      .find('a')
      .first()
      .attr('href');

    if (!flightAircraftURL) {
      throw new Error('Flight aircraft not found');
    }

    return format('%s%s', this.BASE_URL, flightAircraftURL);
  }

  static async getAircraftMetadata(
    params: Parameters<typeof this.findFlightAircraftLink>[0],
  ) {
    const url = await this.findFlightAircraftLink(params);
    const metadata = this.crawlAircraftLink(url);
    return metadata;
  }
}
