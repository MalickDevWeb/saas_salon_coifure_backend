import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";
import { IProductRepository } from "../../../domain/repositories/IProductRepository";
import { AppError } from "../../../shared/errors/AppError";

type CreateOrderInput = {
  userId: string;
  items: Array<{ productId: string; quantity: number }>;
};

export class CreateOrder {
  constructor(
    private readonly productRepository: IProductRepository,
    private readonly orderRepository: IOrderRepository
  ) {}

  async execute(input: CreateOrderInput) {
    if (input.items.length === 0) throw new AppError("Order items are required");
    const productIds = input.items.map((item) => item.productId);
    const products = await this.productRepository.findManyByIds(productIds);
    const productMap = new Map(products.map((product) => [product.id!, product]));
    const items = input.items.map((item) => {
      const product = productMap.get(item.productId);
      if (!product) throw new AppError(`Product ${item.productId} not found`, 404);
      if (item.quantity <= 0) throw new AppError("Quantity must be positive", 422);
      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for ${product.name}`, 409);
      }
      return {
        productId: product.id!,
        quantity: item.quantity,
        unitPrice: product.price
      };
    });
    const totalAmount = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );
    return this.orderRepository.createWithItems({
      userId: input.userId,
      totalAmount,
      items
    });
  }
}
