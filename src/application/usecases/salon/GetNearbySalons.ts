import { ISalonRepository } from "../../../domain/repositories/ISalonRepository";
import { DistanceService } from "../../../domain/services/DistanceService";

type NearbyInput = {
  latitude: number;
  longitude: number;
  radiusKm: number;
};

export class GetNearbySalons {
  constructor(private readonly salonRepository: ISalonRepository) {}

  async execute(input: NearbyInput) {
    const salons = await this.salonRepository.list();
    return salons
      .map((entry) => ({
        ...entry,
        distanceKm: DistanceService.inKilometers(
          input.latitude,
          input.longitude,
          entry.salon.latitude,
          entry.salon.longitude
        )
      }))
      .filter((entry) => entry.distanceKm <= input.radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }
}
