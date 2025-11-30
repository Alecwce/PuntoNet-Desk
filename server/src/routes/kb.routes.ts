import { Router } from "express";
import {
  getArticles,
  createArticle,
  deleteArticle,
} from "../controllers/kb.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", getArticles); // Everyone can view
router.post("/", authorize(["ADMIN", "AGENT"]), createArticle);
router.delete("/:id", authorize(["ADMIN"]), deleteArticle);

export default router;
