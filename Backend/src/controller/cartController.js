
import CartItem from "../model/Cart.js";
import {Product} from "../model/Product.js";

export const addToCart = async (req, res) => {
     console.log("api hit")
  const { productId, quantity } = req.body;
  const userId = req.user.id; 
  try {
    console.log(productId)
    const product = await Product.findByPk(productId);
    if (!product) {
             console.log("product not fount")
        return res.status(404).json({ message: "Product not found" }) 
   };

    const existing = await CartItem.findOne({ where: { userId, productId } });
    if (existing) {
      existing.quantity += quantity;
      await existing.save();
      return res.status(200).json({ data: existing, message: "Cart updated" });
    }

    const newItem = await CartItem.create({
      userId,
      productId,
      artistId: product.createdBy, 
      quantity,
    });

    res.status(201).json({ data: newItem, message: "Added to cart" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

export const viewCart = async (req, res) => {
    console.log("fetch cart item api hit ")
  const userId = req.user.id;
  console.log(userId)
  try {
    const cart = await CartItem.findAll({
      where: { userId },
      include: [{ model: Product }, { association: "artist", attributes: ["name"] }],
    });
    console.log(cart)
    res.status(200).json({ data: cart });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: err.message });
  }
};

export const updateCartQuantity = async (req, res) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;
  try {
    const item = await CartItem.findByPk(cartItemId);
    if (!item) return res.status(404).json({ message: "Cart item not found" });
    item.quantity = quantity;
    await item.save();
    res.json({ data: item, message: "Quantity updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const removeCartItem = async (req, res) => {
  const { cartItemId } = req.params;
  try {
    await CartItem.destroy({ where: { id: cartItemId } });
    res.json({ message: "Item removed from cart" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
