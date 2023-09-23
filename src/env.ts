import * as Yup from 'yup';

import { BasicObject } from '@app/types/common';
import { merge } from 'lodash';
import { providers } from 'gitops-secrets';

const DOPPLER_TOKEN = process.env.DOPPLER_TOKEN;
const remoteConfig: BasicObject = DOPPLER_TOKEN
  ? await providers.doppler
      .fetch({ dopplerToken: DOPPLER_TOKEN })
      .catch(() => ({}))
  : {};

/**
 * @see {@link https://github.com/jquense/yup}
 */
const schema = Yup.object({
  PORT: Yup.number().default(3000).required(),
  NODE_ENV: Yup.string()
    .oneOf(['development', 'staging', 'test', 'production'])
    .default('development')
    .required(),

  DATABASE_URL: Yup.string().when('NODE_ENV', {
    is: 'test',
    otherwise: schema => schema.required(),
  }),

  AERO_DATABOX_API_KEY: Yup.string().required(),
  AIR_LABS_API_KEY: Yup.string().optional(),

  FIREBASE_PROJECT_ID: Yup.string().required(),
  FIREBASE_CLIENT_EMAIL: Yup.string().required(),
  FIREBASE_PRIVATE_KEY: Yup.string()
    .transform((value: string) => value.replace(/\\n/g, '\n'))
    .required(),

  SENTRY_DSN: Yup.string().optional(),
});

export const ENV = await schema
  .constantCase()
  .validate(merge(remoteConfig, process.env));

export const isDev = ENV.NODE_ENV === 'development';
export const isProd = ENV.NODE_ENV === 'production';
export const isStaging = ENV.NODE_ENV === 'staging';
export const isTest = ENV.NODE_ENV === 'test';
