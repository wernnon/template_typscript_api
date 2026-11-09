import { AppError } from '../errors/AppError';
import { ProdutoRepository } from '../repositories/produto.repository';
import { CreateProdutoInput, UpdateProdutoInput } from '../schemas/produto.schema';

export class ProdutoService {
  constructor(private produtoRepository = new ProdutoRepository()) {}

  async create(data: CreateProdutoInput, userId?: number) {
    return this.produtoRepository.create(data, userId);
  }

  async getById(id: number) {
    const produto = await this.produtoRepository.findById(id);
    if (!produto) {
      throw new AppError('Produto não encontrado.', 404, 'PRODUCT_NOT_FOUND');
    }
    return produto;
  }

  async listAll() {
    return this.produtoRepository.findAll();
  }

  async update(id: number, data: UpdateProdutoInput) {
    await this.getById(id);
    return this.produtoRepository.update(id, data);
  }

  async delete(id: number) {
    await this.getById(id);
    return this.produtoRepository.delete(id);
  }
}
