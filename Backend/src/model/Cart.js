
import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import User from "./User.js";
import { Product } from "./Product.js";

const CartItem = sequelize.define("CartItem", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  productId: { type: DataTypes.INTEGER, allowNull: false },
  artistId: { type: DataTypes.INTEGER, allowNull: false },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  addedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// Associations
CartItem.belongsTo(Product, { foreignKey: "productId" } );
CartItem.belongsTo(User, { foreignKey: "artistId", as: "artist" });

export default CartItem;
