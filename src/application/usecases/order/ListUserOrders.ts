import { IOrderRepository } from "../../../domain/repositories/IOrderRepository";

export class ListUserOrders {
  constructor(private readonly orderRepository: IOrderRepository) {}

  async execute(userId: string) {
    return this.orderRepository.listByUserId(userId);
  }
}
