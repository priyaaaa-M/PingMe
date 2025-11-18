import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectToDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT;
const __dirname = path.resolve();

// ----------------------
// ⭐ Content-Security-Policy FIX
// ----------------------
app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; " + 
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pingme-pre6.onrender.com https://cdn.jsdelivr.net; " +
    "img-src 'self' data: https://pingme-pre6.onrender.com https://cdn.jsdelivr.net; " +
    "connect-src 'self' https://pingme-pre6.onrender.com; " +
    "style-src 'self' 'unsafe-inline'; " +
    "frame-src 'self' https://pingme-pre6.onrender.com;"
  );
  next();
});


// ----------------------
// CORS
// ----------------------
app.use(
  cors({
    origin: ["http://localhost:5173", "https://pingme-pre6.onrender.com"],
    credentials: true,
  })
);

// ----------------------
// Middleware
// ----------------------
app.use(express.json());
app.use(cookieParser());

// ----------------------
// API Routes
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

// ----------------------
// Production — Serve React
// ----------------------
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../frontend/dist");

  // Serve static frontend files
  app.use(express.static(frontendDistPath));

  // Handle SPA routing (but skip API)
  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// ----------------------
// Start server
// ----------------------
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectToDB();
});
