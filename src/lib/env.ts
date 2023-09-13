import * as Yup from "yup";

/**
 * @see {@link https://github.com/jquense/yup}
 */
const schema = Yup.object({
  PORT: Yup.number().default(3000),
  NODE_ENV: Yup.string()
    .oneOf(["development", "staging", "test", "production"])
    .default("development"),
});

export const ENV = await schema.validate(process.env);

export const isDev = ENV.NODE_ENV === "development";
export const isProd = ENV.NODE_ENV === "production";
export const isStaging = ENV.NODE_ENV === "staging";
export const isTest = ENV.NODE_ENV === "test";
