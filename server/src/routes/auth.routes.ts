import { Router } from "express";
import { loginLimiter } from "../middleware/rateLimit.middleware";
import { authenticate } from "../middleware/auth.middleware";
import {
  login,
  logout,
  generate2FASecret,
  verify2FASetup,
  validate2FALogin,
  disable2FA,
  get2FAStatus,
} from "../controllers/auth.controller";

const router = Router();

// Public routes
router.post("/login", loginLimiter, login);
router.post("/logout", logout);

// 2FA validation during login (requires temp token, not full auth)
router.post("/2fa/validate-login", validate2FALogin);

// Protected 2FA management routes
router.get("/2fa/status", authenticate, get2FAStatus);
router.post("/2fa/generate", authenticate, generate2FASecret);
router.post("/2fa/verify", authenticate, verify2FASetup);
router.post("/2fa/disable", authenticate, disable2FA);

export default router;
