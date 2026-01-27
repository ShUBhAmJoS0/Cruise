import Review from "../model/review.js";
import User from "../model/User.js";

export const createReview = async (req, res) => {
  try {
    const { artistId, comment } = req.body;
    const userId = req.user.id;

    if (!comment || !artistId) {
      return res.status(400).json({ message: "Comment and artistId required" });
    }

    const review = await Review.create({
      userId,
      artistId,
      comment
    });

    const reviewWithUser = await Review.findByPk(review.id, {
      include: [{ model: User, as: "reviewer", attributes: ["id", "name", "profileImage"] }]
    });

    res.status(201).json({ message: "Review created", review: reviewWithUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getArtistReviews = async (req, res) => {
  try {
    const { artistId } = req.params;
    const reviews = await Review.findAll({
      where: { artistId },
      include: [{ model: User, as: "reviewer", attributes: ["id", "name", "profileImage"] }],
      order: [["createdAt", "DESC"]]
    });

    res.json({ data: reviews, message: "Reviews fetched" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;

    const review = await Review.findByPk(reviewId);
    if (!review || review.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await review.destroy();
    res.json({ message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
