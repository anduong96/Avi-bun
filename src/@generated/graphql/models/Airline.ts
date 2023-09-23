import { Field, ObjectType, ID } from 'type-graphql';
import { GQL_ImageType } from '../enums/ImageType';

@ObjectType('Airline')
export class GQL_Airline {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  iata: string;

  @Field()
  logoFullImageURL: string;

  @Field(() => GQL_ImageType)
  logoFullImageType: GQL_ImageType;

  @Field()
  logoCompactImageURL: string;

  @Field(() => GQL_ImageType)
  logoCompactImageType: GQL_ImageType;

  @Field()
  isLowCost: boolean;

  // skip overwrite 👇
}
