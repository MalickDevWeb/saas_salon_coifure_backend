import { Booking } from "../entities/Booking";

export interface IBookingRepository {
  create(booking: Booking): Promise<Booking>;
  listByUserId(userId: string): Promise<Booking[]>;
  hasConflict(
    salonId: string,
    startTime: Date,
    endTime: Date
  ): Promise<boolean>;
}
