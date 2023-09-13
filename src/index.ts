import "@app/api/rest";
import "reflect-metadata";

import { ENV, isDev } from "./lib/env";

import { Elysia } from "elysia";
import { GraphqlMiddleware } from "./api/graphql";
import { Logger } from "./lib/logger";
import { RestMiddleware } from "@app/api/rest";

const app = new Elysia();

app.use(RestMiddleware);
app.use(GraphqlMiddleware);

app.listen(ENV.PORT, (server) => {
  if (isDev) {
    Logger.info(`Server listening on http://localhost:${server.port}`);
  }
});
