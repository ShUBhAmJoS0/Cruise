// backend/src/model/Event.js

import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";

const Event = sequelize.define(
  "Event",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    images: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    prices: {
        type: DataTypes.JSONB, // Postgres JSON column
        allowNull: false,
        defaultValue: { VIP: 0, Regular: 0, Student: 0 }
    },
     category: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: "Events",
    timestamps: true,
  }
);

export default Event;
