import { InputType } from 'type-graphql';

import { Partial, Pick } from '@app/api/graphql/_utils';
import { GQL_UserPreference } from '@app/@generated/graphql/models/UserPreference';

@InputType()
export class UpdateUserPreferenceInput extends Partial(
  Pick(GQL_UserPreference, ['measurement']),
) {}
