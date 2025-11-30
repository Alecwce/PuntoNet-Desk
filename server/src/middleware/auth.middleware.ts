import { Request, Response, NextFunction } from "express";
import { prisma } from "../index";

// Extend Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // For this MVP/Demo, we are skipping real JWT verification
  // In a real app, we would verify the token from req.headers.authorization

  // Simulating a logged-in user (e.g., Admin) for testing purposes
  // You can change this email to test different roles
  const demoEmail = "admin@puntonet.com";

  try {
    const user = await prisma.user.findUnique({ where: { email: demoEmail } });
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: Insufficient permissions" });
    }

    next();
  };
};
