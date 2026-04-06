import { Order } from "../../../domain/entities/Order";
import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { AppError } from "../../../shared/errors/AppError";
import { prisma } from "../prisma/client";

export class PrismaOrderRepository implements IOrderRepository {
  async listByUserId(userId: string): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: "desc" }
    });
    return orders.map(
      (order) =>
        new Order(
          order.userId,
          Number(order.totalAmount),
          order.status,
          order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice)
          })),
          order.id
        )
    );
  }

  async createWithItems(input: {
    userId: string;
    totalAmount: number;
    items: Array<{ productId: string; quantity: number; unitPrice: number }>;
  }): Promise<Order> {
    const order = await prisma.$transaction(async (tx) => {
      for (const item of input.items) {
        const updated = await tx.product.updateMany({
          where: { id: item.productId, stock: { gte: item.quantity } },
          data: { stock: { decrement: item.quantity } }
        });
        if (updated.count === 0) throw new AppError("Concurrent stock update", 409);
      }
      return tx.order.create({
        data: {
          userId: input.userId,
          totalAmount: input.totalAmount,
          items: {
            create: input.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice
            }))
          }
        },
        include: { items: true }
      });
    });
    return new Order(
      order.userId,
      Number(order.totalAmount),
      order.status,
      order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice)
      })),
      order.id
    );
  }
}
