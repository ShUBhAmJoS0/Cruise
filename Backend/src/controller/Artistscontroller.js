
import Event from "../model/Event.js"
import Follow from "../model/follow.js"
import Review from "../model/review.js"
import User from "../model/User.js"

export const getallArtists = async(req,res)=>{
    console.log("getallarist apu hit")
    try {
        const artists = await User.findAll({where:{userType:"Artist"}})
        console.log(artists)
        res.status(200).send({data:artists,message:"sucessfully fetched all artists"})
    } catch (error) {
        res.status(500).send({message:error.message})
    }
}
export const getArtistbyid = async(req,res)=>{
    console.log("get by artist hit")
    try {
        const artistid = req.params.id
        const currentUserId=req.user.id
         const followersCount = await Follow.count({
      where: { followingId:artistid }
    });

    const followingCount = await Follow.count({
      where: { followerId: artistid }
    });

    const isFollowing = await Follow.findOne({
      where: {
        followerId: currentUserId,
        followingId: artistid
      }
    });
        console.log(artistid)
        const artist = await User.findOne({where:{id:artistid}})
        console.log(artist)
        res.status(200).send({data:{artist,followersCount,
        followingCount,
        isFollowing:!!isFollowing},message:"artist by id fetched sucessfully "})
       
    } catch (error) {
        res.status(500).send({message:error.message})
    }
}
export const getArtistgigs = async(req,res)=>{4
  console.log("gig api also hit")
    try {
        const artistId=req.params.id
        console.log(artistId)
             const artistgigs = await Event.findAll({where:{createdBy:artistId}})
             console.log(artistgigs)
                     res.status(200).send({data:artistgigs,message:"gigs fetched sucessfully"})
    } catch (error) {
           res.status(500).send({message:error.message})
    }
}
export const getpendingArtistgigs = async(req,res)=>{4
  console.log("gig api also hit")
    try {
        const artistId=req.params.id
        console.log(artistId)
             const artistgigs = await Event.findAll({where:{createdBy:artistId,status:"pending"}})
             console.log(artistgigs)
                     res.status(200).send({data:artistgigs,message:"gigs fetched sucessfully"})
    } catch (error) {
           res.status(500).send({message:error.message})
    }
}

export const createReview = async (req, res) => {
  try {
    const { comment, artistId } = req.body;
    const userId = req.user.id; 

    if (!comment || !artistId) {
      return res.status(400).json({ message: "Comment is required" });
    }

    const review = await Review.create({
      comment,
      artistId,
      userId,
    });

    res.status(201).json(review);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create review" });
  }
};
export const getReviewsByArtist = async (req, res) => {
  try {
    const { artistId } = req.params;

    const reviews = await Review.findAll({
      where: { artistId },
    });

    res.status(200).json(
      reviews.map((r) => ({
        id: r.id,
        comment: r.comment,
        createdAt: r.createdAt,
        userName: r.User.username,
      }))
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};
export const followUser = async (req, res) => {
  try {
    const followerId = req.user.id; // Assuming you have auth middleware that adds user to req
    const followingId = req.params.id; // Artist/user ID to follow

    // Prevent self-following
    if (followerId === parseInt(followingId)) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      where: { followerId, followingId }
    });

    if (existingFollow) {
      return res.status(400).json({ message: "Already following this user" });
    }

    // Create follow relationship
    await Follow.create({ followerId, followingId });

    res.status(200).json({ message: "Successfully followed user" });
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Unfollow an artist/user
export const unfollowUser = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.id;

    const follow = await Follow.findOne({
      where: { followerId, followingId }
    });

    if (!follow) {
      return res.status(404).json({ message: "Follow relationship not found" });
    }

    await follow.destroy();

    res.status(200).json({ message: "Successfully unfollowed user" });
  } catch (error) {
    console.error("Unfollow error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all followers of a user
export const getFollowers = async (req, res) => {
  try {
    const userId = req.params.id;

    const followers = await Follow.findAll({
      where: { followingId: userId },
      include: [
        {
          model: User,
          as: "follower", // You'll need to set up this association
          attributes: ["id", "username", "email", "profilePicture"] // Adjust based on your User model
        }
      ]
    });

    const followersList = followers.map(follow => follow.follower);

    res.status(200).json({
      count: followersList.length,
      followers: followersList
    });
  } catch (error) {
    console.error("Get followers error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all users that a user is following
export const getFollowing = async (req, res) => {
  try {
    const userId = req.params.id;

    const following = await Follow.findAll({
      where: { followerId: userId },
      include: [
        {
          model: User,
          as: "following", // You'll need to set up this association
          attributes: ["id", "username", "email", "profilePicture"]
        }
      ]
    });

    const followingList = following.map(follow => follow.following);

    res.status(200).json({
      count: followingList.length,
      following: followingList
    });
  } catch (error) {
    console.error("Get following error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Check if current user is following a specific user
export const checkFollowStatus = async (req, res) => {
  try {
    const followerId = req.user.id;
    const followingId = req.params.id;

    const isFollowing = await Follow.findOne({
      where: { followerId, followingId }
    });

    res.status(200).json({ isFollowing: !!isFollowing });
  } catch (error) {
    console.error("Check follow status error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get followers count
export const getFollowersCount = async (req, res) => {
  try {
    const userId = req.params.id;

    const count = await Follow.count({
      where: { followingId: userId }
    });

    res.status(200).json({ followersCount: count });
  } catch (error) {
    console.error("Get followers count error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get following count
export const getFollowingCount = async (req, res) => {
  try {
    const userId = req.params.id;

    const count = await Follow.count({
      where: { followerId: userId }
    });

    res.status(200).json({ followingCount: count });
  } catch (error) {
    console.error("Get following count error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};