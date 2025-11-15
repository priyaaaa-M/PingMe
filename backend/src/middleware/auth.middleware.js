import jwt from "jsonwebtoken";
import User from "../models/User.js";



export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt; // <- must match the name used in res.cookie
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (!decodedToken) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decodedToken.userId);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
