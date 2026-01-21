import React, { useState, useEffect } from "react";
import api from "../api/axios";

function OrderCard({ order }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-md mb-5 overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-200">
      <div className="p-5">
      
        <div className="flex justify-between items-start mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-teal-50 p-1.5 rounded-lg">
                <svg className="w-4 h-4 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  Order #{order.id}
                </h3>
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {new Date(order.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
          </div>

          <span
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
              order.status === "Confirmed"
                ? "bg-green-50 text-green-700 border border-green-200"
                : order.status === "Cancelled"
                ? "bg-red-50 text-red-700 border border-red-200"
                : "bg-gray-50 text-gray-700 border border-gray-200"
            }`}
          >
            {order.status}
          </span>
        </div>

     
        <div className="space-y-3 mb-4">
          {order.OrderItems.map((item, index) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 py-3 ${
                index !== order.OrderItems.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={`http://localhost:5000/${item.product.productImage}`}
                  alt={item.product.productName}
                  className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                />
                <div className="absolute -top-1.5 -right-1.5 bg-teal-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {item.quantity}
                </div>
              </div>

              <div className="flex-1">
                <p className="font-semibold text-gray-800 mb-0.5">
                  {item.product.productName}
                </p>
                <p className="text-xs text-gray-500">
                  Quantity: {item.quantity}
                </p>
              </div>

              <div className="text-right">
                <p className="text-xs text-gray-500 mb-0.5">Subtotal</p>
                <p className="font-semibold text-gray-800">
                  NPR {parseFloat(item.totalPrice).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

      
        <div className="flex justify-end items-center mt-4 pt-4 border-t border-gray-200">
          <div className="bg-teal-50 px-5 py-2.5 rounded-lg border border-teal-200">
            <p className="text-xs font-medium text-teal-700 mb-0.5">Total Amount</p>
            <p className="text-xl font-bold text-teal-600">
              NPR {parseFloat(order.totalPrice).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}


export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("All"); 

  useEffect(() => {
    loadOrders();
  }, []);

const loadOrders = async () => {
  setIsLoading(true);
  try {
    const res = await api.get("/api/orderhistory");
    setOrders(res.data.orders || []);
  } catch (err) {
    console.error("LOAD ORDERS ERROR:", err);
  } finally {
    setIsLoading(false);
  }
};
useEffect(() => {
  if (orders.length > 0) {
    const totalOrders = orders.length;
    const activeOrders = orders.filter(o => o.status === "Confirmed").length;
    const totalSpent = orders.reduce(
      (sum, o) => sum + parseFloat(o.totalPrice),
      0
    );

    setStats({ totalOrders, activeOrders, totalSpent });
  }
}, [orders]);


  const handleCancelOrder = async (orderId) => {
    try {
      await api.put(`/api/orderhistory/${orderId}/cancel`);
      await loadOrders();
    } catch (err) {
      console.error("CANCEL ORDER ERROR:", err);
      alert("Failed to cancel order. Please try again.");
    }
  };

  const filteredOrders = orders.filter(order => {
    if (filter === "All") return true;
    return order.status === filter;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 rounded-xl" style={{ backgroundColor: '#3593a6' }}>
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Order History
              </h1>
              <p className="text-gray-600 text-sm">View and manage your ticket orders</p>
            </div>
          </div>
        </div>

       
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs mb-1 font-medium">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
                  <p className="text-gray-400 text-xs mt-1">All time</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(53, 147, 166, 0.1)' }}>
                  <svg className="w-6 h-6" style={{ color: '#3593a6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs mb-1 font-medium">Active Orders</p>
                  <p className="text-3xl font-bold text-green-600">{stats.activeOrders}</p>
                  <p className="text-gray-400 text-xs mt-1">Confirmed</p>
                </div>
                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center border border-green-100">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-5 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs mb-1 font-medium">Total Spent</p>
                  <p className="text-2xl font-bold text-gray-800">
                    NPR {parseFloat(stats.totalSpent).toLocaleString()}
                  </p>
                  <p className="text-gray-400 text-xs mt-1">Lifetime</p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center border border-orange-100">
                  <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

    
        <div className="bg-white rounded-xl shadow-md p-1.5 mb-6 flex gap-1.5 border border-gray-200">
          {["All", "Active", "Completed", "Cancelled"].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all text-sm ${
                filter === filterOption
                  ? "text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
              style={filter === filterOption ? { backgroundColor: '#3593a6' } : {}}
            >
              {filterOption}
            </button>
          ))}
        </div>

      
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 rounded-full animate-spin border-t-transparent absolute top-0" style={{ borderColor: '#3593a6', borderTopColor: 'transparent' }}></div>
            </div>
            <p className="text-gray-600 font-medium mt-4">Loading your orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
  <OrderCard key={order.id} order={order} />
))
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-md p-12 border border-gray-200">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-200">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-xl font-bold text-gray-700 mb-2">
                {filter === "All" ? "No orders yet" : `No ${filter.toLowerCase()} orders`}
              </p>
              <p className="text-gray-500">
                {filter === "All" 
                  ? "Start booking tickets to see your order history!" 
                  : `You don't have any ${filter.toLowerCase()} orders.`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}