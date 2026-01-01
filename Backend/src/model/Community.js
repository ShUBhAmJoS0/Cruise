// models/Community.js
import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";

const Community = sequelize.define("Community", {
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Community;
