import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

// Resolve __dirname for ES modules
const __dirname = path.resolve();

// Load environment variables from .env
dotenv.config({ path: path.join(__dirname, ".env") });

// Import routes and DB
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";
import { connectToDB } from "./lib/db.js";



// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // change if frontend URL changes
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

<<<<<<< HEAD
// Serve frontend in production
=======


>>>>>>> 46c7800d3da610e6199119a1f156ba4e0b21f697
if (process.env.NODE_ENV === "production") {
  const frontendDistPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendDistPath));

  // For SPA routing
  app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) return next();
    res.sendFile(path.join(frontendDistPath, "index.html"));
  });
}

// Start server and connect to DB
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
<<<<<<< HEAD
  
  try {
    await connectToDB();
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
=======
  connectToDB();
>>>>>>> 46c7800d3da610e6199119a1f156ba4e0b21f697
});
