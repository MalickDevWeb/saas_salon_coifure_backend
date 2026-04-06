import bcrypt from "bcryptjs";
import { IHashService } from "../../domain/services/IHashService";

export class BcryptHashService implements IHashService {
  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, 10);
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    return bcrypt.compare(value, hashedValue);
  }
}
