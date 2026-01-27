import { useState, useEffect } from "react";
import api from "../api/axios";
import { auth } from "../firebase";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = await auth.currentUser.getIdToken();
        const response = await api.get("/api/booking", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data.data);
      } catch (err) {
        setError("Failed to load bookings");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-md shadow">Loading your bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-6 rounded-md shadow text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 pt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="bg-white p-6 rounded-md shadow text-center">
            <p className="text-gray-600">You haven't made any bookings yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white p-6 rounded-md shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {booking.eventName}
                    </h2>
                    <p className="text-gray-600">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      Rs. {booking.totalPrice}
                    </p>
                    <p className="text-sm text-gray-500 capitalize">
                      {booking.paymentStatus}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Ticket Type</p>
                    <p className="font-medium">{booking.ticketType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Quantity</p>
                    <p className="font-medium">{booking.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Customer Name</p>
                    <p className="font-medium">{booking.customerName}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm text-gray-500">Billing Address</p>
                  <p className="font-medium">{booking.billingAddress}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
