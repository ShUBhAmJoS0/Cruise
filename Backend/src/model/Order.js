import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import OrderItem from "./OrderItems.js";

const Order = sequelize.define("Order", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.STRING, allowNull: false, defaultValue: "pending" },
}, {
  tableName: "orders",
  timestamps: true,
});

Order.hasMany(OrderItem, { foreignKey: "orderId", as: "OrderItems" });

export default Order;
