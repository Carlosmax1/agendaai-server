import fastify from 'fastify';
import proxy from '@fastify/reply-from';
import cors from '@fastify/cors';
import cookies from '@fastify/cookie';
import jwt from 'jsonwebtoken';

import { envs } from '@/envs';

const app = fastify({
  logger: true,
});

app.register(cors, {
  origin: '*',
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
});

app.register(proxy);
app.register(cookies);

app.route({
  method: ['GET', 'POST'],
  url: '/auth*',
  handler: async (request, reply) => {
    return reply.from('http://localhost:3002' + request.raw.url);
  },
});

/*
  Rota para o serviço de agenda, criação, edição e exclusão de agendas
*/
app.route({
  method: ['GET', 'POST', 'PUT', 'DELETE'],
  url: '/api*',
  preHandler: async (request, reply, done) => {
    if (!request.cookies.auth_token) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
    const token = request.cookies.auth_token;
    try {
      jwt.verify(token, envs.JWT_SECRET);
      return done();
    } catch (error) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
  },
  handler: async (request, reply) => {
    const header = {
      'x-service': 'api-gateway',
      Authorization: `Bearer ${request.cookies.auth_token}`,
    };

    return reply.from('http://localhost:3001' + request.raw.url?.replace('/api', ''), {
      rewriteRequestHeaders: (_, headers) => {
        // remove cookie header
        delete headers.cookie;
        return { ...headers, ...header };
      },
    });
  },
});

app.get('/', async (request, reply) => {
  return { hello: 'world' };
});

app.listen({ port: envs.PORT, host: '0.0.0.0' }).then(() => {
  console.log(`API-AUTH is running on http://localhost:${envs.PORT}`);
});
