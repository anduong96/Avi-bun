import { PrismaClient } from '@prisma/client';

import { Logger } from './lib/logger';

class _prisma extends PrismaClient {
  static _instance: PrismaClient;
  private static isConnected = false;
  private logger = Logger.getSubLogger({ name: 'Prisma' });

  constructor() {
    super();
    this.connect();
  }

  static get instance() {
    if (!this._instance) {
      this._instance = new this();
    }

    return this._instance;
  }

  private connect() {
    if (!_prisma.isConnected) {
      _prisma.isConnected = true;
      this.$connect()
        .then(() => {
          this.logger.debug('Connected to Prisma');
        })
        .catch(error => {
          this.logger.error('Unable to connect to Prisma', error);
        });
    }
  }
}

export const prisma = _prisma.instance;
