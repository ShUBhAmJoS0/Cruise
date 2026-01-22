
import sequelize from "../Database/db.js";
import { DataTypes } from "sequelize";

const UserProblem = sequelize.define("UserProblem", {
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
        validate: { isEmail: true }
    },
    subject: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("Open", "Resolved"),
        defaultValue: "Open",
        allowNull: false
    },
    priority: {
        type: DataTypes.ENUM("Low", "Medium", "High"),
        defaultValue: "Medium",
        allowNull: false
    },
    reportedBy: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'
        }
    }
}, {
    tableName: "user_problems",
    timestamps: true,
    underscored: true
});

export default UserProblem;
