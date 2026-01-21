import OrderHistory from "../model/OrderHistory.js";
import User from "../model/User.js";

export const getOrderHistory = async (req, res) => {
  try {
   
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const orders = await OrderHistory.findAll({
      where: { userId },
      order: [["orderDate", "DESC"]], 
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.json(orders);
  } catch (error) {
    console.error("GET ORDER HISTORY ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const order = await OrderHistory.findOne({
      where: { id, userId }, 
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "name", "email"],
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

export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const order = await OrderHistory.findOne({
      where: { id, userId },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if order can be cancelled
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

    // Update order status
    await order.update({
      status: "Cancelled",
      paymentStatus: "Refunded",
    });

    const updatedOrder = await OrderHistory.findByPk(id, {
      include: [
        {
          model: User,
          as: "User",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.json(updatedOrder);
  } catch (error) {
    console.error("CANCEL ORDER ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getOrderStats = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const totalOrders = await OrderHistory.count({
      where: { userId },
    });

    const activeOrders = await OrderHistory.count({
      where: { userId, status: "Active" },
    });

    const totalSpent = await OrderHistory.sum("totalAmount", {
      where: { userId, paymentStatus: "Completed" },
    });

    res.json({
      totalOrders,
      activeOrders,
      totalSpent: totalSpent || 0,
    });
  } catch (error) {
    console.error("GET ORDER STATS ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};