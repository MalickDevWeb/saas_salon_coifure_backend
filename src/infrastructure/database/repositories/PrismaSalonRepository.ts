import { Salon } from "../../../domain/entities/Salon";
import { Service } from "../../../domain/entities/Service";
import {
  ISalonRepository,
  SalonWithServices
} from "../../../domain/repositories/ISalonRepository";
import { prisma } from "../prisma/client";

export class PrismaSalonRepository implements ISalonRepository {
  async list(): Promise<SalonWithServices[]> {
    const salons = await prisma.salon.findMany({
      include: { services: true },
      orderBy: { createdAt: "desc" }
    });
    return salons.map((salon) => ({
      salon: new Salon(
        salon.name,
        salon.address,
        salon.latitude,
        salon.longitude,
        salon.ownerId,
        salon.id
      ),
      services: salon.services.map(
        (service) =>
          new Service(
            service.salonId,
            service.name,
            Number(service.price),
            service.durationMinutes,
            service.id
          )
      )
    }));
  }

  async findServiceById(serviceId: string): Promise<Service | null> {
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) return null;
    return new Service(
      service.salonId,
      service.name,
      Number(service.price),
      service.durationMinutes,
      service.id
    );
  }
}
