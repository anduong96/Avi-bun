import { isDev } from "./env";
import pino from "pino";

async function buildLogger() {
  if (isDev) {
    const pretty = await import("pino-pretty");
    const logger = pino(
      pretty.default({
        levelFirst: true,
        colorize: true,
      })
    );

    logger.level = "debug";
    return logger;
  }

  const logger = pino();
  return logger;
}

export const Logger = await buildLogger();
