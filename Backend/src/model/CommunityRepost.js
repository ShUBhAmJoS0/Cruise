import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import Community from "./Community.js";

const CommunityRepost = sequelize.define("CommunityRepost", {
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
CommunityRepost.belongsTo(Community, { foreignKey: "communityId" });
Community.hasMany(CommunityRepost, { as: "Repost", foreignKey: "communityId" });

export default CommunityRepost;
