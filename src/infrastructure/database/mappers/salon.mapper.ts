import { Booking } from "../../../domain/entities/Booking";
import { Salon } from "../../../domain/entities/Salon";
import { Service } from "../../../domain/entities/Service";

type PrismaSalonLike = {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  ownerId: string;
};

type PrismaServiceLike = {
  id: string;
  salonId: string;
  name: string;
  price: number | { toString(): string };
  durationMinutes: number;
};

type PrismaBookingLike = {
  id: string;
  userId: string;
  salonId: string;
  serviceId: string;
  startTime: Date;
  endTime: Date;
  status: Booking["status"];
};

export const toSalonEntity = (salon: PrismaSalonLike): Salon =>
  new Salon(
    salon.name,
    salon.address,
    salon.latitude,
    salon.longitude,
    salon.ownerId,
    salon.id
  );

export const toServiceEntity = (service: PrismaServiceLike): Service =>
  new Service(
    service.salonId,
    service.name,
    Number(service.price),
    service.durationMinutes,
    service.id
  );

export const toBookingEntity = (booking: PrismaBookingLike): Booking =>
  new Booking(
    booking.userId,
    booking.salonId,
    booking.serviceId,
    booking.startTime,
    booking.endTime,
    booking.status,
    booking.id
  );
