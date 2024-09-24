import { z } from 'zod';

export const envsSchema = z.object({
  PORT: z.string().default('3000'),
  RABBIT_URI: z.string().default('amqp://localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PASSWORD: z.string().default(''),
  REDIS_URI: z.string().default('redis://localhost:6379'),
});

export const envs = envsSchema.parse(process.env);
