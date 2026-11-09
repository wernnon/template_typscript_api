import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { ProdutoController } from '../controllers/produto.controller';
import { createProdutoSchema, updateProdutoSchema } from '../schemas/produto.schema';
import { authenticate } from '../utils/auth.middleware';

export async function produtoRoutes(app: FastifyInstance) {
  const controller = new ProdutoController();
  const typedApp = app.withTypeProvider<ZodTypeProvider>();

  typedApp.post('/produtos', {
    onRequest: [authenticate],
    schema: {
      tags: ['Produtos'],
      summary: 'Cadastra um novo produto',
      body: createProdutoSchema,
    },
  }, controller.create.bind(controller));

  typedApp.get('/produtos', {
    schema: {
      tags: ['Produtos'],
      summary: 'Lista todos os produtos',
    },
  }, controller.listAll.bind(controller));

  typedApp.get('/produtos/:id', {
    schema: {
      tags: ['Produtos'],
      summary: 'Obtém produto por ID',
    },
  }, controller.getById.bind(controller));

  typedApp.put('/produtos/:id', {
    onRequest: [authenticate],
    schema: {
      tags: ['Produtos'],
      summary: 'Atualiza produto',
      body: updateProdutoSchema,
    },
  }, controller.update.bind(controller));

  typedApp.delete('/produtos/:id', {
    onRequest: [authenticate],
    schema: {
      tags: ['Produtos'],
      summary: 'Remove produto',
    },
  }, controller.delete.bind(controller));
}
