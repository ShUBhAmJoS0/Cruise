import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ReceiptPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items, total, tax, discount } = location.state || {};

  if (!items) {
    return <p>No receipt data found</p>;
  }

  return (
    <main className="max-w-6xl mx-auto mt-20 px-4">
      <h1 className="text-3xl font-bold mb-6">Order Receipt</h1>

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        {items.map(item => (
          <div key={item.id} className="flex justify-between mb-2">
            <div>
              {item.product.productName} (x{item.quantity}) - {item.artist.username}
            </div>
            <div>${(item.product.productPrice * item.quantity).toFixed(2)}</div>
          </div>
        ))}

        <hr className="my-2"/>
        <p>Tax: ${tax.toFixed(2)}</p>
        <p>Discount: ${discount.toFixed(2)}</p>
        <p className="font-bold text-lg">Grand Total: ${total.toFixed(2)}</p>
      </div>

      <p className="text-green-600 font-semibold mb-4"> Your order has been confirmed!</p>

      <button
        className="px-6 py-3 bg-[#3593A6] text-white rounded hover:bg-[#3593A6]/60"
        onClick={() => navigate("/")}
      >
        Back to Home
      </button>
    </main>
  );
};

export default ReceiptPage;
