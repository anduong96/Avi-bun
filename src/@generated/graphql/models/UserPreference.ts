import { Field, ObjectType, ID } from 'type-graphql';
import { GQL_MeasurementType } from '../enums/MeasurementType';

@ObjectType('UserPreference')
export class GQL_UserPreference {
  @Field(() => ID)
  id: string;

  @Field()
  userID: string;

  @Field(() => GQL_MeasurementType)
  measurement: GQL_MeasurementType;

  // skip overwrite 👇
}
