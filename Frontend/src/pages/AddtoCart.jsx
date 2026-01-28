import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2, Minus, Plus, PackageCheck } from "lucide-react";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/cart");
      console.log(res.data.data);
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
    const ids = cart.map((item) => item.id);
    navigate("/checkout", { state: { cartItemIds: ids } });
  };

  return (
    <main className="max-w-6xl mx-auto mt-20 p-4 pt-6 min-h-[520px] pb-12">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart size={28} className="text-[#3593A6]" />
        <h1 className="text-3xl font-medium tracking-tight text-gray-900">
          Your Cart
        </h1>
      </div>

      {cart.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center min-h-[340px] py-10 px-4 bg-white rounded-2xl shadow-lg border border-gray-100">
          <ShoppingCart size={40} className="text-gray-300 mb-3" />
          <h2 className="text-base font-medium text-gray-700 mb-1">
            Your cart is empty
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            Looks like you haven&apos;t added anything yet.
          </p>
          <button
            onClick={() => navigate("/merchandise")}
            className="flex items-center gap-2 px-4 py-2 bg-[#3593A6] text-white text-sm font-medium rounded-lg shadow hover:bg-[#256d7b] transition"
          >
            <PackageCheck size={16} /> Shop Now
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cart.map((item) => (
          <div
            key={item.id}
            className="flex bg-white rounded-2xl shadow-lg border border-gray-100 p-4 gap-4 items-center hover:shadow-2xl transition min-h-[120px]"
          >
            <img
              src={`http://localhost:5000/${item.product.productImage}`}
              className="w-20 h-20 rounded-xl object-cover border border-gray-200 shadow-sm"
              alt={item.product.productName}
            />
            <div className="flex-1 min-w-0">
              <h2 className="font-medium text-base text-gray-900 truncate">
                {item.product.productName}
              </h2>
              <p className="text-xs text-gray-500 mb-0.5">
                Artist:{" "}
                <span className="font-normal text-gray-700">
                  {item.artist.username}
                </span>
              </p>
              <p className="text-sm font-medium text-[#3593A6]">
                ${item.product.productPrice}
              </p>

              <div className="flex items-center gap-2 mt-3">
                <button
                  className="p-1.5 bg-gray-100 rounded-full border border-gray-200 hover:bg-gray-200"
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="font-medium text-base px-1">
                  {item.quantity}
                </span>
                <button
                  className="p-1.5 bg-gray-100 rounded-full border border-gray-200 hover:bg-gray-200"
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>

                <button
                  className="ml-auto p-1.5 bg-red-50 border border-red-200 rounded-full hover:bg-red-100 transition"
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove item"
                >
                  <Trash2 size={14} className="text-red-500" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="mt-6 flex justify-end">
          <button
            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white font-medium rounded-xl shadow hover:bg-green-700 transition text-base"
            onClick={buyAll}
          >
            <PackageCheck size={16} /> Buy All
          </button>
        </div>
      )}
    </main>
  );
};

export default CartPage;
