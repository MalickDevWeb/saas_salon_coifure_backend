import { NextFunction, Request, Response } from "express";
import { CreateSalon } from "../../application/usecases/salon/CreateSalon";
import { GetOwnerSalon } from "../../application/usecases/salon/GetOwnerSalon";
import { GetNearbySalons } from "../../application/usecases/salon/GetNearbySalons";
import { ListSalons } from "../../application/usecases/salon/ListSalons";
import { ListOwnerBookings } from "../../application/usecases/salon/ListOwnerBookings";
import { AppError } from "../../shared/errors/AppError";
import { AuthRequest } from "../http/AuthRequest";

export class SalonController {
  constructor(
    private readonly listSalons: ListSalons,
    private readonly getNearbySalons: GetNearbySalons,
    private readonly createSalon: CreateSalon,
    private readonly getOwnerSalon: GetOwnerSalon,
    private readonly listOwnerBookings: ListOwnerBookings
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

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("Unauthorized", 401);
      const { name, address, latitude, longitude } = req.body;
      if (!name || !address) {
        throw new AppError("name and address are required", 422);
      }
      const salon = await this.createSalon.execute({
        ownerId: req.user.id,
        name,
        address,
        latitude: Number(latitude),
        longitude: Number(longitude)
      });
      res.status(201).json(salon);
    } catch (error) {
      next(error);
    }
  };

  me = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("Unauthorized", 401);
      res.json(await this.getOwnerSalon.execute(req.user.id));
    } catch (error) {
      next(error);
    }
  };

  ownerBookings = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("Unauthorized", 401);
      res.json(await this.listOwnerBookings.execute(req.user.id));
    } catch (error) {
      next(error);
    }
  };
}
