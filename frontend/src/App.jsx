import { Routes, Route , useLocation} from "react-router-dom";
import ProtectedRoute from "./Components/Auth/ProtectedRoute";
import adminDashboard from "./Components/Admin/adminDashboard";

export default function App() {
  const location = useLocation();
  const isAdminPage = location.pathname === "/admin";

  return (
    // Use a Fragment <> instead of <Router>
    <>
      <AuthRedirect /> 
      <main>
        {/* Only show Navbar if we aren't on the admin page */}
        {!isAdminPage && <Navbar />}
        
        <Routes>
          <Route path="/" element={
              <>
                <Hero />
                <Footer />
              </>
            } 
          />

          <Route path="/service-history" element={<ServiceHistory />} />
          <Route path="/payment-history" element={<PaymentHistory />} />
          <Route path="/notifications" element={<Notifications />} />

          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={"Admin"}>
                <adminDashboard/>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </>
  );
}