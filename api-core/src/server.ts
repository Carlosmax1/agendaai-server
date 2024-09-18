import fastify from 'fastify';
import { envs } from '@/env';

const app = fastify({ logger: true });

app.get('/agenda', async (request, reply) => {
  console.log(request.headers);
  return { hello: 'world' };
});

app.get('/lembretes', async (request, reply) => {
  console.log(request.headers);
  return { hello: 'world' };
});

app.listen({ port: envs.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`API-CORE is running on http://localhost:${envs.PORT}`);
});
