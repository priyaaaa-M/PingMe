import User from "../models/User.js";
import FriendRequest from "../models/FriendReuest.js";

// ----------------- GET RECOMMENDED USERS -----------------
export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user._id;

    const userFriends = (req.user.friends || []).map(f => f.toString());

    const recommendedUsers = await User.find({
      _id: { 
        $ne: currentUserId,
        $nin: userFriends
      },
      isOnboarded: true,
    }).select("-password -refreshToken");

    res.status(200).json({
      success: true,
      count: recommendedUsers.length,
      users: recommendedUsers,
    });

  } catch (error) {
    console.error("Error in getRecommendedUsers controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// ----------------- GET FRIENDS -----------------
export async function getFriends(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getFriends controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// ----------------- SEND FRIEND REQUEST -----------------
export async function sendFriendRequest(req, res) {
  try {
    const senderId = req.user._id.toString();
    const { id: recipientId } = req.params;

    if (senderId === recipientId) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) return res.status(404).json({ message: "User not found" });

    if ((recipient.friends || []).includes(senderId)) {
      return res.status(400).json({ message: "You are already friends" });
    }

    const existingReq = await FriendRequest.findOne({
      sender: senderId,
      recipient: recipientId,
      status: "pending",
    });

    if (existingReq) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    await new FriendRequest({ sender: senderId, recipient: recipientId }).save();

    res.status(200).json({ message: "Friend request sent successfully" });

  } catch (error) {
    console.error("Error in sendFriendRequest controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// ----------------- ACCEPT FRIEND REQUEST -----------------
export async function acceptFriendRequest(req, res) {
  try {
    const { requestId } = req.body;
    if (!requestId) {
      return res.status(400).json({ message: "Request ID is required" });
    }

    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) return res.status(404).json({ message: "Friend request not found" });

    if (friendRequest.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not the recipient of this request" });
    }

    if (friendRequest.status !== "pending") {
      return res.status(400).json({ message: "Request is not pending" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient }
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender }
    });

    res.status(200).json({ message: "Friend request accepted successfully" });

  } catch (error) {
    console.error("Error in acceptFriendRequest controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// ----------------- GET INCOMING + ACCEPTED REQUESTS -----------------
export async function getFriendRequests(req, res) {
  try {
    const incomingReqs = await FriendRequest.find({
      recipient: req.user._id,
      status: "pending",
    }).populate("sender", "fullName profilePic nativeLanguage learningLanguage");

    const acceptedRequest = await FriendRequest.find({
      sender: req.user._id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json({ incomingReqs, acceptedRequest });

  } catch (error) {
    console.error("Error in getFriendRequests controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// ----------------- GET OUTGOING REQUESTS -----------------
export async function getOutgoingFriendRequests(req, res) {
  try {
    const outgoingRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "pending",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    res.status(200).json(outgoingRequests);

  } catch (error) {
    console.error("Error in getOutgoingFriendRequests controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}


// Add this new function to your user.controller.js
export async function getUserById(req, res) {
  try {
    const { userId } = req.params;
    
    const user = await User.findById(userId)
      .select('-password -refreshToken -friends -friendRequests -createdAt -updatedAt -__v');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        status: user.status || 'Offline'
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
}
