import User from "../models/User.js";
import FriendRequest from "../models/FriendReuest.js"; // Fixed import typo: "FriendReuest" -> "FriendRequest"

// ----------------- GET RECOMMENDED USERS -----------------
export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user._id;

    const userFriends = (req.user.friends || [])
      .filter(friend => friend != null && friend._id) // Enhanced filter for nulls
      .map(f => f._id.toString()); // Ensure string IDs

    let recommendedUsers = await User.find({
      _id: { 
        $ne: currentUserId,
        $nin: userFriends
      },
      isOnboarded: true,
    }).select("-password -refreshToken");

          // Remove null or broken users (caused by manual DB delete)
    recommendedUsers = recommendedUsers.filter(u => u && u._id);

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

<<<<<<< HEAD
          // Remove null or broken users (caused by manual DB delete)
=======
>>>>>>> 62a86bc6fb2019fe93f3354046e0dc4a62a78a0a


// ----------------- GET FRIENDS -----------------
export async function getFriends(req, res) {
  try {
    const user = await User.findById(req.user._id)
      .select("friends")
      .populate("friends", "fullName profilePic nativeLanguage learningLanguage");

    // Filter null friends post-populate
    const safeFriends = (user.friends || []).filter(friend => friend != null && friend._id);

    res.status(200).json(safeFriends);
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

    const recipientFriends = (recipient.friends || []).map(f => f.toString());
    if (recipientFriends.includes(senderId)) {
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

    const friendRequest = await FriendRequest.findById(requestId)
      .populate('sender', 'fullName profilePic')
      .populate('recipient', 'fullName profilePic');
    
    if (!friendRequest) return res.status(404).json({ message: "Friend request not found" });

    if (friendRequest.recipient._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not the recipient of this request" });
    }

    if (friendRequest.status !== "pending") {
      return res.status(400).json({ message: "Request is not pending" });
    }

    friendRequest.status = "accepted";
    await friendRequest.save();

    // Use $addToSet to avoid duplicates, and ensure IDs are ObjectId
    await User.findByIdAndUpdate(friendRequest.sender._id, {
      $addToSet: { friends: friendRequest.recipient._id }
    });

    await User.findByIdAndUpdate(friendRequest.recipient._id, {
      $addToSet: { friends: friendRequest.sender._id }
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

    // Filter null senders
    const safeIncoming = incomingReqs.filter(req => req.sender != null && req.sender._id);

    const acceptedRequests = await FriendRequest.find({
      sender: req.user._id,
      status: "accepted",
    }).populate("recipient", "fullName profilePic nativeLanguage learningLanguage");

    // Filter null recipients
    const safeAccepted = acceptedRequests.filter(req => req.recipient != null && req.recipient._id);

    res.status(200).json({ incomingReqs: safeIncoming, acceptedRequests: safeAccepted });

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

    // Filter null recipients
    const safeOutgoing = outgoingRequests.filter(req => req.recipient != null && req.recipient._id);

    res.status(200).json(safeOutgoing);

  } catch (error) {
    console.error("Error in getOutgoingFriendRequests controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

// ----------------- GET USER BY ID -----------------
export async function getUserById(req, res) {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID is required' });
    }
    
    const user = await User.findById(userId)
      .select('-password -refreshToken -friends -friendRequests -createdAt -updatedAt -__v')
      .populate('friends', 'fullName profilePic'); // Optional populate with null filter
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Filter null friends if populated
    if (user.friends) {
      user.friends = user.friends.filter(friend => friend != null && friend._id);
    }

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        status: user.status || 'Offline',
        friends: user.friends || [] // Safe empty array
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
