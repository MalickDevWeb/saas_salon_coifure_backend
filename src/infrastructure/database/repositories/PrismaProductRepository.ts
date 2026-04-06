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
