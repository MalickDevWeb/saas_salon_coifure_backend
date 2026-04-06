export type UserRole = "CLIENT" | "SALON" | "ADMIN";

export class User {
  constructor(
    public readonly name: string,
    public readonly email: string,
    public readonly passwordHash: string,
    public readonly role: UserRole,
    public readonly id?: string
  ) {}
}
