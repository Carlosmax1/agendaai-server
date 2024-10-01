import { z } from 'zod';

const envsSchema = z.object({
  SMTP_HOST: z.string(),
  SMTP_PORT: z.coerce.number(),
  SMPT_SECURE: z.coerce.boolean(),
  SMTP_USER: z.string(),
  SMTP_PASS: z.string(),
  RABBIT_URI: z.string(),
});

export const envs = envsSchema.parse(process.env);
