import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import Community from "./Community.js";
import User from "./User.js"

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


// ASSOCIATIONS

CommunityRepost.belongsTo(Community, {
  foreignKey: "communityId",
});

Community.hasMany(CommunityRepost, {
  as: "Repost",
  foreignKey: "communityId",
});

CommunityRepost.belongsTo(User, {
  foreignKey: "userId",
  as: "User",
});


User.hasMany(CommunityRepost, {
  foreignKey: "userId",
  as: "Reposts",
});

export default CommunityRepost;
