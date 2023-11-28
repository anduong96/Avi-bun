import { registerEnumType } from 'type-graphql';

export enum GQL_MeasurementType {
  AMERICAN = 'AMERICAN',
  METRIC = 'METRIC',
}
registerEnumType(GQL_MeasurementType, {
  name: 'MeasurementType',
});
