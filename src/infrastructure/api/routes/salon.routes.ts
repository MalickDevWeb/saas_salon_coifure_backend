import { Router } from "express";
import { SalonController } from "../../../interfaces/controllers/SalonController";

export const buildSalonRouter = (controller: SalonController): Router => {
  const router = Router();
  router.get("/", controller.list);
  router.get("/nearby", controller.nearby);
  return router;
};
