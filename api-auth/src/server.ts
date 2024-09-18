import fastify from 'fastify';
import { envs } from '@/envs';

const app = fastify({ logger: true });

app.get('/', async (request, reply) => {
  return { hello: 'world' };
});

app.listen({ port: envs.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`API-AUTH is running on http://localhost:${envs.PORT}`);
});
