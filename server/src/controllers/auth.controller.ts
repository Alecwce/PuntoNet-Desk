import { Request, Response } from "express";
import { prisma } from "../index";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { authenticator } from "otplib";
import * as QRCode from "qrcode";

// Configure authenticator for better security
authenticator.options = {
  digits: 6,
  step: 30, // 30 seconds window
  window: 2, // Allow 2 steps before/after for clock drift (approx 1 min)
};

const loginSchema = z.object({
  email: z.string().email("Formato de correo inválido"),
  password: z.string().min(6, "La contraseña requiere al menos 6 caracteres"),
});

const tokenSchema = z.object({
  token: z.string().length(6, "El código debe tener 6 dígitos"),
});

const validate2FASchema = z.object({
  userId: z.string().uuid("ID de usuario inválido"),
  token: z.string().length(6, "El código debe tener 6 dígitos"),
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

    // 4. Check if 2FA is enabled
    // 4. Check if 2FA is enabled
    // 4. Check if 2FA is enabled
    if (user.isTwoFactorEnabled) {
      console.log(`🔐 2FA requerido para usuario: ${email}`);
      // Return a temporary state indicating 2FA is required
      // We use a short-lived token to identify the user during 2FA validation
      const tempToken = jwt.sign(
        { userId: user.id, purpose: "2fa-validation" },
        process.env.JWT_SECRET || "default-secret-key",
        { expiresIn: "5m" } // Only 5 minutes to complete 2FA
      );

      return res.json({
        require2fa: true,
        tempToken,
        userId: user.id,
        message: "Verificación de dos factores requerida",
      });
    }

    // 5. Generate Token (No 2FA)
    const token = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "default-secret-key",
      { expiresIn: "24h" }
    );

    // 6. Set HttpOnly Cookie
    // 6. Set HttpOnly Cookie
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", token, {
      httpOnly: true,
      secure: isProduction, // True in production (HTTPS), False in dev (HTTP)
      sameSite: isProduction ? "none" : "lax", // None for cross-site in prod, Lax for local dev
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      path: "/",
    });

    console.log(`✅ Login exitoso. Usuario: ${email}, IP: ${ip}`);

    // Return user info (excluding password and 2FA secret)
    const { password: _, twoFactorSecret: __, ...userWithoutSensitive } = user;
    res.json({
      message: "Login exitoso",
      user: userWithoutSensitive,
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

// Generate 2FA secret and QR code
export const generate2FASecret = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Generate a new secret
    const secret = authenticator.generateSecret();

    // Create otpauth URL for QR code
    const serviceName = "PuntoNet Service Desk";
    const otpauthUrl = authenticator.keyuri(user.email, serviceName, secret);

    // Generate QR code as data URL
    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    // Temporarily store the secret (not yet enabled)
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: secret },
    });

    console.log(`🔐 2FA secret generado para: ${user.email}`);

    res.json({
      message: "Secreto 2FA generado exitosamente",
      qrCode: qrCodeDataUrl,
      secret: secret, // Show only during setup for manual entry
    });
  } catch (error) {
    console.error("❌ Error generating 2FA secret:", error);
    res.status(500).json({ error: "Error al generar secreto 2FA" });
  }
};

// Verify 2FA setup (activate 2FA for user)
export const verify2FASetup = async (req: Request, res: Response) => {
  const result = tokenSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Código inválido",
      errors: result.error.format(),
    });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({
        message: "Primero debes generar un secreto 2FA",
      });
    }

    const { token } = result.data;

    // Verify the token
    const isValid = authenticator.verify({
      token,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      console.warn(`⚠️ 2FA setup fallido - código incorrecto: ${user.email}`);
      return res.status(400).json({ message: "Código incorrecto" });
    }

    // Enable 2FA
    await prisma.user.update({
      where: { id: user.id },
      data: { isTwoFactorEnabled: true },
    });

    console.log(`✅ 2FA activado para: ${user.email}`);

    res.json({
      message: "Autenticación de dos factores activada exitosamente",
      isTwoFactorEnabled: true,
    });
  } catch (error) {
    console.error("❌ Error verifying 2FA setup:", error);
    res.status(500).json({ error: "Error al verificar código 2FA" });
  }
};

// Validate 2FA during login
export const validate2FALogin = async (req: Request, res: Response) => {
  const result = validate2FASchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      message: "Datos inválidos",
      errors: result.error.format(),
    });
  }

  const { userId, token } = result.data;
  const ip = req.ip;

  try {
    // Verify the temp token from headers
    const tempToken = req.headers["x-2fa-token"] as string;
    if (!tempToken) {
      return res.status(401).json({ message: "Token temporal requerido" });
    }

    try {
      const decoded = jwt.verify(
        tempToken,
        process.env.JWT_SECRET || "default-secret-key"
      ) as { userId: string; purpose: string };

      if (decoded.purpose !== "2fa-validation" || decoded.userId !== userId) {
        return res.status(401).json({ message: "Token temporal inválido" });
      }
    } catch {
      return res.status(401).json({ message: "Token temporal expirado" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || !user.twoFactorSecret) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Verify the TOTP token
    const isValid = authenticator.verify({
      token,
      secret: user.twoFactorSecret,
    });

    if (!isValid) {
      console.warn(
        `⚠️ 2FA login fallido - código incorrecto: ${user.email}, IP: ${ip}`
      );
      return res.status(401).json({ message: "Código incorrecto" });
    }

    // 2FA verified - issue final JWT
    const finalToken = jwt.sign(
      { userId: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "default-secret-key",
      { expiresIn: "24h" }
    );

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("token", finalToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });

    console.log(`✅ 2FA login exitoso: ${user.email}, IP: ${ip}`);

    const { password: _, twoFactorSecret: __, ...userWithoutSensitive } = user;
    res.json({
      message: "Login completado exitosamente",
      user: userWithoutSensitive,
    });
  } catch (error) {
    console.error("❌ Error validating 2FA login:", error);
    res.status(500).json({ error: "Error al validar código 2FA" });
  }
};

// Disable 2FA
export const disable2FA = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!user.isTwoFactorEnabled) {
      return res.status(400).json({ message: "2FA no está activo" });
    }

    // Disable 2FA and remove secret
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isTwoFactorEnabled: false,
        twoFactorSecret: null,
      },
    });

    console.log(`🔓 2FA desactivado para: ${user.email}`);

    res.json({
      message: "Autenticación de dos factores desactivada",
      isTwoFactorEnabled: false,
    });
  } catch (error) {
    console.error("❌ Error disabling 2FA:", error);
    res.status(500).json({ error: "Error al desactivar 2FA" });
  }
};

// Get current user's 2FA status
export const get2FAStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "No autorizado" });
    }

    res.json({
      isTwoFactorEnabled: req.user.isTwoFactorEnabled || false,
    });
  } catch (error) {
    console.error("❌ Error getting 2FA status:", error);
    res.status(500).json({ error: "Error al obtener estado 2FA" });
  }
};

// Emergency 2FA Reset (Protected by secret)
export const emergencyReset2FA = async (req: Request, res: Response) => {
  const { secret } = req.query;
  const email = "admin@puntonet.com";

  if (secret !== "puntonet2024recovery") {
    return res
      .status(403)
      .json({ message: "Forbidden: Invalid recovery secret" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Admin user not found" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isTwoFactorEnabled: false, twoFactorSecret: null },
    });

    console.log(
      `🚨 Emergency 2FA reset performed for ${email} by IP ${req.ip}`
    );
    res.json({
      message:
        "Admin 2FA has been reset successfully. Please login immediately.",
    });
  } catch (error) {
    console.error("Emergency reset error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
