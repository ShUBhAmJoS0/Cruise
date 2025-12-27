import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Icon placeholders (replace with SVGs if you want)
const icons = {
  profile: "👤",
  booking: "📅",
  cart: "🛒",
  orders: "📦",
  logout: "🚪",
};

export function NavPage({ children }) {
  const { logout, user } = useAuth(); // your AuthContext provides user info
  const navigate = useNavigate();

  const [showRightNav, setShowRightNav] = useState(false);
  const [selected, setSelected] = useState("");

  const toggleRightNav = () => setShowRightNav((prev) => !prev);

  const handleMenuClick = (menu) => {
    setSelected(menu);
    // Later: Add navigation logic here if needed
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="relative h-[100vh]">
      {/* Top bar */}
      <div className="flex justify-end items-center p-4 bg-[#3593A6] shadow-md">
        <span className="mr-4 text-white font-semibold">{user?.name || "User"}</span>
        <button
          onClick={toggleRightNav}
          className="text-white font-bold p-2 rounded hover:bg-white/20 transition"
        >
          {icons.profile}
        </button>
      </div>

      {/* Overlay */}
      {showRightNav && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={() => setShowRightNav(false)}
        />
      )}

      {/* Right-side nav panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-white w-1/2 max-w-[300px] shadow-lg transform transition-transform duration-300 z-50
        ${showRightNav ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex flex-col p-5 mt-16">
          <button
            onClick={() => handleMenuClick("MyProfile")}
            className={`flex items-center gap-3 mb-3 p-3 rounded transition ${
              selected === "MyProfile" ? "bg-gray-100" : "hover:bg-gray-100"
            }`}
          >
            <span className="text-xl">{icons.profile}</span>
            My Profile
          </button>

          <button
            onClick={() => handleMenuClick("MyBooking")}
            className={`flex items-center gap-3 mb-3 p-3 rounded transition ${
              selected === "MyBooking" ? "bg-gray-100" : "hover:bg-gray-100"
            }`}
          >
            <span className="text-xl">{icons.booking}</span>
            My Booking
          </button>

          <button
            onClick={() => handleMenuClick("MyCart")}
            className={`flex items-center gap-3 mb-3 p-3 rounded transition ${
              selected === "MyCart" ? "bg-gray-100" : "hover:bg-gray-100"
            }`}
          >
            <span className="text-xl">{icons.cart}</span>
            My Cart
          </button>

          <button
            onClick={() => handleMenuClick("MyOrders")}
            className={`flex items-center gap-3 mb-3 p-3 rounded transition ${
              selected === "MyOrders" ? "bg-gray-100" : "hover:bg-gray-100"
            }`}
          >
            <span className="text-xl">{icons.orders}</span>
            My Ordered Items
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 mb-3 p-3 rounded hover:bg-gray-100 transition"
          >
            <span className="text-xl">{icons.logout}</span>
            Log Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="mt-16">{children}</div>
    </div>
  );
}
