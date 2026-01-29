import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import User from "./User.js";

const OrderHistory = sequelize.define("OrderHistory", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: true, 
  },
  eventName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  eventDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  eventImage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  ticketType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  totalAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  paymentStatus: {
    type: DataTypes.ENUM("Pending", "Completed", "Failed", "Refunded"),
    defaultValue: "Pending",
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  orderDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  status: {
    type: DataTypes.ENUM("Active", "Cancelled", "Completed"),
    defaultValue: "Active",
    allowNull: false,
  },
}, {
  tableName: "order_histories",
  timestamps: true,
  underscored: true,
});

OrderHistory.belongsTo(User, {
  foreignKey: "userId",
  as: "User",
});

User.hasMany(OrderHistory, {
  foreignKey: "userId",
  as: "OrderHistories",
});

export default OrderHistory;