import { HealthResolver } from "./health/health.resolver";
import { apolloMiddleware } from "@app/lib/elysia.apollo";
import { buildSchema } from "type-graphql";
import { isDev } from "../../lib/env";
import path from "path";

const gqlSchema = await buildSchema({
  resolvers: [HealthResolver],
  emitSchemaFile: isDev
    ? path.resolve(import.meta.dir, "../../../", "schema.graphql")
    : undefined,
});

export const GraphqlMiddleware = apolloMiddleware({
  schema: gqlSchema,
  enablePlayground: isDev,
});
