// import Order from "../model/Order.js";
// import OrderItem from "../model/OrderItems.js";
// import {Product} from "../model/Product.js";


// export const getOrCreateCart = async (userId) => {
//   console.log("function hit")
//   let order = await Order.findOne({ where: { userId, status: "pending" } });
//   if (!order) {
//     order = await Order.create({ userId, status: "pending" });
//   }
//   return order;
// };

// export const addToCart = async (req, res) => {
//   try {
//     console.log("api hit");

//     const userId = req.user.id;
//     const { productId, quantity } = req.body;

//     const product = await Product.findByPk(productId);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }

//     const order = await getOrCreateCart(userId);

//     let item = await OrderItem.findOne({
//       where: { orderId: order.id, productId }
//     });

//     if (item) {
//       item.quantity += quantity;
//       await item.save();
//     } else {
//       await OrderItem.create({
//         orderId: order.id,
//         productId,
//         quantity,
//         priceAtPurchase: product.price
//       });
//     }

//     return res.status(200).json({
//       data: order.id,
//       message: "Added to cart"
//     });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Server error" });
//   }
// };

// export const updateCartItem = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { itemId } = req.params;
//     const { quantity } = req.body;

//     const order = await getOrCreateCart(userId);
//     const item = await OrderItem.findOne({ where: { id: itemId, orderId: order.id } });
//     if (!item) return res.status(404).json({ message: "Item not found" });

//     if (quantity < 1) await item.destroy();
//     else {
//       item.quantity = quantity;
//       await item.save();
//     }

//     res.json({ message: "Cart updated" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };

// export const removeCartItem = async (req, res) => {
//   try {
//     const userId = req.user.uid;
//     const { itemId } = req.params;

//     const order = await getOrCreateCart(userId);
//     await OrderItem.destroy({ where: { id: itemId, orderId: order.id } });

//     res.json({ message: "Item removed" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
