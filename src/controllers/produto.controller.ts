import { FastifyReply, FastifyRequest } from 'fastify';
import { CreateProdutoInput, UpdateProdutoInput } from '../schemas/produto.schema';
import { ProdutoService } from '../services/produto.service';

export class ProdutoController {
  constructor(private produtoService = new ProdutoService()) {}

  async create(request: FastifyRequest<{ Body: CreateProdutoInput }>, reply: FastifyReply) {
    const userId = (request.user as { id: number })?.id;
    const produto = await this.produtoService.create(request.body, userId);
    return reply.status(201).send(produto);
  }

  async listAll(_request: FastifyRequest, reply: FastifyReply) {
    const produtos = await this.produtoService.listAll();
    return reply.status(200).send(produtos);
  }

  async getById(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    const produto = await this.produtoService.getById(Number(request.params.id));
    return reply.status(200).send(produto);
  }

  async update(request: FastifyRequest<{ Params: { id: number }; Body: UpdateProdutoInput }>, reply: FastifyReply) {
    const produto = await this.produtoService.update(Number(request.params.id), request.body);
    return reply.status(200).send(produto);
  }

  async delete(request: FastifyRequest<{ Params: { id: number } }>, reply: FastifyReply) {
    await this.produtoService.delete(Number(request.params.id));
    return reply.status(204).send();
  }
}
