import { Router } from "express";
import { ITokenService } from "../../../domain/services/ITokenService";
import { OrderController } from "../../../interfaces/controllers/OrderController";
import { authMiddleware } from "../middlewares/auth.middleware";

export const buildOrderRouter = (
  controller: OrderController,
  tokenService: ITokenService
): Router => {
  const router = Router();
  router.use(authMiddleware(tokenService));
  router.get("/me", controller.listMine);
  router.post("/", controller.create);
  return router;
};
