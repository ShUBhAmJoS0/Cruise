
import Event from "../model/Event.js"
import Follow from "../model/follow.js"
import Review from "../model/review.js"
import User from "../model/User.js"

export const getallArtists = async(req,res)=>{
    console.log("getallartist api hit");
    try {
        const currentUserId = req.user.id;
    
        const artists = await User.findAll({
            where: { userType: "Artist" },
            attributes: ['id', 'name', 'email', 'profileImage', 'bio', 'coverImage']
        });

        const userFollows = await Follow.findAll({
            where: { followerId: currentUserId },
            attributes: ['followingId']
        });

        const followingIds = new Set(userFollows.map(follow => follow.followingId));
        const artistsWithFollowStatus = await Promise.all(
            artists.map(async (artist) => {
                const followersCount = await Follow.count({
                    where: { followingId: artist.id }
                });

                return {
                    id: artist.id,
                    name: artist.name,
                    email: artist.email,
                    profileImage: artist.profileImage,
                    bio: artist.bio,
                    coverImage: artist.coverImage,
                    followersCount,
                    isFollowing: followingIds.has(artist.id) // Check if user follows this artist
                };
            })
        );

        console.log(artistsWithFollowStatus);
        res.status(200).send({
            data: artistsWithFollowStatus,
            message: "Successfully fetched all artists"
        });
    } catch (error) {
        console.error("Get all artists error:", error);
        res.status(500).send({ message: error.message });
    }
};

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
  console.log("follow user api hitting")
  try {
    const followerId = req.user.id; 
    const followingId = req.params.id; 

    const existingFollow = await Follow.findOne({
      where: { followerId, followingId }
    });

    if (existingFollow) {
      return res.status(400).json({ message: "Already following this user" });
    }

    await Follow.create({ followerId, followingId });

    res.status(200).json({ message: "Successfully followed user" });
  } catch (error) {
    console.error("Follow error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Unfollow an artist/user
export const unfollowUser = async (req, res) => {
    console.log("unfollow user api hitting")
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

export const getFollowers = async (req, res) => {
    console.log("gget followers api hitting")
  try {
    const userId = req.params.id;

    const followers = await Follow.findAll({
      where: { followingId: userId },
      include: [
        {
          model: User,
          as: "follower",
          attributes: ["id", "name", "email", "profileImage"]
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


export const getFollowing = async (req, res) => {
    console.log("follow user api hitting")
  try {
    const userId = req.params.id;

    const following = await Follow.findAll({
      where: { followerId: userId },
      include: [
        {
          model: User,
          as: "following", 
          attributes: ["id", "name", "email", "profileImage"]
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


