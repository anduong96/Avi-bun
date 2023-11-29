import ShortUniqueId from 'short-unique-id';

const uid = new ShortUniqueId({ length: 6 });
export function createID() {
  return uid.rnd();
}
