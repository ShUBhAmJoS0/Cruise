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
      references: {
        model: "users",
        key: "id"
      },
      onDelete: 'CASCADE'
    },
    artistId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id"
      },
      onDelete:'CASCADE'
    },
  },
  {
    timestamps: true
  }
);

Review.belongsTo(User, { foreignKey: "userId", as: "reviewer" });
Review.belongsTo(User, { foreignKey: "artistId", as: "artist" });

export default Review;
