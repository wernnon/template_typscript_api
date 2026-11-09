import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';

export function globalErrorHandler(
  error: FastifyError | Error,
  _request: FastifyRequest,
  reply: FastifyReply
) {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      status: 'error',
      code: error.code,
      message: error.message,
      details: error.details ?? null,
    });
  }

  if (error instanceof ZodError) {
    return reply.status(400).send({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Dados de entrada inválidos.',
      issues: error.format(),
    });
  }

  console.error('[UNHANDLED_ERROR]', error);

  return reply.status(500).send({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Ocorreu um erro interno no servidor.',
  });
}
