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
  PORT: Yup.number().default(3000),
  NODE_ENV: Yup.string()
    .oneOf(['development', 'staging', 'test', 'production'])
    .default('development'),

  DATABASE_URL: Yup.string().required(),
  AERO_DATABOX_API_KEY: Yup.string().optional(),
  AIR_LABS_API_KEY: Yup.string().optional(),
}).constantCase();

export const ENV = await schema.validate(merge(process.env, remoteConfig));

export const isDev = ENV.NODE_ENV === 'development';
export const isProd = ENV.NODE_ENV === 'production';
export const isStaging = ENV.NODE_ENV === 'staging';
export const isTest = ENV.NODE_ENV === 'test';
