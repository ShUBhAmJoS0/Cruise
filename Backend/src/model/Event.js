// backend/src/model/Event.js

import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import User from "./User.js";

const Event = sequelize.define(
  "Events",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    location: { type: DataTypes.STRING, allowNull: false },
    date: { type: DataTypes.DATE, allowNull: false },
    time: { type: DataTypes.STRING, allowNull: false },
    category:{ type: DataTypes.STRING, allowNull: false },
    images: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
    profileImage:{type:DataTypes.STRING,allowNull:false},
    prices: {
        type: DataTypes.JSONB, 
        allowNull: false,
        defaultValue: { VIP: 0, Regular: 0, Student: 0 }
    },
    Quantity:{
        type: DataTypes.JSONB, 
        allowNull: false,
        defaultValue: { VIP: 0, Regular: 0, Student: 0 }
    },
    createdBy:{
      type: DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:User,
        key:"id"
      }
    },
    status:{
      type:DataTypes.STRING,
      allowNull:false,
      defaultValue:"pending"
    },
    visible:{
      type:DataTypes.STRING,
      allowNull:false,
      defaultValue:"Active"
    }
  },
{
  timestamps: true
}
);

export default Event;
