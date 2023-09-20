import { isDev } from '../env';
import pino from 'pino';

export const Logger = pino({
  level: isDev ? 'debug' : 'info',
  transport: {
    targets: [
      {
        level: 'debug',
        target: 'pino-pretty',
        options: {
          colorize: true,
          singleLine: true,
          levelFirst: true,
        },
      },
    ],
  },
});
