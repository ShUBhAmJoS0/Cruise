  import { BrowserRouter, Routes, Route } from "react-router-dom";
  import { AuthProvider } from "./context/AuthContext";
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
            <Route path="/events" element={<ExploreEvents />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgotpassword" element={<ForgetPassword/>}/>
            {/* After login */}
            <Route path="/event/:id" element={<Bookingpage></Bookingpage>}/>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    );
  }


  export default App;
