import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/cart");
      console.log(res.data.data)
      setCart(res.data.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (id, qty) => {
    if (qty < 1) return;
    try {
      await api.put(`/api/cart/${id}`, { quantity: qty });
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/api/cart/${id}`);
      fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const buyAll = () => {
    const ids = cart.map(item => item.id);
    navigate("/checkout", { state: { cartItemIds: ids } });
  };

  return (
    <main className="max-w-6xl mx-auto mt-20 px-4">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cart.length === 0 && !loading && <p>No items in cart</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cart.map(item => (
          <div key={item.id} className="flex bg-white rounded-lg shadow p-4 gap-4">
            <img
              src={`http://localhost:5000/${item.product.productImage}`}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h2 className="font-semibold">{item.product.productName}</h2>
              <p className="text-sm text-gray-500">Artist: {item.artist.username}</p>
              <p className="text-sm font-medium">${item.product.productPrice}</p>

              <div className="flex items-center gap-2 mt-2">
                <button
                  className="px-2 bg-gray-200 rounded"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                >-</button>
                <span>{item.quantity}</span>
                <button
                  className="px-2 bg-gray-200 rounded"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                >+</button>

                <button
                  className="ml-auto px-3 py-1 bg-red-500 text-white rounded"
                  onClick={() => removeItem(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-500"
            onClick={buyAll}
          >
            Buy All
          </button>
        </div>
      )}
    </main>
  );
};

export default CartPage;
