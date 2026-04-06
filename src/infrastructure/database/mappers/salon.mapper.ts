import {
  Booking as PrismaBooking,
  Salon as PrismaSalon,
  Service as PrismaService
} from "@prisma/client";
import { Booking } from "../../../domain/entities/Booking";
import { Salon } from "../../../domain/entities/Salon";
import { Service } from "../../../domain/entities/Service";

export const toSalonEntity = (salon: PrismaSalon): Salon =>
  new Salon(
    salon.name,
    salon.address,
    salon.latitude,
    salon.longitude,
    salon.ownerId,
    salon.id
  );

export const toServiceEntity = (service: PrismaService): Service =>
  new Service(
    service.salonId,
    service.name,
    Number(service.price),
    service.durationMinutes,
    service.id
  );

export const toBookingEntity = (booking: PrismaBooking): Booking =>
  new Booking(
    booking.userId,
    booking.salonId,
    booking.serviceId,
    booking.startTime,
    booking.endTime,
    booking.status,
    booking.id
  );
