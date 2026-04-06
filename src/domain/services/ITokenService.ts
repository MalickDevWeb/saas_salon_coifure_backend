import { UserRole } from "../entities/User";

export type AuthPayload = {
  id: string;
  role: UserRole;
};

export interface ITokenService {
  sign(payload: AuthPayload): string;
  verify(token: string): AuthPayload;
}
