export type OrderStatus = "PENDING" | "PAID" | "CANCELED" | "COMPLETED";

export type OrderItemInput = {
  productId: string;
  quantity: number;
  unitPrice: number;
};

export class Order {
  constructor(
    public readonly userId: string,
    public readonly totalAmount: number,
    public readonly status: OrderStatus = "PENDING",
    public readonly items: OrderItemInput[] = [],
    public readonly id?: string
  ) {}
}
