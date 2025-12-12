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
app.disable("x-powered-by");

// Debug Middleware for CORS
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// CORS Configuration - ROBUST & CRITICAL
const allowedOrigins = [
  "https://punto-net-desk.vercel.app", // Production Vercel (Current)
  "https://puntonet-desk.vercel.app", // Production Vercel (Alternative)
  "http://localhost:5173", // Local Frontend
  "http://localhost:3000", // Local Alt
  process.env.FRONTEND_URL, // Env Variable
  process.env.CORS_ORIGIN, // Env Variable
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, postman)
      if (!origin) return callback(null, true);

      // Check if origin is allowed or matches wildcard pattern
      const isAllowed = allowedOrigins.some((allowed) => {
        if (!allowed) return false;
        if (allowed.includes("*")) {
          // Handle wildcards if present in list (e.g. *.vercel.app)
          const pattern = allowed.replace("*.", "");
          return origin.endsWith(pattern);
        }
        return origin === allowed || origin.endsWith(".vercel.app"); // Explicit vercel subdomain support
      });

      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS blocked origin: ${origin}`);
        callback(null, false);
        // callback(new Error("Not allowed by CORS")); // Don't crash, just block
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400, // 24 hours
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
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date(),
    cors_origins: allowedOrigins,
  });
});
// Maintain compatibility with /api/health as well
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date(),
    cors_origins: allowedOrigins,
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export { app, prisma };
