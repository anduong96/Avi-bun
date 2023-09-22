import { isDev } from '@app/env';
import moment from 'moment';
import winston from 'winston';

const momentFormat = 'L hh:mm:ss:SS A';
const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  const timestr = moment(timestamp as string).format(momentFormat);
  return `[${level}] ${timestr}: ${message}`;
});

export const WinstonLogger = winston.createLogger({
  level: isDev ? 'debug' : 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.splat(),
        winston.format.prettyPrint(),
        winston.format.timestamp(),
        winston.format.colorize(),
        customFormat,
      ),
    }),
  ],
});

winston.addColors({
  debug: 'gray',
});
