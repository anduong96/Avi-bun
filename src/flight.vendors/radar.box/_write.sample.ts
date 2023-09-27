import ky from 'ky';
import { RadarBox } from '.';
import fs from 'fs/promises';

const TAIL_NUMBER = 'N730AN';

const route = `https://www.radarbox.com/data/registration/${TAIL_NUMBER}`;
const request = await ky.get(route);

const html = await request.text();
const data = RadarBox.crawlAircraftHtml(html);

await fs.writeFile(
  `.playground/sample_${TAIL_NUMBER}.json`,
  JSON.stringify(data, null, 2),
  'utf-8',
);
