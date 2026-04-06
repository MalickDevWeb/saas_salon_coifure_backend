import { NextFunction, Response } from "express";
import { ITokenService } from "../../../domain/services/ITokenService";
import { AuthRequest } from "../../../interfaces/http/AuthRequest";

export const authMiddleware =
  (tokenService: ITokenService) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Unauthorized" });
    try {
      req.user = tokenService.verify(token);
      next();
    } catch {
      res.status(401).json({ message: "Invalid token" });
    }
  };
