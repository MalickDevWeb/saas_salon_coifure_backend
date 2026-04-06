export class Service {
  constructor(
    public readonly salonId: string,
    public readonly name: string,
    public readonly price: number,
    public readonly durationMinutes: number,
    public readonly id?: string
  ) {}
}
