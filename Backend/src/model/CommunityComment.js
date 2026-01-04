import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import Community from "./Community.js";

const CommunityComment = sequelize.define("CommunityComment", {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  communityId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

// Associations
CommunityComment.belongsTo(Community, { foreignKey: "communityId" });
Community.hasMany(CommunityComment, { as: "Comments", foreignKey: "communityId" });

export default CommunityComment;
