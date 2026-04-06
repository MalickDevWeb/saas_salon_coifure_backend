import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";

export class ListUserBookings {
  constructor(private readonly bookingRepository: IBookingRepository) {}

  async execute(userId: string) {
    return this.bookingRepository.listByUserId(userId);
  }
}
