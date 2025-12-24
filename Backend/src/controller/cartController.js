import Order from "../model/Order.js";
import OrderItem from "../model/OrderItems.js";
import Product from "../model/Product.js";

// Helper: get or create pending order for user
const getOrCreateCart = async (userId) => {
  let order = await Order.findOne({ where: { userId, status: "pending" } });
  if (!order) {
    order = await Order.create({ userId, status: "pending" });
  }
  return order;
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { productId, quantity = 1 } = req.body;

    const product = await Product.findByPk(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const order = await getOrCreateCart(userId);

    let orderItem = await OrderItem.findOne({
      where: { orderId: order.id, productId },
    });

    if (orderItem) {
      orderItem.quantity += quantity;
      await orderItem.save();
    } else {
      await OrderItem.create({
        orderId: order.id,
        productId,
        quantity,
        priceAtPurchase: product.price,
      });
    }

    res.json({ message: "Added to cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.uid;
    const order = await Order.findOne({
      where: { userId, status: "pending" },
      include: [{ model: OrderItem, as: "OrderItems", include: Product }]
    });
    res.json(order || { message: "Cart is empty" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { itemId } = req.params;
    const { quantity } = req.body;

    const order = await getOrCreateCart(userId);
    const item = await OrderItem.findOne({ where: { id: itemId, orderId: order.id } });
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (quantity < 1) {
      await item.destroy();
    } else {
      item.quantity = quantity;
      await item.save();
    }

    res.json({ message: "Cart updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove item
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.uid;
    const { itemId } = req.params;

    const order = await getOrCreateCart(userId);
    await OrderItem.destroy({ where: { id: itemId, orderId: order.id } });

    res.json({ message: "Item removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
