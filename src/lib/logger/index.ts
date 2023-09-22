import { isDev, isProd } from '@app/env';
import * as TsLog from 'tslog';

export const Logger = new TsLog.Logger({
  name: 'App',
  type: 'pretty',
  hideLogPositionForProduction: isProd,
  minLevel: isDev ? 0 : 3,
  prettyLogTemplate:
    '\n{{rawIsoStr}} {{logLevelName}} {{name}} {{filePathWithLine}}\n',
});
