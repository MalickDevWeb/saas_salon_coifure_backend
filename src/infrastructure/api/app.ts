import cors from "cors";
import express from "express";
import { GetCurrentUser } from "../../application/usecases/auth/GetCurrentUser";
import { LoginUser } from "../../application/usecases/auth/LoginUser";
import { RegisterUser } from "../../application/usecases/auth/RegisterUser";
import { CreateBooking } from "../../application/usecases/booking/CreateBooking";
import { ListUserBookings } from "../../application/usecases/booking/ListUserBookings";
import { CreateOrder } from "../../application/usecases/order/CreateOrder";
import { ListUserOrders } from "../../application/usecases/order/ListUserOrders";
import { CreateProduct } from "../../application/usecases/product/CreateProduct";
import { ListProducts } from "../../application/usecases/product/ListProducts";
import { CreateSalon } from "../../application/usecases/salon/CreateSalon";
import { CreateService } from "../../application/usecases/salon/CreateService";
import { GetOwnerSalon } from "../../application/usecases/salon/GetOwnerSalon";
import { GetNearbySalons } from "../../application/usecases/salon/GetNearbySalons";
import { ListSalons } from "../../application/usecases/salon/ListSalons";
import { ListOwnerBookings } from "../../application/usecases/salon/ListOwnerBookings";
import { IProductRepository } from "../../domain/repositories/IProductRepository";
import { ISalonRepository } from "../../domain/repositories/ISalonRepository";
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
import { buildServiceRouter } from "./routes/service.routes";
import { AuthController } from "../../interfaces/controllers/AuthController";
import { BookingController } from "../../interfaces/controllers/BookingController";
import { OrderController } from "../../interfaces/controllers/OrderController";
import { ProductController } from "../../interfaces/controllers/ProductController";
import { SalonController } from "../../interfaces/controllers/SalonController";
import { ServiceController } from "../../interfaces/controllers/ServiceController";

export const buildApp = () => {
  const app = express();
  const userRepository = new PrismaUserRepository();
  const salonRepository: ISalonRepository = new PrismaSalonRepository();
  const bookingRepository = new PrismaBookingRepository();
  const productRepository: IProductRepository = new PrismaProductRepository();
  const orderRepository = new PrismaOrderRepository();
  const hashService = new BcryptHashService();
  const tokenService = new JwtTokenService(process.env.JWT_SECRET ?? "change-me");
  const authController = new AuthController(
    new RegisterUser(userRepository, hashService),
    new LoginUser(userRepository, hashService, tokenService),
    new GetCurrentUser(userRepository)
  );
  const salonController = new SalonController(
    new ListSalons(salonRepository),
    new GetNearbySalons(salonRepository),
    new CreateSalon(salonRepository),
    new GetOwnerSalon(salonRepository),
    new ListOwnerBookings(salonRepository)
  );
  const serviceController = new ServiceController(
    new CreateService(salonRepository)
  );
  const bookingController = new BookingController(
    new CreateBooking(bookingRepository, salonRepository),
    new ListUserBookings(bookingRepository)
  );
  const productController = new ProductController(
    new ListProducts(productRepository),
    new CreateProduct(productRepository)
  );
  const orderController = new OrderController(
    new CreateOrder(productRepository, orderRepository),
    new ListUserOrders(orderRepository)
  );
  app.use(cors());
  app.use(express.json());
  app.get("/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api/auth", buildAuthRouter(authController, tokenService));
  app.use("/api/salons", buildSalonRouter(salonController, tokenService));
  app.use("/api/services", buildServiceRouter(serviceController, tokenService));
  app.use("/api/bookings", buildBookingRouter(bookingController, tokenService));
  app.use("/api/products", buildProductRouter(productController, tokenService));
  app.use("/api/orders", buildOrderRouter(orderController, tokenService));
  app.use(errorMiddleware);
  return app;
};
