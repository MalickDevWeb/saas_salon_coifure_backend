import { Router } from "express";
import { ITokenService } from "../../../domain/services/ITokenService";
import { ServiceController } from "../../../interfaces/controllers/ServiceController";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

export const buildServiceRouter = (
  controller: ServiceController,
  tokenService: ITokenService
): Router => {
  const router = Router();
  router.post(
    "/",
    authMiddleware(tokenService),
    roleMiddleware("SALON", "ADMIN"),
    controller.create
  );
  return router;
};
