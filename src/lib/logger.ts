import { isDev } from "./env";
import pino from "pino";
import pretty from "pino-pretty";

export const Logger = isDev
  ? pino(
      pretty({
        colorize: true,
        minimumLevel: "debug",
      })
    )
  : pino();
