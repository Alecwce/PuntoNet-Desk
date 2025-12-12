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

app.disable("x-powered-by");

// CORS Configuration (Must be first)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
  "http://localhost:5173",
  "https://punto-net-desk.vercel.app", // Fallback
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // Check if origin is allowed or is a vercel subdomain
      if (
        allowedOrigins.includes(origin) ||
        allowedOrigins.some((o) => o && origin.startsWith(o)) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        console.warn(`Blocked by CORS: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

// Handle preflight requests
app.options("*", cors());

app.use(helmet());
app.use(cookieParser());
app.use(express.json());

// Serve static files from uploads directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/kb", kbRoutes);
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/reports", reportsRoutes);

// Basic health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date() });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { app, prisma };
