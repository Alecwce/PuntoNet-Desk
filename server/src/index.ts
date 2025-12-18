import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import path from "path";
import csurf from "csurf";

dotenv.config();

const app = express();
// Enable trust proxy for Vercel/Railway
app.set("trust proxy", 1);

const prisma = new PrismaClient();
const port = process.env.PORT || 3001;

// Route imports
import authRoutes from "./routes/auth.routes";
import ticketRoutes from "./routes/ticket.routes";
import kbRoutes from "./routes/kb.routes";
import userRoutes from "./routes/user.routes";
import clientRoutes from "./routes/client.routes";
import reportsRoutes from "./routes/reports.routes";
import searchRoutes from "./routes/search.routes";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1️⃣ CORS CONFIGURATION - DEBE IR PRIMERO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const getAllowedOrigins = (): string[] => {
  const envOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
    : [];

  const defaultOrigins = [
    "https://punto-net-desk.vercel.app",
    "https://puntonet-desk.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
  ];

  const uniqueOrigins = [
    ...new Set([...envOrigins, ...defaultOrigins, process.env.FRONTEND_URL]),
  ].filter(Boolean) as string[];
  return uniqueOrigins;
};

const allowedOrigins = getAllowedOrigins();

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🔒 CORS Configuration:");
console.log("   Allowed Origins:", allowedOrigins);
console.log("   NODE_ENV:", process.env.NODE_ENV);
console.log("   PORT:", port);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        return callback(null, true);
      }

      // Check against whitelist
      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed.includes("*")) {
          const pattern = allowed.replace("*.", "");
          return origin.endsWith(pattern);
        }
        return origin === allowed;
      });

      // Explicitly allow any vercel.app subdomain (common for preview deployments)
      // Using Regex for safer matching
      const isVercelSubdomain = /https:\/\/.*\.vercel\.app$/.test(origin);

      if (isAllowed || isVercelSubdomain) {
        callback(null, true);
      } else {
        console.warn(`🚫 CORS BLOCKED: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
      "CSRF-Token",
      "X-CSRF-Token",
      "x-2fa-token",
      "Access-Control-Allow-Headers",
      "Access-Control-Request-Headers",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 600, // Reduced maxAge to 10 mins for easier debugging
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// Explicitly handle preflight for all routes
app.options("*", cors());

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2️⃣ HELMET & PARSERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.disable("x-powered-by");
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3️⃣ CSRF PROTECTION (After cookie parser)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Secure in prod
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // None for cross-site (Vercel->Railway)
  },
});

// Apply CSRF protection selectively (exclude auth routes)
// Auth routes are protected by rate limiting instead
// Apply CSRF protection to all routes
app.use((req, res, next) => {
  csrfProtection(req, res, next);
});

// CSRF Token Endpoint
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 4️⃣ LOGGING MIDDLEWARE
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.path} - Origin: ${req.headers.origin || "none"}`
  );
  next();
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 5️⃣ STATIC FILES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 6️⃣ HEALTH CHECK
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    cors_origins: allowedOrigins,
    node_env: process.env.NODE_ENV,
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    cors_origins: allowedOrigins,
    node_env: process.env.NODE_ENV,
  });
});

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 7️⃣ API ROUTES
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/kb", kbRoutes);
app.use("/api/users", userRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/search", searchRoutes);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 8️⃣ ERROR HANDLING
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (err.code === "EBADCSRFTOKEN") {
      console.warn("🚫 CSRF Attack detected:", req.ip);
      return res.status(403).json({ error: "Invalid CSRF Token" });
    }
    console.error("❌ Error:", err.message);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 9️⃣ START SERVER
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.listen(Number(port), "0.0.0.0", () => {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📍 Health check: http://0.0.0.0:${port}/health`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
});

export { app, prisma };
