import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Increased limit to 20 for recovery/testing
  message: {
    message:
      "Demasiados intentos de inicio de sesión, por favor intente de nuevo en 15 minutos",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  validate: { trustProxy: false }, // Trust proxy handled in app.ts
});
