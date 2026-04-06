import { ISalonRepository } from "../../../domain/repositories/ISalonRepository";

export class GetOwnerSalon {
  constructor(private readonly salonRepository: ISalonRepository) {}

  async execute(ownerId: string) {
    return this.salonRepository.findByOwnerId(ownerId);
  }
}
