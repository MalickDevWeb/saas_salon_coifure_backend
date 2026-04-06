import { Service } from "../../../domain/entities/Service";
import { ISalonRepository } from "../../../domain/repositories/ISalonRepository";
import { AppError } from "../../../shared/errors/AppError";

type CreateServiceInput = {
  ownerId: string;
  salonId: string;
  name: string;
  price: number;
  durationMinutes: number;
};

export class CreateService {
  constructor(private readonly salonRepository: ISalonRepository) {}

  async execute(input: CreateServiceInput): Promise<Service> {
    const isOwner = await this.salonRepository.isOwnedByUser(
      input.salonId,
      input.ownerId
    );
    if (!isOwner) throw new AppError("Unauthorized salon access", 403);
    const service = new Service(
      input.salonId,
      input.name,
      input.price,
      input.durationMinutes
    );
    return this.salonRepository.createService(service);
  }
}
