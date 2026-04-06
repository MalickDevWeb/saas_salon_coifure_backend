import { NextFunction, Request, Response } from "express";
import { ListProducts } from "../../application/usecases/product/ListProducts";

export class ProductController {
  constructor(private readonly listProducts: ListProducts) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const salonId =
        typeof req.query.salonId === "string" ? req.query.salonId : undefined;
      res.json(await this.listProducts.execute(salonId));
    } catch (error) {
      next(error);
    }
  };
}
