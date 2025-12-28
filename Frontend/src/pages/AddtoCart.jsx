import React, { useState, useEffect } from "react";
import api from "../api/axios";

const AddToCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch cart items
  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      alert("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity
  const updateQuantity = async (itemId, quantity) => {
    try {
      if (quantity < 1) {
        // Remove item if quantity < 1
        await api.delete(`/api/cart/${itemId}`);
      } else {
        await api.patch(`/api/cart/${itemId}`, { quantity });
      }
      fetchCart(); // refresh cart after update
    } catch (err) {
      console.error("Failed to update quantity:", err);
      alert("Failed to update quantity");
    }
  };

  // Remove item
  const removeItem = async (itemId) => {
    try {
      await api.delete(`/api/cart/${itemId}`);
      fetchCart(); // refresh cart after removal
    } catch (err) {
      console.error("Failed to remove item:", err);
      alert("Failed to remove item");
    }
  };

  if (loading) return <p className="p-4">Loading cart...</p>;

  if (!cart || !cart.OrderItems || cart.OrderItems.length === 0)
    return <p className="p-4">Your cart is empty.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="space-y-4">
        {cart.OrderItems.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center bg-gray-100 p-3 rounded-lg"
          >
            <div>
              <p className="font-semibold">{item.Product.name}</p>
              <p>${item.priceAtPurchase}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                className="px-2 py-1 bg-gray-300 rounded"
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                className="px-2 py-1 bg-gray-300 rounded"
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
              <button
                className="px-2 py-1 bg-red-400 text-white rounded"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right font-bold text-lg">
        Total: $
        {cart.OrderItems.reduce(
          (acc, item) => acc + item.quantity * item.priceAtPurchase,
          0
        )}
      </div>
    </div>
  );
};

export default AddToCart;
