import { Salon } from "../entities/Salon";
import { Service } from "../entities/Service";

export type SalonWithServices = {
  salon: Salon;
  services: Service[];
};

export interface ISalonRepository {
  list(): Promise<SalonWithServices[]>;
  findServiceById(serviceId: string): Promise<Service | null>;
}
