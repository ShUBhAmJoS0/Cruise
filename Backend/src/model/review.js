import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import User from "./User.js";


const Review = sequelize.define(
  "review",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    artistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },

);
  Review.belongsTo(User, { foreignKey: "id" });
export default Review;
