import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateUserInput, UserQueryInput } from '../schemas/user.schema';
import { UserService } from '../services/user.service';

export class UserController {
  constructor(private userService = new UserService()) {}

  async create(request: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply) {
    const user = await this.userService.create(request.body);
    return reply.status(201).send(user);
  }

  async getById(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const user = await this.userService.getById(Number(request.params.id));
    return reply.status(200).send(user);
  }

  async list(request: FastifyRequest<{ Querystring: UserQueryInput }>, reply: FastifyReply) {
    const result = await this.userService.list(request.query);
    return reply.status(200).send(result);
  }
}
