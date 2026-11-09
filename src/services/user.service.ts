import bcrypt from 'bcryptjs';
import { AppError } from '../errors/AppError';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserInput, UserQueryInput } from '../schemas/user.schema';

export class UserService {
  constructor(private userRepository = new UserRepository()) {}

  async create(data: CreateUserInput) {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new AppError('E-mail já cadastrado.', 409, 'EMAIL_EXISTS');
    }

    const senha_hash = await bcrypt.hash(data.senha, 10);
    return this.userRepository.create({ ...data, senha_hash });
  }

  async getById(id: number) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('Usuário não encontrado.', 404, 'USER_NOT_FOUND');
    }
    return user;
  }

  async list(query: UserQueryInput) {
    return this.userRepository.findAll(query);
  }
}
