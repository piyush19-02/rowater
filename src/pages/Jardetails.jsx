import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function JarDetails() {
  const [data, setData] = useState([]);
  const [sortType, setSortType] = useState("date");
  const navigate = useNavigate();

  useEffect(() => {
    loadData("date");
  }, []);

  const loadData = (type) => {
    const deliveries = JSON.parse(localStorage.getItem("deliveries")) || [];

    // 🔥 TODAY DATE
    const today = new Date().toISOString().split("T")[0];

    let filtered = deliveries
      .filter((d) => {
        let date = null;

        if (d.date) {
          date = d.date;
        } else if (d.requestedAt) {
          date = d.requestedAt.split("T")[0];
        }

        const jar = d.jar ?? 0;

        return date === today && jar > 0;
      })
      .map((d, index) => {
        const amount = Number(d.amount || 0);
        const received = Number(d.received || 0);

        return {
          ...d,
          orderNo: index + 1,
          deliveryBoy: d.deliveryBoy || d.driverName || "Piyush",
          amount,
          received,
          pending: amount - received,
        };
      });

    // 🔥 SORT
    if (type === "pending") {
      filtered.sort((a, b) => b.pending - a.pending);
    }

    setData(filtered);
  };

  const handleSort = (type) => {
    setSortType(type);
    loadData(type);
  };

  // 🔥 TOTALS
  const total = data.reduce((t, d) => t + d.amount, 0);
  const received = data.reduce((t, d) => t + d.received, 0);
  const pending = total - received;

  return (
    <div className="flex">
      <Sidebar />

      <div className="md:ml-60 p-4 md:p-6 w-full bg-gray-100 min-h-screen pb-20">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            Today Jar Sales 🧊
          </h2>

          <div className="flex gap-2">
            <button
              onClick={() => handleSort("date")}
              className={`px-3 py-1 rounded-full ${
                sortType === "date"
                  ? "bg-blue-600 text-white"
                  : "bg-white shadow"
              }`}
            >
              Date
            </button>

            <button
              onClick={() => handleSort("pending")}
              className={`px-3 py-1 rounded-full ${
                sortType === "pending"
                  ? "bg-blue-600 text-white"
                  : "bg-white shadow"
              }`}
            >
              Pending
            </button>
          </div>
        </div>

        {/* TOTAL CARDS */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
          <div className="bg-white p-3 rounded-xl shadow">
            <p className="text-xs text-gray-400">Total</p>
            <p className="font-bold text-blue-600">₹{total}</p>
          </div>

          <div className="bg-white p-3 rounded-xl shadow">
            <p className="text-xs text-gray-400">Received</p>
            <p className="font-bold text-green-600">₹{received}</p>
          </div>

          <div className="bg-white p-3 rounded-xl shadow">
            <p className="text-xs text-gray-400">Pending</p>
            <p className="font-bold text-red-600">₹{pending}</p>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <div className="grid grid-cols-5 bg-gray-50 p-4 text-sm font-semibold text-gray-600">
            <p>Order</p>
            <p>Manager</p>
            <p>Client</p>
            <p>Received / Total</p>
            <p>Pending</p>
          </div>

          {data.length === 0 ? (
            <p className="p-4 text-center text-gray-400">
              No data found
            </p>
          ) : (
            data.map((d) => (
              <div
                key={d.orderNo}
                onClick={() => navigate(`/order/${d.id}`)}
                className="grid grid-cols-5 p-4 border-t items-center hover:bg-blue-50 cursor-pointer transition"
              >
                <p className="font-semibold">#{d.orderNo}</p>

                <p className="text-sm text-gray-600">
                  {d.deliveryBoy}
                </p>

                <p className="font-medium">
                  {d.customerName || (d.customer_id ? "Customer" : "Guest")}
                </p>

                <div>
                  <span className="text-green-600 font-semibold">
                    ₹{d.received}
                  </span>
                  <span className="text-gray-400">
                    {" / "}₹{d.amount}
                  </span>
                </div>

                <p className="text-red-600 font-semibold">
                  ₹{d.pending}
                </p>
              </div>
            ))
          )}

        </div>

      </div>
    </div>
  );
}