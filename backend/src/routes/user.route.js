import express from "express";;
import { protectRoute } from "../middleware/auth.middleware.js";



import { 
  getRecommendedUsers, 
  getFriends, 
  sendFriendRequest, 
  acceptFriendRequest, 
  getFriendRequests, 
  getOutgoingFriendRequests,
  getUserById  
} from "../controllers/user.controller.js";
const router = express.Router();



//apply auth middleware to all route
router.use(protectRoute);
router.get("/", getRecommendedUsers);

router.get("/friends", getFriends);

router.post("/friend-request/:id",sendFriendRequest);

router.put("/friend-requests/:id/accept",  acceptFriendRequest);

router.get("/friend-requests",  getFriendRequests);

router.get("/outgoing-friend-requests",  getOutgoingFriendRequests);

router.get("/:id", getUserById);


export default router
