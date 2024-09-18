import { RouteShorthandOptions } from 'fastify';
import { envs } from '@/envs';
import jwt from 'jsonwebtoken';

export const authMiddleware: RouteShorthandOptions = {
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
};
