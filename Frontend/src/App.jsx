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
import PrivateRoute from "./context/privateRoute";
import PublicRoute from "./context/publicRoute";
import { Navbar } from "./pages/Navpage";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Your landing page */}
          <Route path="/landing" element={<Landing />} /> 

          {/* Authentication pages */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/forgotpassword" element={ <ForgetPassword /> } />

          {/* Other pages from master */}
          <Route path="/events" element={<PrivateRoute><ExploreEvents /></PrivateRoute>} />
          <Route path="/event/:id" element={<PrivateRoute><Bookingpage /></PrivateRoute>} />
          <Route path="/artist/Request" element={<PrivateRoute><Navbar><ArtistEventRequestPage/></Navbar></PrivateRoute>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
