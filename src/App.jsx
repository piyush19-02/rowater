import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Customers from "./pages/Customers";
import Delivery from "./pages/Delivery";
import JarDetails from "./pages/Jardetails";
import CustomerDetails from "./pages/CustomerDetails";
import WaterDetails from "./pages/WaterDetails";
import OrderDetails  from "./pages/OrderDetails";
import MonthlyCustomers from "./components/MonthlyCustomers";
import MonthlyCustomerDetails from "./pages/MonthlyCustomerDetails";
import AddExpense from "./pages/AddExpense";
import Addorder from "./pages/Addorder";
import UpcomingOrders from "./components/UpcomingOrders";
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
{/* <Route path="/expenses" element={<Expenses />} /> */}
<Route path="/expenses/add" element={<AddExpense/>} />
<Route path="/add-order" element={<Addorder/>} />
<Route path="/upcoming" element={<UpcomingOrders/>}/>
      </Routes>
    </BrowserRouter>
  );
}