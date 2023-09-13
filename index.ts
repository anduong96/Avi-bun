import { ENV } from "./src/lib/env";
import { Elysia } from "elysia";
import { Logger } from "./src/lib/logger";

const app = new Elysia();

app.listen(ENV.PORT, (server) =>
  Logger.info(`Elysia 🥟 Apollo Server Listening on port ${server.port}`)
);
