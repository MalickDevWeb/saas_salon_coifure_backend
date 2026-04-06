import { Booking } from "../../../domain/entities/Booking";
import { Salon } from "../../../domain/entities/Salon";
import { Service } from "../../../domain/entities/Service";
import {
  ISalonRepository,
  SalonWithServices
} from "../../../domain/repositories/ISalonRepository";
import {
  toBookingEntity,
  toSalonEntity,
  toServiceEntity
} from "../mappers/salon.mapper";
import { prisma } from "../prisma/client";

export class PrismaSalonRepository implements ISalonRepository {
  async list(): Promise<SalonWithServices[]> {
    const salons = await prisma.salon.findMany({
      include: { services: true },
      orderBy: { createdAt: "desc" }
    });
    return salons.map((salon) => ({
      salon: toSalonEntity(salon),
      services: salon.services.map(toServiceEntity)
    }));
  }

  async create(salon: Salon): Promise<Salon> {
    const created = await prisma.salon.create({
      data: {
        name: salon.name,
        address: salon.address,
        latitude: salon.latitude,
        longitude: salon.longitude,
        ownerId: salon.ownerId
      }
    });
    return toSalonEntity(created);
  }

  async createService(service: Service): Promise<Service> {
    const created = await prisma.service.create({
      data: {
        salonId: service.salonId,
        name: service.name,
        price: service.price,
        durationMinutes: service.durationMinutes
      }
    });
    return toServiceEntity(created);
  }

  async findByOwnerId(ownerId: string): Promise<Salon | null> {
    const salon = await prisma.salon.findFirst({ where: { ownerId } });
    return salon ? toSalonEntity(salon) : null;
  }

  async isOwnedByUser(salonId: string, ownerId: string): Promise<boolean> {
    const count = await prisma.salon.count({ where: { id: salonId, ownerId } });
    return count > 0;
  }

  async listBookingsByOwnerId(ownerId: string): Promise<Booking[]> {
    const bookings = await prisma.booking.findMany({
      where: { salon: { ownerId } },
      orderBy: { startTime: "desc" }
    });
    return bookings.map(toBookingEntity);
  }

  async findServiceById(serviceId: string): Promise<Service | null> {
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    return service ? toServiceEntity(service) : null;
  }
}
