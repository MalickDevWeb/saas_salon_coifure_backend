import { Product } from "../../../domain/entities/Product";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { prisma } from "../prisma/client";

export class PrismaProductRepository implements IProductRepository {
  async list(salonId?: string): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: { salonId, isActive: true },
      orderBy: { createdAt: "desc" }
    });
    return products.map(
      (product) =>
        new Product(
          product.salonId,
          product.name,
          Number(product.price),
          product.stock,
          product.isActive,
          product.id
        )
    );
  }

  async create(product: Product): Promise<Product> {
    const created = await prisma.product.create({
      data: {
        salonId: product.salonId,
        name: product.name,
        price: product.price,
        stock: product.stock,
        isActive: product.isActive
      }
    });
    return new Product(
      created.salonId,
      created.name,
      Number(created.price),
      created.stock,
      created.isActive,
      created.id
    );
  }

  async isOwnedByUser(salonId: string, ownerId: string): Promise<boolean> {
    const count = await prisma.salon.count({ where: { id: salonId, ownerId } });
    return count > 0;
  }

  async findManyByIds(productIds: string[]): Promise<Product[]> {
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, isActive: true }
    });
    return products.map(
      (product) =>
        new Product(
          product.salonId,
          product.name,
          Number(product.price),
          product.stock,
          product.isActive,
          product.id
        )
    );
  }
}
