import { FastifyReply, FastifyRequest } from 'fastify';
import { LoginInput } from '../schemas/auth.schema';
import { AuthService } from '../services/auth.service';

export class AuthController {
  constructor(private authService = new AuthService()) {}

  async login(request: FastifyRequest<{ Body: LoginInput }>, reply: FastifyReply) {
    const user = await this.authService.login(request.body);
    const token = await reply.jwtSign(
      { id: user.id, role: user.role },
      { sign: { expiresIn: '8h' } }
    );

    return reply.status(200).send({
      token,
      usuario: {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.role,
      },
    });
  }
}
