import { Router } from "express";
import { ProductController } from "../../../interfaces/controllers/ProductController";

export const buildProductRouter = (controller: ProductController): Router => {
  const router = Router();
  router.get("/", controller.list);
  return router;
};
