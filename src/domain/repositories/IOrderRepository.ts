import { Order, OrderItemInput } from "../entities/Order";

export interface IOrderRepository {
  listByUserId(userId: string): Promise<Order[]>;
  createWithItems(input: {
    userId: string;
    totalAmount: number;
    items: OrderItemInput[];
  }): Promise<Order>;
}
