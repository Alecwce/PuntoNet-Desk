import { Router } from "express";
import { prisma } from "../index";
import bcrypt from "bcryptjs";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("🔐 Login attempt:", email);

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("✅ User found:", user.email);
    console.log("🔑 Comparing password...");

    const isValid = await bcrypt.compare(password, user.password);
    console.log("🔑 Password valid:", isValid);

    if (!isValid) {
      console.log("❌ Invalid password");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("✅ Login successful");
    res.json({ user, token: "fake-jwt-token" });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

export default router;
