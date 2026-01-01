import Community from "../model/Community.js";
import CommunityLike from "../model/CommunityLike.js";
import CommunityComment from "../model/CommunityComment.js";
import CommunityRepost from "../model/CommunityRepost.js";

// GET latest single post
export const getAllPosts = async (req, res) => {
  try {
    const latestPost = await Community.findOne({
      order: [["createdAt", "DESC"]],
      include: [CommunityLike, CommunityComment, CommunityRepost],
    });

    if (!latestPost) return res.json(null);
    res.json(latestPost); 
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// CREATE new post (text + optional image)
export const createCommunityPost = async (req, res) => {
  try {
    const { content, userId } = req.body;
    let imageUrl = null;
    if (req.file) imageUrl = `/uploads/${req.file.filename}`;

    const newPost = await Community.create({ content, userId, imageUrl });

    const fullPost = await Community.findOne({
      where: { id: newPost.id },
      include: [CommunityLike, CommunityComment, CommunityRepost],
    });

    res.json(fullPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// LIKE a post
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const existing = await CommunityLike.findOne({ where: { postId: id, userId } });
    if (!existing) await CommunityLike.create({ postId: id, userId });

    const post = await Community.findOne({
      where: { id },
      include: [CommunityLike, CommunityComment, CommunityRepost],
    });

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// ADD comment
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, userId } = req.body;

    const newComment = await CommunityComment.create({ postId: id, userId, content });
    res.json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// REPOST a post
export const repostPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const existing = await CommunityRepost.findOne({ where: { postId: id, userId } });
    if (!existing) await CommunityRepost.create({ postId: id, userId });

    const post = await Community.findOne({
      where: { id },
      include: [CommunityLike, CommunityComment, CommunityRepost],
    });

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
