import moment from 'moment';
import { isNil } from 'lodash';
import { JsonCache, Prisma } from '@prisma/client';

import { prisma } from '@app/prisma';
import { MaybeNil } from '@app/types/maybe.nil';

type Options = {
  nilOnExpired?: boolean;
};

/**
 * The function `getCachedEntry` retrieves a cached entry from a database based on a given key, with an
 * optional option to return null if the entry has expired.
 * @param {string} key - The `key` parameter is a string that represents the unique identifier for the
 * cached entry. It is used to retrieve the cached data from the database.
 * @param {Options} [options] - The `options` parameter is an optional object that can contain the
 * following properties:
 * @returns The function `getCachedEntry` returns a promise that resolves to a value of type
 * `MaybeNil<T>`.
 */
export async function getCachedEntry<T = JsonCache['data']>(
  key: string,
  options?: Options,
): Promise<MaybeNil<T>> {
  const now = moment();
  const query: Prisma.JsonCacheFindFirstArgs = {
    select: {
      data: true,
    },
    where: {
      id: key,
    },
  };

  if ((isNil(options?.nilOnExpired) || options?.nilOnExpired) && query.where) {
    query.where.expiresAt = {
      gte: now.toDate(),
    };
  }

  const entry = await prisma.jsonCache.findFirst(query);
  return entry?.data as MaybeNil<T>;
}
