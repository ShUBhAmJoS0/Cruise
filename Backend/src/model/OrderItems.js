import { DataTypes } from "sequelize";
import sequelize from "../Database/db.js";
import Product from "./Product.js";
import Order from "./Order.js";

const OrderItem = sequelize.define("OrderItem", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  orderId: { type: DataTypes.INTEGER, references: { model: Order, key: "id" }, allowNull: false },
  productId: { type: DataTypes.STRING, references: { model: Product, key: "id" }, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1, allowNull: false },
  priceAtPurchase: { type: DataTypes.FLOAT, allowNull: false }
}, {
  tableName: "order_items",
  timestamps: true
});

// Associations
OrderItem.belongsTo(Product, { foreignKey: "productId" });
OrderItem.belongsTo(Order, { foreignKey: "orderId" });

export default OrderItem;
