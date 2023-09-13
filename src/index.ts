import "reflect-metadata";

import { ENV, isDev } from "./lib/env";

import { Elysia } from "elysia";
import { Logger } from "./lib/logger";
import { apolloMiddleware } from "./lib/elysia.apollo";
import { gqlSchema } from "./api/graphql";

const app = new Elysia();

app.use(
  apolloMiddleware({
    schema: gqlSchema,
    enablePlayground: false,
  })
);

app.listen(ENV.PORT, (server) => {
  if (isDev) {
    Logger.info(`Server listening on http://localhost:${server.port}`);
  }
});
