import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";

const Community = sequelize.define("Community", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },

  reshares: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
});

export default Community;
