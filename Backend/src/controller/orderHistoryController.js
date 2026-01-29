import Order from "../model/Order.js";
import OrderHistory from "../model/OrderHistory.js";
import OrderItem from "../model/OrderItems.js";
import { Product } from "../model/Product.js";
import User from "../model/User.js";

export const getOrderHistory = async (req, res) => {
  console.log("getting order history api");

  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const orders = await Order.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
        {
          model: OrderItem,
          as: 'OrderItems', 
          include: [
            {
              model: Product,
              as: 'product', 
            },
          ],
        },
      ],
    });

 
    console.log("Orders found:", orders.length);
    if (orders.length > 0) {
      console.log("First order OrderItems:", orders[0].OrderItems?.length || 0);
      if (orders[0].OrderItems && orders[0].OrderItems.length > 0) {
        console.log("First OrderItem product:", orders[0].OrderItems[0].product ? "exists" : "missing");
      }
    }

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });

  } catch (error) {
    console.error("GET ORDER HISTORY ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  console.log("getting order by id")
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const order = await Order.findOne({
      where: { id, userId },
      include: [
        {
          model: User,
          attributes: ["id", "name", "email"],
        },
        {
          model: OrderItem,
          as: 'OrderItems',
          include: [
            {
              model: Product,
              as: 'product',
            },
          ],
        },
      ],
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("GET ORDER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};


export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const order = await Order.findOne({
      where: { id, userId },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (order.status === "Completed") {
      return res.status(400).json({ 
        error: "Cannot cancel completed order" 
      });
    }

    if (order.status === "Cancelled") {
      return res.status(400).json({ 
        error: "Order is already cancelled" 
      });
    }
    order.status = "Cancelled";
    await order.save();

    res.json({
      success: true,
      message: "Order deleted successfully"
    });
  } catch (error) {
    console.error("DELETE ORDER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const totalOrders = await Order.count({
      where: { userId },
    });

    const confirmedOrders = await Order.count({
      where: { userId, status: "Confirmed" },
    });

    const totalSpent = await Order.sum("totalPrice", {
      where: { userId },
    });

    res.json({
      totalOrders,
      confirmedOrders,
      totalSpent: totalSpent || 0,
    });
  } catch (error) {
    console.error("GET ORDER STATS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};