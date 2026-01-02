import sequelize from "../Database/db.js";
import { DataTypes } from "sequelize";

const Follow = sequelize.define("Follow", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  followerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  followingId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }

}, );

export default Follow;
