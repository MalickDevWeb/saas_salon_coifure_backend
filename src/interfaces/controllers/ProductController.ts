import { CreateProduct } from "../../application/usecases/product/CreateProduct";
import { NextFunction, Request, Response } from "express";
import { AppError } from "../../shared/errors/AppError";
import { AuthRequest } from "../http/AuthRequest";
import { ListProducts } from "../../application/usecases/product/ListProducts";

export class ProductController {
  constructor(
    private readonly listProducts: ListProducts,
    private readonly createProduct: CreateProduct
  ) {}

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const salonId =
        typeof req.query.salonId === "string" ? req.query.salonId : undefined;
      res.json(await this.listProducts.execute(salonId));
    } catch (error) {
      next(error);
    }
  };

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("Unauthorized", 401);
      const { salonId, name, price, stock } = req.body;
      if (!salonId || !name || !price || stock === undefined) {
        throw new AppError("salonId, name, price and stock are required", 422);
      }
      const product = await this.createProduct.execute({
        ownerId: req.user.id,
        salonId,
        name,
        price: Number(price),
        stock: Number(stock)
      });
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  };
}
