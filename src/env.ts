import * as Yup from 'yup';

/**
 * @see {@link https://github.com/jquense/yup}
 */
const schema = Yup.object({
  AERO_DATABOX_API_KEY: Yup.string().required(),
  AIR_LABS_API_KEY: Yup.string().optional(),
  DATABASE_URL: Yup.string().when('NODE_ENV', {
    is: 'test',
    otherwise: schema => schema.required(),
    then: schema => schema.optional(),
  }),

  FIREBASE_CLIENT_EMAIL: Yup.string().required(),

  FIREBASE_PRIVATE_KEY: Yup.string()
    .transform((value: string) => value.replace(/\\n/g, '\n'))
    .required(),
  FIREBASE_PROJECT_ID: Yup.string().required(),

  LOG_LEVEL: Yup.string().default('debug').required(),
  NODE_ENV: Yup.string()
    .oneOf(['development', 'staging', 'test', 'production'])
    .default('development')
    .required(),
  PORT: Yup.number().default(3000).required(),

  SENTRY_DSN: Yup.string().optional(),
  WEATHER_API_KEY: Yup.string().optional(),
});

export const ENV = await schema.constantCase().validate(process.env);
export const isDev = ENV.NODE_ENV === 'development';
export const isProd = ENV.NODE_ENV === 'production';
export const isStaging = ENV.NODE_ENV === 'staging';
export const isTest = ENV.NODE_ENV === 'test';
