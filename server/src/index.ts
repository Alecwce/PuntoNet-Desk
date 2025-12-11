import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import path from "path";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

import authRoutes from "./routes/auth.routes";
import ticketRoutes from "./routes/ticket.routes";
import kbRoutes from "./routes/kb.routes";
import userRoutes from "./routes/user.routes";
import clientRoutes from "./routes/client.routes";
import reportsRoutes from "./routes/reports.routes";

app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

// Serve static files from uploads directory (Legacy support, everything now in Cloudinary)
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/kb", kbRoutes);
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/reports", reportsRoutes);

// Health check with DB status
app.get("/health", async (req, res) => {
  try {
    // Optional: Check DB connection
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      database: "connected",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: (error as any).message,
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { app, prisma };
