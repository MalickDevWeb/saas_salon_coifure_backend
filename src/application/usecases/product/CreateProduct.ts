import { Product } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { AppError } from "../../../shared/errors/AppError";

type CreateProductInput = {
  ownerId: string;
  salonId: string;
  name: string;
  price: number;
  stock: number;
};

export class CreateProduct {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(input: CreateProductInput): Promise<Product> {
    const isOwner = await this.productRepository.isOwnedByUser(
      input.salonId,
      input.ownerId
    );
    if (!isOwner) throw new AppError("Unauthorized salon access", 403);
    const product = new Product(
      input.salonId,
      input.name,
      input.price,
      input.stock
    );
    return this.productRepository.create(product);
  }
}
