export class Salon {
  constructor(
    public readonly name: string,
    public readonly address: string,
    public readonly latitude: number,
    public readonly longitude: number,
    public readonly ownerId: string,
    public readonly id?: string
  ) {}
}
