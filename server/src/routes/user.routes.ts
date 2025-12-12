import { Router } from "express";
import {
  createUser,
  getUsers,
  updateUser,
  updateProfile,
  deleteUser,
} from "../controllers/user.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";

import { validateResource } from "../middleware/validate.middleware";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";

const router = Router();

router.use(authenticate); // All routes require authentication

router.post(
  "/",
  authorize(["ADMIN"]),
  validateResource(createUserSchema),
  createUser
);
router.get("/", authorize(["ADMIN"]), getUsers);
router.put("/:id", validateResource(updateUserSchema), updateProfile); // Users can update their own profile
router.patch(
  "/:id",
  authorize(["ADMIN"]),
  validateResource(updateUserSchema),
  updateUser
); // Admin can update any user
router.delete("/:id", authorize(["ADMIN"]), deleteUser);

export default router;
