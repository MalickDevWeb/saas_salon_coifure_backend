import { IProductRepository } from "../../../domain/repositories/IProductRepository";

export class ListProducts {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(salonId?: string) {
    return this.productRepository.list(salonId);
  }
}
