import CommunityGuidelines from "../model/CommunityGuideline.js";

export const getCommunityGuidelines = async (req, res) => {
  try {
    const guidelines = await CommunityGuidelines.findAll({
      order: [["createdAt", "ASC"]],
    });

    res.status(200).json(guidelines);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch community guidelines",
    });
  }
};
