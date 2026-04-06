export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELED"
  | "COMPLETED";

export class Booking {
  constructor(
    public readonly userId: string,
    public readonly salonId: string,
    public readonly serviceId: string,
    public readonly startTime: Date,
    public readonly endTime: Date,
    public readonly status: BookingStatus = "PENDING",
    public readonly id?: string
  ) {}
}
