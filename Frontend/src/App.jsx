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
import ProtectedRoute from "./context/privateRoute";import PublicRoute from "./context/publicRoute";
import AdminRoute from "./context/adminRoute";
import { Layout } from "./component/NavBarLayout";
import { AddMerch } from "./pages/ArtistAddMerch";
import ArtistAnalytics from "./pages/ArtistDashboard";
import ArtistProfile from "./pages/artistProfileDisplay";
import ArtistEditProfile from "./pages/ArtistEditProfile";
import FindArtists from "./pages/FindArtists";
import About from "./pages/About";
import CartPage from "./pages/AddtoCart";
import CheckoutPage from "./pages/Checkoutpage";
import ReceiptPage from "./pages/Receptpage";
import Community from "./pages/Community";
import ArtistViewEvents from "./pages/Vieweventartist";
import { ViewMerchandiseTable } from "./pages/viewmerchartist";
import MyBookings from "./pages/MyBookings";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import { Toaster } from "react-hot-toast";

function AppRoutes() {
  const location = useLocation();
  const noNavPatterns = ["/", "/artist/profile/", "/admin"]; 
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
        <Route path="/merchandise" element={<ProtectedRoute allowedRoles={["Attendee"]}><Merchandise></Merchandise></ProtectedRoute>} />
        <Route path="/event/:id" element={<ProtectedRoute allowedRoles={["Attendee"]}><Bookingpage /></ProtectedRoute>} />
<Route path="/searchartists" element={<ProtectedRoute allowedRoles={["Attendee"]}><FindArtists></FindArtists></ProtectedRoute>}/>
<Route path="/about" element={<ProtectedRoute allowedRoles={["Attendee"]}><About /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute allowedRoles={["Attendee"]}><CartPage /></ProtectedRoute>} />
<Route path="/checkout" element={<ProtectedRoute allowedRoles={["Attendee"]}><CheckoutPage /></ProtectedRoute>} />
<Route path="/receipt" element={<ProtectedRoute allowedRoles={["Attendee"]}><ReceiptPage /></ProtectedRoute>} />
<Route path="/community" element={<ProtectedRoute allowedRoles={["Attendee"]}><Community></Community></ProtectedRoute>} />
<Route path="/mybookings" element={<ProtectedRoute allowedRoles={["Attendee"]}><MyBookings /></ProtectedRoute>} />
        {/* artist */}
        <Route path="/artist/Request" element={<ProtectedRoute allowedRoles={["Artist"]}><ArtistEventRequestPage /></ProtectedRoute>} />
        <Route path="/artist/Addmerch" element={<ProtectedRoute allowedRoles={["Artist"]}><AddMerch /></ProtectedRoute>} />
        <Route path="/artist/Profile" element={<ProtectedRoute allowedRoles={["Artist"]}><ArtistAnalytics/></ProtectedRoute>} />
        <Route path="/artist/EditProfile" element={<ProtectedRoute allowedRoles={["Artist"]}><ArtistEditProfile></ArtistEditProfile></ProtectedRoute>} />
        <Route path="/artist/viewevent" element={<ProtectedRoute allowedRoles={["Artist"]}><ArtistViewEvents></ArtistViewEvents></ProtectedRoute>}/>
        <Route path="/artist/viewmerch" element={<ProtectedRoute allowedRoles={["Artist"]}><ViewMerchandiseTable/></ProtectedRoute>}/>
      </Routes>
    </Layout>
  ) : (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/artist/profile/:id" element={<ProtectedRoute allowedRoles={["Attendee"]}><ArtistProfile /></ProtectedRoute>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
    </Routes>
  );

}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Toaster
  position="top-center"
  reverseOrder={false}
  gutter={8}
  containerClassName=""
  containerStyle={{}}
  toasterId="default"
  toastOptions={{

    className: '',
    duration: 5000,
    removeDelay: 1000,
    style: {
      background: '#eafae1',
      color: 'black',
      borderRadius:"12px"
    },

 
    success: {
      duration: 3000,
      iconTheme: {
        primary: 'green',
        secondary: 'white',
      },
    },
    error:{
        duration: 3000,
      iconTheme: {
        primary: 'red',
        secondary: 'white',
      },
          style: {
      background: '#fad7d7',
      color: 'black',
      borderRadius:"12px"
    },
    }
  }}
/>
            <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
