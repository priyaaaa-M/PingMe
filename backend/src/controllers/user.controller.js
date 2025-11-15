import User from "../models/User.js";

export async function getRecommendedUsers(req, res) {
  try {
    const currentUserId = req.user._id;
    const currentUser = req.user;

    // Ensure friends array exists
    const userFriends = currentUser.friends || [];

    const recommendedUsers = await User.find({
      _id: { $ne: currentUserId }, // exclude self
      friends: { $nin: userFriends }, // exclude existing friends
    });

    res.status(200).json({
      success: true,
      count: recommendedUsers.length,
      users: recommendedUsers,
    });
  } catch (error) {
    console.error("Error in getRecommendedUser controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}




export async function getFriends(req,res){
     try{
          const user = await User.findById(req.user.id)
            .select("friends")
            .populate("friends","FullName profilepic nativeLanguage learningLanguage");
            res.status(200).json(user.friends);
           
      


     }catch(error){
          console.error("Error in getFriends controller:", error.message);
          res.status(500).json({ message: "Internal Server Error" });
     }
}






export async function sendFriendRequest(req, res) {
  try {
    const myId = req.user._id.toString();
    const { id: recipientId } = req.params;

    // Prevent sending request to yourself
    if (myId === recipientId) {
      return res.status(400).json({ message: "You cannot send a friend request to yourself" });
    }

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already friends
    const isFriend = (recipient.friends || []).includes(myId);
    if (isFriend) {
      return res.status(400).json({ message: "You are already friends" });
    }

    // Check if friend request already exists
    const existingRequest = await FriendRequest.findOne({
      sender: myId,
      recipient: recipientId,
      status: "pending",
    });
    if (existingRequest) {
      return res.status(400).json({ message: "Friend request already sent" });
    }

    // Create new friend request
    const friendRequest = new FriendRequest({
      sender: myId,
      recipient: recipientId,
    });
    await friendRequest.save();

    res.status(200).json({ message: "Friend request sent successfully" });
  } catch (error) {
    console.error("Error in sendFriendRequest controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}





export async function acceptFriendRequest(req, res) {
  try {
    const { id: requestId } = req.params;

    // Find the friend request
    const friendRequest = await FriendRequest.findById(requestId);
    if (!friendRequest) {
      return res.status(404).json({ message: "Friend request not found" });
    }

    // Verify current user is the recipient
    if (friendRequest.recipient.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You are not the recipient of this friend request" });
    }

    // Check if request is pending
    if (friendRequest.status !== "pending") {
      return res.status(400).json({ message: "Friend request is not pending" });
    }

    // Update request status
    friendRequest.status = "accepted";
    await friendRequest.save();

    // Add each user to the other's friends array
    await User.findByIdAndUpdate(friendRequest.sender, {
      $addToSet: { friends: friendRequest.recipient },
    });

    await User.findByIdAndUpdate(friendRequest.recipient, {
      $addToSet: { friends: friendRequest.sender },
    });

    // ✅ Success response
    res.status(200).json({ message: "Friend request accepted successfully" });
  } catch (error) {
    console.error("Error in acceptFriendRequest controller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}



export async function getFriendRequests(req,res){
    try{
         const incomingReqs = await FriendRequest.find({
              recipient:req.user.id,
              status:"pending",


         }).populate("sender","FullName profilepic nativeLanguage learningLanguage");

             const acceptedRequest = await FriendRequest.find({
                  sender:req.user.id,
                  status:"accepted",

             }).populate("recipient","FullName profilepic nativeLanguage learningLanguage");

             res.status(200).json({
                  incomingReqs,
                  acceptedRequest,
             })

    }catch(error){
        console.error("Error in getFriendRequests controller:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}





export async function  getOutgoingFriendRequests (req,res){
    
        try{
           const outgoingRequests = await FriendRequest.find({
                sender:req.user.id,
                status:"pending",

           }).populate("recipient","FullName profilepic nativeLanguage learningLanguage");
              res.status(200).json(outgoingRequests);


        }catch(error){
            console.error("Error in getOutgoingFriendRequests controller:", error.message);
            res.status(500).json({ message: "Internal Server Error" });
        }
       


}




