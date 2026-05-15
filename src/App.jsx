import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useManager } from "./context/ManagerContext";
import Dashboard from "./pages/admin/Dashboard";
import Customers from "./pages/admin/Customers";
import Delivery from "./pages/admin/Delivery";
import JarDetails from "./pages/admin/Jardetails";
import CustomerDetails from "./pages/admin/CustomerDetails";
import WaterDetails from "./pages/admin/WaterDetails";
import OrderDetails  from "./pages/admin/OrderDetails";
import MonthlyCustomers from "./components/MonthlyCustomers";
import MonthlyCustomerDetails from "./pages/admin/MonthlyCustomerDetails";
import AddExpense from "./pages/admin/AddExpense";
import Addorder from "./pages/admin/Addorder";
import UpcomingOrders from "./components/UpcomingOrders";
import ManagerLogin from "./pages/manager/ManagerLogin";
import ManagerDashboard from "./pages/manager/Mangerdashboard";
import DailyCoustumer from "./pages/manager/Dailycoustumer";
import DailyExpense from "./pages/manager/Dailyexpense";
import ManagerMonthlyOrders from "./pages/manager/ManagerMonthlyOrders";
import GuestOrder from "./pages/manager/GuestOrder";
import FutureBookings from "./pages/manager/FutureBookings";
import ManagerDelivery from "./pages/manager/ManagerDelivery";

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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/delivery" element={<Delivery/>} />
        <Route path="/jar-details" element={<JarDetails/>} />
        <Route path="/customer/:id" element={<CustomerDetails />} />
        <Route path="/water-details" element={<WaterDetails />} />
        <Route path="/order/:id" element={<OrderDetails/>} />
        <Route path="/monthly" element={<MonthlyCustomers/>}/>
        <Route path="/monthly/:id" element={<MonthlyCustomerDetails/>} />
        <Route path="/expenses/add" element={<AddExpense/>} />
        <Route path="/add-order" element={<Addorder/>} />
        <Route path="/upcoming" element={<UpcomingOrders/>}/>

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
              <FutureBookings />
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
      </Routes>
    </BrowserRouter>
  );
}