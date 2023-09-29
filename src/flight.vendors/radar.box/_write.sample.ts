import { Logger } from '@app/lib/logger';
import moment from 'moment';

import fs from 'fs/promises';
import ky from 'ky';
import { RadarBox } from '.';

const TAIL_NUMBER = 'N304PQ';
const shouldWrite = true;

const route = `https://www.radarbox.com/data/registration/${TAIL_NUMBER}`;
const request = await ky.get(route);

const html = await request.text();
const data = RadarBox.crawlAircraftHtml(html);
const departure = moment(data.current.depsts * 1000);
const arrival = moment(data.current.arrsts * 1000);

Logger.info(
  `
  now = %s
  Departure=%s
  Arrival=%s
  lastlalot=%s
  firstlalot=%s
  svd=%s
  `,
  moment().format('LLLL'),
  departure.format('LLLL'),
  arrival.format('LLLL'),
  moment(data.current.lastlalot).format('LLLL'),
  moment(data.current.firstlalot).format('LLLL'),
  moment(data.current.svd).format('LLLL'),
  [data.current.lastla, data.current.lastlo],
);

if (shouldWrite) {
  await fs.writeFile(
    `.playground/sample_${TAIL_NUMBER}.json`,
    JSON.stringify(data, null, 2),
    'utf-8',
  );
}
