import { Router } from "express";
import { getTemplates, getTemplate } from "../controllers/templates.controller";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

// All template routes require authentication
router.use(authenticate);

router.get("/", getTemplates);
router.get("/:id", getTemplate);

export default router;
