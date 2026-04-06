import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { prisma } from "../prisma/client";

export class PrismaUserRepository implements IUserRepository {
  async create(user: User): Promise<User> {
    const createdUser = await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        role: user.role
      }
    });
    return new User(
      createdUser.name,
      createdUser.email,
      createdUser.passwordHash,
      createdUser.role,
      createdUser.id
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    return new User(user.name, user.email, user.passwordHash, user.role, user.id);
  }

  async findById(id: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    return new User(user.name, user.email, user.passwordHash, user.role, user.id);
  }
}
