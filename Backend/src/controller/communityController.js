import Community from "../model/Community.js";
import User from "../model/User.js";

/* CREATE POST */
export const createCommunityPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Post cannot be empty" });
    }

    const post = await Community.create({
      content,
      userId: req.user.id,
    });

    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to post" });
  }
};

/* GET POSTS */
export const getCommunityPosts = async (req, res) => {
  try {
    const posts = await Community.findAll({
      order: [["createdAt", "DESC"]],
    });

    const finalPosts = [];

    for (const post of posts) {
      const user = await User.findByPk(post.userId);

      finalPosts.push({
        id: post.id,
        content: post.content,
        likes: post.likes,
        reshares: post.reshares,
        createdAt: post.createdAt,
        userName: user.name,
        userEmail: user.email,
      });
    }

    res.status(200).json(finalPosts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load posts" });
  }
};

/* LIKE */
export const likeCommunityPost = async (req, res) => {
  try {
    const post = await Community.findByPk(req.params.id);
    post.likes += 1;
    await post.save();

    res.status(200).json(post);
  } catch {
    res.status(500).json({ message: "Failed to like" });
  }
};

/* RESHARE */
export const reshareCommunityPost = async (req, res) => {
  try {
    const post = await Community.findByPk(req.params.id);
    post.reshares += 1;
    await post.save();

    res.status(200).json(post);
  } catch {
    res.status(500).json({ message: "Failed to reshare" });
  }
};
