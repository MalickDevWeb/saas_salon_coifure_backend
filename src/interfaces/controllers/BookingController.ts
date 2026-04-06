import { NextFunction, Response } from "express";
import { CreateBooking } from "../../application/usecases/booking/CreateBooking";
import { ListUserBookings } from "../../application/usecases/booking/ListUserBookings";
import { AuthRequest } from "../http/AuthRequest";
import { AppError } from "../../shared/errors/AppError";

export class BookingController {
  constructor(
    private readonly createBooking: CreateBooking,
    private readonly listUserBookings: ListUserBookings
  ) {}

  create = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("Unauthorized", 401);
      const { salonId, serviceId, startTime } = req.body;
      if (!salonId || !serviceId || !startTime) {
        throw new AppError("salonId, serviceId and startTime are required", 422);
      }
      const booking = await this.createBooking.execute({
        userId: req.user.id,
        salonId,
        serviceId,
        startTime
      });
      res.status(201).json(booking);
    } catch (error) {
      next(error);
    }
  };

  listMine = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) throw new AppError("Unauthorized", 401);
      res.json(await this.listUserBookings.execute(req.user.id));
    } catch (error) {
      next(error);
    }
  };
}
