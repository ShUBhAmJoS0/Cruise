// models/Community.js
import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import User from "./User.js"

const Community = sequelize.define("Community", {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  image:{
    type: DataTypes.STRING,
    allowNull: true,
  }
});


// ASSOCIATIONS - Community belongs to User

Community.belongsTo(User, {
  foreignKey: "userId",
  as: "User",
});

User.hasMany(Community, {
  foreignKey: "userId",
  as: "Posts",
});


export default Community;
