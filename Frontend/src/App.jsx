import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Import pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgetPassword from "./pages/ForgetPassword";
import Bookingpage from "./pages/BookingPage";
import ExploreEvents from "./pages/ExploreEvents";
import ArtistEventRequestPage from "./pages/ArtistEventrequestpage"

import { Navbar } from "./pages/Navpage";
import ProtectedRoute from "./context/privateRoute";
import PublicRoute from "./context/publicRoute";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Your landing page */}
          <Route path="/landing" element={<Landing />} /> 

          {/* Authentication pages */}
          <Route path="/login" element={<PublicRoute> <Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute> <Signup /></PublicRoute>} />
          <Route path="/forgotpassword" element={ <PublicRoute><ForgetPassword /></PublicRoute> } />

          {/* Other pages from master */}
          <Route path="/events" element={<ProtectedRoute allowedRoles={["Attendee"]}><ExploreEvents /></ProtectedRoute>} />
          <Route path="/event/:id" element={<ProtectedRoute allowedRoles={["Attendee"]}><Bookingpage /></ProtectedRoute>} />
          <Route path="/artist/Request" element={<ProtectedRoute allowedRoles={["Artist"]}><Navbar><ArtistEventRequestPage/></Navbar></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
