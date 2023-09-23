import * as Cheerio from 'cheerio';

import { keyBy } from 'lodash';

export function getSeatConfiguration($: Cheerio.CheerioAPI) {
  const target = $('dt:contains("SEAT CONFIGURATION")');
  const parts = target
    .parent()
    .find('span')
    .map((_i, el) => $(el).text())
    .toArray()
    .map(entry => {
      const [count, type] = entry.split(' ');
      return {
        count: Number(count),
        type,
      };
    });

  const seatMap = keyBy(parts, item => item.type);
  const Economy = seatMap['Economy'];
  const First = seatMap['First'];
  const Business = seatMap['Business'];

  return {
    economy: Economy?.count,
    first: First?.count,
    business: Business?.count,
  };
}

export function getIcao($: Cheerio.CheerioAPI) {
  const target = $('dt:contains("ICAO IDENTIFIER")');
  const icao = target.parent().find('dd').text();
  return icao.trim();
}

export function getDescription($: Cheerio.CheerioAPI) {
  const target = $('dt:contains("DESCRIPTION")');
  const desc = target.parent().find('dd').text();
  return desc.trim();
}

export function getModel($: Cheerio.CheerioAPI) {
  const target = $('dt:contains("MODEL")');
  const model = target.parent().find('a').text();
  return model.trim();
}

export function getAirlineIata($: Cheerio.CheerioAPI) {
  const target = $('dt:contains("AIRLINE")');
  const airlineIata = target
    .parent()
    .find('.whitespace-nowrap.text-gray-500.text-sm')
    .text();

  return airlineIata.split('/')[0].trim();
}

export function getAircraftFromHtml(content: string) {
  const $ = Cheerio.load(content);
  return {
    seatsConfiguration: getSeatConfiguration($),
    airlineIata: getAirlineIata($),
    icao: getIcao($),
    model: getModel($),
    description: getDescription($),
    html: content,
  };
}
