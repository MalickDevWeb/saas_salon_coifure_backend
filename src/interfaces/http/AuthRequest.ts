import { Request } from "express";
import { AuthPayload } from "../../domain/services/ITokenService";

export interface AuthRequest extends Request {
  user?: AuthPayload;
}
