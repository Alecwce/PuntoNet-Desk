import { Router } from "express";
import { prisma } from "../index";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    // TODO: Implement real password hashing and JWT
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    res.json({ user, token: "fake-jwt-token" });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
