import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import Community from "./Community.js";

const CommunityLike = sequelize.define("CommunityLike", {
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
CommunityLike.belongsTo(Community, { foreignKey: "communityId" });
Community.hasMany(CommunityLike, { as: "Likes", foreignKey: "communityId" });

export default CommunityLike;
