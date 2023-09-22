import * as TsLog from 'tslog';

export const Logger = new TsLog.Logger({
  type: 'pretty',
  prettyLogTemplate:
    '\n{{rawIsoStr}} {{logLevelName}} {{nameWithDelimiterPrefix}} {{filePathWithLine}}\n',
});
