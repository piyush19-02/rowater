import { useEffect, useState } from "react";
import ManagerSidebar from "../../components/ManagerSidebar";
import { useManager } from "../../context/ManagerContext";
import { ShoppingCart, TrendingUp, DollarSign, User } from "lucide-react";

export default function DailyCoustumer() {
  const { currentManager } = useManager();
  const [today, setToday] = useState({});
  const [todayDeliveries, setTodayDeliveries] = useState([]);

  useEffect(() => {
    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];
    const todayDate = new Date().toISOString().split("T")[0];

    // Filter by today's date AND manager ID
    const todayOrders = deliveries.filter(d => {
      const date = d.requestedAt || d.date;
      const isToday = date && date.startsWith(todayDate);
      const isManagerData = !d.managerId || d.managerId === currentManager?.id;
      return isToday && isManagerData;
    });

    let jarOrders = 0, jarEarned = 0, jarReceived = 0;
    let waterOrders = 0, waterEarned = 0, waterReceived = 0;
    let totalCustomers = new Set();

    todayOrders.forEach(d => {
      const amount = Number(d.amount || 0);
      const received = Number(d.received || 0);

      if (d.jar > 0) {
        jarOrders++;
        jarEarned += amount;
        jarReceived += received;
      }
      if (d.liter > 0) {
        waterOrders++;
        waterEarned += amount;
        waterReceived += received;
      }
      if (d.customerName) {
        totalCustomers.add(d.customerName);
      }
    });

    setToday({
      jarOrders,
      jarEarned,
      jarReceived,
      jarPending: jarEarned - jarReceived,
      waterOrders,
      waterEarned,
      waterReceived,
      waterPending: waterEarned - waterReceived,
      totalCustomers: totalCustomers.size,
      totalEarned: jarEarned + waterEarned,
      totalReceived: jarReceived + waterReceived,
      totalPending: (jarEarned + waterEarned) - (jarReceived + waterReceived),
    });

    setTodayDeliveries(todayOrders);
  }, [currentManager?.id]);

  return (
    <div className="flex">
      <ManagerSidebar />
      <div className="md:ml-60 p-4 md:p-6 w-full bg-slate-100 min-h-screen pb-20">
        <h1 className="text-3xl font-bold mb-6">Today's Customer Report</h1>

        {/* TOP STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Customers */}
          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-semibold">Total Customers</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{today.totalCustomers || 0}</p>
              </div>
              <User className="text-blue-600" size={32} />
            </div>
          </div>

          {/* Total Earned */}
          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-semibold">Total Earned</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">₹{today.totalEarned || 0}</p>
              </div>
              <TrendingUp className="text-green-600" size={32} />
            </div>
          </div>

          {/* Total Received */}
          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-green-400">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-semibold">Total Received</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">₹{today.totalReceived || 0}</p>
              </div>
              <DollarSign className="text-green-400" size={32} />
            </div>
          </div>

          {/* Total Pending */}
          <div className="bg-white rounded-2xl shadow p-6 border-l-4 border-red-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-semibold">Total Pending</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">₹{today.totalPending || 0}</p>
              </div>
              <ShoppingCart className="text-red-600" size={32} />
            </div>
          </div>
        </div>

        {/* JAR & WATER SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* JAR */}
          <div className="bg-blue-600 text-white p-6 rounded-3xl shadow">
            <h2 className="mb-4 text-lg font-semibold">Jar Sales 🧊</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-700 rounded-xl p-4 text-center">
                <p className="text-sm opacity-90">Orders</p>
                <p className="text-3xl font-bold">{today.jarOrders || 0}</p>
              </div>
              <div className="bg-blue-700 rounded-xl p-4 text-center">
                <p className="text-sm opacity-90">Total</p>
                <p className="text-3xl font-bold">₹{today.jarEarned || 0}</p>
              </div>
              <div className="bg-red-500 rounded-xl p-4 text-center">
                <p className="text-sm opacity-90">Pending</p>
                <p className="text-3xl font-bold">₹{today.jarPending || 0}</p>
              </div>
              <div className="bg-green-500 rounded-xl p-4 text-center">
                <p className="text-sm opacity-90">Received</p>
                <p className="text-3xl font-bold">₹{today.jarReceived || 0}</p>
              </div>
            </div>
          </div>

          {/* WATER */}
          <div className="bg-cyan-500 text-white p-6 rounded-3xl shadow">
            <h2 className="mb-4 text-lg font-semibold">Water Sales 💧</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-cyan-600 rounded-xl p-4 text-center">
                <p className="text-sm opacity-90">Orders</p>
                <p className="text-3xl font-bold">{today.waterOrders || 0}</p>
              </div>
              <div className="bg-cyan-600 rounded-xl p-4 text-center">
                <p className="text-sm opacity-90">Total</p>
                <p className="text-3xl font-bold">₹{today.waterEarned || 0}</p>
              </div>
              <div className="bg-red-500 rounded-xl p-4 text-center">
                <p className="text-sm opacity-90">Pending</p>
                <p className="text-3xl font-bold">₹{today.waterPending || 0}</p>
              </div>
              <div className="bg-green-500 rounded-xl p-4 text-center">
                <p className="text-sm opacity-90">Received</p>
                <p className="text-3xl font-bold">₹{today.waterReceived || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* TODAY'S CUSTOMERS LIST */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-bold mb-4">Today's Customers ({todayDeliveries.length})</h2>
          
          {todayDeliveries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-slate-300 bg-slate-50">
                    <th className="px-4 py-3 text-left font-semibold text-slate-600">Customer Name</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-600">Jar</th>
                    <th className="px-4 py-3 text-center font-semibold text-slate-600">Water (L)</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">Amount</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">Received</th>
                    <th className="px-4 py-3 text-right font-semibold text-slate-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {todayDeliveries.map((delivery, idx) => (
                    <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{delivery.customerName || "N/A"}</td>
                      <td className="px-4 py-3 text-center text-slate-700">{delivery.jar || "-"}</td>
                      <td className="px-4 py-3 text-center text-slate-700">{delivery.liter || "-"}</td>
                      <td className="px-4 py-3 text-right text-slate-900 font-semibold">₹{delivery.amount || 0}</td>
                      <td className="px-4 py-3 text-right text-green-600 font-semibold">₹{delivery.received || 0}</td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            Number(delivery.received || 0) >= Number(delivery.amount || 0)
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {Number(delivery.received || 0) >= Number(delivery.amount || 0) ? "Paid" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-slate-500 py-8">No deliveries today</p>
          )}
        </div>
      </div>
    </div>
  );
}
