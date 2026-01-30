import React, { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ReceiptPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, total, tax, discount } = location.state || {};

  const orderId = useMemo(() => {
    const timestamp = new Date().getTime();
    return timestamp.toString(36).toUpperCase();
  }, []);

  if (!items) {
    return <p>No receipt data found</p>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-3 bg-emerald-50 border-2 border-emerald-500 rounded-full px-8 py-4">
            <svg className="w-7 h-7 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-emerald-700 font-semibold text-lg">Order Confirmed Successfully</span>
          </div>
        </div>


        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-slate-800 mb-3 tracking-tight">Order Receipt</h1>
          <p className="text-slate-500 text-lg">Thank you for your purchase</p>
        </div>


        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden mb-8">

          <div className="bg-[#3593A6] px-8 py-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-white/80 text-sm font-medium mb-1">Order Date</p>
                <p className="text-white text-lg font-semibold">{new Date().toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                })}</p>
              </div>
              <div className="text-right">
                <p className="text-white/80 text-sm font-medium mb-1">Order ID</p>
                <p className="text-white text-lg font-semibold">#{orderId}</p>
              </div>
            </div>
          </div>


          <div className="px-8 py-6">
            <h2 className="text-slate-800 font-bold text-xl mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#3593A6] rounded-full"></span>
              Order Items
            </h2>

            <div className="space-y-5">
              {items.map((item, index) => (
                <div key={item.id} className="group">
                  <div className="flex justify-between items-start gap-4 pb-5 border-b border-slate-100">
                    <div className="flex-1">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 w-10 h-10 rounded-xl bg-[#3593A6]/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[#3593A6] font-bold text-sm">{index + 1}</span>
                        </div>
                        <div>
                          <h3 className="text-slate-800 font-semibold text-lg mb-1.5">
                            {item.product.productName}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="font-medium">by {item.artist.username}</span>
                          </div>
                          <div className="inline-flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-1.5">
                            <span className="text-slate-600 text-sm font-medium">Quantity:</span>
                            <span className="text-[#3593A6] font-bold text-sm">{item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-slate-400 text-sm mb-1">NPR {item.product.productPrice.toFixed(2)} each</p>
                      <p className="text-slate-800 font-bold text-xl">
                        NPR {(item.product.productPrice * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Section */}
          <div className="px-8 py-6 bg-slate-50 border-t border-slate-200">
            <h2 className="text-slate-800 font-bold text-xl mb-5 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-[#3593A6] rounded-full"></span>
              Order Summary
            </h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between items-center py-2">
                <span className="text-slate-600 font-medium">Subtotal</span>
                <span className="text-slate-800 font-semibold text-lg">
                  NPR {(total - tax + discount).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between items-center py-2">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 font-medium">Tax</span>
                  <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded-md font-medium">
                    Included
                  </span>
                </div>
                <span className="text-slate-800 font-semibold text-lg">
                  NPR {tax.toFixed(2)}
                </span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 font-medium">Discount</span>
                    <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md font-medium">
                      Applied
                    </span>
                  </div>
                  <span className="text-emerald-600 font-semibold text-lg">
                    -NPR {discount.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-5 border-t-2 border-slate-200">
              <div className="flex justify-between items-center">
                <span className="text-slate-800 font-bold text-2xl">Grand Total</span>
                <span className="text-[#3593A6] font-bold text-3xl">
                  NPR {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>


        <div className="flex justify-center">
          <button
            className="group px-10 py-4 bg-[#3593A6] text-white rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-[#2d7a8a] transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-3"
            onClick={() => navigate("/")}
          >
            <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-10">
          <p className="text-slate-400 text-sm">
            A confirmation email has been sent to your registered email address
          </p>
        </div>
      </div>
    </main>
  );
};

export default ReceiptPage;