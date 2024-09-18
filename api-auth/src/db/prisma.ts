import { PrismaClient } from '@prisma/client';
import { envs } from '@/envs';

export const db = new PrismaClient({
  log: ['query'],
  errorFormat: 'pretty',
  datasources: {
    db: {
      url: envs.DATABASE_URL,
    },
  },
});
