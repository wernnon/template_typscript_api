import fastifyCors from '@fastify/cors';
import fastifyJwt from '@fastify/jwt';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import ScalarApiReference from '@scalar/fastify-api-reference';
import 'dotenv/config';
import fastify from 'fastify';
import {
  createJsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { authRoutes } from './routes/auth.routes';
import { produtoRoutes } from './routes/produto.routes';
import { userRoutes } from './routes/user.routes';
import { globalErrorHandler } from './utils/error-handler';

const app = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Middlewares & Plugins
app.register(fastifyCors, { origin: '*' });
app.register(fastifyJwt, { secret: process.env.JWT_SECRET || 'supersecret' });

// Documentação OpenAPI / Swagger
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Fastify Prisma API Starter',
      description: 'Documentação da API desenvolvida com Fastify, Prisma e Zod',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  transform: createJsonSchemaTransform({ skipList: [] }),
});

app.register(fastifySwaggerUi, { routePrefix: '/docs' });
app.register(ScalarApiReference, { routePrefix: '/reference', configuration: { theme: 'purple' } });

// Handler Global de Erros
app.setErrorHandler(globalErrorHandler);

// Registro de Rotas
app.register(authRoutes, { prefix: '/api' });
app.register(userRoutes, { prefix: '/api' });
app.register(produtoRoutes, { prefix: '/api' });

const PORT = Number(process.env.PORT) || 3333;
const HOST = process.env.HOST || '0.0.0.0';

app.listen({ port: PORT, host: HOST }, (err, address) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
  console.log(`🚀 Servidor rodando em ${address}`);
  console.log(`📚 Documentação Scalar: ${address}/reference`);
});
