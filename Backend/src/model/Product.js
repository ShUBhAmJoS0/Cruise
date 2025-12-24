import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js"; 

const Product = sequelize.define("Product", {
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
    type: DataTypes.FLOAT, // store as number, not string
    allowNull: false,
  },
  bg: {
    type: DataTypes.STRING, // UI color class
    allowNull: true,
  },
  label: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  number: {
    type: DataTypes.STRING, // jersey number or similar
    allowNull: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: "products",
  timestamps: true,
});

export default Product;
