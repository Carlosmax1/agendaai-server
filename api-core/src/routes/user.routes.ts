import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { UserUseCase } from '@/usecases/user.usecase';
import { envs } from '@/env';
import jwt from 'jsonwebtoken';

const userCreateSchema = z
  .object({
    name: z
      .string()
      .trim()
      .toLowerCase()
      .min(3)
      .transform((name) => {
        return name
          .split(' ')
          .map((word) => {
            return word[0].toUpperCase().concat(word.substring(1));
          })
          .join(' ');
      }),
    email: z.string().trim().toLowerCase().email(),
    phone: z
      .string()
      .min(1, 'Campo obrigatório')
      .max(15)
      .regex(/^(\(\d{2}\)\s?|\d{2}\s)?(\d{4,5}-\d{4}|\d{4}-\d{4})$/, 'Telefone inválido.'),
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, 'Invalid password');

export async function userRoutes(app: FastifyInstance) {
  const userUseCase = new UserUseCase();
  app.post<{ Body: z.infer<typeof userCreateSchema> }>('/', async (request, reply) => {
    const body = request.body;
    try {
      const { email, password, phone, name } = userCreateSchema.parse(body);
      await userUseCase.create({ email, password, phone, name });
      return reply.code(201).send({});
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error });
      } else {
        return reply.code(409).send({ error: error.message });
      }
    }
  });
  app.get(
    '/',
    {
      preHandler: async (request, reply, done) => {
        const token = request.headers.authorization?.split(' ')[1];
        if (!token) return reply.code(401).send({ message: 'Unauthorized' });
        try {
          jwt.verify(token, envs.JWT_SECRET);
          return done();
        } catch (error) {
          return reply.code(401).send({ message: 'Unauthorized' });
        }
      },
    },
    async (request, reply) => {
      try {
        const users = await userUseCase.readAll();
        return reply.code(200).send({ users });
      } catch (error: any) {
        return reply.code(500).send({ error: error.message });
      }
    }
  );
}
