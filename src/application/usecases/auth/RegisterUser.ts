import { User, UserRole } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IHashService } from "../../../domain/services/IHashService";
import { AppError } from "../../../shared/errors/AppError";

type RegisterUserInput = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export class RegisterUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService
  ) {}

  async execute(input: RegisterUserInput): Promise<User> {
    const email = input.email.toLowerCase();
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) throw new AppError("Email already in use", 409);
    const passwordHash = await this.hashService.hash(input.password);
    const user = new User(input.name, email, passwordHash, input.role);
    return this.userRepository.create(user);
  }
}
