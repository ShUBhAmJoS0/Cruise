import sequelize from "../Database/db.js";
import { DataTypes } from "sequelize";
import OrderHistoryModel from "../model/OrderHistory.js";
import OrderHistoryItemModel from "../model/OrderHistoryItem.js";

// Initialize models
const OrderHistory = OrderHistoryModel(sequelize, DataTypes);
const OrderHistoryItem = OrderHistoryItemModel(sequelize, DataTypes);

// Set up associations (only once here)
OrderHistory.hasMany(OrderHistoryItem, {
  foreignKey: "orderHistoryId",
  as: "items",
});
OrderHistoryItem.belongsTo(OrderHistory, {
  foreignKey: "orderHistoryId",
  as: "orderHistory",
});

// Generate unique order ID
const generateOrderId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `ORD-${timestamp}-${random}`.toUpperCase();
};

// Get all orders for a user
export const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await OrderHistory.findAll({
      where: { userId },
      include: [
        {
          model: OrderHistoryItem,
          as: "items",
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    console.error("GET USER ORDERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message,
    });
  }
};

// Get single order details
export const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await OrderHistory.findOne({
      where: { id: orderId },
      include: [
        {
          model: OrderHistoryItem,
          as: "items",
        },
      ],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error("GET ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
      error: error.message,
    });
  }
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      totalAmount,
      paymentMethod,
      shippingAddress,
    } = req.body;

    // Validate required fields
    if (!userId || !items || !totalAmount || !paymentMethod || !shippingAddress) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Generate unique order ID
    const orderId = generateOrderId();

    // Calculate estimated delivery (7 days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 7);

    // Create order
    const order = await OrderHistory.create({
      orderId,
      userId,
      totalAmount,
      paymentMethod,
      shippingAddress,
      status: "pending",
      paymentStatus: "pending",
      estimatedDelivery,
    });

    // Create order items
    const orderItems = items.map((item) => ({
      orderHistoryId: order.id,
      productName: item.productName,
      productImage: item.productImage,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.quantity * item.price,
    }));

    await OrderHistoryItem.bulkCreate(orderItems);

    // Fetch complete order with items
    const completeOrder = await OrderHistory.findOne({
      where: { id: order.id },
      include: [
        {
          model: OrderHistoryItem,
          as: "items",
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      data: completeOrder,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await OrderHistory.findOne({ where: { id: orderId } });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Update order
    const updateData = { status };
    
    if (trackingNumber) {
      updateData.trackingNumber = trackingNumber;
    }

    if (status === "delivered") {
      updateData.deliveredAt = new Date();
    }

    await order.update(updateData);

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update order status",
      error: error.message,
    });
  }
};

// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await OrderHistory.findOne({ where: { id: orderId } });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if order can be cancelled
    if (["shipped", "delivered"].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot cancel order that is already shipped or delivered",
      });
    }

    await order.update({ status: "cancelled" });

    res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    console.error("CANCEL ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to cancel order",
      error: error.message,
    });
  }
};