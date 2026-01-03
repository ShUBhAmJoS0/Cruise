
import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import User from "./User.js";

const Order = sequelize.define("Order", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: "Pending" }, 
  totalPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

Order.belongsTo(User, { foreignKey: "userId" });

export default Order;