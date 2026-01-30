import sequelize from "../Database/db.js";
import { DataTypes } from "sequelize";

const Follow = sequelize.define("Follow", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },

  followerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },

  followingId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
     onDelete: 'CASCADE'
  }
},{
  indexes: [
    {
      unique: true,
      fields: ['followerId', 'followingId'],
      name: 'unique_follow_pair'
    }
  ],
}
);

export default Follow;
