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

// Route imports
import authRoutes from "./routes/auth.routes";
import ticketRoutes from "./routes/ticket.routes";
import kbRoutes from "./routes/kb.routes";
import userRoutes from "./routes/user.routes";
import clientRoutes from "./routes/client.routes";
import reportsRoutes from "./routes/reports.routes";

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 1️⃣ CORS CONFIGURATION - DEBE IR PRIMERO
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const allowedOrigins = [
  "https://punto-net-desk.vercel.app", // ⚠️ VERCEL FRONTEND (con guiones)
  "https://puntonet-desk.vercel.app", // Alternativa sin guiones
  "http://localhost:5173", // Desarrollo local
  "http://localhost:3000", // Alternativa local
  process.env.FRONTEND_URL, // Variable de entorno
  process.env.CORS_ORIGIN, // Variable alternativa
].filter(Boolean) as string[];

console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
console.log("🔒 CORS Configuration:");
console.log("   Allowed Origins:", allowedOrigins);
console.log("   NODE_ENV:", process.env.NODE_ENV);
console.log("   PORT:", port);
console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

app.use(
  cors({
    origin: function (origin, callback) {
      console.log(`📨 Request from origin: ${origin || "no-origin"}`);

      // Permitir requests sin origin (Postman, apps móviles, curl, etc)
      if (!origin) {
        console.log("✅ Allowing request without origin");
        return callback(null, true);
      }

      // Verificar si está en la lista permitida
      const isAllowed = allowedOrigins.some((allowed) => {
        if (allowed && allowed.includes("*")) {
          // Manejo de wildcards
          const pattern = allowed.replace("*.", "");
          return origin.endsWith(pattern);
        }
        return origin === allowed;
      });

      // También permitir cualquier subdominio de vercel.app
      const isVercelSubdomain = origin.endsWith(".vercel.app");

      if (isAllowed || isVercelSubdomain) {
        console.log(`✅ CORS allowed for: ${origin}`);
        callback(null, true);
      } else {
        console.warn(`🚫 CORS BLOCKED: ${origin}`);
        console.warn(`   Allowed origins:`, allowedOrigins);
        // En lugar de lanzar error, permitiremos pero logueamos
        // callback(new Error("Not allowed by CORS"));
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
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 2️⃣ HELMET Y OTROS HEADERS (DESPUÉS DE CORS)
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.disable("x-powered-by");
app.use(helmet());
app.use(cookieParser());

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// 3️⃣ BODY PARSERS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
// 6️⃣ HEALTH CHECK (antes de auth para verificar que funciona)
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
