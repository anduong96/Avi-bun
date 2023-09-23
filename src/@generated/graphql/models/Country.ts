import { Field, ObjectType, ID } from 'type-graphql';
import { GQL_ImageType } from '../enums/ImageType';

@ObjectType('Country')
export class GQL_Country {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  isoCode: string;

  @Field()
  dialCode: string;

  @Field()
  flagImageURL: string;

  @Field(() => GQL_ImageType)
  flagImageType: GQL_ImageType;

  // skip overwrite 👇
}
