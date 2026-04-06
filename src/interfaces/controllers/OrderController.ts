import { NextFunction, Response } from "express";
import { CreateOrder } from "../../application/usecases/order/CreateOrder";
import { ListUserOrders } from "../../application/usecases/order/ListUserOrders";
import { AuthRequest } from "../http/AuthRequest";
import { AppError } from "../../shared/errors/AppError";

export class OrderController {
  constructor(
    private readonly createOrder: CreateOrder,
    private readonly listUserOrders: ListUserOrders
  ) {}

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("Unauthorized", 401);
      const items = Array.isArray(req.body.items) ? req.body.items : [];
      const order = await this.createOrder.execute({ userId: req.user.id, items });
      res.status(201).json(order);
    } catch (error) {
      next(error);
    }
  };

  listMine = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("Unauthorized", 401);
      res.json(await this.listUserOrders.execute(req.user.id));
    } catch (error) {
      next(error);
    }
  };
}
