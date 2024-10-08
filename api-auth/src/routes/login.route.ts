import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { envs } from '@/envs';

import { LoginUseCase } from '@/usecases/login.usecase';

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string(),
});

export const loginRoutes = async (app: FastifyInstance) => {
  const loginUseCase = new LoginUseCase();
  app.post<{ Body: z.infer<typeof loginSchema> }>('/login', async (request, reply) => {
    const loginBody = request.body;
    try {
      const login = loginSchema.parse(loginBody);
      const response = await loginUseCase.login(login);
      if ('error' in response) {
        if (response.error === 'invalid_credentials') {
          return reply.code(401).send({ error: 'invalid_credentials' });
        }
        return reply.code(500).send({ error: 'internal_error' });
      }
      return reply
        .cookie('auth_token', response.token, {
          httpOnly: true,
          maxAge: response.expiresIn,
          path: '/',
        })
        .status(200)
        .send(response);
    } catch (error) {
      return reply.code(500).send({ error: 'internal_error', message: JSON.stringify(error) });
    }
  });

  app.get('/logout', async (request, reply) => {
    try {
      return reply.clearCookie('auth_token').status(200).send({ message: 'logout' });
    } catch (error) {
      return reply.code(500).send({ error: 'internal_error', message: JSON.stringify(error) });
    }
  });

  app.get('/check', async (request, reply) => {
    try {
      const token = request.cookies.auth_token;
      if (!token) return reply.code(401).send({ error: 'unauthorized' });
      jwt.verify(token, envs.JWT_SECRET, (err, decoded) => {});
    } catch (error) {
      return reply.code(500).send({ error: 'internal_error', message: JSON.stringify(error) });
    }
  });
};
