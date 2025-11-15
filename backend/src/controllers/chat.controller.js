import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
  try {
    // ✅ Ensure user exists in request (protect middleware must set req.user)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    // ✅ Generate the token using user ID
    const token = generateStreamToken(req.user.id);

    // ✅ Respond with token
    res.status(200).json({ token });
  } catch (error) {
    console.error("❌ Error in getStreamToken controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
