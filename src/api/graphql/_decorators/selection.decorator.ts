import type { GraphQLResolveInfo } from 'graphql';

import { Kind } from 'graphql';
import { get, omit } from 'lodash';
import { createParamDecorator } from 'type-graphql';

import { ApolloServerContext } from '../_context/types';

type PrismaProjection<T extends object> = {
  [K in keyof T]: T[K] extends object ? PrismaProjection<T[K]> : true;
};

function parseGraphQLInfo<T extends object = object>(
  info: Pick<GraphQLResolveInfo, 'fieldNodes'>,
) {
  const projection = {} as PrismaProjection<T>;

  if (!info.fieldNodes[0].selectionSet) {
    return projection;
  }

  // Loop through the requested fields in the GraphQL query
  for (const fieldNode of info.fieldNodes[0].selectionSet.selections) {
    if (fieldNode.kind === Kind.FIELD) {
      const fieldName = fieldNode.name.value;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      projection[fieldName] = fieldNode.selectionSet
        ? parseGraphQLInfo({ ...info, fieldNodes: [fieldNode] })
        : true;
    }
  }

  return projection;
}

export function Selections(root?: string) {
  return createParamDecorator<ApolloServerContext>(({ info }) => {
    const selection = omit(parseGraphQLInfo(info), ['__typename']);

    if (root) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return get(selection, root);
    }

    return selection;
  });
}
