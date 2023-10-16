import * as TsLog from 'tslog';

import { ENV, isDev, isProd } from '@app/env';

export const LOG_LEVEL: Record<string, number> = {
  debug: 2,
  error: 5,
  fatal: 6,
  info: 3,
  silly: 0,
  trace: 1,
  warn: 4,
};

const initLogLevel = LOG_LEVEL[ENV.LOG_LEVEL];
const minLevel = initLogLevel ?? (isDev ? LOG_LEVEL.debug : LOG_LEVEL.info);

export const Logger = new TsLog.Logger({
  hideLogPositionForProduction: isProd,
  minLevel: minLevel,
  name: 'App',
  overwrite: {
    addPlaceholders: (logObjMeta, placeholderValues) => {
      placeholderValues['filePathWithLine'] =
        logObjMeta.path?.filePathWithLine?.replace('/', '') ?? '';
    },
  },
  prettyLogTemplate:
    '\n{{rawIsoStr}} {{logLevelName}} {{name}} {{filePathWithLine}}\n',
  type: 'pretty',
});
