
import sequelize from "../Database/db.js";
import { DataTypes } from "sequelize";
const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
firebase_uid:{
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: true,
},
  userType: {
      type: DataTypes.ENUM("Attendee", "Artist"),
      defaultValue: "Attendee",
      allowNull: false,
    },
  createdAt: {
    type: DataTypes.DATE,
    field: "created_at",
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: "updated_at",
    defaultValue: DataTypes.NOW
  },
    profileImage: { type: DataTypes.STRING, allowNull: true , defaultValue:'uploads/events/defaultprofilepic.png'},
  coverImage: { type: DataTypes.STRING, allowNull: true },
  bio: { type: DataTypes.TEXT, allowNull: true },
  social:{type:DataTypes.STRING, allowNull:true},
  about:{type:DataTypes.STRING(1000),allowNull:true},
  
  followersCount: {
    type: DataTypes.VIRTUAL(DataTypes.INTEGER),
    defaultValue: 0
  },

  followingCount: {
    type: DataTypes.VIRTUAL(DataTypes.INTEGER),
    defaultValue: 0
  }

}, 
{
  tableName: "users",
  timestamps: true,
  underscored: true
}
);
 export default User;
