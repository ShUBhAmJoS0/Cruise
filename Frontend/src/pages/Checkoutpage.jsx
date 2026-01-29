import { useEffect, useState } from "react";
import api from "../api/axios";
import { useLocation } from "react-router-dom";
import { 
  X, 
  ShoppingBag, 
  Minus, 
  Plus, 
  Trash2, 
  Package, 
  User,
  CheckCircle,
  CreditCard,
  Receipt
} from "lucide-react";

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
      toast.success("order confirmed sucessfully")
      setShowReceipt(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <ShoppingBag className="w-8 h-8 text-[#3593A6]" />
            <h1 className="text-4xl font-black text-slate-800">Checkout</h1>
          </div>
          <p className="text-slate-600">Review your items and complete your purchase</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Cart Items Section */}
          <div className="lg:col-span-2">
            {loading && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <div className="w-16 h-16 border-4 border-[#3593A6]/30 border-t-[#3593A6] rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-600 font-medium">Loading your cart...</p>
              </div>
            )}

            {items.length === 0 && !loading && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <Package className="w-20 h-20 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-800 mb-2">No items to checkout</h3>
                <p className="text-slate-500">Your cart is empty</p>
              </div>
            )}

            {items.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                    <Package className="w-5 h-5 text-[#3593A6]" />
                    Cart Items ({items.length})
                  </h2>
                </div>

                {items.map(item => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all border-2 border-transparent hover:border-[#3593A6]/20"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={`http://localhost:5000/${item.product?.productImage || "default.png"}`}
                          alt={item.product?.productName}
                          className="w-28 h-28 rounded-xl object-cover border-2 border-slate-100"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-slate-800 mb-1">
                            {item.product?.productName || "Unknown Product"}
                          </h3>
                          
                          <div className="flex items-center gap-2 mb-2">
                            <User className="w-4 h-4 text-slate-400" />
                            <p className="text-sm text-slate-600">
                              {item.artist?.name || "Unknown Artist"}
                            </p>
                          </div>

                          {item.product?.productDescription && (
                            <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                              {item.product.productDescription}
                            </p>
                          )}

                          <p className="text-lg font-black text-[#3593A6]">
                            ${Number(item.product?.productPrice || 0).toFixed(2)}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1">
                            <button
                              className="w-8 h-8 flex items-center justify-center bg-white text-[#3593A6] rounded-lg hover:bg-[#3593A6] hover:text-white transition-all shadow-sm"
                              onClick={() => updateQty(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-bold text-slate-800 w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              className="w-8 h-8 flex items-center justify-center bg-white text-[#3593A6] rounded-lg hover:bg-[#3593A6] hover:text-white transition-all shadow-sm"
                              onClick={() => updateQty(item.id, item.quantity + 1)}
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="text-xs text-slate-500 mb-1">Subtotal</p>
                            <p className="text-xl font-black text-slate-800">
                              ${((item.product?.productPrice ?? 0) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary Section */}
          {items.length > 0 && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <Receipt className="w-5 h-5 text-[#3593A6]" />
                  <h2 className="text-xl font-bold text-slate-800">Order Summary</h2>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="font-semibold text-slate-800">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-slate-600 flex items-center gap-2">
                      Tax
                      <span className="text-xs bg-slate-100 px-2 py-0.5 rounded">10%</span>
                    </span>
                    <span className="font-semibold text-slate-800">
                      ${tax.toFixed(2)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between items-center py-2">
                      <span className="text-emerald-600">Discount</span>
                      <span className="font-semibold text-emerald-600">
                        -${discount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="border-t-2 border-slate-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-slate-800">Total</span>
                      <span className="text-2xl font-black text-[#3593A6]">
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  className="w-full py-4 bg-[#3593A6] text-white rounded-xl font-bold hover:bg-[#2d7a8a] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  onClick={confirmOrder}
                >
                  <CreditCard className="w-5 h-5" />
                  Confirm Order
                </button>

                <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-emerald-700">
                      Secure checkout · Free shipping on orders over $50
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl relative animate-[slideUp_0.3s_ease-out]">
            {/* Modal Header */}
            <div className="bg-[#3593A6] rounded-t-3xl p-6 relative">
              <button
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/20 hover:bg-white/30 rounded-full transition-all"
                onClick={() => setShowReceipt(false)}
              >
                <X className="w-5 h-5 text-white" />
              </button>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-black text-white mb-2">Order Confirmed!</h2>
                <p className="text-white/90">Your order has been successfully placed</p>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-[#3593A6]" />
                  Order Details
                </h3>
                
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {receiptData.items.map((item, index) => (
                    <div 
                      key={item.id} 
                      className="flex justify-between items-start gap-4 py-3 border-b border-slate-100 last:border-0"
                    >
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 text-sm">
                          {item.product.productName}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500">Qty: {item.quantity}</span>
                          <span className="text-xs text-slate-400">•</span>
                          <span className="text-xs text-slate-500">{item.artist?.name}</span>
                        </div>
                      </div>
                      <p className="font-bold text-slate-800">
                        ${(item.product.productPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3 mb-6 p-4 bg-slate-50 rounded-xl">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax</span>
                  <span className="font-semibold text-slate-800">${receiptData.tax.toFixed(2)}</span>
                </div>
                {receiptData.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-emerald-600">Discount</span>
                    <span className="font-semibold text-emerald-600">-${receiptData.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                  <span className="font-bold text-slate-800">Grand Total</span>
                  <span className="text-2xl font-black text-[#3593A6]">
                    ${receiptData.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                className="w-full py-3 bg-[#3593A6] text-white rounded-xl font-bold hover:bg-[#2d7a8a] transition-all"
                onClick={() => setShowReceipt(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default CheckoutPage;