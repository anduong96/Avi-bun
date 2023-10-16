import { isNil } from 'lodash';
import * as TypeGql from 'type-graphql';

import { ApolloServerContext } from '../_context/types';

export const validateApolloAuth: TypeGql.AuthChecker<ApolloServerContext> = ({
  context,
}) => {
  return !isNil(context.user);
};
