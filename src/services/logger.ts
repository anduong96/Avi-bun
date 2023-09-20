import { compact } from 'lodash';
import { isDev } from '../env';
import pino from 'pino';

export const Logger = pino({
  level: isDev ? 'debug' : 'info',
  transport: {
    targets: compact([
      isDev && {
        level: 'debug',
        target: 'pino-pretty',
        options: {
          colorize: true,
          singleLine: true,
          levelFirst: true,
        },
      },
    ]),
  },
});
