import { NextFunction, Request, Response } from "express";
import { GetNearbySalons } from "../../application/usecases/salon/GetNearbySalons";
import { ListSalons } from "../../application/usecases/salon/ListSalons";
import { AppError } from "../../shared/errors/AppError";

export class SalonController {
  constructor(
    private readonly listSalons: ListSalons,
    private readonly getNearbySalons: GetNearbySalons
  ) {}

  list = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.json(await this.listSalons.execute());
    } catch (error) {
      next(error);
    }
  };

  nearby = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const latitude = Number(req.query.lat);
      const longitude = Number(req.query.lon);
      const radiusKm = Number(req.query.radius ?? 5);
      if ([latitude, longitude, radiusKm].some(Number.isNaN)) {
        throw new AppError("lat, lon and radius must be valid numbers", 422);
      }
      res.json(await this.getNearbySalons.execute({ latitude, longitude, radiusKm }));
    } catch (error) {
      next(error);
    }
  };
}
