import { Router } from "express";
import { ITokenService } from "../../../domain/services/ITokenService";
import { SalonController } from "../../../interfaces/controllers/SalonController";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

export const buildSalonRouter = (
  controller: SalonController,
  tokenService: ITokenService
): Router => {
  const router = Router();
  router.get("/", controller.list);
  router.get("/nearby", controller.nearby);
  router.post(
    "/",
    authMiddleware(tokenService),
    roleMiddleware("SALON", "ADMIN"),
    controller.create
  );
  router.get(
    "/me",
    authMiddleware(tokenService),
    roleMiddleware("SALON", "ADMIN"),
    controller.me
  );
  router.get(
    "/me/bookings",
    authMiddleware(tokenService),
    roleMiddleware("SALON", "ADMIN"),
    controller.ownerBookings
  );
  return router;
};
