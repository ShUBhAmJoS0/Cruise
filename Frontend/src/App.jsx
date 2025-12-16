import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Import pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgetPassword from "./pages/ForgetPassword";
import Bookingpage from "./pages/BookingPage";
import ExploreEvents from "./pages/ExploreEvents";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Your landing page */}
          <Route path="/landing" element={<Landing />} /> 

          {/* Authentication pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgetPassword />} />

          {/* Other pages from master */}
          <Route path="/events" element={<ExploreEvents />} />
          <Route path="/event/:id" element={<Bookingpage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
