import fastify from 'fastify';
import cookies from '@fastify/cookie';

import { envs } from '@/envs';
import { loginRoutes } from '@/routes/login.route';

const app = fastify({ logger: true });

app.register(cookies);

app.get('/', async (request, reply) => {
  return { hello: 'world' };
});

app.register(loginRoutes, {
  prefix: '/auth',
});

app.listen({ port: envs.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`API-AUTH is running on http://localhost:${envs.PORT}`);
});
