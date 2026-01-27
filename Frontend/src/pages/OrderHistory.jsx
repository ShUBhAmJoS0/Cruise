import React, { useState, useEffect } from "react";
import api from "../api/axios";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const currentUserId = 1; 

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const res = await api.get(`/api/order-history/user/${currentUserId}`);
      setOrders(res.data.data || []);
    } catch (err) {
      console.error("LOAD ORDERS ERROR:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const res = await api.get(`/api/order-history/${orderId}`);
      setSelectedOrder(res.data.data);
      setShowModal(true);
    } catch (err) {
      console.error("LOAD ORDER DETAILS ERROR:", err);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) {
      return;
    }

    try {
      await api.put(`/api/order-history/${orderId}/cancel`);
      await loadOrders();
      setShowModal(false);
      alert("Order cancelled successfully!");
    } catch (err) {
      console.error("CANCEL ORDER ERROR:", err);
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      confirmed: "bg-blue-100 text-blue-800 border-blue-200",
      processing: "bg-purple-100 text-purple-800 border-purple-200",
      shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
      delivered: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "confirmed":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "processing":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        );
      case "shipped":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        );
      case "delivered":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case "cancelled":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Order History</h1>
          <p className="text-gray-600">Track and manage your orders</p>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <svg className="w-8 h-8 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  {/* Order Header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800 mb-1">
                        Order #{order.orderId}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-4 py-2 rounded-full text-sm font-semibold border flex items-center gap-2 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="mb-4">
                    <div className="flex items-center gap-4 flex-wrap">
                      {order.items?.slice(0, 3).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg"
                        >
                          {item.productImage && (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="w-10 h-10 object-cover rounded"
                            />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-800">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <span className="text-sm text-gray-500">
                          +{order.items.length - 3} more items
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Order Info */}
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t">
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-xl font-bold text-gray-800">
                          ${parseFloat(order.totalAmount).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Payment</p>
                        <p className="text-sm font-medium text-gray-800">
                          {order.paymentMethod}
                        </p>
                      </div>
                      {order.trackingNumber && (
                        <div>
                          <p className="text-sm text-gray-500">Tracking</p>
                          <p className="text-sm font-medium text-gray-800">
                            {order.trackingNumber}
                          </p>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => handleViewDetails(order.orderId)}
                      className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-12">
              <svg
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <p className="text-xl text-gray-500 mb-2">No orders yet</p>
              <p className="text-gray-400">Start shopping to see your orders here!</p>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white z-10">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    Order #{selectedOrder.orderId}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6">
                {/* Status */}
                <div className="mb-6">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold border inline-flex items-center gap-2 ${getStatusColor(
                      selectedOrder.status
                    )}`}
                  >
                    {getStatusIcon(selectedOrder.status)}
                    {selectedOrder.status.charAt(0).toUpperCase() +
                      selectedOrder.status.slice(1)}
                  </span>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl"
                      >
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">
                            {item.productName}
                          </p>
                          <p className="text-sm text-gray-500">
                            Quantity: {item.quantity} × ${parseFloat(item.price).toFixed(2)}
                          </p>
                        </div>
                        <p className="font-bold text-gray-800">
                          ${parseFloat(item.subtotal).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Details */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-bold text-gray-800 mb-2">Payment Information</h4>
                    <p className="text-sm text-gray-600">
                      Method: <span className="font-medium">{selectedOrder.paymentMethod}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Status:{" "}
                      <span className="font-medium">
                        {selectedOrder.paymentStatus}
                      </span>
                    </p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <h4 className="font-bold text-gray-800 mb-2">Delivery Information</h4>
                    {selectedOrder.trackingNumber && (
                      <p className="text-sm text-gray-600 mb-1">
                        Tracking: <span className="font-medium">{selectedOrder.trackingNumber}</span>
                      </p>
                    )}
                    {selectedOrder.estimatedDelivery && (
                      <p className="text-sm text-gray-600">
                        Estimated:{" "}
                        <span className="font-medium">
                          {new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-gray-50 p-4 rounded-xl mb-6">
                  <h4 className="font-bold text-gray-800 mb-2">Shipping Address</h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {selectedOrder.shippingAddress}
                  </p>
                </div>

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-800">Total Amount</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${parseFloat(selectedOrder.totalAmount).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                {["pending", "confirmed"].includes(selectedOrder.status) && (
                  <div className="mt-6">
                    <button
                      onClick={() => handleCancelOrder(selectedOrder.orderId)}
                      className="w-full px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}