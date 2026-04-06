export class Product {
  constructor(
    public readonly salonId: string,
    public readonly name: string,
    public readonly price: number,
    public readonly stock: number,
    public readonly isActive = true,
    public readonly id?: string
  ) {}
}
