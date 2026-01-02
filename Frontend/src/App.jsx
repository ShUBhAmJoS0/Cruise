import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useLocation } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgetPassword from "./pages/ForgetPassword";
import Bookingpage from "./pages/BookingPage";
import ExploreEvents from "./pages/ExploreEvents";
import Merchandise from "./pages/Merchandise";
import ArtistEventRequestPage from "./pages/ArtistEventrequestpage"
import ProtectedRoute from "./context/privateRoute";
import PublicRoute from "./context/publicRoute";
<<<<<<< HEAD
import  Usernavbar  from "./pages/userNavbar";
import Community from "./pages/Community";
=======
import { Layout } from "./component/NavBarLayout";
import { AddMerch } from "./pages/ArtistAddMerch";
import { ArtistDashboard } from "./pages/ArtistDashboard";
import ArtistProfile from "./pages/artistProfileDisplay";
import ArtistEditProfile from "./pages/ArtistEditProfile";
import FindArtists from "./pages/FindArtists";
import About from "./pages/About";

function AppRoutes() {
  const location = useLocation();
  const noNavPatterns = ["/", "/artist/profile/"]; 
 const showLayout = !noNavPatterns.some(path => {
    if (path === "/") {
      return location.pathname === "/"; 
    }
    return location.pathname.startsWith(path); 
  });
  return showLayout ? (
    <Layout>
      <Routes>
        {/* public */}
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
        <Route path="/forgotpassword" element={<PublicRoute><ForgetPassword /></PublicRoute>} />

        {/* users */}
        <Route path="/events" element={<ProtectedRoute allowedRoles={["Attendee"]}><ExploreEvents /></ProtectedRoute>} />
        <Route path="/merchandise" element={<ProtectedRoute allowedRoles={["Attendee"]}><ExploreEvents /></ProtectedRoute>} />
        <Route path="/event/:id" element={<ProtectedRoute allowedRoles={["Attendee"]}><Bookingpage /></ProtectedRoute>} />
<Route path="/searchartists" element={<ProtectedRoute allowedRoles={["Attendee"]}><FindArtists></FindArtists></ProtectedRoute>}/>
<Route path="/about" element={<ProtectedRoute allowedRoles={["Attendee"]}><About /></ProtectedRoute>} />
        {/* artist */}
        <Route path="/artist/Request" element={<ProtectedRoute allowedRoles={["Artist"]}><ArtistEventRequestPage /></ProtectedRoute>} />
        <Route path="/artist/Addmerch" element={<ProtectedRoute allowedRoles={["Artist"]}><AddMerch /></ProtectedRoute>} />
        <Route path="/artist/Profile" element={<ProtectedRoute allowedRoles={["Artist"]}><ArtistDashboard /></ProtectedRoute>} />
        <Route path="/artist/EditProfile" element={<ProtectedRoute allowedRoles={["Artist"]}><ArtistEditProfile></ArtistEditProfile></ProtectedRoute>} />
      </Routes>
    </Layout>
  ) : (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/artist/profile/:id" element={<ArtistProfile />} />
    </Routes>
  );
}
>>>>>>> 2536c7b90bc3eb9594643ab871fb396029d416f3

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
<<<<<<< HEAD
        <Routes>
          {/* Your landing page */}
          <Route path="/landing" element={<Landing />} /> 

          {/* Authentication pages */}
          <Route path="/login" element={<PublicRoute> <Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute> <Signup /></PublicRoute>} />
          <Route path="/forgotpassword" element={ <PublicRoute><ForgetPassword /></PublicRoute> } />

          {/* Other pages from master */}
          <Route path="/events" element={<ProtectedRoute allowedRoles={["Attendee"]}><Usernavbar><ExploreEvents/></Usernavbar></ProtectedRoute>} />
          <Route path="/event/:id" element={<ProtectedRoute allowedRoles={["Attendee"]}><Bookingpage /></ProtectedRoute>} />
          <Route path="/artist/Request" element={<ProtectedRoute allowedRoles={["Artist"]}><Usernavbar><ArtistEventRequestPage/></Usernavbar></ProtectedRoute>}/>
          <Route path="/merchandise" element={<ProtectedRoute><Usernavbar><Merchandise /></Usernavbar></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute allowedRoles={["Attendee"]}><Usernavbar><AddToCart /></Usernavbar></ProtectedRoute>}/>
          <Route path="/community" element={ <ProtectedRoute allowedRoles={["Attendee"]}><Usernavbar><Community /></Usernavbar></ProtectedRoute>}/>
        </Routes>
=======
        <AppRoutes />
>>>>>>> 2536c7b90bc3eb9594643ab871fb396029d416f3
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
