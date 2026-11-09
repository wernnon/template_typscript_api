import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { UserController } from '../controllers/user.controller';
import { createUserSchema, userQuerySchema } from '../schemas/user.schema';
import { authenticate, authorizeRoles } from '../utils/auth.middleware';

export async function userRoutes(app: FastifyInstance) {
  const controller = new UserController();
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.post('/users', {
    onRequest: [authorizeRoles('ADMIN')],
    schema: {
      tags: ['Usuários'],
      summary: 'Cria um novo usuário (Apenas Admin)',
      body: createUserSchema,
    },
  }, controller.create.bind(controller));

  typedApp.get('/users', {
    onRequest: [authenticate],
    schema: {
      tags: ['Usuários'],
      summary: 'Lista usuários com paginação',
      querystring: userQuerySchema,
    },
  }, controller.list.bind(controller));

  typedApp.get('/users/:id', {
    onRequest: [authenticate],
    schema: {
      tags: ['Usuários'],
      summary: 'Busca usuário por ID',
    },
  }, controller.getById.bind(controller));
}
