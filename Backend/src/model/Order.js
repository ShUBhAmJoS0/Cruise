import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import OrderItem from "./OrderItem.js"; // will associate later

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING, // Firebase UID or email
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "completed", "cancelled"),
    defaultValue: "pending",
    allowNull: false,
  },
  totalAmount: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    allowNull: false,
  },
}, {
  tableName: "orders",
  timestamps: true,
});

export default Order;
