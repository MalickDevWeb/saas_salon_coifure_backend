import { Salon } from "../../../domain/entities/Salon";
import { ISalonRepository } from "../../../domain/repositories/ISalonRepository";
import { AppError } from "../../../shared/errors/AppError";

type CreateSalonInput = {
  ownerId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export class CreateSalon {
  constructor(private readonly salonRepository: ISalonRepository) {}

  async execute(input: CreateSalonInput): Promise<Salon> {
    const existing = await this.salonRepository.findByOwnerId(input.ownerId);
    if (existing) throw new AppError("Salon profile already exists", 409);
    const salon = new Salon(
      input.name,
      input.address,
      input.latitude,
      input.longitude,
      input.ownerId
    );
    return this.salonRepository.create(salon);
  }
}
