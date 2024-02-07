import ShortUniqueId from 'short-unique-id';

export function createID(length: number = 10) {
  return new ShortUniqueId({ length: length }).rnd();
}
