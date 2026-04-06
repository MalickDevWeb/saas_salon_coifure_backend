import { ISalonRepository } from "../../../domain/repositories/ISalonRepository";

export class ListOwnerBookings {
  constructor(private readonly salonRepository: ISalonRepository) {}

  async execute(ownerId: string) {
    return this.salonRepository.listBookingsByOwnerId(ownerId);
  }
}
