import { Router } from "express";
import { prisma } from "../index";
import { authenticate } from "../middleware/auth.middleware";

const router = Router();

router.get("/", authenticate, async (req, res) => {
  const { q } = req.query;
  if (!q || typeof q !== "string") {
    return res.json({ tickets: [], clients: [] });
  }

  try {
    const [tickets, clients] = await prisma.$transaction([
      prisma.ticket.findMany({
        where: {
          OR: [
            { subject: { contains: q, mode: "insensitive" } },
            { description: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: {
          id: true,
          subject: true,
          status: true,
        },
      }),
      prisma.user.findMany({
        where: {
          role: "CLIENT",
          OR: [
            { name: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
        },
      }),
    ]);

    res.json({ tickets, clients });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ message: "Error performing search" });
  }
});

export default router;
