import { isDev } from "./env";
import pino from "pino";
import pretty from "pino-pretty";

function buildLogger() {
  if (isDev) {
    const logger = pino(
      pretty({
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

export const Logger = buildLogger();
