import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";

const Product = sequelize.define(
  "Product",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    bg: {
      type: DataTypes.STRING,
    },
    label: {
      type: DataTypes.STRING,
    },
    number: {
      type: DataTypes.STRING,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "products",
    timestamps: true,
  }
);

export default Product;
