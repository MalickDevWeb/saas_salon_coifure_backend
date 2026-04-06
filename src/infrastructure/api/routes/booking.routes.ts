import { Router } from "express";
import { ITokenService } from "../../../domain/services/ITokenService";
import { BookingController } from "../../../interfaces/controllers/BookingController";
import { authMiddleware } from "../middlewares/auth.middleware";

export const buildBookingRouter = (
  controller: BookingController,
  tokenService: ITokenService
): Router => {
  const router = Router();
  router.use(authMiddleware(tokenService));
  router.get("/me", controller.listMine);
  router.post("/", controller.create);
  return router;
};
