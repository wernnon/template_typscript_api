import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { AuthController } from '../controllers/auth.controller';
import { loginSchema } from '../schemas/auth.schema';

export async function authRoutes(app: FastifyInstance) {
  const controller = new AuthController();
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.post('/login', {
    schema: {
      tags: ['Autenticação'],
      summary: 'Realiza autenticação do usuário',
      body: loginSchema,
    },
  }, controller.login.bind(controller));
}
