import { registerEnumType } from 'type-graphql';

export enum GQL_DateFormatType {
  AMERICAN = 'AMERICAN',
  WORLD = 'WORLD',
}
registerEnumType(GQL_DateFormatType, {
  name: 'DateFormatType',
});
