import { Salon } from "../entities/Salon";
import { Service } from "../entities/Service";
import { Booking } from "../entities/Booking";

export type SalonWithServices = {
  salon: Salon;
  services: Service[];
};

export interface ISalonRepository {
  list(): Promise<SalonWithServices[]>;
  create(salon: Salon): Promise<Salon>;
  createService(service: Service): Promise<Service>;
  findByOwnerId(ownerId: string): Promise<Salon | null>;
  isOwnedByUser(salonId: string, ownerId: string): Promise<boolean>;
  listBookingsByOwnerId(ownerId: string): Promise<Booking[]>;
  findServiceById(serviceId: string): Promise<Service | null>;
}
