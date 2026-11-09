import bcrypt from 'bcryptjs';
import { AppError } from '../errors/AppError';
import { UserRepository } from '../repositories/user.repository';
import { LoginInput } from '../schemas/auth.schema';

export class AuthService {
  constructor(private userRepository = new UserRepository()) {}

  async login(data: LoginInput) {
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('E-mail ou senha incorretos.', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(data.senha, user.senha_hash);
    if (!isMatch) {
      throw new AppError('E-mail ou senha incorretos.', 401, 'INVALID_CREDENTIALS');
    }

    if (!user.ativo) {
      throw new AppError('Usuário inativo. Entre em contato com o suporte.', 403, 'USER_INACTIVE');
    }

    return user;
  }
}
