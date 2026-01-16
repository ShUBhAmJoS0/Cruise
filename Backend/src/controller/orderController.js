
import CartItem from "../model/Cart.js";
import Order from "../model/Order.js";
import OrderItem from "../model/OrderItems.js";
import { Product } from "../model/Product.js";

const TAX_RATE = 0.1;
const DISCOUNT = 0;   


export const buyAllCartItems = async (req, res) => {
  console.log("api hit for buying items");

  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { cartItemId, cartItemIds, quantity } = req.body;

  try {
    let items = [];

    if (cartItemId) {
      const item = await CartItem.findByPk(cartItemId, { include: [{model:Product}] });
      if (!item) return res.status(404).json({ message: "Cart item not found" });

      item.quantity = quantity || item.quantity;
      items.push(item);

    } else if (cartItemIds && cartItemIds.length > 0) {
      items = await CartItem.findAll({
        where: { id: cartItemIds },
        include: [{model:Product}],
      });
console.log(items)
      if (!items.length)
        return res.status(400).json({ message: "No items found in cart" });

    } else {
      return res.status(400).json({ message: "No items specified to buy" });
    }
console.log("Cart items fetched for order:", items.map(i => ({
  id: i.id,
  productId: i.productId,
  quantity: i.quantity,
  productQuantity: i.product?.productQuantity
})));
    for (const i of items) {
      if (!i.product)
        return res.status(400).json({ message: "Product not found" });

      if (i.product.productQuantity < i.quantity) {
        return res.status(400).json({
          message: `Only ${i.Product.productQuantity} items left for ${i.product.productName}`,
        });
      }
    }

    let totalPrice = 0;
    items.forEach(i => {
      totalPrice +=
        (i.product.productPrice || 0) *
        i.quantity *
        (1 + TAX_RATE - DISCOUNT);
    });

    const order = await Order.create({
      userId,
      totalPrice,
      status: "Confirmed",
    });

    for (const i of items) {
      await OrderItem.create({
        orderId: order.id,
        productId: i.productId,
        artistId: i.artistId,
        quantity: i.quantity,
        price: i.product.productPrice,
        totalPrice: i.product.productPrice * i.quantity,
      });

      await i.product.update({
        productQuantity: i.product.productQuantity - i.quantity,
      });

      await i.destroy();
    }

    res.json({
      order,
      message: "Order placed successfully",
      itemsBought: items.length,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};