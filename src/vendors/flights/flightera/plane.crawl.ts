import moment from 'moment';
import { keyBy } from 'lodash';
import * as Cheerio from 'cheerio';

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
    business: Business?.count,
    economy: Economy?.count,
    first: First?.count,
  };
}

export function getIcao($: Cheerio.CheerioAPI) {
  const target = $('dt:contains("ICAO IDENTIFIER")');
  const icao = target.parent().find('dd').text();
  return icao.trim();
}

export function getImage($: Cheerio.CheerioAPI) {
  const target = $('dt:contains("PICTURE")');
  const image = target.parent().find('img').attr('src');
  let imageSrc = image?.startsWith('//')
    ? image.replace('//', '').trim()
    : image?.trim();

  if (!imageSrc) {
    return undefined;
  }

  if (!imageSrc.startsWith('http')) {
    imageSrc = `https://${imageSrc}`;
  }

  return imageSrc;
}

export function getDescription($: Cheerio.CheerioAPI) {
  const target = $('dt:contains("DESCRIPTION")');
  const desc = target.parent().find('dd').text();
  return desc.trim();
}

export function getModel($: Cheerio.CheerioAPI) {
  const target = $('dt:contains("MODEL")');
  const model = target.parent().find('a').text().trim();
  const match = model.match(/\(([^)]+)\)/);

  if (match && match.length >= 2) {
    const extractedString = match[1];
    return extractedString;
  }

  return model;
}

export function getFirstFlight($: Cheerio.CheerioAPI) {
  const target = $('dt:contains("FIRST FLIGHT")');
  const date = target.parent().find('dd').text();
  if (!date) {
    return null;
  }

  return moment(date, 'MMMM YYYY').toDate();
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
    airlineIata: getAirlineIata($),
    description: getDescription($),
    firstFlight: getFirstFlight($),
    icao: getIcao($),
    image: getImage($),
    model: getModel($),
    seatsConfiguration: getSeatConfiguration($),
  };
}
