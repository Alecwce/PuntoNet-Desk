import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
  updateProfile,
  deleteUser,
} from "../controllers/user.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

const router = Router();

router.use(authenticate); // All routes require authentication

router.post("/", authorize(["ADMIN"]), createUser);
router.get("/", authorize(["ADMIN"]), getUsers);
router.put("/:id", updateProfile); // Users can update their own profile
router.patch("/:id", authorize(["ADMIN"]), updateUser); // Admin can update any user
router.delete("/:id", authorize(["ADMIN"]), deleteUser);

export default router;
