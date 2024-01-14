import { PrismaClient } from '@prisma/client';

import { ENV, isDev } from './env';

class _prisma extends PrismaClient {
  static _instance: PrismaClient;

  constructor() {
    super({
      datasources: {
        db: {
          url: ENV.DATABASE_URL!.replaceAll('"', ''),
        },
      },
      log: isDev ? ['query', 'info', 'warn', 'error'] : ['error'],
    });
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new this();
    }

    return this._instance;
  }
}

export const prisma = _prisma.instance;
