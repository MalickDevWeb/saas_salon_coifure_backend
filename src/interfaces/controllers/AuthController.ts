import { NextFunction, Request, Response } from "express";
import { LoginUser } from "../../application/usecases/auth/LoginUser";
import { RegisterUser } from "../../application/usecases/auth/RegisterUser";
import { AppError } from "../../shared/errors/AppError";

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly loginUser: LoginUser
  ) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, role } = req.body;
      const allowedRoles = ["CLIENT", "SALON", "ADMIN"];
      if (!name || !email || !password || !role) {
        throw new AppError("name, email, password and role are required", 422);
      }
      if (!allowedRoles.includes(role)) {
        throw new AppError("role must be CLIENT, SALON or ADMIN", 422);
      }
      const user = await this.registerUser.execute({ name, email, password, role });
      res.status(201).json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) throw new AppError("email and password required", 422);
      const result = await this.loginUser.execute({ email, password });
      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
