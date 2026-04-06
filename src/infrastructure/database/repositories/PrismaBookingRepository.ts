import { Booking } from "../../../domain/entities/Booking";
import { IBookingRepository } from "../../../domain/repositories/IBookingRepository";
import { prisma } from "../prisma/client";

export class PrismaBookingRepository implements IBookingRepository {
  async create(booking: Booking): Promise<Booking> {
    const created = await prisma.booking.create({
      data: {
        userId: booking.userId,
        salonId: booking.salonId,
        serviceId: booking.serviceId,
        startTime: booking.startTime,
        endTime: booking.endTime,
        status: booking.status
      }
    });
    return new Booking(
      created.userId,
      created.salonId,
      created.serviceId,
      created.startTime,
      created.endTime,
      created.status,
      created.id
    );
  }

  async listByUserId(userId: string): Promise<Booking[]> {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      orderBy: { startTime: "desc" }
    });
    return bookings.map(
      (booking) =>
        new Booking(
          booking.userId,
          booking.salonId,
          booking.serviceId,
          booking.startTime,
          booking.endTime,
          booking.status,
          booking.id
        )
    );
  }

  async hasConflict(
    salonId: string,
    startTime: Date,
    endTime: Date
  ): Promise<boolean> {
    const count = await prisma.booking.count({
      where: {
        salonId,
        status: { in: ["PENDING", "CONFIRMED"] },
        startTime: { lt: endTime },
        endTime: { gt: startTime }
      }
    });
    return count > 0;
  }
}
