import { NextFunction, Response } from "express";
import { CreateService } from "../../application/usecases/salon/CreateService";
import { AppError } from "../../shared/errors/AppError";
import { AuthRequest } from "../http/AuthRequest";

export class ServiceController {
  constructor(private readonly createService: CreateService) {}

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("Unauthorized", 401);
      const { salonId, name, price, durationMinutes } = req.body;
      if (!salonId || !name || !price || !durationMinutes) {
        throw new AppError(
          "salonId, name, price and durationMinutes are required",
          422
        );
      }
      const service = await this.createService.execute({
        ownerId: req.user.id,
        salonId,
        name,
        price: Number(price),
        durationMinutes: Number(durationMinutes)
      });
      res.status(201).json(service);
    } catch (error) {
      next(error);
    }
  };
}
