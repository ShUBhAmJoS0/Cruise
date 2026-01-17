import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import Community from "./Community.js";
import User from "./User.js";

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


// ASSOCIATIONS

CommunityLike.belongsTo(Community, {
  foreignKey: "communityId",
});

Community.hasMany(CommunityLike, {
  as: "Likes",
  foreignKey: "communityId",
});

CommunityLike.belongsTo(User, {
  foreignKey: "userId",
  as: "User",
});

User.hasMany(CommunityLike, {
  foreignKey: "userId",
  as: "Likes",
});

export default CommunityLike;
