import uuid from 'uuid';

export function createID() {
  return uuid.v4();
}
