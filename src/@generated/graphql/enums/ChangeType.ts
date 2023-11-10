import { registerEnumType } from 'type-graphql';

export enum GQL_ChangeType {
  ADDED = 'ADDED',
  REMOVED = 'REMOVED',
  MODIFIED = 'MODIFIED',
}
registerEnumType(GQL_ChangeType, {
  name: 'ChangeType',
});
