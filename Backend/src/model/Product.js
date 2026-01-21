import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import User from "./User.js";
import OrderItem from "./OrderItems.js";
export const Product= sequelize.define("product",{
    productId:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    createdBy:{
      type: DataTypes.INTEGER,
      allowNull:false,
      references:{
        model:User,
        key:"id"
      }
    },
    productName:{
        type:DataTypes.STRING,
        allowNull:false
    },
    productDescription: { type: DataTypes.TEXT, allowNull: false },
    skuNumber:{
        type:DataTypes.STRING,
        allowNull:false
    },
    productCategory:{
        type:DataTypes.STRING,
        allowNull:false
    },
    productPrice:{
        type:DataTypes.DECIMAL(10, 2),
        allowNull:false
    },
    productQuantity:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    productImage:{
        type:DataTypes.STRING,
        allowNull:false
    },
visible:{
      type:DataTypes.STRING,
      allowNull:false,
      defaultValue:"Active"
    }

}

)

