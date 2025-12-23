import { Order } from "../model/Order.js"; 
import { OrderItem, Product } from "../model/Product.js";

export const checkout = async (req, res) => {
  try {
    const userId = req.user.uid;

    const order = await Order.findOne({
      where: { userId, status: "pending" },
      include: [{ model: OrderItem, as: "OrderItems", include: Product }]
    });

    if (!order || order.OrderItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    order.status = "completed"; 
    await order.save();

    res.json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
