import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import Event from "./Event.js";
import User from "./User.js";

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ticketCode: {
      type: DataTypes.STRING(50),
      allowNull: true,
      unique: true,
      field: "ticket_code",
    },
    eventName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "event_name",
    },
    ticketType: {
      type: DataTypes.ENUM("VIP", "Standard", "Student"),
      allowNull: false,
      field: "ticket_type",
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    customerName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: "customer_name",
    },
    billingAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: "billing_address",
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "total_price",
    },
    paymentStatus: {
      type: DataTypes.ENUM("pending", "success", "failed"),
      allowNull: false,
      defaultValue: "success",
      field: "payment_status",
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id"
      }
    },
    EventId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: Event,
        key: "id",
      },
    },
    createdAt: {
      type: DataTypes.DATE,
      field: "created_at",
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: "updated_at",
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "bookings",
    timestamps: true,
    underscored: true,
  }
);

export default Booking;
