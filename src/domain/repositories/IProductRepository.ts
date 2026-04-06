import { Product } from "../entities/Product";

export interface IProductRepository {
  list(salonId?: string): Promise<Product[]>;
  create(product: Product): Promise<Product>;
  isOwnedByUser(salonId: string, ownerId: string): Promise<boolean>;
  findManyByIds(productIds: string[]): Promise<Product[]>;
}
