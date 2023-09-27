import { isDev, isProd, isTest } from '@app/env';
import * as TsLog from 'tslog';

export const Logger = new TsLog.Logger({
  name: 'App',
  type: 'pretty',
  hideLogPositionForProduction: isProd,
  minLevel: isDev || isTest ? 0 : 3,
  overwrite: {
    addPlaceholders: (logObjMeta, placeholderValues) => {
      placeholderValues['filePathWithLine'] =
        logObjMeta.path?.filePathWithLine?.replace('/', '') ?? '';
    },
  },
  prettyLogTemplate:
    '\n{{rawIsoStr}} {{logLevelName}} {{name}} {{filePathWithLine}}\n',
});
