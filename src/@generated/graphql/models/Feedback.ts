import { Field, ObjectType, ID, Int } from 'type-graphql';
import { GQL_FeedbackType } from '../enums/FeedbackType';
import { GQL_User } from './User';

@ObjectType('Feedback')
export class GQL_Feedback {
  @Field(() => ID)
  id: string;

  @Field()
  userID: string;

  @Field()
  message: string;

  @Field(() => Int)
  rating: number;

  @Field(() => GQL_FeedbackType)
  type: GQL_FeedbackType;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // skip overwrite 👇
}
