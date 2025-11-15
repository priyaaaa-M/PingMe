import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectToDB } from "./lib/db.js";

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js";


import cors from "cors";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

//cors
app.use(cors({
    origin: 'http://localhost:5173', // Your frontend URL
    credentials: true // If you're using cookies/sessions
}));
// ✅ Middleware to parse JSON requests
app.use(express.json());

// ✅ Middleware to parse cookies
app.use(cookieParser());


connectToDB(); // ✅ Connect to MongoDB

// ✅ Register routes
app.use("/api/auth", authRoute);
app.use("/api/user",userRoute)
app.use("/api/chat",chatRoute)


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

app.get("/", (req, res) => {
  res.send("API running successfully 🚀");
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
