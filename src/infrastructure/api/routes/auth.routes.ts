import { Router } from "express";
import { AuthController } from "../../../interfaces/controllers/AuthController";

export const buildAuthRouter = (controller: AuthController): Router => {
  const router = Router();
  router.post("/register", controller.register);
  router.post("/login", controller.login);
  return router;
};
