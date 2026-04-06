import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IHashService } from "../../../domain/services/IHashService";
import { ITokenService } from "../../../domain/services/ITokenService";
import { AppError } from "../../../shared/errors/AppError";

type LoginUserInput = {
  email: string;
  password: string;
};

export class LoginUser {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService,
    private readonly tokenService: ITokenService
  ) {}

  async execute(input: LoginUserInput): Promise<{ token: string }> {
    const user = await this.userRepository.findByEmail(input.email.toLowerCase());
    if (!user) throw new AppError("Invalid credentials", 401);
    const isValid = await this.hashService.compare(
      input.password,
      user.passwordHash
    );
    if (!isValid) throw new AppError("Invalid credentials", 401);
    return { token: this.tokenService.sign({ id: user.id!, role: user.role }) };
  }
}
