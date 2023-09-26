import { PrismaClient } from '@prisma/client';
import { Logger } from './lib/logger';

export const prisma = new PrismaClient();

const logger = Logger.getSubLogger({ name: 'Prisma' });
let hasConnection = false;
export async function connectPrisma() {
  logger.debug('Connecting to Prisma');

  if (hasConnection) {
    logger.debug('Already connected to Prisma; Disconnecting');
    await prisma.$disconnect();
  }

  hasConnection = true;
  await prisma.$connect();
  logger.debug('Connected to Prisma');
}
