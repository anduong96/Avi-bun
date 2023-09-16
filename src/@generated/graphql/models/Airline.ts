import { Field, ObjectType, ID } from 'type-graphql';
import { GQL_ImageType } from '../enums/ImageType';

@ObjectType()
export class GQL_Airline {
  @Field(_type => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  iata: string;

  @Field()
  logoFullImageURL: string;

  @Field(_type => GQL_ImageType)
  logoFullImageType: GQL_ImageType;

  @Field()
  logoCompactImageURL: string;

  @Field(_type => GQL_ImageType)
  logoCompactImageType: GQL_ImageType;

  @Field()
  isLowCost: boolean;

  // skip overwrite 👇
}
