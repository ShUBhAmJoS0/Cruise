
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
  password: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  userType: {
      type: DataTypes.ENUM("Attendee", "Artist"),
      defaultValue: "Attendee",
      allowNull: false,
    },

    googleId: {
      type: DataTypes.STRING(255),
      allowNull: true,   // Only needed for Google users
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
  }
}, {
  tableName: "users",
  timestamps: true,
  underscored: true
});
 export default User;
