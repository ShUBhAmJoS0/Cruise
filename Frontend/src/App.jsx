import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./context/privateRoute";
import PublicRoute from "./context/publicRoute";
import AdminRoute from "./context/adminRoute";
import { Layout } from "./component/NavBarLayout";
import { Toaster } from "react-hot-toast";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load all page components
const Landing = lazy(() => import("./pages/Landing"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgetPassword = lazy(() => import("./pages/ForgetPassword"));
const Bookingpage = lazy(() => import("./pages/BookingPage"));
const ExploreEvents = lazy(() => import("./pages/ExploreEvents"));
const Merchandise = lazy(() => import("./pages/Merchandise"));
const ArtistEventRequestPage = lazy(() => import("./pages/ArtistEventrequestpage"));
const AddMerch = lazy(() => import("./pages/ArtistAddMerch"));
const ArtistAnalytics = lazy(() => import("./pages/ArtistDashboard"));
const ArtistProfile = lazy(() => import("./pages/artistProfileDisplay"));
const ArtistEditProfile = lazy(() => import("./pages/ArtistEditProfile"));
const FindArtists = lazy(() => import("./pages/FindArtists"));
const About = lazy(() => import("./pages/About"));
const CartPage = lazy(() => import("./pages/AddtoCart"));
const CheckoutPage = lazy(() => import("./pages/Checkoutpage"));
const ReceiptPage = lazy(() => import("./pages/Receptpage"));
const Community = lazy(() => import("./pages/Community"));
const OrderHistory = lazy(() => import('./pages/OrderHistory'));
const ArtistViewEvents = lazy(() => import("./pages/Vieweventartist"));
const ViewMerchandiseTable = lazy(() => import("./pages/viewmerchartist"));
const MyBookings = lazy(() => import("./pages/MyBookings"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const UserEditProfile = lazy(() => import("./pages/UserEditProfile"));
const Fetchuserreviews = lazy(() => import("./pages/Fetchuserreviews"));

function AppRoutes() {
  const location = useLocation();
  const noNavPatterns = ["/", "/artist/profile/"];
  const showLayout = !noNavPatterns.some(path => {
    const currentPath = location.pathname.toLowerCase();
    if (path === "/") {
      return currentPath === "/";
    }
    // Handle artist profile specifically to allow it in the "no nav" list while keeping /artist/profile (admin view) separate if needed
    // But wait, the route for attendee view is /artist/profile/:id
    return currentPath.startsWith(path.toLowerCase());
  });
  return showLayout ? (
    <Layout>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* public */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />
          <Route path="/forgotpassword" element={<PublicRoute><ForgetPassword /></PublicRoute>} />

          {/* users */}
          <Route path="/events" element={<ProtectedRoute allowedRoles={["Attendee"]}><ExploreEvents /></ProtectedRoute>} />
          <Route path="/merchandise" element={<ProtectedRoute allowedRoles={["Attendee"]}><Merchandise></Merchandise></ProtectedRoute>} />
          <Route path="/event/:id" element={<ProtectedRoute allowedRoles={["Attendee"]}><Bookingpage /></ProtectedRoute>} />
          <Route path="/searchartists" element={<ProtectedRoute allowedRoles={["Attendee"]}><FindArtists></FindArtists></ProtectedRoute>} />
          <Route path="/about" element={<ProtectedRoute allowedRoles={["Attendee"]}><About /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute allowedRoles={["Attendee"]}><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute allowedRoles={["Attendee"]}><CheckoutPage /></ProtectedRoute>} />
          <Route path="/receipt" element={<ProtectedRoute allowedRoles={["Attendee"]}><ReceiptPage /></ProtectedRoute>} />
          <Route path="/community" element={<ProtectedRoute allowedRoles={["Attendee"]}><Community></Community></ProtectedRoute>} />
          <Route path="/mybookings" element={<ProtectedRoute allowedRoles={["Attendee"]}><MyBookings /></ProtectedRoute>} />
          <Route path="/orderhistory" element={<ProtectedRoute allowedRoles={["Attendee"]}><OrderHistory></OrderHistory></ProtectedRoute>} />
          <Route path="/usereditprofile" element={<ProtectedRoute allowedRoles={["Attendee"]}><UserEditProfile /></ProtectedRoute>} />
          {/* artist */}
          <Route path="/artist/request" element={<ProtectedRoute allowedRoles={["Artist"]}><ArtistEventRequestPage /></ProtectedRoute>} />
          <Route path="/artist/addmerch" element={<ProtectedRoute allowedRoles={["Artist"]}><AddMerch /></ProtectedRoute>} />
          <Route path="/artist/profile" element={<ProtectedRoute allowedRoles={["Artist"]}><ArtistAnalytics /></ProtectedRoute>} />
          <Route path="/artist/editprofile" element={<ProtectedRoute allowedRoles={["Artist"]}><ArtistEditProfile></ArtistEditProfile></ProtectedRoute>} />
          <Route path="/artist/viewevent" element={<ProtectedRoute allowedRoles={["Artist"]}><ArtistViewEvents></ArtistViewEvents></ProtectedRoute>} />
          <Route path="/artist/viewmerch" element={<ProtectedRoute allowedRoles={["Artist"]}><ViewMerchandiseTable /></ProtectedRoute>} />
          <Route path="/artist/fetchreviews" element={<ProtectedRoute allowedRoles={["Artist"]}><Fetchuserreviews /></ProtectedRoute>} />
          <Route path="/artist" element={<Navigate to="/artist/profile" replace />} />

          {/* admin */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </Layout>
  ) : (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/artist/profile/:id" element={<ProtectedRoute allowedRoles={["Attendee"]}><ArtistProfile /></ProtectedRoute>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
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
              borderRadius: "12px"
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: 'green',
                secondary: 'white',
              },
            },
            error: {
              duration: 3000,
              iconTheme: {
                primary: 'red',
                secondary: 'white',
              },
              style: {
                background: '#fad7d7',
                color: 'black',
                borderRadius: "12px"
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