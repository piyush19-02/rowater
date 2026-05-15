import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ManagerSidebar from "../../components/ManagerSidebar";
import { useManager } from "../../context/ManagerContext";
import { customers } from "../../data/demoData";
import { upcomingOrders } from "../../data/upcomingData";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { currentManager } = useManager();
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedDeliveries = JSON.parse(localStorage.getItem("deliveries")) || [];
    setDeliveries(savedDeliveries);
  }, []);

  const { jar, water } = useMemo(() => {
    const managerDeliveries = deliveries.filter(d => !d.managerId || d.managerId === currentManager?.id);
    const todayOrders = managerDeliveries;
    const jarCompleted = todayOrders.filter(d => d.jar > 0 && Number(d.received || 0) >= Number(d.amount || 0)).length;
    const waterCompleted = todayOrders.filter(d => d.liter > 0 && Number(d.received || 0) >= Number(d.amount || 0)).length;
    const jarQuantity = todayOrders.reduce((total, d) => total + Number(d.jar || 0), 0);
    const waterQuantity = todayOrders.reduce((total, d) => total + Number(d.liter || 0), 0);

    const futureJarPending = upcomingOrders.filter(d => d.jar > 0 && Number(d.received || 0) < Number(d.amount || 0)).length;
    const futureWaterPending = upcomingOrders.filter(d => d.liter > 0 && Number(d.received || 0) < Number(d.amount || 0)).length;

    return {
      jar: {
        orders: customers.length,
        completed: jarCompleted,
        pending: futureJarPending,
        quantity: jarQuantity,
      },
      water: {
        orders: customers.length,
        completed: waterCompleted,
        pending: futureWaterPending,
        quantity: waterQuantity,
      },
    };
  }, [deliveries, currentManager?.id]);

  return (
    <div className="flex">
      <ManagerSidebar />
      <div className="md:ml-60 p-4 md:p-6 w-full bg-slate-100 min-h-screen pb-20">
        <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>

        {/* PENDING BOX */}
        <div className="bg-white rounded-3xl shadow p-4 md:p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Pending</h2>
          
          {/* TABLE STRUCTURE */}
          <div className="overflow-x-auto">
            <table className="w-full text-center">
              <thead>
                <tr className="border-b-2 border-slate-300">
                  <th className="px-2 py-3 text-xs md:text-sm uppercase tracking-[0.1em] text-slate-600">Item</th>
                  <th className="px-2 py-3 text-xs md:text-sm uppercase tracking-[0.1em] text-slate-600">Jar</th>
                  <th className="px-2 py-3 text-xs md:text-sm uppercase tracking-[0.1em] text-slate-600">Water</th>
                  <th className="px-2 py-3 text-xs md:text-sm uppercase tracking-[0.1em] text-slate-600">Add</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="px-2 py-3 text-xs md:text-sm font-semibold text-slate-700">Order</td>
                  <td className="px-2 py-3">
                    <div className="text-sm md:text-base text-slate-500">Completed / Customers</div>
                    <div className="text-lg md:text-2xl font-bold text-blue-600">{jar.completed || 0} / {jar.orders || 0}</div>
                  </td>
                  <td className="px-2 py-3">
                    <div className="text-sm md:text-base text-slate-500">Completed / Customers</div>
                    <div className="text-lg md:text-2xl font-bold text-cyan-600">{water.completed || 0} / {water.orders || 0}</div>
                  </td>
                  <td className="px-2 py-3 align-middle" rowSpan="2">
                    <button
                      onClick={() => navigate("/manager/guest-order")}
                      className="h-full min-h-[100px] w-full rounded-3xl bg-slate-900 text-white px-3 py-2 text-sm font-semibold hover:bg-slate-800 transition"
                    >
                      Add Guest Order
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="px-2 py-3 text-xs md:text-sm font-semibold text-slate-700">Quantity</td>
                  <td className="px-2 py-3">
                    <div className="text-lg md:text-2xl font-bold text-blue-600">{jar.quantity || 0}</div>
                  </td>
                  <td className="px-2 py-3">
                    <div className="text-lg md:text-2xl font-bold text-cyan-600">{water.quantity || 0}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold">Guest Orders</h2>
            <p className="text-sm text-slate-500">Open the guest order page for full details and a delivered tab.</p>
          </div>
          <button
            onClick={() => navigate("/manager/guest-order")}
            className="rounded-3xl bg-slate-900 text-white px-5 py-3 font-semibold hover:bg-slate-800 transition"
          >
            Open Guest Order Page
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
            <div className="bg-slate-50 rounded-3xl p-6 shadow-sm">
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm uppercase tracking-widest text-slate-500">Booking</p>
                  <h3 className="text-2xl font-bold text-slate-900">Pending Bookings</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-3xl border border-slate-200 p-5 cursor-pointer" onClick={() => navigate("/manager/future-bookings") }>
                    <p className="text-sm text-slate-500">Water</p>
                    <p className="mt-3 text-3xl font-bold text-cyan-600">{water.pending || 0}</p>
                    <p className="mt-1 text-sm text-slate-500">Booking count</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 p-5 cursor-pointer" onClick={() => navigate("/manager/future-bookings") }>
                    <p className="text-sm text-slate-500">Jar</p>
                    <p className="mt-3 text-3xl font-bold text-blue-600">{jar.pending || 0}</p>
                    <p className="mt-1 text-sm text-slate-500">Booking count</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-orange-500 rounded-3xl p-6 text-white shadow-sm flex flex-col justify-between">
              <div>
                <p className="text-sm uppercase tracking-widest text-orange-100">Add Expense</p>
                <h3 className="mt-3 text-2xl font-bold">New Expense</h3>
                <p className="mt-2 text-sm text-orange-100/90">Record your expense quickly and keep the dashboard updated.</p>
              </div>
              <button
                onClick={() => navigate("/expenses/add")}
                className="mt-6 inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-orange-600 hover:bg-slate-100"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>

      </div>
  );
}
