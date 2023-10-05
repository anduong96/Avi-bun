/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Logger } from '@app/lib/logger';
import moment from 'moment';

import fs from 'fs/promises';
import ky from 'ky';
import { RadarBox } from '.';

const TAIL_NUMBER = 'N508JL';
const shouldWrite = true;

const route = `https://www.radarbox.com/data/registration/${TAIL_NUMBER}`;
const request = await ky.get(route);

const html = await request.text();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data = RadarBox.crawlAircraftHtml(html) as any;

const departure = moment(data.current.depsts * 1000);
const arrival = moment(data.current.arrsts * 1000);
const originIata = data.current.aplngia;
const destinationIata = data.current.apdstia;
const departureTz = data.current.aplngtzns;
const arrivalTz = data.current.apdsttzns;
const departureUtcOffset = data.current.aplngtz;
const arrivalUtcOffset = data.current.apdsttz;

Logger.info(
  `
  now = %s
  Departure = %s
  Arrival = %s
  Origin = %s %s - %s
  Destination = %s %s - %s
  lastlalot = %s
  firstlalot = %s
  svd = %s
  fnia = %s
  coordinates = %s
  `,
  moment().format('LLLL'),
  departure,
  arrival,
  originIata,
  departureTz,
  departureUtcOffset,
  destinationIata,
  arrivalTz,
  arrivalUtcOffset,
  data.current.lastlalot,
  data.current.firstlalot,
  data.current.svd,
  data.current.fnia,
  [data.current.lastla, data.current.lastlo],
);

if (shouldWrite) {
  await fs.writeFile(
    `.playground/sample_${TAIL_NUMBER}.json`,
    JSON.stringify(data, null, 2),
    'utf-8',
  );
}
