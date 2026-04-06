import { Router } from "express";
import { ITokenService } from "../../../domain/services/ITokenService";
import { AuthController } from "../../../interfaces/controllers/AuthController";
import { authMiddleware } from "../middlewares/auth.middleware";

export const buildAuthRouter = (
  controller: AuthController,
  tokenService: ITokenService
): Router => {
  const router = Router();
  router.post("/register", controller.register);
  router.post("/login", controller.login);
  router.get("/me", authMiddleware(tokenService), controller.me);
  return router;
};
