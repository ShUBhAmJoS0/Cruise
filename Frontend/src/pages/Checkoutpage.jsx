import { useEffect, useState } from "react";
import api from "../api/axios";
import { useLocation, useNavigate } from "react-router-dom";

const TAX_RATE = 0.1; 
const DISCOUNT = 0;

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItemIds } = location.state || {};
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

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
      navigate("/receipt", { state: { items, total, tax, discount } });
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    }
  };

  return (
    <main className="max-w-6xl mx-auto mt-20 px-4">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      {loading && <p>Loading...</p>}

      {items.length === 0 && !loading && <p>No items to checkout.</p>}

      {items.map(item => (
        <div key={item.id} className="flex gap-4 bg-white rounded-lg p-4 mb-3">
          <img
            src={`http://localhost:5000/${item.product?.productImage || "default.png"}`}
            className="w-24 h-24 rounded-lg object-cover"
          />
          <div className="flex-1">
            <h2 className="font-semibold">{item.product?.productName || "Unknown Product"}</h2>
            <p className="text-sm text-gray-500">Artist: {item.artist?.name || "Unknown"}</p>
            <p className="text-sm font-medium text-gray-500">${item.product.productPrice}</p>
     <p className="text-sm font-medium text-gray-500 mt-5 mb-5">{item.product.productDescription}</p>
            <div className="flex items-center gap-2 mt-2">
              <button
                className="px-2 bg-gray-200 rounded"
                onClick={() => updateQty(item.id, item.quantity - 1)}
              >-</button>
              <span>{item.quantity}</span>
              <button
                className="px-2 bg-gray-200 rounded"
                onClick={() => updateQty(item.id, item.quantity + 1)}
              >+</button>
            </div>
          </div>
          <p className="font-medium">
            ${( (item.product?.productPrice ?? 0) * item.quantity ).toFixed(2)}
          </p>
        </div>
      ))}

      {items.length > 0 && (
        <div className="mt-6 bg-gray-50 p-4 rounded">
          <p>Subtotal: ${subtotal.toFixed(2)}</p>
          <p>Tax: ${tax.toFixed(2)}</p>
          <p>Discount: ${discount.toFixed(2)}</p>
          <p className="font-bold text-lg">Total: ${total.toFixed(2)}</p>

          <button
            className="mt-4 px-6 py-3 bg-[#3593A6] text-white rounded hover:bg-[#3593A6]/50"
            onClick={confirmOrder}
          >
            Confirm Order
          </button>
        </div>
      )}
    </main>
  );
};

export default CheckoutPage;
