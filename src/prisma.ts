import { PrismaClient } from '@prisma/client';

import { ENV } from './env';

class _prisma extends PrismaClient {
  static _instance: PrismaClient;

  constructor() {
    super({
      datasources: {
        db: {
          url: ENV.DATABASE_URL!.replaceAll('"', ''),
        },
      },
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
