import { Request, Response, NextFunction } from "express";
import { prisma } from "../index";
import { User, Role } from "@prisma/client";
import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  role: Role;
  email: string;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "No autorizado - Token no encontrado" });
    }

    // Verify token
    if (!process.env.JWT_SECRET) {
      console.error("CRITICAL: JWT_SECRET not defined");
      return res.status(500).json({ error: "Internal Server Error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as TokenPayload;

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Token inválido" });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ message: "Usuario no encontrado" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Sesión inválida o expirada" });
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
