import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { ClipboardList, Calendar, Package, ShoppingBag, CheckCircle, DollarSign, TrendingUp, Star, Award, Gift } from "lucide-react";

function OrderCard({ order }) {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status) => {
    switch(status) {
      case "Confirmed":
        return "bg-gradient-to-r from-emerald-500 to-emerald-600";
      case "Cancelled":
        return "bg-gradient-to-r from-red-500 to-red-600";
      case "Active":
        return "bg-gradient-to-r from-blue-500 to-blue-600";
      default:
        return "bg-gradient-to-r from-slate-500 to-slate-600";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg mb-4 overflow-hidden hover:shadow-xl transition-all duration-300 border border-slate-200 hover:scale-[1.01]">
      {/* Colored Header Strip */}
      <div className={`h-1.5 ${getStatusColor(order.status)}`}></div>
      
      <div className="p-5">
        {/* Order Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3593A6] to-[#2d7a8a] flex items-center justify-center shadow-md">
                <ClipboardList className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                <Star className="w-2.5 h-2.5 text-yellow-800 fill-yellow-800" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-800 mb-0.5">
                Order #{order.id}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="w-3.5 h-3.5" />
                <span className="font-semibold">
                  {new Date(order.createdAt).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-md ${getStatusColor(order.status)}`}
            >
              {order.status}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {order.OrderItems.length} {order.OrderItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-3 mb-4">
          <div className="space-y-2.5">
            {order.OrderItems.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-3 bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-all"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={`http://localhost:5000/${item.product.productImage}`}
                    alt={item.product.productName}
                    className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-sm"
                  />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-[#3593A6] to-[#2d7a8a] text-white text-xs font-black rounded-full flex items-center justify-center shadow-md border-2 border-white">
                    {item.quantity}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-800 mb-1 text-sm line-clamp-1">
                    {item.product.productName}
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-[#3593A6]/10 px-2 py-0.5 rounded">
                      <Package className="w-3 h-3 text-[#3593A6]" />
                      <span className="text-xs font-bold text-[#3593A6]">
                        Qty: {item.quantity}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded">
                      <TrendingUp className="w-3 h-3 text-purple-600" />
                      <span className="text-xs font-bold text-purple-600">
                        Popular
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="text-xs text-slate-400 mb-0.5 font-semibold">Subtotal</p>
                  <p className="font-black text-[#3593A6] text-base">
                    NPR {parseFloat(item.totalPrice).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Total */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] rounded-xl p-4 shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white/90 mb-0.5">Total Amount</p>
              <p className="text-2xl font-black text-white">
                NPR {parseFloat(order.totalPrice).toLocaleString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/20 px-3 py-1.5 rounded-lg">
              <p className="text-xs text-white/80 mb-0.5">You Saved</p>
              <p className="text-sm font-bold text-yellow-300">15%</p>
            </div>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#3593A6]/10 to-purple-500/10 rounded-2xl blur-2xl"></div>
          <div className="relative bg-white rounded-2xl shadow-xl p-5 border border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3593A6] to-[#2d7a8a] flex items-center justify-center shadow-lg">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-black bg-gradient-to-r from-[#3593A6] to-purple-600 bg-clip-text text-transparent mb-1">
                    Order History
                  </h1>
                  <p className="text-slate-600 text-sm font-medium">Track and manage all your orders</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-2 rounded-xl shadow-lg">
                <Gift className="w-4 h-4 text-white" />
                <span className="text-white font-bold text-sm">VIP Member</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Total Orders */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#3593A6] rounded-2xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl shadow-lg p-4 border border-slate-200 hover:shadow-xl transition-all hover:border-[#3593A6]/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3593A6]/10 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 text-[#3593A6]" />
                  </div>
                  <TrendingUp className="w-4 h-4 text-[#3593A6]" />
                </div>
                <p className="text-slate-500 text-xs mb-1 font-bold">Total Orders</p>
                <p className="text-3xl font-black text-slate-800 mb-1">{stats.totalOrders}</p>
                <p className="text-slate-400 text-xs font-medium">All time purchases</p>
              </div>
            </div>

            {/* Active Orders */}
            <div className="relative group">
              <div className="absolute inset-0 bg-emerald-500 rounded-2xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl shadow-lg p-4 border border-slate-200 hover:shadow-xl transition-all hover:border-emerald-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div className="px-2 py-0.5 bg-emerald-100 rounded-full">
                    <span className="text-emerald-700 font-bold text-xs">ACTIVE</span>
                  </div>
                </div>
                <p className="text-slate-500 text-xs mb-1 font-bold">Confirmed Orders</p>
                <p className="text-3xl font-black text-emerald-600 mb-1">{stats.activeOrders}</p>
                <p className="text-slate-400 text-xs font-medium">Ready for delivery</p>
              </div>
            </div>

            {/* Total Spent */}
            <div className="relative group">
              <div className="absolute inset-0 bg-[#3593A6] rounded-2xl blur-sm opacity-0 group-hover:opacity-20 transition-opacity"></div>
              <div className="relative bg-white rounded-2xl shadow-lg p-4 border border-slate-200 hover:shadow-xl transition-all hover:border-[#3593A6]/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3593A6]/10 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-[#3593A6]" />
                  </div>
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                </div>
                <p className="text-slate-500 text-xs mb-1 font-bold">Total Spent</p>
                <p className="text-2xl font-black text-[#3593A6] mb-1">
                  NPR {parseFloat(stats.totalSpent).toLocaleString()}
                </p>
                <p className="text-slate-400 text-xs font-medium">Lifetime value</p>
              </div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg p-1.5 mb-6 border border-slate-200">
          <div className="flex gap-1.5">
            {["All", "Completed", "Cancelled"].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`flex-1 px-4 py-2.5 rounded-xl font-bold transition-all text-sm ${
                  filter === filterOption
                    ? "bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] text-white shadow-md"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {filterOption}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#3593A6] border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-600 font-semibold mt-4">Loading your orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard key={order.id} order={order} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-12 border border-slate-200">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Package className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-xl font-black text-slate-700 mb-2">
                {filter === "All" ? "No orders yet" : `No ${filter.toLowerCase()} orders`}
              </h3>
              <p className="text-slate-500 mb-4">
                {filter === "All" 
                  ? "Start shopping to see your order history!" 
                  : `You don't have any ${filter.toLowerCase()} orders.`}
              </p>
              <button className="px-6 py-2.5 bg-gradient-to-r from-[#3593A6] to-[#2d7a8a] text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all text-sm">
                Browse Products
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}