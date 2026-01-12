import { useEffect, useState } from "react";
import api from "../api/axios";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";

const TAX_RATE = 0.1;
const DISCOUNT = 0;

const CheckoutPage = () => {
  const location = useLocation();
  const { cartItemIds } = location.state || {};
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/cart");
      setItems(res.data.data.filter(i => cartItemIds.includes(i.id)));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  const updateQty = async (id, qty) => {
    if (qty < 1) return;
    try {
      await api.put(`/api/cart/${id}`, { quantity: qty });
      setItems(prev => prev.map(i => i.id === id ? { ...i, quantity: qty } : i));
    } catch (err) {
      console.error(err);
      alert("Failed to update quantity.");
    }
  };

  const subtotal = items.reduce(
    (acc, i) => acc + (i.product?.productPrice || 0) * i.quantity,
    0
  );
  const tax = subtotal * TAX_RATE;
  const discount = subtotal * DISCOUNT;
  const total = subtotal + tax - discount;

  const confirmOrder = async () => {
    try {
      await api.post("/api/cart/order/cart", { cartItemIds });
      setReceiptData({ items, total, tax, discount });
      setShowReceipt(true);
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  return (
    <main className="max-w-6xl mx-auto mt-20 px-4">
      <div className="w-full bg-[]">
      <h1 className="text-3xl font-bold mb-6 text-[#3593A6]">Checkout</h1>
      </div>
      {loading && <p>Loading...</p>}

      {items.length === 0 && !loading && <p>No items to checkout.</p>}

      {items.map(item => (
        <div
          key={item.id}
          className="flex gap-4 bg-white rounded-2xl shadow-md p-5 mb-4 hover:shadow-xl transition"
        >
          <img
            src={`http://localhost:5000/${item.product?.productImage || "default.png"}`}
            className="w-28 h-28 rounded-xl object-cover border border-gray-200"
          />
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h2 className="font-semibold text-lg text-gray-800">{item.product?.productName || "Unknown Product"}</h2>
              <p className="text-sm text-gray-500">Artist: {item.artist?.name || "Unknown"}</p>
              <p className="text-sm font-bold text-[#3593A6] mt-2">${item.product.productPrice}</p>
              <p className="text-xs text-gray-400 mt-1">{item.product.productDescription}</p>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <button
                className="px-3 py-1 bg-[#e5f3f8] text-[#3593A6] rounded hover:bg-[#d0ebf2]"
                onClick={() => updateQty(item.id, item.quantity - 1)}
              >-</button>
              <span className="font-semibold">{item.quantity}</span>
              <button
                className="px-3 py-1 bg-[#e5f3f8] text-[#3593A6] rounded hover:bg-[#d0ebf2]"
                onClick={() => updateQty(item.id, item.quantity + 1)}
              >+</button>
              <p className="ml-auto font-bold text-gray-700">${(item.product?.productPrice ?? 0) * item.quantity}</p>
            </div>
          </div>
        </div>
      ))}


      {items.length > 0 && (
        <div className="mt-6 bg-[#f0faff] p-6 rounded-2xl shadow-md">
          <p className="text-gray-700">Subtotal: <span className="font-bold">${subtotal.toFixed(2)}</span></p>
          <p className="text-gray-700">Tax: <span className="font-bold">${tax.toFixed(2)}</span></p>
          <p className="text-gray-700">Discount: <span className="font-bold">${discount.toFixed(2)}</span></p>
          <p className="text-lg font-bold text-[#3593A6] mt-2">Total: ${total.toFixed(2)}</p>

          <button
            className="mt-4 px-6 py-3 bg-gradient-to-r from-[#3593A6] to-[#66c7d6] text-white rounded-2xl font-semibold shadow hover:scale-105 transition"
            onClick={confirmOrder}
          >
            Confirm Order
          </button>
        </div>
      )}

      {showReceipt && receiptData && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl w-96 p-6 shadow-xl relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setShowReceipt(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-bold text-[#3593A6] mb-4">Order Receipt</h2>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {receiptData.items.map(item => (
                <div key={item.id} className="flex justify-between">
                  <div>
                    {item.product.productName} (x{item.quantity}) - {item.artist?.name}
                  </div>
                  <div>${(item.product.productPrice * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            <hr className="my-3" />
            <p>Tax: ${receiptData.tax.toFixed(2)}</p>
            <p>Discount: ${receiptData.discount.toFixed(2)}</p>
            <p className="font-bold text-lg text-[#3593A6]">Grand Total: ${receiptData.total.toFixed(2)}</p>
            <p className="text-green-600 font-semibold mt-2">Your order has been confirmed!</p>
            <button
              className="mt-4 w-full px-6 py-2 bg-[#3593A6] text-white rounded-2xl hover:bg-[#3593A6]/70 transition"
              onClick={() => setShowReceipt(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default CheckoutPage;
