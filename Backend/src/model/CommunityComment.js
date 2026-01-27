import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import Community from "./Community.js";
import User from "./User.js";

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


// ASSOCIATIONS

CommunityComment.belongsTo(Community, {
  foreignKey: "communityId",
});

Community.hasMany(CommunityComment, {
  as: "Comments",
  foreignKey: "communityId",
});

CommunityComment.belongsTo(User, {
  foreignKey: "userId",
  as: "User",
});

User.hasMany(CommunityComment, {
  foreignKey: "userId",
  as: "Comments",
});


export default CommunityComment;
