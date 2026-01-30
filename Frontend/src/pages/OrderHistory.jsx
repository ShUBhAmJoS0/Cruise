import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { ClipboardList, Calendar, Package, ShoppingBag, CheckCircle, DollarSign, TrendingUp, Star, Award, Gift, X, Trash2, Eye, MapPin, CreditCard, Truck, User, Tag, BarChart3, Clock, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// Order Details Modal Component


function OrderDetailsModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-500";
      case "Cancelled":
        return "bg-red-500";
      case "Active":
        return "bg-blue-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="bg-slate-50 px-8 py-6 border-b border-slate-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-[#3593A6] rounded-2xl flex items-center justify-center">
                <ClipboardList className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Order Details</h2>
                <p className="text-slate-600">Order #{order.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-bold text-white ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-slate-200 hover:bg-slate-300 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Order Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-5 h-5 text-[#3593A6]" />
                <span className="font-semibold text-slate-700">Order Date</span>
              </div>
              <p className="text-slate-600">
                {new Date(order.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-[#3593A6]" />
                <span className="font-semibold text-slate-700">Customer</span>
              </div>
              <p className="text-slate-600">{order.User?.name || 'N/A'}</p>
              <p className="text-sm text-slate-500">{order.User?.email || 'N/A'}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="w-5 h-5 text-[#3593A6]" />
                <span className="font-semibold text-slate-700">Total Amount</span>
              </div>
              <p className="text-2xl font-bold text-[#3593A6]">NPR {parseFloat(order.totalPrice).toLocaleString()}</p>
            </div>
          </div>

          {/* Products Section */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-3">
              <Package className="w-6 h-6 text-[#3593A6]" />
              Ordered Products ({order.OrderItems?.length || 0})
            </h3>

            <div className="space-y-4">
              {order.OrderItems?.map((item, index) => (
                <div key={item.id} className="bg-white border-2 border-slate-100 rounded-2xl p-6 hover:border-[#3593A6]/30 transition-colors">
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={`http://localhost:5000/${item.product.productImage}`}
                        alt={item.product.productName}
                        className="w-24 h-24 rounded-xl object-cover border-2 border-slate-200"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-slate-800 mb-1">{item.product.productName}</h4>
                          <p className="text-slate-600 text-sm mb-2 line-clamp-2">{item.product.productDescription}</p>
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Tag className="w-4 h-4" />
                              SKU: {item.product.skuNumber}
                            </span>
                            <span className="flex items-center gap-1">
                              <BarChart3 className="w-4 h-4" />
                              {item.product.productCategory}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500 mb-1">Unit Price</p>
                          <p className="font-bold text-[#3593A6]">NPR {parseFloat(item.price).toLocaleString()}</p>
                        </div>
                      </div>

                      {/* Quantity and Subtotal */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#3593A6]/10 px-3 py-1 rounded-lg">
                            <span className="font-semibold text-[#3593A6]">Qty: {item.quantity}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-slate-500 mb-1">Subtotal</p>
                          <p className="text-lg font-bold text-slate-800">NPR {parseFloat(item.totalPrice).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-slate-50 rounded-2xl p-6">
            <h4 className="text-lg font-bold text-slate-800 mb-4">Order Summary</h4>
            <div className="space-y-3">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal ({order.OrderItems?.length || 0} items)</span>
                <span>NPR {parseFloat(order.totalPrice).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Tax (10%)</span>
                <span>NPR {(parseFloat(order.totalPrice) * 0.1).toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-300 pt-3 flex justify-between font-bold text-lg text-slate-800">
                <span>Total Amount</span>
                <span>NPR {(parseFloat(order.totalPrice) * 1.1).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderCard({ order, onDeleteOrder, onViewDetails }) {
  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-emerald-500";
      case "Cancelled":
        return "bg-red-500";
      case "Active":
        return "bg-blue-500";
      default:
        return "bg-slate-500";
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg mb-6 overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-slate-100 hover:border-[#3593A6]/20 cursor-pointer group">
      <div className="p-6">
        {/* Order Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 bg-[#3593A6] rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <ClipboardList className="w-7 h-7 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center border-3 border-white shadow-md">
                <Star className="w-3 h-3 text-yellow-800 fill-yellow-800" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 mb-1 group-hover:text-[#3593A6] transition-colors">
                Order #{order.id}
              </h3>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Calendar className="w-4 h-4" />
                <span className="font-medium">
                  {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-bold text-white shadow-lg ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onViewDetails(order);
                }}
                className="p-2 rounded-xl bg-slate-100 hover:bg-[#3593A6] hover:text-white text-slate-600 transition-all duration-200 group/btn"
                title="View Details"
              >
                <Eye className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
              </button>
              {(order.status === "Confirmed") && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteOrder(order.id);
                  }}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-red-500 hover:text-white text-slate-600 transition-all duration-200 group/btn"
                  title="Delete Order"
                >
                  <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Package className="w-4 h-4" />
              <span className="font-medium">
                {order.OrderItems.length} {order.OrderItems.length === 1 ? 'item' : 'items'}
              </span>
            </div>
          </div>
        </div>

        {/* Featured Product Preview */}
        {order.OrderItems.length > 0 && (
          <div className="mb-6">
            <div className="bg-slate-50 rounded-2xl p-4 border-2 border-slate-100">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <img
                    src={`http://localhost:5000/${order.OrderItems[0].product.productImage}`}
                    alt={order.OrderItems[0].product.productName}
                    className="w-20 h-20 rounded-xl object-cover border-2 border-white shadow-md"
                  />
                  {order.OrderItems.length > 1 && (
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#3593A6] text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                      +{order.OrderItems.length - 1}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 mb-1 text-lg line-clamp-1">
                    {order.OrderItems[0].product.productName}
                  </h4>
                  <p className="text-slate-600 text-sm mb-2 line-clamp-2">
                    {order.OrderItems[0].product.productDescription}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-[#3593A6]/10 px-3 py-1 rounded-lg">
                      <Package className="w-4 h-4 text-[#3593A6]" />
                      <span className="text-sm font-semibold text-[#3593A6]">
                        Qty: {order.OrderItems[0].quantity}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-lg">
                      <Tag className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-600">
                        {order.OrderItems[0].product.productCategory}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-slate-500 mb-1 font-medium">Total</p>
                  <p className="text-2xl font-bold text-[#3593A6]">
                    NPR {parseFloat(order.totalPrice).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order Footer */}
        <div className="flex items-center justify-between bg-slate-50 rounded-2xl p-4 border-2 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3593A6] rounded-xl flex items-center justify-center shadow-md">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-700">Order Total</p>
              <p className="text-lg font-bold text-[#3593A6]">
                NPR {parseFloat(order.totalPrice).toLocaleString()}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(order);
            }}
            className="px-6 py-2 bg-[#3593A6] hover:bg-[#2d7a8a] text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 group/btn"
          >
            <Eye className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
            View Details
          </button>
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
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/api/orderhistory");
      setOrders(res.data.orders || []);
      console.log(res.data.orders)
    } catch (err) {
      console.error("LOAD ORDERS ERROR:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (orders.length > 0) {
      const totalOrders = orders.length;
      const confirmedOrders = orders.filter(o => o.status === "Confirmed").length;
      const cancelledOrders = orders.filter(o => o.status === "Cancelled").length;
      const totalSpent = orders.reduce(
        (sum, o) => sum + parseFloat(o.totalPrice),
        0
      );
      const avgOrderValue = totalSpent / totalOrders;
      const recentOrders = orders.filter(o =>
        new Date(o.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      ).length;

      setStats({
        totalOrders,
        confirmedOrders,
        cancelledOrders,
        totalSpent,
        avgOrderValue,
        recentOrders
      });
    }
  }, [orders]);


  const handleDeleteOrder = async (orderId) => {
    if (!confirm("Are you sure you want to permanently delete this order? This action cannot be undone.")) return;

    try {
      await api.delete(`/api/orderhistory/${orderId}`);
      toast.success("Order cancelled sucessfully")
      await loadOrders();
    } catch (err) {
      console.error("DELETE ORDER ERROR:", err);
      toast.error("Failed to delete order. Please try again.");
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  const filteredOrders = orders.filter(order => {
    if (filter === "All") return true;
    return order.status === filter;
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#3593A6] rounded-3xl flex items-center justify-center shadow-xl">
                  <ClipboardList className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-slate-800 mb-2">
                    Order History
                  </h1>
                  <p className="text-slate-600 text-lg">Track, manage and explore all your orders</p>
                </div>
              </div>
              <div className="hidden md:flex items-center gap-3 bg-yellow-400 px-6 py-3 rounded-2xl shadow-lg">
                <Gift className="w-5 h-5 text-yellow-800" />
                <span className="text-yellow-800 font-bold text-sm">VIP Member</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Enhanced Overview */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Stats */}
            {stats && (
              <>
                <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-[#3593A6]" />
                    Overview
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Total Orders</span>
                      <span className="font-bold text-slate-800">{stats.totalOrders}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Confirmed</span>
                      <span className="font-bold text-emerald-600">{stats.confirmedOrders}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Cancelled</span>
                      <span className="font-bold text-red-600">{stats.cancelledOrders}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Recent (30d)</span>
                        <span className="font-bold text-[#3593A6]">{stats.recentOrders}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spending Stats */}
                <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#3593A6]" />
                    Spending
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Total Spent</p>
                      <p className="text-2xl font-bold text-[#3593A6]">
                        NPR {parseFloat(stats.totalSpent).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 mb-1">Average Order</p>
                      <p className="text-xl font-bold text-slate-800">
                        NPR {parseFloat(stats.avgOrderValue).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#3593A6]" />
                    Quick Actions
                  </h3>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-[#3593A6] hover:bg-[#2d7a8a] text-white rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2" onClick={() => navigate("/merchandise")}>
                      <ShoppingBag className="w-4 h-4" />
                      Shop More
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-3xl shadow-xl p-6 border-2 border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[#3593A6]" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => handleViewDetails(order)}>
                        <div className="w-8 h-8 bg-[#3593A6]/20 rounded-lg flex items-center justify-center">
                          <Package className="w-4 h-4 text-[#3593A6]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 truncate">Order #{order.id}</p>
                          <p className="text-xs text-slate-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Filter Tabs */}
            <div className="bg-white rounded-3xl shadow-xl p-2 mb-6 border-2 border-slate-100">
              <div className="flex gap-2">
                {["All", "Confirmed", "Cancelled", "Completed"].map((filterOption) => (
                  <button
                    key={filterOption}
                    onClick={() => setFilter(filterOption)}
                    className={`flex-1 px-6 py-3 rounded-2xl font-bold transition-all text-sm ${filter === filterOption
                      ? "bg-[#3593A6] text-white shadow-lg"
                      : "text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    {filterOption} {filterOption !== "All" && `(${orders.filter(o => o.status === filterOption).length})`}
                  </button>
                ))}
              </div>
            </div>

            {/* Orders List */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative w-20 h-20">
                  <div className="absolute inset-0 border-4 border-slate-200 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-[#3593A6] border-t-transparent rounded-full animate-spin"></div>
                </div>
                <p className="text-slate-700 font-bold mt-6 text-lg">Loading your orders...</p>
              </div>
            ) : filteredOrders.length > 0 ? (
              <div className="space-y-6">
                {filteredOrders.map(order => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    onDeleteOrder={handleDeleteOrder}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="bg-white rounded-3xl shadow-xl p-16 border-2 border-slate-100">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Package className="w-12 h-12 text-slate-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-700 mb-4">
                    {filter === "All" ? "No orders yet" : `No ${filter.toLowerCase()} orders`}
                  </h3>
                  <p className="text-slate-500 mb-6 text-lg">
                    {filter === "All"
                      ? "Start shopping to see your order history!"
                      : `You don't have any ${filter.toLowerCase()} orders.`}
                  </p>
                  <button className="px-8 py-4 bg-[#3593A6] hover:bg-[#2d7a8a] text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all duration-200 text-lg flex items-center gap-2 mx-auto">
                    <ShoppingBag className="w-5 h-5" />
                    Browse Products
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Details Modal */}
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}