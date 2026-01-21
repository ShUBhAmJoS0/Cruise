// backend/src/model/Notification.js

import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";

const Notification = sequelize.define(
    "Notifications",
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        message: { type: DataTypes.STRING, allowNull: false },
        type: { type: DataTypes.STRING, allowNull: false }, // e.g., "EventRequest"
        link: { type: DataTypes.STRING, allowNull: true },    // e.g., "/admin/event-requests"
        isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
        timestamps: true
    }
);

export default Notification;
