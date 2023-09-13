import { HealthResolver } from "./health/health.resolver";
import { buildSchema } from "type-graphql";
import { isDev } from "../../lib/env";
import path from "path";

export const gqlSchema = await buildSchema({
  resolvers: [HealthResolver],
  emitSchemaFile: isDev
    ? path.resolve(import.meta.dir, "../../../", "schema.graphql")
    : undefined,
});
