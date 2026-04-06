import { Booking } from "../../../domain/entities/Booking";
import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { ISalonRepository } from "../../../domain/repositories/ISalonRepository";
import { AppError } from "../../../shared/errors/AppError";

type CreateBookingInput = {
  userId: string;
  salonId: string;
  serviceId: string;
  startTime: string;
};

export class CreateBooking {
  constructor(
    private readonly bookingRepository: IBookingRepository,
    private readonly salonRepository: ISalonRepository
  ) {}

  async execute(input: CreateBookingInput): Promise<Booking> {
    const service = await this.salonRepository.findServiceById(input.serviceId);
    if (!service || service.salonId !== input.salonId) {
      throw new AppError("Service not found for this salon", 404);
    }
    const startTime = new Date(input.startTime);
    if (Number.isNaN(startTime.getTime())) {
      throw new AppError("Invalid startTime", 422);
    }
    const endTime = new Date(
      startTime.getTime() + service.durationMinutes * 60 * 1000
    );
    const hasConflict = await this.bookingRepository.hasConflict(
      input.salonId,
      startTime,
      endTime
    );
    if (hasConflict) throw new AppError("Time slot already taken", 409);
    const booking = new Booking(
      input.userId,
      input.salonId,
      input.serviceId,
      startTime,
      endTime
    );
    return this.bookingRepository.create(booking);
  }
}
