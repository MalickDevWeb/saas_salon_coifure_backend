import { Product } from "../entities/Product";

export interface IProductRepository {
  list(salonId?: string): Promise<Product[]>;
  findManyByIds(productIds: string[]): Promise<Product[]>;
}
