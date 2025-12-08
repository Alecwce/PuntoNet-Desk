import { Router } from "express";
import { loginLimiter } from "../middleware/rateLimit.middleware";
import { login, logout } from "../controllers/auth.controller";

const router = Router();

router.post("/login", loginLimiter, login);
router.post("/logout", logout);

export default router;
