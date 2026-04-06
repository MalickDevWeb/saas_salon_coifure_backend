import cors from "cors";
import express from "express";
import { LoginUser } from "../../application/usecases/auth/LoginUser";
import { RegisterUser } from "../../application/usecases/auth/RegisterUser";
import { CreateBooking } from "../../application/usecases/booking/CreateBooking";
import { ListUserBookings } from "../../application/usecases/booking/ListUserBookings";
import { CreateOrder } from "../../application/usecases/order/CreateOrder";
import { ListUserOrders } from "../../application/usecases/order/ListUserOrders";
import { ListProducts } from "../../application/usecases/product/ListProducts";
import { GetNearbySalons } from "../../application/usecases/salon/GetNearbySalons";
import { ListSalons } from "../../application/usecases/salon/ListSalons";
import { PrismaBookingRepository } from "../database/repositories/PrismaBookingRepository";
import { PrismaOrderRepository } from "../database/repositories/PrismaOrderRepository";
import { PrismaProductRepository } from "../database/repositories/PrismaProductRepository";
import { PrismaSalonRepository } from "../database/repositories/PrismaSalonRepository";
import { PrismaUserRepository } from "../database/repositories/PrismaUserRepository";
import { BcryptHashService } from "../security/BcryptHashService";
import { JwtTokenService } from "../security/JwtTokenService";
import { errorMiddleware } from "./middlewares/error.middleware";
import { buildAuthRouter } from "./routes/auth.routes";
import { buildBookingRouter } from "./routes/booking.routes";
import { buildOrderRouter } from "./routes/order.routes";
import { buildProductRouter } from "./routes/product.routes";
import { buildSalonRouter } from "./routes/salon.routes";
import { AuthController } from "../../interfaces/controllers/AuthController";
import { BookingController } from "../../interfaces/controllers/BookingController";
import { OrderController } from "../../interfaces/controllers/OrderController";
import { ProductController } from "../../interfaces/controllers/ProductController";
import { SalonController } from "../../interfaces/controllers/SalonController";

export const buildApp = () => {
  const app = express();
  const userRepository = new PrismaUserRepository();
  const salonRepository = new PrismaSalonRepository();
  const bookingRepository = new PrismaBookingRepository();
  const productRepository = new PrismaProductRepository();
  const orderRepository = new PrismaOrderRepository();
  const hashService = new BcryptHashService();
  const tokenService = new JwtTokenService(process.env.JWT_SECRET ?? "change-me");
  const authController = new AuthController(
    new RegisterUser(userRepository, hashService),
    new LoginUser(userRepository, hashService, tokenService)
  );
  const salonController = new SalonController(
    new ListSalons(salonRepository),
    new GetNearbySalons(salonRepository)
  );
  const bookingController = new BookingController(
    new CreateBooking(bookingRepository, salonRepository),
    new ListUserBookings(bookingRepository)
  );
  const productController = new ProductController(
    new ListProducts(productRepository)
  );
  const orderController = new OrderController(
    new CreateOrder(productRepository, orderRepository),
    new ListUserOrders(orderRepository)
  );
  app.use(cors());
  app.use(express.json());
  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api/auth", buildAuthRouter(authController));
  app.use("/api/salons", buildSalonRouter(salonController));
  app.use("/api/bookings", buildBookingRouter(bookingController, tokenService));
  app.use("/api/products", buildProductRouter(productController));
  app.use("/api/orders", buildOrderRouter(orderController, tokenService));
  app.use(errorMiddleware);
  return app;
};
