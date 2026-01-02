import Community from "../model/Community.js";
import CommunityLike from "../model/CommunityLike.js";
import CommunityComment from "../model/CommunityComment.js";
import CommunityRepost from "../model/CommunityRepost.js";


const postIncludes = [
  {
    model: CommunityComment,
    as: "Comments",
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

// GET latest community post
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


// CREATE community post
export const createCommunityPost = async (req, res) => {
  try {
    const content = req.body.content?.trim() || "";
    const userId = Number(req.body.userId);

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    if (!content && !req.file) {
      return res.status(400).json({ message: "Post cannot be empty" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const post = await Community.create({
      content,
      userId,
      image:imageUrl,
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

// LIKE post
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const existingLike = await CommunityLike.findOne({
      where: { communityId: id, userId },
    });

    if (existingLike) {
      await existingLike.destroy(); // UNLIKE
    } else {
      await CommunityLike.create({ communityId: id, userId });
    }

    const post = await Community.findByPk(id, {
      include: ["Likes", "Comments", "Repost"],
    });

    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Like toggle failed" });
  }
};

// ADD comment
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const content = req.body.content?.trim();
    const userId = Number(req.body.userId);

    if (!content || !userId) {
      return res
        .status(400)
        .json({ message: "content and userId are required" });
    }

    await CommunityComment.create({
      communityId: id,
      content,
      userId,
    });

    const post = await Community.findOne({
      where: { id },
      include: postIncludes,
    });

    res.json(post);
  } catch (error) {
    console.error("COMMENT ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

// REPOST post
export const repostPost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = Number(req.body.userId);

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    await CommunityRepost.findOrCreate({
      where: { communityId: id, userId },
    });

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
