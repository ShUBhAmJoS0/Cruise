import Community from "../model/Community.js";
import CommunityLike from "../model/CommunityLike.js";
import CommunityComment from "../model/CommunityComment.js";
import CommunityRepost from "../model/CommunityRepost.js";
import User from "../model/User.js";

const postIncludes = [
  {
    model: User,
    as: "User",
    attributes: ["id", "name", "email", "profileImage"], 
  },
  {
    model: CommunityComment,
    as: "Comments",
    include: [
      {
        model: User,
        as: "User",
        attributes: ["id", "name", "profileImage"], 
      },
    ],
  },
  {
    model: CommunityLike,
    as: "Likes",
  },
  {
    model: CommunityRepost,
    as: "Repost",
  },
];

export const getCurrentUser = async (req, res) => {
  try {
    
    const userId = req.session?.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = await User.findByPk(userId, {
      attributes: ["id", "name", "email", "profileImage"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("GET CURRENT USER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Community.findAll({
      order: [["createdAt", "DESC"]],
      include: postIncludes,
    });

    res.json(posts);
  } catch (error) {
    console.error("GET POSTS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

export const createCommunityPost = async (req, res) => {
  try {
    const content = req.body.content?.trim() || "";
    
    // SECURITY: Get userId from authenticated session, NOT from request body
    const userId = req.session?.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!content && !req.file) {
      return res.status(400).json({ message: "Post cannot be empty" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const post = await Community.create({
      content,
      userId, // From session, secure
      image: imageUrl,
    });

    const fullPost = await Community.findOne({
      where: { id: post.id },
      include: postIncludes,
    });

    res.status(201).json(fullPost);
  } catch (error) {
    console.error("CREATE POST ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

export const updateCommunityPost = async (req, res) => {
  try {
    const { id } = req.params;
    const content = req.body.content?.trim() || "";
    const userId = req.session?.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const post = await Community.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ message: "You can only edit your own posts" });
    }

    if (!content && !req.file && !post.image) {
      return res.status(400).json({ message: "Post cannot be empty" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : post.image;

    await post.update({
      content: content || post.content,
      image: imageUrl,
    });

    const updatedPost = await Community.findOne({
      where: { id },
      include: postIncludes,
    });

    res.json(updatedPost);
  } catch (error) {
    console.error("UPDATE POST ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteCommunityPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session?.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const post = await Community.findByPk(id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.userId !== userId) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    await CommunityLike.destroy({ where: { communityId: id } });
    await CommunityComment.destroy({ where: { communityId: id } });
    await CommunityRepost.destroy({ where: { communityId: id } });

    // Delete the post
    await post.destroy();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("DELETE POST ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session?.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const existingLike = await CommunityLike.findOne({
      where: { communityId: id, userId },
    });

    if (existingLike) {
      await existingLike.destroy(); 
    } else {
      await CommunityLike.create({ communityId: id, userId }); 
    }

    const post = await Community.findByPk(id, {
      include: postIncludes,
    });

    res.json(post);
  } catch (err) {
    console.error("LIKE ERROR:", err);
    res.status(500).json({ message: "Like toggle failed" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const content = req.body.content?.trim();
    const userId = req.session?.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }

    const comment = await CommunityComment.create({
      communityId: id,
      content,
      userId,
    });

    // Return the comment with user info
    const fullComment = await CommunityComment.findByPk(comment.id, {
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "name", "profileImage"],
        },
      ],
    });

    res.json(fullComment);
  } catch (error) {
    console.error("COMMENT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// TOGGLE REPOST (userId from session)

export const repostPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.session?.userId || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const existingRepost = await CommunityRepost.findOne({
      where: { communityId: id, userId },
    });

    if (existingRepost) {
      await existingRepost.destroy(); 
    } else {
      await CommunityRepost.create({ communityId: id, userId }); 
    }

    const post = await Community.findOne({
      where: { id },
      include: postIncludes,
    });

    res.json(post);
  } catch (error) {
    console.error("REPOST ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};