import { ENV, isDev, isProd } from '@app/env';
import * as TsLog from 'tslog';

export const LOG_LEVEL: Record<string, number> = {
  silly: 0,
  trace: 1,
  debug: 2,
  info: 3,
  warn: 4,
  error: 5,
  fatal: 6,
};

const initLogLevel = LOG_LEVEL[ENV.LOG_LEVEL];
const minLevel = initLogLevel ?? (isDev ? LOG_LEVEL.debug : LOG_LEVEL.info);

export const Logger = new TsLog.Logger({
  name: 'App',
  type: 'pretty',
  hideLogPositionForProduction: isProd,
  minLevel: minLevel,
  overwrite: {
    addPlaceholders: (logObjMeta, placeholderValues) => {
      placeholderValues['filePathWithLine'] =
        logObjMeta.path?.filePathWithLine?.replace('/', '') ?? '';
    },
  },
  prettyLogTemplate:
    '\n{{rawIsoStr}} {{logLevelName}} {{name}} {{filePathWithLine}}\n',
});
