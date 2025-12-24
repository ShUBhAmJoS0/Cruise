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
import ProtectedRoute from "./context/privateRoute";
import PublicRoute from "./context/publicRoute";
import { Layout } from "./component/NavBarLayout";
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} /> 

{/* for public */}
          <Route path="/login" element={<PublicRoute> <Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute> <Signup /></PublicRoute>} />
          <Route path="/forgotpassword" element={ <PublicRoute><ForgetPassword /></PublicRoute> } />

{/* for users */}
          <Route path="/events" element={<ProtectedRoute allowedRoles={["Attendee"]}><ExploreEvents /></ProtectedRoute>} />
        <Route path="/merchandise" element={<ProtectedRoute allowedRoles={["Attendee"]}><ExploreEvents /></ProtectedRoute>} />
          <Route path="/event/:id" element={<ProtectedRoute allowedRoles={["Attendee"]}><Bookingpage /></ProtectedRoute>} />

          {/* for artist */}
          <Route path="/artist/Request" element={<ProtectedRoute allowedRoles={["Artist"]}><ArtistEventRequestPage/></ProtectedRoute>}/>
        </Routes>
              {/* for admin */}
</Layout>
      </BrowserRouter>
    </AuthProvider>



  );
}

export default App;
