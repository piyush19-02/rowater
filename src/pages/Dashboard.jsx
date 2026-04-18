import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Calendar, Wallet, Clock } from "lucide-react";
import MonthlyCustomers from "../components/MonthlyCustomers";
import Expenses from "../components/Expenses";
import UpcomingOrders from "../components/UpcomingOrders";

export default function Dashboard() {
  const [tab, setTab] = useState("retail");

  const [jar, setJar] = useState({});
  const [water, setWater] = useState({});
  const [monthly, setMonthly] = useState({});
  const [expense, setExpense] = useState([]);
  const [upcoming, setUpcoming] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    const today = new Date().toISOString().split("T")[0];
    const month = today.slice(0, 7);

    let jarOrders = 0, jarEarned = 0, jarReceived = 0;
    let waterOrders = 0, waterEarned = 0, waterReceived = 0;

    let mEarned = 0, mReceived = 0;
    const future = [];

    deliveries.forEach(d => {
      const date = d.requestedAt || d.date;
      if (!date) return;

      const isToday = date.startsWith(today);
      const isMonth = date.startsWith(month);
      const isFuture = date > today;

      const amount = Number(d.amount || 0);
      const received = Number(d.received || 0);

      // 🧊 JAR
      if (d.jar > 0) {
        if (isToday) {
          jarOrders++;
          jarEarned += amount;
          jarReceived += received;
        }
      }

      // 💧 WATER
      if (d.liter > 0) {
        if (isToday) {
          waterOrders++;
          waterEarned += amount;
          waterReceived += received;
        }
      }

      // 📅 MONTHLY
      if (isMonth) {
        mEarned += amount;
        mReceived += received;
      }

      // ⏳ UPCOMING
      if (isFuture) {
        future.push(d);
      }
    });

    setJar({
      orders: jarOrders,
      earned: jarEarned,
      received: jarReceived,
      pending: jarEarned - jarReceived,
    });

    setWater({
      orders: waterOrders,
      earned: waterEarned,
      received: waterReceived,
      pending: waterEarned - waterReceived,
    });

    setMonthly({
      earned: mEarned,
      received: mReceived,
      pending: mEarned - mReceived,
    });

    setExpense(expenses);
    setUpcoming(future);
  }, []);

  const tabs = [
    { key: "retail", icon: <ShoppingCart size={16} /> },
    { key: "monthly", icon: <Calendar size={16} /> },
    { key: "expense", icon: <Wallet size={16} /> },
    { key: "upcoming", icon: <Clock size={16} /> },
  ];

  return (
    <div className="flex">
      <Sidebar />

      <div className="md:ml-60 p-4 md:p-6 w-full bg-gray-100 min-h-screen pb-20">

        {/* TOP NAV */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full capitalize ${
                tab === t.key
                  ? "bg-blue-600 text-white"
                  : "bg-white shadow"
              }`}
            >
              {t.icon}
              {t.key}
            </button>
          ))}
        </div>

        {/* ================= RETAIL ================= */}
        {tab === "retail" && (
          <div className="space-y-5">

            {/* 🧊 JAR */}
            <div
              onClick={() => navigate("/jar-details")}
              className="bg-blue-600 text-white p-6 rounded-3xl shadow cursor-pointer"
            >
              <h2 className="mb-4 text-lg font-semibold">Jar Sales 🧊</h2>

              <div className="grid grid-cols-4 text-center">
                <div>
                  <p>Orders</p>
                  <p className="font-bold">{jar.orders}</p>
                </div>
                <div>
                  <p>Total</p>
                  <p className="font-bold">₹{jar.earned}</p>
                </div>
                <div>
                  <p>Pending</p>
                  <p className="font-bold text-red-200">₹{jar.pending}</p>
                </div>
                <div>
                  <p>Received</p>
                  <p className="font-bold text-green-200">₹{jar.received}</p>
                </div>
              </div>
            </div>

            {/* 💧 WATER */}
            <div
              onClick={() => navigate("/water-details")}
              className="bg-cyan-500 text-white p-6 rounded-3xl shadow cursor-pointer"
            >
              <h2 className="mb-4 text-lg font-semibold">Water Sales 💧</h2>

              <div className="grid grid-cols-4 text-center">
                <div>
                  <p>Orders</p>
                  <p className="font-bold">{water.orders}</p>
                </div>
                <div>
                  <p>Total</p>
                  <p className="font-bold">₹{water.earned}</p>
                </div>
                <div>
                  <p>Pending</p>
                  <p className="font-bold text-red-200">₹{water.pending}</p>
                </div>
                <div>
                  <p>Received</p>
                  <p className="font-bold text-green-200">₹{water.received}</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* MONTHLY */}
        {tab === "monthly" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <MonthlyCustomers />
          </div>
        )}

        {/* EXPENSE */}
        {tab === "expense" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <Expenses />
          </div>
        )}

        {/* UPCOMING */}
        {tab === "upcoming" && (
          <div className="bg-white p-6 rounded-2xl shadow">
            <UpcomingOrders />
          </div>
        )}

      </div>
    </div>
  );
}