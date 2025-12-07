import { Router } from "express";
import {
  getArticles,
  createArticle,
  deleteArticle,
  getArticleById,
  updateArticle,
  incrementViews,
} from "../controllers/kb.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate);

router.get("/", getArticles); // Everyone can view
router.get("/:id", getArticleById); // Get single article
router.post("/", authorize(["ADMIN", "AGENT"]), createArticle);
router.put("/:id", authorize(["ADMIN", "AGENT"]), updateArticle);
router.patch("/:id/view", incrementViews); // Track views
router.delete("/:id", authorize(["ADMIN"]), deleteArticle);

export default router;
