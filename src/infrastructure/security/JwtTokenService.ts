import jwt from "jsonwebtoken";
import {
  AuthPayload,
  ITokenService
} from "../../domain/services/ITokenService";

export class JwtTokenService implements ITokenService {
  constructor(private readonly secret: string) {}

  sign(payload: AuthPayload): string {
    return jwt.sign(payload, this.secret, { expiresIn: "7d" });
  }

  verify(token: string): AuthPayload {
    return jwt.verify(token, this.secret) as AuthPayload;
  }
}
