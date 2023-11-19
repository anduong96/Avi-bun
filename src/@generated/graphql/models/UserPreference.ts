import { Field, ObjectType, ID } from 'type-graphql';
import { GQL_MeasurementType } from '../enums/MeasurementType';
import { GQL_DateFormatType } from '../enums/DateFormatType';

@ObjectType('UserPreference')
export class GQL_UserPreference {
  @Field(() => ID)
  id: string;

  @Field()
  userID: string;

  @Field(() => GQL_MeasurementType)
  measurement: GQL_MeasurementType;

  @Field(() => GQL_DateFormatType)
  dateFormat: GQL_DateFormatType;

  // skip overwrite 👇
}
