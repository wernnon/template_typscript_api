import { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../errors/AppError';

export interface UserPayload {
  id: number;
  role: 'ADMIN' | 'USER';
}

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    throw new AppError('Token de autenticação inválido ou ausente.', 401, 'UNAUTHORIZED');
  }
}

export function authorizeRoles(...allowedRoles: ('ADMIN' | 'USER')[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    await authenticate(request, reply);
    const user = request.user as UserPayload;

    if (!allowedRoles.includes(user.role)) {
      throw new AppError('Acesso não autorizado para esta regra.', 403, 'FORBIDDEN');
    }
  };
}
