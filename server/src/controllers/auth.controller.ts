import { Request, Response } from "express";
import { prisma } from "@/index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Formato de correo inválido"),
  password: z.string().min(6, "La contraseña requiere al menos 6 caracteres"),
});

export const login = async (req: Request, res: Response) => {
  // 1. Zod Validation
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Datos inválidos",
      errors: result.error.format(),
    });
  }

  const { email, password } = result.data;
  const ip = req.ip;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // 2. Audit Logging (Failed Attempt - User not found)
    if (!user) {
      console.warn(
        `⚠️ ALERTA DE SEGURIDAD: Intento de login fallido. Email: ${email}, IP: ${ip}`
      );
      // Return generic message to prevent enumeration
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    // 3. Audit Logging (Failed Attempt - Invalid Password)
    if (!isValid) {
      console.warn(
        `⚠️ ALERTA DE SEGURIDAD: Intento de login fallido (Password incorrecto). Email: ${email}, IP: ${ip}`
      );
      return res.status(401).json({ message: "Credenciales inválidas" });
    }

    // 4. Generate Token
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "default-secret-key",
      { expiresIn: "24h" }
    );

    // 5. Set HttpOnly Cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Set to true in prod (requires HTTPS)
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/",
    });

    console.log(`✅ Login exitoso. Usuario: ${email}, IP: ${ip}`);

    // Return user info (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: "Login exitoso",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    res
      .status(500)
      .json({ error: "Error en el servidor durante el inicio de sesión" });
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  });
  res.json({ message: "Sesión cerrada correctamente" });
};
