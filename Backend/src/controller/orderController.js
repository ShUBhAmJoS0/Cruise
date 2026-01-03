
import CartItem from "../model/Cart.js";
import Order from "../model/Order.js";
import OrderItem from "../model/OrderItems.js";

const TAX_RATE = 0.1;
const DISCOUNT = 0;   

export const buySingleItem = async (req, res) => {
    console.log("api hit for buying single item")
  const { cartItemId, quantity } = req.body;
  const userId = req.user.id;
  try {
    const item = await CartItem.findByPk(cartItemId, { include: "Product" });
    if (!item) return res.status(404).json({ message: "Cart item not found" });

    const price = item.product.productPrice;
    const totalPrice = price * quantity * (1 + TAX_RATE - DISCOUNT);

    const order = await Order.create({ userId, totalPrice, status: "Confirmed" });
    await OrderItem.create({
      orderId: order.id,
      productId: item.productId,
      artistId: item.artistId,
      quantity,
      price,
      totalPrice,
    });

    await item.destroy(); 

    res.json({ order, message: "Order placed successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const buyAllCartItems = async (req, res) => {
       console.log("api hit for buying items");

  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { cartItemId, cartItemIds, quantity } = req.body;

  try {
    let items = [];

    if (cartItemId) {
      const item = await CartItem.findByPk(cartItemId, { include: "product" });
      if (!item) return res.status(404).json({ message: "Cart item not found" });
      item.quantity = quantity || item.quantity;
      items.push(item);
    } else if (cartItemIds && cartItemIds.length > 0) {
      // Multiple items buy (cart)
      items = await CartItem.findAll({ where: { id: cartItemIds }, include: "product" });
      if (!items.length) return res.status(400).json({ message: "No items found in cart" });
    } else {
      return res.status(400).json({ message: "No items specified to buy" });
    }


    let totalPrice = 0;
    items.forEach(i => {
      totalPrice += (i.Product?.productPrice || 0) * i.quantity * (1 + TAX_RATE - DISCOUNT);
    });


    const order = await Order.create({ userId, totalPrice, status: "Confirmed" });

    for (const i of items) {
      await OrderItem.create({
        orderId: order.id,
        productId: i.productId,
        artistId: i.artistId,
        quantity: i.quantity,
        price: i.Product?.productPrice || 0,
        totalPrice: (i.Product?.productPrice || 0) * i.quantity,
      });
      await i.destroy();
    }

    res.json({ order, message: "Order placed successfully", itemsBought: items.length });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};
