import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useManager } from "./context/ManagerContext";
import { useAdmin } from "./context/useAdmin";
import Dashboard from "./pages/admin/Dashboard";
import Customers from "./pages/admin/Customers";
import Delivery from "./pages/admin/Delivery";
import JarDetails from "./pages/admin/Jardetails";
import CustomerDetails from "./pages/admin/CustomerDetails";
import WaterDetails from "./pages/admin/WaterDetails";
import OrderDetails from "./pages/admin/OrderDetails";
import MonthlyCustomers from "./components/MonthlyCustomers";
import MonthlyCustomerDetails from "./pages/admin/MonthlyCustomerDetails";
import AddExpense from "./pages/admin/AddExpense";
import Addorder from "./pages/admin/Addorder";
import Managers from "./pages/admin/Managers";
import UpcomingOrders from "./components/UpcomingOrders";
import AdminLogin from "./pages/admin/AdminLogin";
import ManagerLogin from "./pages/manager/ManagerLogin";
import ManagerDashboard from "./pages/manager/Mangerdashboard";
import DailyCoustumer from "./pages/manager/Dailycoustumer";
import DailyExpense from "./pages/manager/Dailyexpense";
import ManagerMonthlyOrders from "./pages/manager/ManagerMonthlyOrders";
import GuestOrder from "./pages/manager/GuestOrder";
// import FutureBookings from "./pages/manager/FutureBookings";
import ManagerDelivery from "./pages/manager/ManagerDelivery";
import ManagerCustomers from "./pages/manager/ManagerCustomers";
import PendingJars from "./pages/manager/PendingJars";
import ManagerPartyOrders from "./pages/manager/ManagerPartyOrders";
import ManagerPartyOrderAdd from "./pages/manager/ManagerPartyOrderAdd";
import ManagerOrderDetails from "./pages/manager/ManagerOrderDetails";

// Protected Route Component
function ProtectedRoute({ children }) {
  const { isLoggedIn, isLoading } = useManager();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/manager/login" replace />;
  }

  return children;
}

function AdminProtectedRoute({ children }) {
  const { isLoggedIn, isLoading } = useAdmin();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>;
  }

  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/" element={<AdminProtectedRoute><Dashboard /></AdminProtectedRoute>} />
        <Route path="/customers" element={<AdminProtectedRoute><Customers /></AdminProtectedRoute>} />
        <Route path="/delivery" element={<AdminProtectedRoute><Delivery/></AdminProtectedRoute>} />
        <Route path="/jar-details" element={<AdminProtectedRoute><JarDetails/></AdminProtectedRoute>} />
        <Route path="/customer/:id" element={<AdminProtectedRoute><CustomerDetails /></AdminProtectedRoute>} />
        <Route path="/water-details" element={<AdminProtectedRoute><WaterDetails /></AdminProtectedRoute>} />
        <Route path="/order/:id" element={<AdminProtectedRoute><OrderDetails/></AdminProtectedRoute>} />
        <Route path="/monthly" element={<AdminProtectedRoute><MonthlyCustomers/></AdminProtectedRoute>} />
        <Route path="/monthly/:id" element={<AdminProtectedRoute><MonthlyCustomerDetails/></AdminProtectedRoute>} />
        <Route path="/expenses/add" element={<AdminProtectedRoute><AddExpense/></AdminProtectedRoute>} />
        <Route path="/add-order" element={<AdminProtectedRoute><Addorder/></AdminProtectedRoute>} />
        <Route path="/upcoming" element={<AdminProtectedRoute><UpcomingOrders/></AdminProtectedRoute>} />
        <Route path="/managers" element={<AdminProtectedRoute><Managers /></AdminProtectedRoute>} />

        {/* MANAGER ROUTES */}
        <Route path="/manager/login" element={<ManagerLogin />} />
        <Route 
          path="/manager" 
          element={
            <ProtectedRoute>
              <ManagerDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager/daily-customers" 
          element={
            <ProtectedRoute>
              <DailyCoustumer />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager/daily-expense" 
          element={
            <ProtectedRoute>
              <DailyExpense />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager/monthly-orders" 
          element={
            <ProtectedRoute>
              <ManagerMonthlyOrders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager/guest-order" 
          element={
            <ProtectedRoute>
              <GuestOrder />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager/future-bookings" 
          element={
            <ProtectedRoute>
              <UpcomingOrders/>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manager/delivery" 
          element={
            <ProtectedRoute>
              <ManagerDelivery />
            </ProtectedRoute>
          } 
        />
        <Route path="/manager/customers" element={<ProtectedRoute><ManagerCustomers /></ProtectedRoute>} />
        <Route path="/manager/pending-jars" element={<ProtectedRoute><PendingJars /></ProtectedRoute>} />
        <Route path="/manager/party-orders" element={<ProtectedRoute><ManagerPartyOrders /></ProtectedRoute>} />
        <Route path="/manager/party-orders/add" element={<ProtectedRoute><ManagerPartyOrderAdd /></ProtectedRoute>} />
        <Route path="/manager/order/:id" element={<ProtectedRoute><ManagerOrderDetails /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
