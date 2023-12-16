import ky from 'ky';
import { mapValues, merge } from 'lodash';

type NodeEnv = 'development' | 'production' | 'staging' | 'test';
const PROJECT_NAME = 'avi-bun';
const DOPPLER_TOKEN = process.env.DOPPLER_TOKEN;
const NODE_ENV = process.env.NODE_ENV as NodeEnv;
const DOPPLER_ENV = NODE_ENV === 'test' ? 'development' : NODE_ENV;
const Authorization = `Bearer ${DOPPLER_TOKEN}`;

if (!DOPPLER_TOKEN) {
  throw new Error('Missing DOPPLER_TOKEN');
}

const route = 'https://api.doppler.com/v3/configs/config/secrets';
const result = await ky
  .get(route, {
    headers: {
      Authorization,
    },
    searchParams: {
      config: DOPPLER_ENV,
      include_dynamic_secrets: 'true',
      include_managed_secrets: 'true',
      project: PROJECT_NAME,
    },
  })
  .json<{
    secrets: Record<string, { computed: string }>;
    success: boolean;
  }>();

const env = mapValues(result.secrets, value => value.computed);
const args = Bun.argv.slice(2);
const proc = Bun.spawn(args, {
  env: merge(env, Bun.env),
  stdout: 'inherit',
});

const output = await new Response(proc.stdout).text();

// eslint-disable-next-line no-console
console.log(output);
