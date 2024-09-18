import { z } from 'zod';

const envSchema = z.object({
  JWT_SECRET: z.string(),
  PORT: z.coerce.number(),
});

export const envs = envSchema.parse(process.env);
