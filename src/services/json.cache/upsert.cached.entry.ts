import moment from 'moment';
import { Prisma } from '@prisma/client';

import { prisma } from '@app/prisma';
import { Logger } from '@app/lib/logger';

export async function upsertCachedEntry<
  T extends Prisma.JsonCacheUncheckedCreateInput['data'],
>(key: string, data: T, expiresAt = moment().add(24, 'hours').toDate()) {
  const now = moment().toDate();
  const result = await prisma.jsonCache.upsert({
    create: {
      createdAt: now,
      data: data,
      expiresAt: expiresAt,
      id: key,
      updatedAt: now,
    },
    select: {
      id: true,
    },
    update: {
      data: data,
      updatedAt: now,
    },
    where: {
      id: key,
    },
  });

  Logger.getSubLogger({ name: 'JsonCache' }).debug('Upserted key=%s', key);
  return result.id;
}
