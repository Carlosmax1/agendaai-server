import fastify from 'fastify';
import { userRoutes } from '@/routes/user.routes';
import { envs } from '@/env';

const app = fastify({ logger: true });

app.register(userRoutes, {
  prefix: '/user',
});

app.listen({ port: envs.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`API-CORE is running on http://localhost:${envs.PORT}`);
});
